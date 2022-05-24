/*

End-to-end test program for the event stream with Node

Steps:
- npm run compile
- PARTICLE_API_TOKEN=<my-token> node test/EventStream-e2e-node.js
- Follow the scenarios in EventStream.feature

 */

const Particle = require('../lib/Particle');
const baseUrl = process.env.PARTICLE_API_BASE_URL || 'http://localhost:9090';
const auth = process.env.PARTICLE_API_TOKEN;
const particle = new Particle({ baseUrl });


/* eslint-disable no-console */
particle.getEventStream({ deviceId: 'mine', auth })
	.then(stream => {
		console.log('event stream connected');

		['event', 'error', 'disconnect', 'reconnect', 'reconnect-success', 'reconnect-error']
			.forEach(eventName => {
				stream.on(eventName, (arg) => {
					console.log(eventName, arg);
				});
			});
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
/* eslint-enable no-console */

