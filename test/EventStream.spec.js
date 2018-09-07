import {sinon, expect} from './test-setup';
import EventStream from '../src/EventStream.js';
import http from 'http';

/*
  V constructor
  connect
  V abort
  V end
  ? parse
  ? parseEventStreamLine
*/

describe('EventStream tests', () => {
	it('constructor', () => {
		const ev = new EventStream('foo', 'bar', {
			test: '123'
		});

		expect(ev.uri).to.equal('foo');
		expect(ev.token).to.equal('bar');
		expect(ev.reconnectInterval).to.equal(2000);
		expect(ev.test).to.equal('123');
	});

	describe('connect', () => {
		it('sets up the right callback', (done) => {
			const ev = new EventStream();

			ev.uri = 'http://foo.bar:1337';

			ev.debug = sinon.stub();

			//const request = sinon.stub(http, 'request');
			const res = {
				statusCode: 200,
				on: () => {},
				once: () => {}
			};

			let functions = {};

			const requestor = {
				request: sinon.stub().returns({
					on: (name, cb) => {
						functions[name] = cb;

						if (name === 'response') {
							cb(res);
						}
					},
					end: sinon.stub()
				})
			};

			ev.connect(requestor).then(() => {
				expect(ev.origin).to.equal('http://foo.bar:1337');
				/* expect(requestor.request).to.have.been.calledWith({
					hostname: 'foo.bar1'
				}); TODO */
				expect(ev.debug).to.have.been.calledOnce;

				done();
			}).catch(err => {
				console.error(err);
				done();
			});
		});
	});

	describe('onResponse', () => {
		it('json body', () => {
			const ev = new EventStream();

			ev.uri = 'foo-uri';

			ev.emit = sinon.stub();

			const resolve = () => {};
			const reject = sinon.stub();

			let functions = {};

			const res = {
				statusCode: 400,
				on: (name, cb) => {
					functions[name] = cb;
				}
			};

			ev.onResponse(resolve, reject, res);

			functions.data('{"foo": "bar", "error_description": "error description"}');
			functions.end();

			expect(ev.emit).to.have.been.calledWith('response', {
				statusCode: 400,
				body: {
					foo: 'bar',
					error_description: 'error description'
				}
			});

			expect(reject).to.have.been.calledWith({
				statusCode: 400,
				errorDescription: 'HTTP error 400 from foo-uri - error description',
				body: {
					foo: 'bar',
					error_description: 'error description'
				}
			});
		});

		it('non-json body', () => {
			const ev = new EventStream();

			ev.uri = 'foo-uri';

			ev.emit = sinon.stub();

			const resolve = () => {};
			const reject = sinon.stub();

			let functions = {};

			const res = {
				statusCode: 400,
				on: (name, cb) => {
					functions[name] = cb;
				}
			};

			ev.onResponse(resolve, reject, res);

			functions.data('foo');
			functions.end();

			expect(ev.emit).to.have.been.calledWith('response', {
				statusCode: 400,
				body: 'foo'
			});

			//ev.emit = sinon.stub().throws('foo-error'); TODO

			//functions.end();

			//expect(ev.emit).to.have.been.calledWith('error', 'foo-error');

			expect(reject).to.have.been.calledWith({
				statusCode: 400,
				errorDescription: 'HTTP error 400 from foo-uri',
				body: 'foo'
			});

			expect(ev.req).to.be.undefined;
		});
	});

	it('onError', () => {
		const ev = new EventStream();

		ev.uri = 'foo';

		const reject = sinon.stub();

		ev.onError(reject, 'bar');

		expect(reject).to.have.been.calledWith({
			error: 'bar',
			errorDescription: 'Network error from foo'
		});
	});

  it('abort', () => {
    const ev = new EventStream();

    const req = {
      abort: sinon.stub()
    };

    ev.req = req;
    ev.removeAllListeners = sinon.stub();

    ev.abort();

    expect(req.abort).to.have.been.calledOnce;
    expect(ev.removeAllListeners).to.have.been.calledOnce;
  });

  describe('end', () => {
    it('should return undefined when there is no req', () => {
      const ev = new EventStream();

      ev.req = null;

      expect(ev.end()).to.be.undefined;
    });

    it('should call connect', () => {
      const ev = new EventStream();

      ev.reconnectInterval = 0;
      ev.req = true;

      ev.emit = sinon.stub();
      ev.removeAllListeners = sinon.stub();

      sinon.stub(EventStream.prototype, 'connect', function connect() {
        return new Promise((resolve, reject) => {
          reject('foo');
        });
      });

      ev.end();

      setTimeout(() => {
        expect(ev.connect).to.have.been.calledOnce;
        expect(ev.emit).to.have.been.calledWith('error', 'foo');
        expect(ev.removeAllListeners).to.have.been.calledOnce;
        done();
      }, 10);
    });
  });

	describe.only('parseEventStreamLine', () => {
		it('1', () => {
			const ev = new EventStream();
			const f = ev.parseEventStreamLine.bind(ev);

			ev.eventName = 'foo';
			ev.event = {};
			ev.data = '{"foo":"bar"}';

			ev.emit = sinon.stub();

			f(0, 0, 0);

			expect(ev.emit).to.have.been.calledWith('foo', {
				name: 'foo',
				foo: 'bar'
			});

			expect(ev.emit).to.have.been.calledWith('event', {
				name: 'foo',
				foo: 'bar'
			});
		});
	});
});