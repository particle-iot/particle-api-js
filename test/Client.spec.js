import {expect} from './test-setup';

import Client from '../src/Client';
import * as fixtures from './fixtures';

let api = {};
let token = "tok";
let client;
describe('Client', () => {
	beforeEach(() => {
		client = new Client({ api: api, auth: token });
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
			api.listLibraries = () => Promise.resolve({ body: fixtures.readJSON('libraries.json') });
			return client.libraries().then(libraries => {
				expect(libraries.length).to.equal(1);
				expect(libraries[0].name).to.equal('neopixel');
			});
		});
	});

	describe('library', () => {
		it('resolves to a Library objects', () => {
			api.getLibrary = () => Promise.resolve({ body: fixtures.readJSON('library.json') });
			return client.library('neopixel').then(library => {
				expect(library.name).to.equal('neopixel');
			});
		});
	});

	describe('downloadFile', () => {
		it('delegates to api', () => {
			api.downloadFile = () => Promise.resolve('delegated');
			return expect(client.downloadFile('url')).to.eventually.equal('delegated');
		});
	});

	describe('compileCode', () => {
		it('delegates to api', () => {
			api.compileCode = ({files, platformId, targetVersion, auth}) => {
				return Promise.resolve([files, platformId, targetVersion, auth]);
			}
			return expect(client.compileCode('a', 'b', 'c')).to.eventually.eql(['a', 'b', 'c', client.auth]);
		});
	});
});
