import { expect } from './test-setup';
import Library from '../src/Library';

const client = {} as Library.ClientInterface;

describe('Library', () => {
	describe('constructor', () => {
		it('sets attributes', () => {
			const library = new Library(client, {
				attributes: {
					name: 'testlib',
					version: '1.0.0',
					author: 'test'
				}
			});
			expect(library.name).to.equal('testlib');
			expect(library.version).to.equal('1.0.0');
		});
	});

	describe('download', () => {
		it('return the file contents', () => {
			client.downloadFile = (url: string) => {
				return Promise.resolve(Buffer.from(`${url}-content`));
			};

			const library = new Library(client, {
				attributes: {
					name: 'testlib',
					version: '1.0.0',
					author: 'test'
				},
				links: {
					download: 'url'
				}
			});
			return expect(library.download()).to.eventually.deep.equal(Buffer.from('url-content'));
		});
	});
});
