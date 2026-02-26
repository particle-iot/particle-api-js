import { sinon, expect } from './test-setup';
import Client from '../src/Client';
import * as fixtures from './fixtures';
import Library from '../src/Library';

const token = 'tok';

describe('Client', () => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
	let api: Record<string, Function>;
	let client: Client;

	beforeEach(() => {
		api = {};
		client = new Client({ api: api as object as Client.Api, auth: token });
	});

	describe('constructor', () => {
		it('sets the auth token', () => {
			expect(client.auth).to.equal(token);
		});
		it('sets the api', () => {
			expect(client.api).to.equal(api);
		});
	});

	describe('libraries', () => {
		it('resolves to a list of Library objects', () => {
			api.listLibraries = () => Promise.resolve({ body: fixtures.read('libraries.json') });
			return client.libraries().then(libraries => {
				expect(libraries.length).to.equal(1);
				expect(libraries[0].name).to.equal('neopixel');
			});
		});
	});

	describe('library', () => {
		it('resolves to a Library objects', () => {
			api.getLibrary = () => Promise.resolve({ body: fixtures.read('library.json') });
			return client.library('neopixel').then(library => {
				expect(library.name).to.equal('neopixel');
			});
		});
	});

	describe('libraryVersions', () => {
		it('resolves to a Library objects', () => {
			api.getLibraryVersions = () => Promise.resolve({ body: fixtures.read('libraryVersions.json') });
			return client.libraryVersions().then(libraries => {
				expect(libraries.length).to.equal(9);
				expect(libraries[0].name).to.equal('neopixel');
				expect(libraries[0].version).to.equal('0.0.10');
				expect(libraries[1].version).to.equal('0.0.9');
			});
		});
	});

	describe('downloadFile', () => {
		it('delegates to api', () => {
			api.downloadFile = ({ uri }: { uri: string }) => Promise.resolve(`${uri} delegated`);
			return expect(client.downloadFile('uri')).to.eventually.equal('uri delegated');
		});
	});

	describe('compileCode', () => {
		it('delegates to api', () => {
			api.compileCode = ({ files, platformId, targetVersion, auth }: Record<string, string | number | object>) => {
				return Promise.resolve([files, platformId, targetVersion, auth]);
			};
			const files = { 'main.ino': 'code' };
			return expect(
				client.compileCode(files, 6, '1.2.3')
			).to.eventually.eql([files, 6, '1.2.3', client.auth]);
		});
	});

	describe('signalDevice', () => {
		it('delegates to api', () => {
			api.signalDevice = () => {
				return Promise.resolve([true, client.auth]);
			};
			return expect(client.signalDevice({ deviceId: 'testid', signal: true }))
				.to.eventually.eql([true, client.auth]);
		});
	});

	describe('publishLibrary', () => {
		it('delegates to api and returns the library metadata on success', () => {
			const name = 'fred';
			const metadata = { name };
			const library = new Library(client as object as Library.ClientInterface, metadata as object as Library.ApiData);
			api.publishLibrary = sinon.stub().resolves({ body: { data: metadata } });
			return client.publishLibrary(name)
				.then(actual => {
					expect(actual).to.eql(library);
					expect(api.publishLibrary).to.have.been.calledWith({ name, auth: token });
				});
		});

		it('delegates to api and calls _throwError to handle the error', () => {
			const error = { message: 'I don\'t like vegetables' };
			api.publishLibrary = sinon.stub().rejects(error);
			const name = 'notused';
			return client.publishLibrary(name)
				.then(() => {
					throw new Error('expected an exception');
				})
				.catch(actual => {
					expect(actual).to.eql(error);
					expect(api.publishLibrary).to.have.been.calledWith({ name, auth: token });
				});
		});
	});

	describe('contributeLibrary', () => {
		it('delegates to api and returns the library metadata on success', () => {
			const archive = 'test-archive';
			const metadata = { name: '' };
			const library = new Library(client as object as Library.ClientInterface, metadata as object as Library.ApiData);
			api.contributeLibrary = sinon.stub().resolves({ body: { data: metadata } });
			return client.contributeLibrary(archive)
				.then(actual => {
					expect(actual).to.eql(library);
					expect(api.contributeLibrary).to.have.been.calledWith({ archive, auth: token });
				});
		});

		it('delegates to api and calls _throwError to handle the error', () => {
			const archive = 'test-archive';
			const error = { message: 'I don\'t like vegetables' };
			api.contributeLibrary = sinon.stub().rejects(error);
			return client.contributeLibrary(archive)
				.then(() => {
					throw new Error('expected an exception');
				})
				.catch(actual => {
					expect(actual).to.eql(error);
					expect(api.contributeLibrary).to.have.been.calledWith({ archive, auth: token });
				});
		});
	});

	describe('listDevices', () => {
		it('delegates to api', () => {
			api.listDevices = ({ auth }: { auth: string }) => {
				return Promise.resolve([auth]);
			};
			return expect(client.listDevices()).to.eventually.eql([client.auth]);
		});
	});

	describe('listBuildTargets', () => {
		it('delegates to api', () => {
			const response = {
				targets: [
					{
						platforms: [0, 6],
						prereleases: [],
						version: '1.2.3',
						firmware_vendor: 'Foo'
					}, {
						platforms: [6, 8],
						prereleases: [6],
						version: '4.5.6',
						firmware_vendor: 'Bar'
					}
				]
			};
			const expected = [
				{
					version: '1.2.3',
					platform: 0,
					prerelease: false,
					firmware_vendor: 'Foo'
				}, {
					version: '1.2.3',
					platform: 6,
					prerelease: false,
					firmware_vendor: 'Foo'
				}, {
					version: '4.5.6',
					platform: 6,
					prerelease: true,
					firmware_vendor: 'Bar'
				}, {
					version: '4.5.6',
					platform: 8,
					prerelease: false,
					firmware_vendor: 'Bar'
				},
			];
			api.listBuildTargets = () => {
				return Promise.resolve({ body: response });
			};
			return expect(client.listBuildTargets()).to.eventually.eql(expected);
		});
	});

	describe('trackingIdentity', () => {
		it('delegates to api and unpacks the body', () => {
			api.trackingIdentity = ({ auth, full, context }: Record<string, string | boolean | object>) => {
				return Promise.resolve({ body: { auth, full, context } });
			};
			const context = { abd: 123 };
			const full = true;
			return expect(
				client.trackingIdentity({ full, context })
			).to.eventually.eql({ auth: client.auth, full, context });
		});

		it('delegates to api with default parameters and unpacks the body', () => {
			api.trackingIdentity = ({ auth, full, context }: Record<string, string | boolean | object | undefined>) => {
				return Promise.resolve({ body: { auth, full, context } });
			};
			const context = undefined;
			const full = false;
			return expect(client.trackingIdentity()).to.eventually.eql({ auth: client.auth, full, context });
		});
	});
});
