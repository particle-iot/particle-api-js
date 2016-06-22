export default class FakeAgent {
	get(uri, auth, query = undefined) {
		return this.request({ method: 'get', uri, auth, query });
	}

	head(uri, auth) {
		return this.request({ method: 'head', uri, auth });
	}

	post(uri, data, auth) {
		return this.request({ method: 'post', uri, data, auth });
	}

	put(uri, data, auth) {
		return this.request({ method: 'put', uri, data, auth });
	}

	delete(uri, data, auth) {
		return this.request({ method: 'delete', uri, data, auth });
	}

	request(opts) {
		return new Promise((resolve) => resolve(opts));
	}
}

