import Particle from './Particle';

class Client {
	constructor({ auth, api = new Particle() }) {
		Object.assign(this, { auth, api });
	}

	libraries() {
		return Promise.resolve([]);
	}
}

export default Client;
