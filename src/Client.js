import Particle from './Particle';
import Library from './Library';

export default class Client {
	constructor({ auth, api = new Particle() }) {
		Object.assign(this, { auth, api });
	}

	libraries() {
		return this.api.listLibraries()
		.then((payload) => {
			const libraries = payload.body.data || [];
			return libraries.map(l => new Library(this, l));
		});
	}
}
