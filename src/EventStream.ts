import * as http from 'http';
import * as https from 'https';
import * as url from 'url';
import { EventEmitter } from 'events';

interface EventStreamError {
	error?: Error;
	errorDescription: string;
	statusCode?: number;
	body?: any;
}

interface ParticleEvent {
	name: string;
	data?: string;
	ttl?: number;
	published_at?: string;
	coreid?: string;
}

class EventStream extends EventEmitter {
	private uri: string;
	private token: string;
	private reconnectInterval: number = 2000;
	private timeout: number = 13000; // keep alive can be sent up to 12 seconds after last event
	private data: string = '';
	private buf: string = '';
	private req?: http.ClientRequest;
	private origin?: string;
	private idleTimeout?: NodeJS.Timeout;
	private eventName?: string;
	private event: boolean = false;

	constructor(uri: string, token: string) {
		super();
		this.uri = uri;
		this.token = token;

		this.parse = this.parse.bind(this);
		this.end = this.end.bind(this);
		this.idleTimeoutExpired = this.idleTimeoutExpired.bind(this);
	}

	connect(): Promise<EventStream> {
		return new Promise((resolve, reject) => {
			const parsedUrl = url.parse(this.uri);
			const { hostname, protocol, port, path } = parsedUrl;
			this.origin = `${protocol}//${hostname}${port ? (':' + port) : ''}`;

			const isSecure = protocol === 'https:';
			const requestor = isSecure ? https : http;
			const nonce = (global as any).performance ? (global as any).performance.now() : 0;

			const req = requestor.request({
				hostname: hostname!,
				protocol,
				// Firefox has issues making multiple fetch requests with the same parameters so add a nonce
				path: `${path}?nonce=${nonce}`,
				headers: {
					'Authorization': `Bearer ${this.token}`
				},
				method: 'get',
				port: parseInt(port || (isSecure ? '443' : '80'), 10),
				// @ts-ignore - This is a non-standard option but may be used by some environments
				mode: 'prefer-streaming'
			});

			this.req = req;

			let connected = false;
			const connectionTimeout = setTimeout(() => {
				if (this.req) {
					this.req.abort();
				}
				reject({
					error: new Error('Timeout'),
					errorDescription: `Timeout connecting to ${this.uri}`
				});
			}, this.timeout);

			req.on('error', (e: Error) => {
				clearTimeout(connectionTimeout);

				if (connected) {
					this.end();
				} else {
					reject({
						error: e,
						errorDescription: `Network error from ${this.uri}`
					});
				}
			});

			req.on('response', (res: http.IncomingMessage) => {
				clearTimeout(connectionTimeout);

				const statusCode = res.statusCode!;
				if (statusCode !== 200) {
					let body = '';
					res.on('data', (chunk: Buffer) => body += chunk.toString());
					res.on('end', () => {
						let parsedBody: any;
						try {
							parsedBody = JSON.parse(body);
						} catch (_err) {
							// don't bother doing anything special if the JSON.parse fails
							// since we are already about to reject the promise anyway
						}

						let errorDescription = `HTTP error ${statusCode} from ${this.uri}`;
						if (parsedBody && parsedBody.error_description) {
							errorDescription += ' - ' + parsedBody.error_description;
						}

						reject({
							statusCode,
							errorDescription,
							body: parsedBody || body
						});
						this.req = undefined;
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
			this.req.abort();
			this.req = undefined;
		}
		this.removeAllListeners();
	}

	/* Private methods */

	private emitSafe(event: string, param?: any): void {
		try {
			this.emit(event, param);
		} catch (error) {
			if (event !== 'error') {
				this.emitSafe('error', error);
			}
		}
	}

	private end(): void {
		this.stopIdleTimeout();

		if (!this.req) {
			// request was ended intentionally by abort
			// do not auto reconnect.
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
			}).catch((err: EventStreamError) => {
				this.emitSafe('reconnect-error', err);
				this.reconnect();
			});
		}, this.reconnectInterval);
	}

	private isOffline(): boolean {
		if (typeof navigator === 'undefined' || !Object.hasOwnProperty.call(navigator, 'onLine')) {
			return false;
		}
		return !(navigator as any).onLine;
	}

	private startIdleTimeout(): void {
		this.stopIdleTimeout();
		this.idleTimeout = setTimeout(this.idleTimeoutExpired, this.timeout);
	}

	private stopIdleTimeout(): void {
		if (this.idleTimeout) {
			clearTimeout(this.idleTimeout);
			this.idleTimeout = undefined;
		}
	}

	private idleTimeoutExpired(): void {
		if (this.req) {
			this.req.abort();
			this.end();
		}
	}

	private parse(chunk: Buffer): void {
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

	private parseEventStreamLine(pos: number, fieldLength: number, lineLength: number): void {
		if (lineLength === 0) {
			try {
				if (this.data.length > 0 && this.event) {
					const event: ParticleEvent = JSON.parse(this.data);
					event.name = this.eventName || '';
					this.emitSafe('event', event);
				}
			} catch (_err) {
				// do nothing if JSON.parse fails
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

