import {expect} from './test-setup';

import Client from '../src/Client';
import {readJSON} from './support/fixtures';

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
			api.listLibraries = () => {
				return Promise.resolve({ body: readJSON('libraries.json') });
			};
			return client.libraries().then(libraries => {
				expect(libraries.length).to.equal(1);
				expect(libraries[0].name).to.equal('neopixel');
			});
		});
	})

	describe('library', () => {
		it('resolves to a Library objects', () => {
			api.getLibrary = () => {
				return Promise.resolve({ body: readJSON('library.json') });
			};
			return client.library('neopixel').then(library => {
				expect(library.name).to.equal('neopixel');
			});
		});
	});

	describe('downloadFile', () => {
		it('delegates to api', () => {
			api.downloadFile = () => { return Promise.resolve('delegated'); };
			return client.downloadFile('url').should.eventually.equal('delegated');
		})
	})
});
