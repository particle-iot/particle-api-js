import Particle from './Particle';
import Library from './Library';

export default class Client {
	constructor({ auth, api = new Particle() }) {
		Object.assign(this, { auth, api });
	}

	ready() {
		return Boolean(this.auth);
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
		return this.api.publishLibrary({ name, auth: this.auth })
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

	/**
	 * @param {Object} files Object containing files to be compiled
	 * @param {Number} platformId Platform id number of the device you are compiling for
	 * @param {String} targetVersion System firmware version to compile against
	 * @return {Promise}
	 * @deprecated Will be removed in 6.5
	 */
	compileCode(files, platformId, targetVersion) {
		return this.api.compileCode({ files, platformId, targetVersion, auth: this.auth });
	}

	/**
	 * @param {String} $0.deviceId Device ID or Name
	 * @param {Boolean} $0.signal   Signal on or off
	 * @return {Promise}
	 * @deprecated Will be removed in 6.5
	 */
	signalDevice({ signal, deviceId }) {
		return this.api.signalDevice({ signal, deviceId, auth: this.auth });
	}

	/**
	 * @return {Promise}
	 * @deprecated Will be removed in 6.5
	 */
	listDevices() {
		return this.api.listDevices({ auth: this.auth });
	}

	/**
	 * @return {Promise}
	 * @deprecated Will be removed in 6.5
	 */
	listBuildTargets() {
		return this.api.listBuildTargets({ onlyFeatured: true, auth: this.auth })
			.then(payload => {
				let targets = [];
				for (let target of payload.body.targets) {
					for (let platform of target.platforms) {
						targets.push({
							version: target.version,
							platform: platform,
							prerelease: target.prereleases.indexOf(platform) > -1,
							firmware_vendor: target.firmware_vendor
						});
					}
				}
				return targets;
			}, error => {

			});
	}

	trackingIdentity({ full=false, context }={}) {
		return this.api.trackingIdentity({ full, context, auth: this.auth })
			.then(payload => {
				return payload.body;
			});
	}
}
