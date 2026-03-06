import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import chaiSubset from 'chai-subset';

chai.use(sinonChai as object as Chai.ChaiPlugin);
chai.use(chaiAsPromised as object as Chai.ChaiPlugin);
chai.use(chaiSubset);

const expect = chai.expect;

export { chai, sinon, expect };
