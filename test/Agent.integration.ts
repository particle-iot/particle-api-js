import { expect } from './test-setup';
import Agent from '../src/Agent';
import type { JSONResponse } from '../src/types';

describe('Agent', () => {
	if (!process.env.SKIP_AGENT_TEST){
		it('can fetch a webpage', function cb() {
			this.retries(5);
			this.timeout(6000);
			const agent = new Agent();
			const query = { a: '1', b: '2' };
			const result = agent.get({ uri: 'https://postman-echo.com/get', query });
			return result.then((res) => {
				const jsonRes = res as JSONResponse<{ args: Record<string, string> }>;
				expect(jsonRes.statusCode).to.equal(200);
				expect(jsonRes).has.property('body');
				expect(jsonRes.body.args).to.deep.equal(query);
			});
		});
	}
});
