interface ParticleDefaults {
	baseUrl: string;
	clientSecret: string;
	clientId: string;
	tokenDuration: number;
	auth?: string;
}

const defaults: ParticleDefaults = {
	baseUrl: 'https://api.particle.io',
	clientSecret: 'particle-api',
	clientId: 'particle-api',
	tokenDuration: 7776000, // 90 days
	auth: undefined
};

export = defaults;
