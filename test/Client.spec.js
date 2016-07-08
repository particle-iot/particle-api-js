const should = require('should'); // monkeypatch the world~!1

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
			client.auth.should.equal(token);
		});
		it('sets the api', () => {
			client.api.should.equal(api);
		});
	});

	describe('#libraries', () => {
		xit('resolves to a list of Library objects', () => {
			api.listLibraries = () => {
				Promise.resolve(readFixture('libraries.json'));
			};
			return client.libraries().should.finally.equal(['uber-library-example']);
		});
	});
});
