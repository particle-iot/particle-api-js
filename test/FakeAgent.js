export default class FakeAgent {
	get(uri, auth, query = undefined, context, headers) {
		return this.request({ method: 'get', uri, auth, query, context, headers });
	}

	head(uri, auth, query, context, headers) {
		return this.request({ method: 'head', uri, auth, query, context, headers });
	}

	post(uri, data, auth, context, headers) {
		return this.request({ method: 'post', uri, data, auth, context, headers });
	}

	put(uri, data, auth, context, headers) {
		return this.request({ method: 'put', uri, data, auth, context, headers });
	}

	delete(uri, data, auth, context, headers) {
		return this.request({ method: 'delete', uri, data, auth, context, headers });
	}

	request(opts) {
		return new Promise((resolve) => resolve(opts));
	}
}

