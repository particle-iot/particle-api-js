// Set up the Mocha test framework with the Chai assertion library and
// the Sinon mock library

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import sinonAsPromised from 'sinon-as-promised';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect = chai.expect;

export {
	chai,
	sinon,
	expect,
	sinonAsPromised
};
