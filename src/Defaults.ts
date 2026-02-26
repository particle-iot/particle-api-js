import type { ParticleOptions } from './types';

const Defaults: Required<Pick<ParticleOptions, 'baseUrl' | 'clientId' | 'clientSecret' | 'tokenDuration'>> & { auth: undefined } = {
	baseUrl: 'https://api.particle.io',
	clientSecret: 'particle-api',
	clientId: 'particle-api',
	tokenDuration: 7776000,
	auth: undefined
};

export default Defaults;
module.exports = Defaults;
