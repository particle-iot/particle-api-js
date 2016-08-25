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
		it('can get a resource', () => {
			const sut = new Agent();
			sut.request = sinon.stub();
			sut.request.returns('123');
			expect(sut.get('abcd', 'auth', 'query')).to.be.equal('123');
			expect(sut.request).to.be.calledWith({auth: 'auth', method: 'get', query: 'query', uri: 'abcd'});
		});

		it('can head a resource', () => {
			const sut = new Agent();
			sut.request = sinon.stub();
			sut.request.returns('123');
			expect(sut.head('abcd', 'auth')).to.be.equal('123');
			expect(sut.request).to.be.calledWith({auth: 'auth', method: 'head', uri: 'abcd'});
		});

		it('can post a resource', () => {
			const sut = new Agent();
			sut.request = sinon.stub();
			sut.request.returns('123');
			expect(sut.post('abcd', 'data', 'auth')).to.be.equal('123');
			expect(sut.request).to.be.calledWith({auth: 'auth', method: 'post', data: 'data', uri: 'abcd'});
		});

		it('can put a resource', () => {
			const sut = new Agent();
			sut.request = sinon.stub();
			sut.request.returns('123');
			expect(sut.put('abcd', 'data', 'auth')).to.be.equal('123');
			expect(sut.request).to.be.calledWith({auth: 'auth', method: 'put', data:'data', uri: 'abcd'});
		});

		it('can delete a resource', () => {
			const sut = new Agent();
			sut.request = sinon.stub();
			sut.request.returns('123');
			expect(sut.delete('abcd', 'data', 'auth')).to.be.equal('123');
			expect(sut.request).to.be.calledWith({auth: 'auth', method: 'delete', data:'data', uri: 'abcd'});
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
			req.returns({_getFormData: () => {
				return {
					append: attach
				}
			}});
			const files = {
				file: {data: 'filedata', path: 'filepath'},
				file2: {data: 'file2data', path: 'file2path'}
			};
			sut._buildRequest({uri: 'uri', method: 'get', files: files, makerequest: req});
			expect(attach.callCount).to.be.equal(2);
			expect(attach).to.be.calledWith('file', 'filedata', {filename: 'filepath', relativePath: '.'});
			expect(attach).to.be.calledWith('file2', 'file2data', {filename: 'file2path', relativePath: '.'});
		});

		it('should attach files and form data', () => {
			const sut = new Agent();
			sut.prefix = undefined;
			const req = sinon.stub();
			const attach = sinon.stub();
			const field = sinon.stub();
			req.returns({_getFormData: () => {
				return {
					append: attach
				}
			}, field: field});
			const files = {
				file: {data: 'filedata', path: 'filepath'},
				file2: {data: 'file2data', path: 'file2path'}
			};
			const form = {form1: 'value1', form2: 'value2'};
			sut._buildRequest({uri: 'uri', method: 'get', files: files, form: form, makerequest: req});
			expect(attach.callCount).to.be.equal(2);
			expect(attach).to.be.calledWith('file', 'filedata', {filename: 'filepath', relativePath: '.'});
			expect(attach).to.be.calledWith('file2', 'file2data', {filename: 'file2path', relativePath: '.'});
			expect(field.callCount).to.be.equal(2);
			expect(field).to.be.calledWith('form1', 'value1');
			expect(field).to.be.calledWith('form2', 'value2');
		});
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
			files:sanitizedFiles});
	});

	it('uses default arguments for request', () => {
		const sut = new Agent();
		sut._sanitizeFiles = sinon.stub();
		sut._request = sinon.stub();
		sut._request.returns('123');
		const result = sut.request({uri: 'abc', method:'post'});
		expect(result).to.equal('123');
		expect(sut._request).calledOnce.calledWith({uri: 'abc', method:'post',
			auth: undefined, data: undefined, files: undefined, form: undefined, query: undefined });
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
			form: 'form', files: 'files'};
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
});
