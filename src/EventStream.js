/* eslint max-depth: 0 */
const http = require('http');
const https = require('https');
const url = require('url');
const { EventEmitter } = require('events');

class EventStream extends EventEmitter {
    constructor(uri, token) {
        super();
        this.uri = uri;
        this.token = token;
        this.reconnectInterval = 2000;
        this.timeout = 13000; // keep alive can be sent up to 12 seconds after last event
        this.data = '';
        this.buf = '';

        this.parse = this.parse.bind(this);
        this.end = this.end.bind(this);
        this.idleTimeoutExpired = this.idleTimeoutExpired.bind(this);
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
                path: `${path}?access_token=${this.token}`,
                method: 'get',
                // @ts-ignore
                port: parseInt(port, 10) || (isSecure ? 443 : 80),
                // @ts-ignore
                mode: 'prefer-streaming'
            });

            this.req = req;

            let connected = false;
            let connectionTimeout = setTimeout(() => {
                if (this.req) {
                    this.req.abort();
                }
                reject({ error: new Error('Timeout'), errorDescription: `Timeout connecting to ${this.uri}` });
            }, this.timeout);

            req.on('error', e => {
                clearTimeout(connectionTimeout);

                if (connected) {
                    this.end();
                } else {
                    reject({ error: e, errorDescription: `Network error from ${this.uri}` });
                }
            });

            req.on('response', res => {
                clearTimeout(connectionTimeout);

                const statusCode = res.statusCode;
                if (statusCode !== 200) {
                    let body = '';
                    res.on('data', chunk => body += chunk);
                    res.on('end', () => {
                        try {
                            body = JSON.parse(body);
                        } catch (e) {
                            // don't bother doing anything special if the JSON.parse fails
                            // since we are already about to reject the promise anyway
                        } finally {
                            let errorDescription = `HTTP error ${statusCode} from ${this.uri}`;
                            // @ts-ignore
                            if (body && body.error_description) {
                                // @ts-ignore
                                errorDescription += ' - ' + body.error_description;
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

    abort() {
        if (this.req) {
            this.req.abort();
            this.req = undefined;
        }
        this.removeAllListeners();
    }

    /* Private methods */

    emitSafe(event, param) {
        try {
            this.emit(event, param);
        } catch (error) {
            if (event !== 'error') {
                this.emitSafe('error', error);
            }
        }
    }

    end() {
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

    reconnect() {
        setTimeout(() => {
            if (this.isOffline()) {
                this.reconnect();
                return;
            }

            this.emitSafe('reconnect');
            this.connect().then(() => {
                this.emitSafe('reconnect-success');
            }).catch(err => {
                this.emitSafe('reconnect-error', err);
                this.reconnect();
            });
        }, this.reconnectInterval);
    }

    isOffline() {
        if (typeof navigator === 'undefined' || navigator.hasOwnProperty('onLine')) {
            return false;
        }
        return !navigator.onLine;
    }

    startIdleTimeout() {
        this.stopIdleTimeout();
        this.idleTimeout = setTimeout(this.idleTimeoutExpired, this.timeout);
    }

    stopIdleTimeout() {
        if (this.idleTimeout) {
            clearTimeout(this.idleTimeout);
            this.idleTimeout = null;
        }
    }

    idleTimeoutExpired() {
        if (this.req) {
            this.req.abort();
            this.end();
        }
    }

    parse(chunk) {
        this.startIdleTimeout();

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
                if (this.data.length > 0 && this.event) {
                    const event = JSON.parse(this.data);
                    event.name = this.eventName || '';
                    this.emitSafe('event', event);
                }
            } catch (e) {
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

module.exports = EventStream;
