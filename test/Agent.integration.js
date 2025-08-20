/**
 * Tests for real the Agent class using an external service.
 */

const { expect } = require('./test-setup');
const Agent = require('../src/Agent');

describe('Agent', () => {
    if (!process.env.SKIP_AGENT_TEST){
        it('can fetch a webpage', function cb() {
            this.retries(5);
            this.timeout(6000);
            const agent = new Agent();
            const query = { a: '1', b: '2' };
            const result = agent.get({ uri: 'https://postman-echo.com/get', query });
            return result.then((res)=> {
                expect(res.statusCode).to.equal(200);
                expect(res).has.property('body');
                expect(res.body.args).to.deep.equal(query);
            });
        });
    }
});
