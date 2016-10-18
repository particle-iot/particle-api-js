import {expect} from './test-setup';
import Particle from '../src/Particle';
import {read} from './fixtures/index';

describe('Client', () => {
	describe('A library can be contributed and then published', () => {
		const auth = process.env.ACCESS_TOKEN || '0aafe7ccb5f7e2b642e7819476b17a610b1d8773';
		const baseUrl = process.env.API_URLxxx || 'api.staging.particle.io';
		const force = process.env.PARTICLE_LIBRARY_DELETE_TOKEN;
		if (!force) {
			throw new Error('PARTICLE_LIBRARY_DELETE_TOKEN should be defined to enable library delete functionality.');
		}

		const api = new Particle({baseUrl});
		const name = 'test-library-publish';
		const sut = api.client({auth});
		function deleteTestLibrary() {
			return api.deleteLibrary({auth, name, force}).catch(error => {
				if (error.statusCode!==404) {
					console.log(error);
					throw error;
				}
			});
		}

		// before(deleteTestLibrary);
		// after(deleteTestLibrary);


		xit('cannot publish a library that does not exist', () => {
			return sut.publishLibrary(name).
			then(library => {
				throw Error('expected an exception');
			}).
			catch(error => {
				expect(error.message).to.contain('not found');
			});
		});

		it('can contribute the library', () => {
			return sut.contributeLibrary(read('test-library-publish-0.0.1.tar.gz'))
				.then(result => {
					console.log(result);
				});
		});

		it('can retrieve the library', () => {
			return sut.library(name).
			then(library => {
				expect(library.name).to.equal(name);
				expect(library.attributes.visibility).to.equal('private');
			});
		});

		it('can publish the library to make it public', () => {
			return sut.publishLibrary(name).
			then(library => {
				expect(library.name).to.equal(name);
				expect(library.attributes.visibility).to.equal('public');
			});
		});
	});
});