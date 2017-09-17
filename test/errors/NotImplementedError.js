import {expect} from '../test-setup';
import NotImplementedError from '../../src/errors/NotImplementedError';

describe('NotImplementedError', () => {
	it('matches the error', () => {
		let exception = new NotImplementedError();
		expect(NotImplementedError.matches(exception)).to.be.true;
	})
});
