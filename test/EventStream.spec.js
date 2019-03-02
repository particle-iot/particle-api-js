import { sinon, expect } from './test-setup';
import http from 'http';
import { EventEmitter } from 'events';

import EventStream from '../src/EventStream';

describe('EventStream', () => {
	afterEach(() => {
		sinon.restore();
	});

	function makeRequest() {
		const fakeRequest = new EventEmitter();
		fakeRequest.end = sinon.spy();
		fakeRequest.setTimeout = sinon.spy();
		return fakeRequest;
	}

	function makeResponse(statusCode) {
		const fakeResponse = new EventEmitter();
		fakeResponse.statusCode = statusCode;
		return fakeResponse;
	}

	describe('constructor', () => {
		it('creates an EventStream objects', () => {
			const eventStream = new EventStream('uri', 'token');

			expect(eventStream).to.be.obj;
		});
	});

	describe('connect', () => {
		it('successfully connects to http', () => {
			const fakeRequest = makeRequest();
			sinon.stub(http, 'request').callsFake(() => {
				setImmediate(() => {
					const fakeResponse = makeResponse(200);
					fakeRequest.emit('response', fakeResponse);
				});

				return fakeRequest;
			});

			const eventStream = new EventStream('http://hostname:8080/path', 'token');

			return eventStream.connect().then(() => {
				expect(http.request).to.have.been.calledWith({
					hostname: 'hostname',
					protocol: 'http:',
					path: '/path?access_token=token',
					method: 'get',
					port: 8080,
					avoidFetch: true,
					mode: 'prefer-streaming'
				});
			});
		});

		it('returns http errors on connect', () => {
			const fakeRequest = makeRequest();
			sinon.stub(http, 'request').callsFake(() => {
				setImmediate(() => {
					const fakeResponse = makeResponse(500);
					fakeRequest.emit('response', fakeResponse);
					setImmediate(() => {
						fakeResponse.emit('data', '{"error":"unknown"}');
						fakeResponse.emit('end');
					});
				});

				return fakeRequest;
			});

			const eventStream = new EventStream('http://hostname:8080/path', 'token');

			return eventStream.connect().then(() => {
				throw new Error('expected to throw error');
			}, (reason) => {
				expect(reason).to.eql({
					statusCode: 500,
					errorDescription: 'HTTP error 500 from http://hostname:8080/path',
					body: {
						error: 'unknown'
					}
				});
			});
		});
	});

	describe('parse', () => {
		let eventStream;
		beforeEach(() => {
			eventStream = new EventStream();
			sinon.stub(eventStream, 'parseEventStreamLine');
		});

		it('accumulates date into the buffer before parsing line', () => {
			eventStream.parse('wo');
			eventStream.parse('rd');

			expect(eventStream.buf).to.eql('word');
			expect(eventStream.parseEventStreamLine).not.to.have.been.called;
		});

		it('parses a line ending with \\n', () => {
			const line = 'field: value\n';

			eventStream.parse(line);

			expect(eventStream.parseEventStreamLine).to.have.been.calledWith(0, line.indexOf(':'), line.indexOf('\n'));
		});

		it('parses 2 lines ending with \\n', () => {
			const line1 = 'field: value\n';
			const line2 = 'field2: value2\n';

			eventStream.parse(line1 + line2);

			expect(eventStream.parseEventStreamLine).to.have.been.calledWith(0, line1.indexOf(':'), line1.indexOf('\n'));
			expect(eventStream.parseEventStreamLine).to.have.been.calledWith(line1.length, line2.indexOf(':'), line2.indexOf('\n'));
		});


		it('parses a line ending with \\r\\n', () => {
			const line = 'field: value\r\n';

			eventStream.parse(line);

			expect(eventStream.parseEventStreamLine).to.have.been.calledWith(0, line.indexOf(':'), line.indexOf('\r'));
		});

		it('parses 2 lines ending with \\r\\n', () => {
			const line1 = 'field: value\r\n';
			const line2 = 'field2: value2\r\n';

			eventStream.parse(line1 + line2);

			expect(eventStream.parseEventStreamLine).to.have.been.calledWith(0, line1.indexOf(':'), line1.indexOf('\r'));
			expect(eventStream.parseEventStreamLine).to.have.been.calledWith(line1.length, line2.indexOf(':'), line2.indexOf('\r'));
		});

		it('clears buffer after parsing full lines', () => {
			eventStream.parse('field: value\n');

			expect(eventStream.buf).to.eql('');
		});

		it('keeps partial lines in buffer after parsing full lines', () => {
			eventStream.parse('field: value\nfield2');

			expect(eventStream.buf).to.eql('field2');
		});
	});

	describe('parseEventStreamLine', () => {
		let eventStream;
		beforeEach(() => {
			eventStream = new EventStream();
		});

		it('ignores comments', () => {
			// comments starts with : at column 0
			const line = ':ok\n';
			eventStream.buf = line;

			eventStream.parseEventStreamLine(0, line.indexOf(':'), line.indexOf('\n'));

			expect(eventStream.event).not.to.be.ok;
			expect(eventStream.data).to.be.eql('');
		});

		it('saves event name', () => {
			const line = 'event: testevent\n';
			eventStream.buf = line;

			eventStream.parseEventStreamLine(0, line.indexOf(':'), line.indexOf('\n'));

			expect(eventStream.event).to.be.true;
			expect(eventStream.eventName).to.eql('testevent');
		});

		it('saves event data', () => {
			const line = 'data: {"data":"test"}\n';
			eventStream.buf = line;

			eventStream.parseEventStreamLine(0, line.indexOf(':'), line.indexOf('\n'));

			expect(eventStream.data).to.eql('{"data":"test"}\n');
		});

		it('saves event name and data on separate lines', () => {
			const lines = ['event: testevent\n', 'data: {"data":"test"}\n'];
			for (let line of lines) {
				eventStream.buf = line;

				eventStream.parseEventStreamLine(0, line.indexOf(':'), line.indexOf('\n'));
			}

			expect(eventStream.event).to.be.true;
			expect(eventStream.eventName).to.eql('testevent');
			expect(eventStream.data).to.eql('{"data":"test"}\n');
		});

		it('emits event on blank line after saving event name and data', () => {
			const handler = sinon.spy();
			eventStream.event = true;
			eventStream.eventName = 'testevent';
			eventStream.data = '{"data":"test"}\n';
			eventStream.on('event', handler);

			eventStream.parseEventStreamLine(0, -1, 0);

			expect(handler).to.have.been.calledWith({
				name: 'testevent',
				data: 'test'
			});
		});

		it('emits event by Particle event name', () => {
			const handler = sinon.spy();
			eventStream.event = true;
			eventStream.eventName = 'myparticleevent';
			eventStream.data = '{"data":"test"}\n';
			eventStream.on('myparticleevent', handler);

			eventStream.parseEventStreamLine(0, -1, 0);

			expect(handler).to.have.been.called;
		});

		it('does not emits event by Particle event name for reserved names', () => {
			const handler = sinon.spy();
			eventStream.event = true;
			eventStream.eventName = 'response';
			eventStream.data = '{"data":"test"}\n';
			eventStream.on('response', handler);

			eventStream.parseEventStreamLine(0, -1, 0);

			expect(handler).not.to.have.been.called;
		});

		it('emits error if the event handler crashes', () => {
			const errorHandler = sinon.spy();
			eventStream.event = true;
			eventStream.eventName = 'testevent';
			eventStream.data = '{"data":"test"}\n';
			eventStream.on('error', errorHandler);
			eventStream.on('event', () => {
				throw new Error('failed!');
			});

			eventStream.parseEventStreamLine(0, -1, 0);

			expect(errorHandler).to.have.been.called;
		});

		it('clears the event after emitting it', () => {
			eventStream.event = true;
			eventStream.eventName = 'testevent';
			eventStream.data = '{"data":"test"}\n';

			eventStream.parseEventStreamLine(0, -1, 0);

			expect(eventStream.event).to.be.false;
			expect(eventStream.eventName).to.be.undefined;
			expect(eventStream.data).to.eql('');
		});

		it('ignores multiple blank lines in succession', () => {
			const handler = sinon.spy();
			eventStream.on('event', handler);

			eventStream.parseEventStreamLine(0, -1, 0);
			eventStream.parseEventStreamLine(0, -1, 0);
			eventStream.parseEventStreamLine(0, -1, 0);

			expect(handler).not.to.have.been.called;
		});
	});
});
