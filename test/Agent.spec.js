const { sinon, expect } = require('./test-setup');
const Agent = require('../src/Agent.js');

describe('Agent', () => {
	beforeEach(() => {
		sinon.restore();
	});

	describe('constructor', () => {
		it('calls setBaseUrl', () => {
			const baseUrl = 'https://foo.com';
			sinon.stub(Agent.prototype, 'setBaseUrl');
			const agent = new Agent(baseUrl);
			expect(agent.setBaseUrl).to.have.property('callCount', 1);
			expect(agent.setBaseUrl.firstCall.args).to.have.lengthOf(1);
			expect(agent.setBaseUrl.firstCall.args[0]).to.eql(baseUrl);
		});
	});

	describe('sanitize files', () => {
		it('can call sanitize will falsy value', () => {
			const agent = new Agent();
			expect(agent._sanitizeFiles(undefined)).to.be.undefined;
		});

		it('sanitizes file names', () => {
			const agent = new Agent();
			const original = { one: 'content1', two: 'content2' };
			const actual = agent._sanitizeFiles(original);
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
		let uri, method, auth, headers, query, data, context, agent;

		beforeEach(() => {
			uri = 'http://example.com/v1';
			method = 'get';
			auth = 'fake-token';
			headers = { 'X-FOO': 'foo', 'X-BAR': 'bar' };
			query = 'foo=1&bar=2';
			data = { foo: true, bar: false };
			context = { blah: {} };
			agent = new Agent();
			agent.request = sinon.stub();
			agent.request.resolves('fake-response');
		});

		it('can GET a resource', () => {
			return agent.get({ uri, auth, headers, query, context }).then(() => {
				expect(agent.request).to.be.calledWith({ uri, method, auth, headers, query, context });
			});
		});

		it('can HEAD a resource', () => {
			method = 'head';
			return agent.head({ uri, auth, headers, query, context }).then(() => {
				expect(agent.request).to.be.calledWith({ uri, method, auth, headers, query, context });
			});
		});

		it('can POST a resource', () => {
			method = 'post';
			return agent.post({ uri, auth, headers, data, context }).then(() => {
				expect(agent.request).to.be.calledWith({ uri, method, auth, headers, data, context });
			});
		});

		it('can PUT a resource', () => {
			method = 'put';
			return agent.put({ uri, auth, headers, data, context }).then(() => {
				expect(agent.request).to.be.calledWith({ uri, method, auth, headers, data, context });
			});
		});

		it('can DELETE a resource', () => {
			method = 'delete';
			return agent.delete({ uri, auth, headers, data, context }).then(() => {
				expect(agent.request).to.be.calledWith({ uri, method, auth, headers, data, context });
			});
		});
	});

	describe('authorize', () => {
		let agent;

		beforeEach(() => {
			agent = new Agent();
		});

		it('authorize no auth is unchanged', () => {
			expect(agent._getAuthorizationHeader(undefined)).to.eql({});
		});

		it('authorize with bearer', () => {
			const auth = '123';
			const bearer = 'Bearer 123';
			const headers = agent._getAuthorizationHeader(auth);
			expect(headers).to.eql({ Authorization: bearer });
		});

		if (typeof window !== 'undefined') {
			it('supports auth with user/pass in browsers', () => {
				const auth = {
					username: 'test@particle.io',
					password: 'super_secret'
				};
				const basic = 'Basic dGVzdEBwYXJ0aWNsZS5pbzpzdXBlcl9zZWNyZXQ=';
				const headers = agent._getAuthorizationHeader(auth);
				expect(headers).to.eql({ Authorization: basic });
			});
		} else {
			it('supports auth with user/pass in node', () => {
				const auth = {
					username: 'test@particle.io',
					password: 'super_secret'
				};
				const basic = 'Basic dGVzdEBwYXJ0aWNsZS5pbzpzdXBlcl9zZWNyZXQ=';
				const headers = agent._getAuthorizationHeader(auth);
				expect(headers).to.eql({ Authorization: basic });
			});
		}
	});

	describe('request', () => {
		let agent;

		beforeEach(() => {
			agent = new Agent();
			agent._promiseResponse = sinon.stub();
			agent._promiseResponse.resolves('fake-response');
			agent._buildRequest = sinon.stub();
			agent._sanitizeFiles = sinon.stub();
		});

		it('sanitizes files from a request', () => {
			const sanitizedFiles = { a:'a' };
			const files = {};
			const form = {};
			agent._sanitizeFiles.returns(sanitizedFiles);

			return agent.request({ uri: 'abc', method: 'post', data: '123', query: 'all', form, files })
				.then((res) => {
					expect(res).to.be.equal('fake-response');
					expect(agent._sanitizeFiles).calledOnce.calledWith(sinon.match.same(files));
				});
		});

		it('uses default arguments for request', () => {
			const args = ['abc', { args: '123' }];
			agent._buildRequest.returns(args);
			return agent.request({ uri: 'abc', method:'post' })
				.then((res) => {
					expect(res).to.be.equal('fake-response');
					expect(agent._promiseResponse).calledOnce.calledWith(args);
				});
		});

		it('builds and sends the request', () => {
			const agent = new Agent();
			const options = {
				uri: 'http://example.com/v1',
				method: 'get',
				auth: 'fake-token',
				headers: { 'X-FOO': 'foo', 'X-BAR': 'bar' },
				query: 'foo=1&bar=2',
				data: { foo: true, bar: false },
				files: undefined,
				form: undefined,
				context
			};
			agent._buildRequest = sinon.stub();
			agent._buildRequest.returns('fake-request');
			agent._promiseResponse = sinon.stub();
			agent._promiseResponse.resolves('fake-response');

			return agent.request(options).then((res) => {
				expect(res).to.be.equal('fake-response');
				expect(agent._buildRequest).calledOnce;
				expect(agent._buildRequest).calledWith(options);
				expect(agent._promiseResponse).calledOnce;
				expect(agent._promiseResponse).calledWith('fake-request');
			});
		});

		it('builds a promise to call _promiseResponse', () => {
			const agent = new Agent();
			const req = sinon.stub();
			const response = {
				ok: true,
				status: 200,
				json: () => Promise.resolve('response')
			};
			req.resolves(response);
			const promise = agent._promiseResponse([], false, req);
			expect(promise).has.property('then');
			return promise.then((resp) => {
				expect(resp).to.be.eql({
					body: 'response',
					statusCode: 200
				});
			});
		});

		it('can handle error responses', () => {
			const failResponseData = [
				{
					name: 'error text includes body error description',
					response: {
						status: 404,
						statusText: 'file not found',
						text: () => Promise.resolve('{"error_description": "file not found"}')
					},
					errorDescription: 'HTTP error 404 from 123.url - file not found'
				},
				{
					name: 'error text with no body description',
					response: {
						status: 404,
						text: () => Promise.resolve(''),
					},
					errorDescription: 'HTTP error 404 from 123.url'
				},
				{
					name: 'error text with no status',
					response: {},
					errorDescription: 'Network error from 123.url'
				}
			];
			const agent = new Agent();
			const req = sinon.stub();
			const requests = failResponseData.map((failData) => {
				const response = Object.assign({
					ok: false
				}, failData.response);
				req.resolves(response);
				const promise = agent._promiseResponse(['123.url'] , false, req);
				return promise.catch((resp) => {
					expect(resp.statusCode).to.eql(failData.response.status);
					expect(resp.errorDescription).to.eql(failData.errorDescription);
					expect(resp.shortErrorDescription).to.eql(failData.response.statusText);
				});
			});
			return Promise.all(requests);
		});
	});

	describe('build request', () => {
		let agent;

		beforeEach(() => {
			agent = new Agent('abc');
		});

		it('uses a baseURL if provided', () => {
			const [uri] = agent._buildRequest({ uri: '/uri', method: 'get' });
			expect(uri).to.equal('abc/uri');
		});

		it('uses the provided uri if no baseURL is provided', () => {
			agent.setBaseUrl(undefined);
			const [uri] = agent._buildRequest({ uri: 'uri', method: 'get' });
			expect(uri).to.equal('uri');
		});

		it('generates context headers when one is provided', () => {
			const context = { tool: { name: 'spanner' } };
			const [, opts] = agent._buildRequest({ uri: '/uri', method: 'get', context });
			expect(opts.headers).to.have.property('X-Particle-Tool', 'spanner');
		});

		it('generates auth headers when an auth token is provided', () => {
			const auth = 'abcd-1235';
			const [, opts] = agent._buildRequest({ uri: 'uri', method: 'get', auth });
			expect(opts.headers).to.have.property('Authorization', `Bearer ${auth}`);
		});

		it('adds new query params with the given query object', () => {
			const query = { foo: 1, bar: 2 };
			const [uri] = agent._buildRequest({ uri: '/uri', method: 'get', query });
			expect(uri).to.equal('abc/uri?foo=1&bar=2');
		});

		it('adds query params without colliding with existing ones', () => {
			const query = { foo: 1, bar: 2 };
			const [uri] = agent._buildRequest({ uri: '/uri?test=true', method: 'get', query });
			expect(uri).to.equal('abc/uri?test=true&foo=1&bar=2');
		});

		it('adds the provided data as a JSON request body', () => {
			const [, opts] = agent._buildRequest({ uri: 'uri', method: 'get', data: { a: 'abcd' } });
			expect(opts.body).to.eql('{"a":"abcd"}');
			expect(opts.headers).to.have.property('Content-Type', 'application/json');
		});

		it('should setup form send when form data is given', () => {
			const [, opts] = agent._buildRequest({ uri: 'uri', method: 'get', form: { a: 'abcd' } });
			expect(opts.body).to.eql('a=abcd');
		});

		it('should attach files', () => {
			const files = {
				file: { data: makeFile('filedata'), path: 'filepath' },
				file2: { data: makeFile('file2data'), path: 'file2path' }
			};
			const [, opts] = agent._buildRequest({ uri: 'uri', method: 'get', files });
			expect(opts.body.toString()).to.equal('[object FormData]');
			expect(extractFilename(opts.body, 'file', 0)).to.eql('filepath');
			expect(extractFilename(opts.body, 'file2', 3)).to.eql('file2path');
			expect(opts.headers).to.not.have.property('Content-Type');
		});

		it('should attach files and form data', () => {
			const files = {
				file: { data: makeFile('filedata'), path: 'filepath' },
				file2: { data: makeFile('file2data'), path: 'file2path' }
			};
			const form = { form1: 'value1', form2: 'value2' };
			const [, opts] = agent._buildRequest({ uri: 'uri', method: 'get', files, form });
			expect(opts.body.toString()).to.equal('[object FormData]');
			expect(extractFilename(opts.body, 'file', 0)).to.eql('filepath');
			expect(extractFilename(opts.body, 'file2', 3)).to.eql('file2path');
			expect(extractFormName(opts.body, 'form1', 6, true)).to.eql('value1');
			expect(extractFormName(opts.body, 'form2', 9, true)).to.eql('value2');
			expect(opts.headers).to.not.have.property('Content-Type');
		});

		it('should handle nested dirs', () => {
			const files = {
				file: { data: makeFile('filedata'), path: 'filepath.ino' },
				file2: { data: makeFile('file2data'), path: 'dir/file2path.cpp' }
			};
			const [, opts] = agent._buildRequest({ uri: 'uri', method: 'get', files });
			expect(extractFilename(opts.body, 'file', 0)).to.eql('filepath.ino');
			expect(extractFilename(opts.body, 'file2', 3)).to.eql('dir/file2path.cpp');
		});

		it('sets the user agent to particle-api-js', () => {
			const [, opts] = agent._buildRequest({ uri: 'uri', method: 'get' });
			expect(opts.headers).to.have.property('User-Agent').that.match(/^particle-api-js/);
		});

		if (!inBrowser()){
			it('should handle Windows nested dirs', () => {
				const files = {
					file: { data: makeFile('filedata'), path: 'dir\\windowsfilepath.cpp' }
				};
				const [, opts] = agent._buildRequest({ uri: 'uri', method: 'get', files });
				expect(extractFilename(opts.body, 'file', 0)).to.eql('dir/windowsfilepath.cpp');
			});
		}

		function inBrowser(){
			return typeof window !== 'undefined';
		}

		function makeFile(data){
			if (inBrowser()){
				return new Blob([data]);
			} else {
				return data;
			}
		}

		function extractFilename(formData, fieldName, fieldIndex){
			if (inBrowser()){
				return formData.get(fieldName).name;
			} else {
				return /filename="([^"]*)"/.exec(formData._streams[fieldIndex])[1];
			}
		}

		function extractFormName(formData, fieldName, fieldIndex){
			if (inBrowser()){
				return formData.get(fieldName);
			} else {
				return formData._streams[fieldIndex + 1];
			}
		}
	});

	describe('context', () => {
		let agent;

		beforeEach(() => {
			agent = new Agent();
		});

		describe('_nameAtVersion', () => {
			it('returns empty string when no name given', () => {
				expect(agent._nameAtVersion('', '1.2.3')).to.eql('');
			});

			it('returns just the name when no version given', () => {
				expect(agent._nameAtVersion('fred')).to.eql('fred');
			});

			it('returns name@version when both are given', () => {
				expect(agent._nameAtVersion('fred', '1.2.3')).to.eql('fred@1.2.3');
			});
		});

		describe('_getContextHeaders', () => {
			it('generates the tool context when defined', () => {
				const context = { tool: { name: 'spanner' } };
				const subject = agent._getContextHeaders(context);
				expect(subject).to.have.property('X-Particle-Tool', 'spanner');
			});

			it('does not add the tool context header when not defined',() => {
				const context = { tool: { name2: 'spanner' } };
				const subject = agent._getContextHeaders(context);
				expect(subject).to.not.have.property('X-Particle-Tool');
			});

			it('generates the project context header when defined',() => {
				const context = { project: { name: 'blinky' } };
				const subject = agent._getContextHeaders(context);
				expect(subject).to.have.property('X-Particle-Project', 'blinky');
			});

			it('does not generate the project context header when not defined',() => {
				const context = { project: { name2: 'blinky' } };
				const subject = agent._getContextHeaders(context);
				expect(subject).to.not.have.property('X-Particle-Project');
			});
		});

		describe('_getToolContext', () => {
			it('does not add a header when the tool name is not defined', () => {
				const tool = { noname: 'cli' };
				const subject = agent._getToolContext(tool);
				expect(subject).to.eql({});
			});

			it('adds a header when the tool is defined', () => {
				const tool = { name: 'cli' };
				const subject = agent._getToolContext(tool);
				expect(subject).to.eql({ 'X-Particle-Tool': 'cli' });
			});

			it('adds a header when the tool and components is defined', () => {
				const tool = {
					name: 'cli',
					version: '1.2.3',
					components: [
						{ name: 'bar', version: 'a.b.c' },
						{ name: 'foo', version: '0.0.1' }
					]
				};
				const subject = agent._getToolContext(tool);
				expect(subject).to.eql({ 'X-Particle-Tool': 'cli@1.2.3, bar@a.b.c, foo@0.0.1' });
			});
		});

		describe('_addProjectContext', () => {
			it('adds a header when the project is defined', () => {
				const project = { name: 'blinky' };
				const subject = agent._getProjectContext(project);
				expect(subject).to.have.property('X-Particle-Project', 'blinky');
			});

			it('does not set the header when the project has no name', () => {
				const project = { noname: 'blinky' };
				const subject = agent._getProjectContext(project);
				expect(subject).to.not.have.property('X-Particle-Project');
			});
		});

		describe('_buildSemicolonSeparatedProperties', () => {
			const obj = { name: 'fred', color: 'pink' };

			it('returns empty string when no default property', () => {
				expect(agent._buildSemicolonSeparatedProperties(obj)).to.be.eql('');
			});

			it('returns empty string when default property does not exist', () => {
				expect(agent._buildSemicolonSeparatedProperties(obj, 'job')).to.be.eql('');
			});

			it('returns the default property only', () => {
				expect(agent._buildSemicolonSeparatedProperties({ name:'fred' }, 'name')).eql('fred');
			});

			it('returns the default property plus additional properties', () => {
				expect(agent._buildSemicolonSeparatedProperties(obj, 'name')).eql('fred; color=pink');
			});
		});
	});
});
