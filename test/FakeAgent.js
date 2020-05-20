export default class FakeAgent {
	get({ uri, auth, headers, query, context }){
		return this.request({ uri, method: 'get', auth, headers, query, context });
	}

	head({ uri, auth, headers, query, context }){
		return this.request({ uri, method: 'head', auth, headers, query, context });
	}

	post({ uri, headers, data, auth, context }){
		return this.request({ uri, method: 'post', auth, headers, data, context });
	}

	put({ uri, auth, headers, data, context }){
		return this.request({ uri, method: 'put', auth, headers, data, context });
	}

	delete({ uri, auth, headers, data, context }){
		return this.request({ uri, method: 'delete', auth, headers, data, context });
	}

	request(opts){
		return new Promise((resolve) => resolve(opts));
	}
}

