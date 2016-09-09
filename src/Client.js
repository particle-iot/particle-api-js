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


	/**
	 * Publish a new library version
	 * @param  {Buffer} archive The compressed archive with the library source
	 * @return {Promise}
	 */
	publishLibrary(archive) {
		return this.api.publishLibrary({ archive, auth: this.auth })
			.then(payload => {
				const library = payload.body.data || {};
				return new Library(this, library);
			}, error => {
				if (error.body && error.body.errors) {
					const errorMessages = error.body.errors.map((e) => e.message).join('\n');
					throw new Error(errorMessages);
				}
				throw error;

			});
		// TODO: format error
	}





	downloadFile(url) {
		return this.api.downloadFile({ url });
	}

	compileCode(files, platformId, targetVersion) {
		return this.api.compileCode({ files, platformId, targetVersion, auth: this.auth });
	}
}
