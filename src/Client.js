import Particle from './Particle';
import Library from './Library';

export default class Client {
	constructor({ auth, api = new Particle() }) {
		Object.assign(this, { auth, api });
	}

	/**
	 * Get firmware library objects
	 * @param  {Object} query The query parameters for libraries. See Particle.listLibraries
	 * @return {Promise}
	 */
	libraries(query = {}) {
		return this.api.listLibraries(Object.assign({}, query, { auth: this.auth }))
		.then(payload => {
			const libraries = payload.body.data || [];
			return libraries.map(l => new Library(this, l));
		});
	}

	/**
	 * Get one firmware library object
	 * @param  {String} name Name of the library to fetch
	 * @param  {Object} query The query parameters for libraries. See Particle.getLibrary
	 * @return {Promise}
	 */
	library(name, query = {}) {
		return this.api.getLibrary(Object.assign({}, query, { name, auth: this.auth }))
			.then(payload => {
				const library = payload.body.data || {};
				return new Library(this, library);
			});
	}

	downloadFile(url) {
		return this.api.downloadFile();
	}
}
