'use strict';
// Type-checking stubs — verify compiled output exports are accessible
const Particle = require('../lib/src/Particle');
const { expect } = require('./test-setup');

describe('Types', () => {
	it('can instantiate Particle with auth option', () => {
		const p = new Particle({ auth: 'token' });
		expect(p.auth).to.equal('token');
		expect(p.baseUrl).to.equal('https://api.particle.io');
	});

	it('Particle has all core methods', () => {
		const p = new Particle();
		expect(p.login).to.be.a('function');
		expect(p.getDevice).to.be.a('function');
		expect(p.listDevices).to.be.a('function');
		expect(p.flashDevice).to.be.a('function');
		expect(p.compileCode).to.be.a('function');
		expect(p.getEventStream).to.be.a('function');
	});

	it('client() returns a Client instance', () => {
		const Client = require('../lib/src/Client');
		const p = new Particle({ auth: 'token' });
		const c = p.client();
		expect(c).to.be.instanceOf(Client);
		expect(c.api).to.equal(p);
	});

	it('Particle d.ts exports are available', () => {
		expect(Particle).to.be.a('function');
		expect(new Particle()).to.be.an('object');
	});
});
