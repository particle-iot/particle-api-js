import Particle from './Particle';
import Library from './Library';

export default class Client {
	constructor({ auth, api = new Particle() }) {
		Object.assign(this, { auth, api });
	}

	/**
	 * Get firmware library objects
	 * @param  {Number} $0.page Page index (default, first page)
	 * @param  {Number} $0.limit Number of items per page
	 * @param  {String} $0.query Search term for the libraries
	 * @param  {String} $0.order Ordering key for the library list
	 * @param  {Array<String>}  $0.architectures List of architectures to filter
	 * @param  {String} $0.category Category to filter
	 * @return {Promise}
	 */
	libraries(query = {}) {
		return this.api.listLibraries(Object.assign({}, query, { auth: this.auth }))
		.then((payload) => {
			const libraries = payload.body.data || [];
			return libraries.map(l => new Library(this, l));
		});
	}

	downloadFile(url) {
		return this.api.downloadFile();
	}
}
