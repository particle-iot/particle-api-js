export default class FakeAgent {
	get(uri, auth, query = undefined, context) {
		return this.request({ method: 'get', uri, auth, query, context });
	}

	head(uri, auth, query, context) {
		return this.request({ method: 'head', uri, auth, query, context });
	}

	post(uri, data, auth, context) {
		return this.request({ method: 'post', uri, data, auth, context });
	}

	put(uri, data, auth, context) {
		return this.request({ method: 'put', uri, data, auth, context });
	}

	delete(uri, data, auth, context) {
		return this.request({ method: 'delete', uri, data, auth, context });
	}

	request(opts) {
		return new Promise((resolve) => resolve(opts));
	}
}

