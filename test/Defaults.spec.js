import { expect } from './test-setup';
import Defaults from '../src/Defaults';

describe('Default Particle constructor options', () => {
	it('includes baseUrl', () => {
		expect(Defaults).to.have.property('baseUrl');
		expect(Defaults.baseUrl).to.eql('https://api.particle.io');
	});

	it('includes clientSecret', () => {
		expect(Defaults).to.have.property('clientSecret');
		expect(Defaults.clientSecret).to.eql('particle-api');
	});

	it('includes clientId', () => {
		expect(Defaults).to.have.property('clientId');
		expect(Defaults.clientId).to.eql('particle-api');
	});

	it('includes tokenDuration', () => {
		expect(Defaults).to.have.property('tokenDuration');
		expect(Defaults.tokenDuration).to.eql(7776000);
	});

	it('includes defaultAuth', () => {
		expect(Defaults).to.have.property('auth');
		expect(Defaults.auth).to.eql(undefined);
	});
});
