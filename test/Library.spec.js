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

	describe('download', () => {
		it('return the file contents', () => {
			client.downloadFile = (url) => {
				return Promise.resolve(`${url}-content`);
			};

			const library = new Library(client, {
				attributes: {
					name: 'testlib',
					version: '1.0.0'
				},
				links: {
					download: 'url'
				}
			});
			expect(library.download()).to.eventually.equal('url-content');
		});
	});
});
