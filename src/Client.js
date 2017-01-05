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
	 * Get list of library versions
	 * @param  {String} name Name of the library to fetch
	 * @param  {Object} query The query parameters for versions. See Particle.getLibraryVersions
	 * @return {Promise}
	 */
	libraryVersions(name, query = {}) {
		return this.api.getLibraryVersions(Object.assign({}, query, { name, auth: this.auth }))
			.then(payload => {
				const libraries = payload.body.data || [];
				return libraries.map(l => new Library(this, l));
			});
	}

	/**
	 * Contribute a new library version
	 * @param  {Buffer} archive The compressed archive with the library source
	 * @return {Promise}
	 */
	contributeLibrary(archive) {
		return this.api.contributeLibrary({ archive, auth: this.auth })
			.then(payload => {
				const library = payload.body.data || {};
				return new Library(this, library);
			}, error => {
				this._throwError(error);
			});
	}

	/**
	 * Make the the most recent private library version public
	 * @param  {string} name The name of the library to publish
	 * @return {Promise} To publish the library
	 */
	publishLibrary(name) {
		return this.api.publishLibrary({name, auth: this.auth })
			.then(payload => {
				const library = payload.body.data || {};
				return new Library(this, library);
			}, error => {
				this._throwError(error);
			});
	}

	/**
	 * Delete an entire published library
	 * @param  {String} $0.name Name of the library to delete
	 * @param  {String} $0.force Key to force deleting a public library
	 * @return {Promise}
	 */
	deleteLibrary({ name, version, force }) {
		return this.api.deleteLibrary({ name, force, auth: this.auth })
			.then(payload => {
				return true;
			}, error => {
				this._throwError(error);
			});
	}

	_throwError(error) {
		if (error.body && error.body.errors) {
			const errorMessages = error.body.errors.map((e) => e.message).join('\n');
			throw new Error(errorMessages);
		}
		throw error;
	}

	downloadFile(url) {
		return this.api.downloadFile({ url });
	}

	compileCode(files, platformId, targetVersion) {
		return this.api.compileCode({ files, platformId, targetVersion, auth: this.auth });
	}

	signalDevice({ signal, deviceId }) {
		return this.api.signalDevice({ signal, deviceId, auth: this.auth });
	}

	listDevices() {
		return this.api.listDevices({ auth: this.auth });
	}
}
