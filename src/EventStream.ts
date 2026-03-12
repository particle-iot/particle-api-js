import * as http from 'http';
import * as https from 'https';
import * as url from 'url';
import { EventEmitter } from 'events';
import type { EventData } from './types';

class EventStream extends EventEmitter {
	uri: string;
	token: string;
	reconnectInterval: number;
	timeout: number;
	data: string;
	buf: string;
	origin?: string;
	req?: http.ClientRequest;
	idleTimeout?: ReturnType<typeof setTimeout> | null;
	event?: boolean;
	eventName?: string;
	agent?: http.Agent;

	constructor(uri = '', token = '', agent?: http.Agent) {
		super();
		this.uri = uri;
		this.token = token;
		this.agent = agent;
		this.reconnectInterval = 2000;
		this.timeout = 13000;
		this.data = '';
		this.buf = '';

		this.parse = this.parse.bind(this);
		this.end = this.end.bind(this);
		this.idleTimeoutExpired = this.idleTimeoutExpired.bind(this);
	}

	connect(): Promise<EventStream> {
		return new Promise((resolve, reject) => {
			const parsed = url.parse(this.uri);
			const { hostname, protocol, port, path } = parsed;
			this.origin = `${protocol}//${hostname}${port ? (':' + port) : ''}`;

			const isSecure = protocol === 'https:';
			const requestor = isSecure ? https : http;
			const nonce = typeof performance !== 'undefined' ? performance.now() : 0;
			const requestOptions: http.RequestOptions = {
				hostname,
				protocol,
				path: `${path}?nonce=${nonce}`,
				headers: {
					'Authorization': `Bearer ${this.token}`
				},
				method: 'get',
				port: parseInt(port ?? '', 10) || (isSecure ? 443 : 80),
				mode: 'prefer-streaming'
			} as http.RequestOptions;
			if (this.agent) {
				requestOptions.agent = this.agent;
			}
			const req = requestor.request(requestOptions);

			this.req = req;

			let connected = false;
			const connectionTimeout = setTimeout(() => {
				if (this.req) {
					this.req.destroy();
				}
				reject({ error: new Error('Timeout'), errorDescription: `Timeout connecting to ${this.uri}` });
			}, this.timeout);

			req.on('error', (e: Error) => {
				clearTimeout(connectionTimeout);

				if (connected) {
					this.end();
				} else {
					reject({ error: e, errorDescription: `Network error from ${this.uri}` });
				}
			});

			req.on('response', (res: http.IncomingMessage) => {
				clearTimeout(connectionTimeout);

				const statusCode = res.statusCode;
				if (statusCode !== 200) {
					let body: string | object = '';
					res.on('data', (chunk: Buffer) => body += chunk.toString());
					res.on('end', () => {
						try {
							body = JSON.parse(body as string);
						} catch (_err) {
							// ignore
						} finally {
							let errorDescription = `HTTP error ${statusCode} from ${this.uri}`;
							if (body && typeof body === 'object' && 'error_description' in body) {
								errorDescription += ' - ' + (body as Record<string, string>).error_description;
							}
							reject({ statusCode, errorDescription, body });
							this.req = undefined;
						}
					});
					return;
				}

				this.data = '';
				this.buf = '';

				connected = true;
				res.on('data', this.parse);
				res.once('end', this.end);
				this.startIdleTimeout();
				resolve(this);
			});
			req.end();
		});
	}

	abort(): void {
		if (this.req) {
			this.req.destroy();
			this.req = undefined;
		}
		this.removeAllListeners();
	}

	private emitSafe(event: string, param?: EventData | Error): void {
		try {
			this.emit(event, param);
		} catch (error) {
			if (event !== 'error') {
				this.emitSafe('error', error as Error);
			}
		}
	}

	private end(): void {
		this.stopIdleTimeout();

		if (!this.req) {
			return;
		}

		this.req = undefined;
		this.emitSafe('disconnect');
		this.reconnect();
	}

	private reconnect(): void {
		setTimeout(() => {
			if (this.isOffline()) {
				this.reconnect();
				return;
			}

			this.emitSafe('reconnect');
			this.connect().then(() => {
				this.emitSafe('reconnect-success');
			}).catch((err: Error) => {
				this.emitSafe('reconnect-error', err);
				this.reconnect();
			});
		}, this.reconnectInterval);
	}

	private isOffline(): boolean {
		if (typeof navigator === 'undefined' || Object.hasOwnProperty.call(navigator, 'onLine')) {
			return false;
		}
		return !navigator.onLine;
	}

	private startIdleTimeout(): void {
		this.stopIdleTimeout();
		this.idleTimeout = setTimeout(this.idleTimeoutExpired, this.timeout);
	}

	private stopIdleTimeout(): void {
		if (this.idleTimeout) {
			clearTimeout(this.idleTimeout);
			this.idleTimeout = null;
		}
	}

	private idleTimeoutExpired(): void {
		if (this.req) {
			this.req.destroy();
			this.end();
		}
	}

	parse(chunk: Buffer | string): void {
		this.startIdleTimeout();

		this.buf += chunk.toString();
		let pos = 0;
		const length = this.buf.length;
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

	parseEventStreamLine(pos: number, fieldLength: number, lineLength: number): void {
		if (lineLength === 0) {
			try {
				if (this.data.length > 0 && this.event) {
					const event = JSON.parse(this.data) as EventData;
					event.name = this.eventName || '';
					this.emitSafe('event', event);
				}
			} catch (_err) {
				// ignore
			} finally {
				this.data = '';
				this.eventName = undefined;
				this.event = false;
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
				this.event = true;
			}
		}
	}
}

export = EventStream;
