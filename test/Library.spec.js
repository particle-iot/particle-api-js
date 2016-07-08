import {expect} from './test-setup';
import Library from '../src/Library';

let client = {};
describe('Library', () => {
	describe('constructor', () => {
		it('sets attributes', () => {
			const library = new Library(client, {
				attributes: {
					name: 'testlib',
					version: '1.0.0'
				}
			});
			expect(library.name).to.equal('testlib');
			expect(library.version).to.equal('1.0.0');
		});
	});
});
