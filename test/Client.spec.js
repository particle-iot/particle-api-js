import {expect} from './test-setup';

import Client from '../src/Client';
import readFixture from './support/fixtures';

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
				return Promise.resolve({ body: readFixture('libraries.json') });
			};
			return client.libraries().then((libraries) => {
				expect(libraries.length).to.equal(1);
				expect(libraries[0].name).to.equal('neopixel');
			});
		});
	});
});
