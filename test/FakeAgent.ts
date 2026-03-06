import type { GetHeadOptions, MutateOptions, AgentRequestOptions } from '../src/types';

class FakeAgent {
	get({ uri, auth, headers, query, context }: GetHeadOptions) {
		return this.request({ uri, method: 'get', auth, headers, query, context });
	}

	head({ uri, auth, headers, query, context }: GetHeadOptions) {
		return this.request({ uri, method: 'head', auth, headers, query, context });
	}

	post({ uri, headers, data, auth, context }: MutateOptions) {
		return this.request({ uri, method: 'post', auth, headers, data, context });
	}

	put({ uri, auth, headers, data, query, context }: MutateOptions) {
		return this.request({ uri, method: 'put', auth, headers, data, query, context });
	}

	patch({ uri, auth, headers, data, context }: MutateOptions) {
		return this.request({ uri, method: 'patch', auth, headers, data, context });
	}

	delete({ uri, auth, headers, data, context }: MutateOptions) {
		return this.request({ uri, method: 'delete', auth, headers, data, context });
	}

	request(opts: AgentRequestOptions) {
		return Promise.resolve(opts);
	}
}

export = FakeAgent;
