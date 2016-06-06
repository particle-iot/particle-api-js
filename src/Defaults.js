export default {
	baseUrl: process.env.PARTICLE_SERVER || 'https://api.particle.io/',
	clientSecret: 'particle-api',
	clientId: 'particle-api',
	tokenDuration: 7776000, // 90 days
};
