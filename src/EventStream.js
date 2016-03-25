/* eslint max-depth: 0 */
import http from 'http';
import https from 'https';
import url from 'url';
import { EventEmitter } from 'events';

class EventStream extends EventEmitter {
	constructor(uri, token, options) {
		super();
		this.uri = uri;
		this.token = token;
		this.reconnectInterval = 2000;
		Object.assign(this, options);
	}

	connect() {
		return new Promise((resolve, reject) => {
			const { hostname, protocol, port, path } = url.parse(this.uri);
			this.origin = `${protocol}//${hostname}${port ? (':' + port) : ''}`;

			const isSecure = protocol === 'https:';
			const requestor = isSecure ? https : http;
			const req = requestor.request({
				hostname,
				protocol,
				path: `${path}?history_limit=30&access_token=${this.token}`,
				method: 'get',
				port: port || (isSecure ? 443 : 80),
				avoidFetch: true,
				mode: 'prefer-streaming'
			});

			this.req = req;
			if (this.debug) {
				this.debug(this);
			}

			req.on('error', e => {
				reject({ error: e, errorDescription: `Network error from ${this.uri}` });
			});

			req.on('response', res => {
				const statusCode = res.statusCode;
				if (statusCode !== 200) {
					let body = '';
					res.on('data', chunk => body += chunk);
					res.on('end', () => {
						try {
							body = JSON.parse(body);
						} catch (e) {}
						this.emit('response', {
							statusCode,
							body
						});
						let errorDescription = `HTTP error ${statusCode} from ${this.uri}`;
						if (body && body.error_description) {
							errorDescription += ' - ' + body.error_description;
						}
						reject({ statusCode, errorDescription, body });
						this.req = undefined;
					});
					return;
				}

				this.data = '';
				this.buf = '';
				this.eventName;
				this.lastEventId;

				res.on('data', this.parse.bind(this));
				res.once('end', this.end.bind(this));
				resolve(this);
			});
			req.end();
		});
	}

	abort() {
		if (this.req) {
			this.req.abort();
			this.req = undefined;
		}
		this.removeAllListeners();
	}

	end() {
		this.req = undefined;
		setTimeout(() => {
			this.connect().catch(err => {
				this.emit('error', err);
				this.removeAllListeners();
			});
		}, this.reconnectInterval);
	}

	parse(chunk) {
		this.buf += chunk;
		let pos = 0;
		let length = this.buf.length;
		let discardTrailingNewline = false;

		while (pos < length) {
			if (discardTrailingNewline) {
				if (this.buf[pos] === '\n') {
					++pos;
				}
				discardTrailingNewline = false;
			}

			let lineLength = -1;
			let fieldLength = -1;

			for (let i = pos; lineLength < 0 && i < length; ++i) {
				const c = this.buf[i];
				if (c === ':') {
					if (fieldLength < 0) {
						fieldLength = i - pos;
					}
				} else if (c === '\r') {
					discardTrailingNewline = true;
					lineLength = i - pos;
				} else if (c === '\n') {
					lineLength = i - pos;
				}
			}

			if (lineLength < 0) {
				break;
			}

			this.parseEventStreamLine(pos, fieldLength, lineLength);

			pos += lineLength + 1;
		}

		if (pos === length) {
			this.buf = '';
		} else if (pos > 0) {
			this.buf = this.buf.slice(pos);
		}
	}

	parseEventStreamLine(pos, fieldLength, lineLength) {
		if (lineLength === 0) {
			try {
				if (this.data.length > 0 && this.eventName) {
					const event = JSON.parse(this.data);
					event.name = this.eventName;
					if (this.eventName !== 'event') {
						this.emit(this.eventName, event);
					}
					this.emit('event', event);
					this.data = '';
				}
				this.eventName = undefined;
			} catch (e) {
				// do nothing if JSON.parse fails
			}
		} else if (fieldLength > 0) {
			const field = this.buf.slice(pos, pos + fieldLength);
			let step = 0;

			if (this.buf[pos + fieldLength + 1] !== ' ') {
				step = fieldLength + 1;
			} else {
				step = fieldLength + 2;
			}
			pos += step;
			const valueLength = lineLength - step;
			const value = this.buf.slice(pos, pos + valueLength);

			if (field === 'data') {
				this.data += value + '\n';
			} else if (field === 'event') {
				this.eventName = value;
			} else if (field === 'id') {
				this.lastEventId = value;
			} else if (field === 'retry') {
				const retry = parseInt(value, 10);
				if (!Number.isNaN(retry)) {
					this.reconnectInterval = retry;
				}
			}
		}
	}
}

export default EventStream;
