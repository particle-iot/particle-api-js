import {sinon, expect} from './test-setup';
import Agent from '../src/Agent.js';

describe('Agent', () => {
	describe('sanitize files', () => {
		it('can call sanitize will falsy value', () => {
			const sut = new Agent();
			expect(sut._sanitizeFiles(undefined)).to.be.falsy;
		});

		it('sanitizes file names', () => {
			const sut = new Agent();
			const original = {'one': 'content1', 'two': 'content2'};
			const actual = sut._sanitizeFiles(original);
			expect(actual).to.eql({
				'file': {
					'data': 'content1',
					'path': 'one'
				},
				'file2': {
					'data': 'content2',
					'path': 'two'
				}
			});
		});
	});

	describe('resource operations', () => {
		let context;
		beforeEach(() => {
			context = { blah: {}}
		});

		it('can get a resource', () => {
			const sut = new Agent();
			sut.request = sinon.stub();
			sut.request.returns('123');
			expect(sut.get('abcd', 'auth', 'query', context)).to.be.equal('123');
			expect(sut.request).to.be.calledWith({auth: 'auth', method: 'get', query: 'query', uri: 'abcd', context});
		});

		it('can head a resource', () => {
			const sut = new Agent();
			sut.request = sinon.stub();
			sut.request.returns('123');
			expect(sut.head('abcd', 'auth', 'query', context)).to.be.equal('123');
			expect(sut.request).to.be.calledWith({auth: 'auth', method: 'head', uri: 'abcd', query: 'query', context });
		});

		it('can post a resource', () => {
			const sut = new Agent();
			sut.request = sinon.stub();
			sut.request.returns('123');
			expect(sut.post('abcd', 'data', 'auth', context)).to.be.equal('123');
			expect(sut.request).to.be.calledWith({auth: 'auth', method: 'post', data: 'data', uri: 'abcd', context});
		});

		it('can put a resource', () => {
			const sut = new Agent();
			sut.request = sinon.stub();
			sut.request.returns('123');
			expect(sut.put('abcd', 'data', 'auth', context)).to.be.equal('123');
			expect(sut.request).to.be.calledWith({auth: 'auth', method: 'put', data:'data', uri: 'abcd', context});
		});

		it('can delete a resource', () => {
			const sut = new Agent();
			sut.request = sinon.stub();
			sut.request.returns('123');
			expect(sut.delete('abcd', 'data', 'auth', context)).to.be.equal('123');
			expect(sut.request).to.be.calledWith({auth: 'auth', method: 'delete', data:'data', uri: 'abcd', context});
		});
	});

	describe('authorize', () => {
		it('authorize no auth is unchanged', () => {
			const sut = new Agent();
			expect(sut._authorizationHeader(undefined)).to.be.undefined;
		});

		it('authorize with credentials', () => {
			const sut = new Agent();
			const authfn = sinon.spy();
			const req = {auth: authfn};
			const auth = {username: 'me', password: 'pwd'};
			expect(sut._authorizationHeader(req, auth)).to.be.equal(req);
			expect(authfn).to.have.been.calledWith('me', 'pwd');
		});

		it('authorize with bearer', () => {
			const auth = '123';
			const bearer = 'Bearer 123';
			const sut = new Agent();
			const setfn = sinon.spy();
			const req = {set: setfn};
			expect(sut._authorizationHeader(req, auth)).to.be.equal(req);
			expect(setfn).to.have.been.calledWith({Authorization: bearer});
		});
	});

	describe('build request', () => {

		it('uses prefix if provided', () => {
			const sut = new Agent();
			sut.prefix = 'abc';
			const use = sinon.stub();
			const req = sinon.stub();
			req.returns({use: use});
			const result = sut._buildRequest({uri: 'uri', method: 'get', makerequest: req});
			expect(result).to.be.ok;
			expect(req).to.be.calledWith('get', 'uri');
			expect(use).to.be.calledWith('abc');
		});

		it('does not call used if no prefix provided', () => {
			const sut = new Agent();
			const use = sinon.stub();
			const req = sinon.stub();
			req.returns({use: use});
			const result = sut._buildRequest({uri: 'uri', method: 'get', makerequest: req});
			expect(result).to.be.ok;
			expect(req).to.be.calledWith('get', 'uri');
			expect(use).to.be.notCalled;
		});

		it('should invoke _applyContext with the request and context when provided', () => {
			const sut = new Agent();
			sut._applyContext = sinon.stub();
			sut.prefix = undefined;
			const request = {};
			const context = { foo: {}};
			const req = sinon.stub().returns(request);
			sut._buildRequest({uri: 'uri', method: 'get', context, makerequest: req});
			expect(sut._applyContext).to.be.calledWith(sinon.match.same(request), sinon.match.same(context));
		});

		it('should not invoke _applyContext when no context is provided', () => {
			const sut = new Agent();
			sut._applyContext = sinon.stub();
			sut.prefix = undefined;
			const request = {};
			const req = sinon.stub().returns(request);
			sut._buildRequest({uri: 'uri', method: 'get', makerequest: req});
			expect(sut._applyContext).to.not.be.called;
		});


		it('should invoke authorize with the request and auth', () => {
			const sut = new Agent();
			sut.prefix = undefined;
			const request = {};
			const req = sinon.stub();
			req.returns(request);
			const authorize = sinon.stub();
			sut._authorizationHeader = authorize;
			sut._buildRequest({uri: 'uri', method: 'get', auth: '123', makerequest: req});
			expect(authorize).to.be.calledWith(sinon.match.same(request), '123');
		});

		it('should invoke query with the given query', () => {
			const sut = new Agent();
			sut.prefix = undefined;
			const query = sinon.stub();
			const req = sinon.stub();
			req.returns({query: query, authorize: sinon.stub()});
			sut._buildRequest({uri: 'uri', method: 'get', query: '123', makerequest: req});
			expect(query).to.be.calledWith('123');
		});

		it('should not query when no query given', () => {
			const sut = new Agent();
			sut.prefix = undefined;
			const query = sinon.stub();
			const req = sinon.stub();
			req.returns({query: query, _authorizationHeader: sinon.stub()});
			sut._buildRequest({uri: 'uri', method: 'get', makerequest: req});
			expect(query).to.be.notCalled;
		});

		it('should invoke send when data given', () => {
			const sut = new Agent();
			sut.prefix = undefined;
			const req = sinon.stub();
			const send = sinon.stub();
			req.returns({send: send});
			sut._buildRequest({uri: 'uri', method: 'get', data: 'abcd', makerequest: req});
			expect(send).to.be.calledWith('abcd');
		});

		it('should setup form send when form data is given', () => {
			const sut = new Agent();
			sut.prefix = undefined;
			const req = sinon.stub();
			const send = sinon.stub();
			const type = sinon.stub();
			req.returns({send: send, type: type});
			sut._buildRequest({uri: 'uri', method: 'get', form: 'abcd', makerequest: req});
			expect(send).to.be.calledWith('abcd');
			expect(type).to.be.calledWith('form');
		});

		it('should attach files', () => {
			const sut = new Agent();
			sut.prefix = undefined;
			const req = sinon.stub();
			const attach = sinon.stub();
			req.returns({ attach: attach });
			const files = {
				file: {data: 'filedata', path: 'filepath'},
				file2: {data: 'file2data', path: 'file2path'}
			};
			sut._buildRequest({uri: 'uri', method: 'get', files: files, makerequest: req});
			expect(attach.callCount).to.be.equal(2);
			expect(attach).to.be.calledWith('file', 'filedata', {filepath: 'filepath'});
			expect(attach).to.be.calledWith('file2', 'file2data', {filepath: 'file2path'});
		});

		it('should attach files and form data', () => {
			const sut = new Agent();
			sut.prefix = undefined;
			const req = sinon.stub();
			const attach = sinon.stub();
			const field = sinon.stub();
			req.returns({
				attach: attach,
				field: field
			});
			const files = {
				file: {data: 'filedata', path: 'filepath'},
				file2: {data: 'file2data', path: 'file2path'}
			};
			const form = {form1: 'value1', form2: 'value2'};
			sut._buildRequest({uri: 'uri', method: 'get', files: files, form: form, makerequest: req});
			expect(attach.callCount).to.be.equal(2);
			expect(attach).to.be.calledWith('file', 'filedata', {filepath: 'filepath'});
			expect(attach).to.be.calledWith('file2', 'file2data', {filepath: 'file2path'});
			expect(field.callCount).to.be.equal(2);
			expect(field).to.be.calledWith('form1', 'value1');
			expect(field).to.be.calledWith('form2', 'value2');
		});

		it('should handle nested dirs', () => {
			const sut = new Agent();
			const files = {
				file: {data: makeFile('filedata'), path: 'filepath.ino'},
				file2: {data: makeFile('file2data'), path: 'dir/file2path.cpp'}
			}
			const req = sut._buildRequest({uri: 'uri', method: 'get', files: files});
			expect(extractFilename(req._formData, 'file', 0)).to.eql('filepath.ino');
			expect(extractFilename(req._formData, 'file2', 3)).to.eql('dir/file2path.cpp');
		});

		if (!inBrowser()) {
			it('should handle Windows nested dirs', () => {
				const sut = new Agent();
				const files = {
					file: {data: makeFile('filedata'), path: 'dir\\windowsfilepath.cpp'}
				}
				const req = sut._buildRequest({uri: 'uri', method: 'get', files: files});
				expect(extractFilename(req._formData, 'file', 0)).to.eql('dir/windowsfilepath.cpp');
			});
		}

		function inBrowser() {
			return typeof window !== 'undefined';
		}

		function makeFile(data) {
			if (inBrowser()) {
				return new Blob([data]);
			} else {
				return data;
			}
		}

		function extractFilename(formData, fieldName, fieldIndex) {
			if (inBrowser()) {
				return formData.get(fieldName).name;
			} else {
				return /filename="([^"]*)"/.exec(formData._streams[fieldIndex])[1];
			}
		}
	});

	it('sanitizes files from a request', () => {
		const sut = new Agent();
		sut._sanitizeFiles = sinon.stub();
		sut._request = sinon.stub();
		const sanitizedFiles = {a:'a'};
		sut._sanitizeFiles.returns(sanitizedFiles);
		sut._request.returns('request_result');
		const files = {};
		const form = {};
		const result = sut.request({uri: 'abc', method:'post', data:'123', query:'all', form:form, files:files});
		expect(result).to.be.equal('request_result');
		expect(sut._sanitizeFiles).calledOnce.calledWith(sinon.match.same(files));
		expect(sut._request).calledOnce.calledWith({uri: 'abc', auth: undefined, method: 'post', data: '123', query: 'all', form:form,
			files:sanitizedFiles, context: undefined});
	});

	it('uses default arguments for request', () => {
		const sut = new Agent();
		sut._sanitizeFiles = sinon.stub();
		sut._request = sinon.stub();
		sut._request.returns('123');
		const result = sut.request({uri: 'abc', method:'post'});
		expect(result).to.equal('123');
		expect(sut._request).calledOnce.calledWith({uri: 'abc', method:'post',
			auth: undefined, data: undefined, files: undefined, form: undefined, query: undefined, context: undefined });
	});

	it('builds and sends the request', () => {
		const sut = new Agent();
		const buildRequest = sinon.stub();
		const promiseResponse = sinon.stub();
		sut._buildRequest = buildRequest;
		sut._promiseResponse = promiseResponse;
		buildRequest.returns('arequest');
		promiseResponse.returns('promise');

		const requestArgs = {uri:'uri', method:'method', data:'data', auth:'auth', query: 'query',
			form: 'form', files: 'files', context};
		const result = sut._request(requestArgs);
		expect(result).to.be.equal('promise');
		expect(buildRequest).calledWith(requestArgs);
		expect(promiseResponse).calledWith('arequest');
		expect(buildRequest).calledOnce;
		expect(promiseResponse).calledOnce;
	});

	it('builds a promise to call _sendRequest from _promiseResponse', () => {
		const sut = new Agent();
		const req = sinon.stub();
		const response = 'response';
		const sendRequest = sinon.spy((req, fulfill, reject)=>{
			fulfill(response);
		});
		sut._sendRequest = sendRequest;
		const promise = sut._promiseResponse(req);
		expect(promise).has.property('then');
		return promise.then((response) => {
			expect(sendRequest).calledOnce;
			// how to verify that fulfill/reject arguments are correctly passed to the promised function?
			//expect(sendRequest).calledWith(req, fulfill, reject);
			expect(response).to.be.equal('response');
		});
	});

	describe('_sendRequest', () => {

		it('can retrieve a success response', () => {
			const response = { body: 'abc', statusCode:200};
			const fulfill = sinon.stub();
			const reject = sinon.stub();

			const request = {end: function end(callback) {
				callback(undefined, response);
			}};
			const end = sinon.spy(request, 'end');

			const sut = new Agent();
			const result = sut._sendRequest(request, fulfill, reject);
			expect(result).to.be.undefined;
			expect(end).to.be.calledOnce;

			expect(fulfill).to.be.calledOnce;
			// not called with response directly but with an object that is equivalent
			expect(fulfill).to.be.calledWith(response);
			expect(reject).to.not.be.called;
		});

		const failResponseData = [
			{name: 'error text includes body error description',
			response: { body: {error_description: 'file not found'}},
			error: {status: 404},
            errorDescription: 'HTTP error 404 from 123.url - file not found'},

			{name: 'error text with no body description',
			response: { body: {}},
			error: {status: 404},
			errorDescription: 'HTTP error 404 from 123.url'},

			{name: 'error text with no body',
			response: { },
			error: {status: 404},
			errorDescription: 'HTTP error 404 from 123.url'},

			{name: 'error text with no response',
			error: {status: 404},
			errorDescription: 'HTTP error 404 from 123.url'},

			{name: 'error text with no status',
			error: {},
			errorDescription: 'Network error from 123.url'},

		];
		for (let failData of failResponseData) {
			it(`can retrieve an error response - ${failData.name}`, () => {
				const fulfill = sinon.stub();
				const reject = sinon.stub();

				const request = {
					url: '123.url', end: function end(callback) {
						callback(failData.error, failData.response);
					}
				};
				const end = sinon.spy(request, 'end');

				const sut = new Agent();
				const result = sut._sendRequest(request, fulfill, reject);
				expect(result).to.be.undefined;
				expect(end).to.be.calledOnce;
				expect(fulfill).to.not.be.called;
				expect(reject).to.be.calledWithMatch({statusCode: failData.error.status, errorDescription:
					failData.errorDescription, error:failData.error, body:failData.response ? failData.response.body : undefined});
			});
		}
	});

	describe('context', () => {
		let sut;

		beforeEach(() => {
			sut = new Agent();
		});

		describe('_nameAtVersion', () => {
			it('returns empty string when no name given', () => {
				expect(sut._nameAtVersion('', '1.2.3')).to.eql('');
			});

			it('returns just the name when no version given', () => {
				expect(sut._nameAtVersion('fred')).to.eql('fred');
			});

			it('returns name@version when both are given', () => {
				expect(sut._nameAtVersion('fred', '1.2.3')).to.eql('fred@1.2.3');
			});
		});

		describe('_applyContext', () => {
			let req;
			beforeEach(() => {
				req = { set: sinon.stub() };
			});
			it('applies the tool context when defined',() => {
				const context = { tool: {name: 'spanner' }};
				sut._applyContext(req, context);
				expect(req.set).to.have.been.calledOnce;
				expect(req.set).to.have.been.calledWith('X-Particle-Tool', 'spanner');
			});

			it('does not apply the tool context when not defined',() => {
				const context = { tool: {name2: 'spanner' }};
				sut._applyContext(req, context);
				expect(req.set).to.have.not.been.called;
			});

			it('applies the project context when defined',() => {
				const context = { project: {name: 'blinky' }};
				sut._applyContext(req, context);
				expect(req.set).to.have.been.calledOnce;
				expect(req.set).to.have.been.calledWith('X-Particle-Project', 'blinky');
			});

			it('does not apply the tool context when not defined',() => {
				const context = { project: {name2: 'blinky' }};
				sut._applyContext(req, context);
				expect(req.set).to.have.been.not.called;
			});
		});

		describe('_addToolContext', () => {
			it('does not add a header when the tool name is not defined', () => {
				const req = { set: sinon.stub() };
				const tool = { noname: 'cli' };
				sut._addToolContext(req, tool);
				expect(req.set).to.have.not.been.called;
			});

			it('adds a header when the tool is defined', () => {
				const req = { set: sinon.stub() };
				const tool = { name: 'cli' };
				sut._addToolContext(req, tool);
				expect(req.set).to.have.been.calledWith('X-Particle-Tool', 'cli');
			});

			it('adds a header when the tool and components is defined', () => {
				const req = { set: sinon.stub() };
				const tool = { name: 'cli', version: '1.2.3', components: [
					{ name: 'bar', version: 'a.b.c'},
					{ name: 'foo', version: '0.0.1'}
				]};
				sut._addToolContext(req, tool);
				expect(req.set).to.have.been.calledWith('X-Particle-Tool', 'cli@1.2.3, bar@a.b.c, foo@0.0.1');
			});

		});

		describe('_addProjectContext', () => {
			it('adds a header when the project is defined', () => {
				const req = { set: sinon.stub() };
				const project = { name: 'blinky' };
				sut._addProjectContext(req, project);
				expect(req.set).to.have.been.calledWith('X-Particle-Project', 'blinky');
			});

			it('does not set the header when the project has no name', () => {
				const req = { set: sinon.stub() };
				const project = { noname: 'blinky' };
				sut._addProjectContext(req, project);
				expect(req.set).to.have.not.been.called;
			});
		});

		describe('_buildSemicolonSeparatedProperties', () => {
			const obj = { name: 'fred', color: 'pink' };
			it('returns empty string when no default property', () => {
				expect(sut._buildSemicolonSeparatedProperties(obj)).to.be.eql('');
			});

			it('returns empty string when default property does not exist', () => {
				expect(sut._buildSemicolonSeparatedProperties(obj, 'job')).to.be.eql('');
			});

			it('returns the default property only', () => {
				expect(sut._buildSemicolonSeparatedProperties({name:'fred'}, 'name')).eql('fred');
			});

			it('returns the default property plus additional properties', () => {
				expect(sut._buildSemicolonSeparatedProperties(obj, 'name')).eql('fred; color=pink');
			});
		});


	});
});
