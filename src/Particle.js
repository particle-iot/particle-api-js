import request from 'superagent';
import Defaults from './Defaults';

import path from 'path';
import { parse, resolve } from 'url';

class Particle {

	constructor(options = Defaults) {
		Object.assign(this, options);
	}

	get baseUrl() { return this.__baseUrl.href; }
	set baseUrl(uri) { this.__baseUrl = parse(uri); }

	url() { return resolve(this.baseUrl, path.join.apply(null, arguments)); }

	login({ username, password, tokenDuration = this.tokenDuration }) {
		return Particle.post(this.url('oauth/token'), {
			username,
			password,
			grant_type: 'password',
			client_id: this.clientId,
			client_secret: this.clientSecret,
			expires_in: tokenDuration,
		});
	}

	createUser({ username, password }) {
		return Particle.post(this.url('v1/users'), {
			username, password,
		});
	}

	removeAccessToken({ username, password, token }) {
		return Particle.delete(this.url('v1/access_tokens', token), {
			access_token: token,
		}, { username, password });
	}

	listDevices({ auth }) {
		return Particle.get(this.url('v1/devices'), auth);
	}

	getDevice({ deviceId, auth }) {
		return Particle.get(this.url('v1/devices', deviceId), auth);
	}

	claimDevice({ deviceId, auth }) {
		return Particle.post(this.url('v1/devices'), {
			id: deviceId,
		}, auth);
	}

	removeDevice({ deviceId, auth }) {
		return Particle.delete(this.url('v1/devices', deviceId), null, auth);
	}

	renameDevice({ deviceId, name, auth }) {
		return Particle.put(this.url('v1/devices', deviceId), { name }, auth);
	}

	getClaimCode({ auth }) {
		return Particle.post(this.url('v1/device_claims'), null, auth);
	}

	changeProduct({ deviceId, productId, shouldUpdate, auth }) {
		return Particle.put(this.url('v1/devices', deviceId), {
			product_id: productId,
			update_after_claim: shouldUpdate || false,
		}, auth);
	}

	getVariable({ deviceId, name, auth }) {
		return Particle.get(this.url('v1/devices', deviceId, name), auth);
	}

	signalDevice({ deviceId, signal, auth }) {
		return Particle.put(this.url('v1/devices/', deviceId), {
			signal: ( !!signal ? 1 : 0 ),
		}, auth);
	}

	flashTinker({ deviceId, auth }) {
		return Particle.put(this.url('v1/devices', deviceId), {
			app: 'tinker',
		}, auth);
	}

	// TODO: Platform agnostic flashDevice (flashCore in SparkJS)
	// TODO: Platform agnostic compileCode
	// NOTE: use Buffer: https://github.com/feross/buffer

	sendPublicKey({ deviceId, key, auth }) {
		return Particle.post(this.url('v1/provisioning', deviceId), {
			deviceID: deviceId,
			publicKey: ( typeof key === 'string' ? key : key.toString() ),
			filename: 'particle-api',
			order: `manual_${ new Date().getTime() }`,
		}, auth);
	}

	callFunction({ deviceId, name, argument, auth }) {
		return Particle.post(this.url('v1/devices', deviceId, name), {
			args: argument,
		}, auth);
	}

	getEventStream({ deviceId, name, auth }) {
		let uri;
		if (!deviceId) { uri = 'v1/events'; }
		else if (deviceId.toLowerCase() === 'mine') { uri = 'v1/devices/events'; }
		else { uri = `v1/devices/${ deviceId }/events`; }

		if (name) { uri += `/${ name }`; }
		// TODO: Add tests for event stream?
		return Particle.get(this.url(uri), auth);
	}

	publishEvent({ name, data, auth }) {
		return Particle.post(this.url('v1/devices/events'), {
			name,
			data,
		}, auth);
	}

	createWebhook({ deviceId, name, url, auth }) {
		const form = { event: name, url };
		if (deviceId === 'mine') { form.mydevices = true; }
		else { form.deviceid = deviceId; }
		return Particle.post(this.url('v1/webhooks'), form, auth);
	}

	deleteWebhook({ hookId, auth }) {
		return Particle.delete(this.url('v1/webhooks', hookId), null, auth);
	}

	listWebhooks({ auth }) {
		return Particle.get(this.url('v1/webhooks'), auth);
	}


	getUserInfo({ auth }) {
		return Particle.get(this.url('v1/user'), auth);
	}

	setUserInfo({ stripeToken, auth }) {
		return Particle.put(this.url('v1/user'), {
			stripe_token: stripeToken,
		}, auth);
	}

	checkSIM({ iccid, auth }) {
		return Particle.head(this.url('v1/sims', iccid), auth);
	}

	activateSIM({ iccid, auth }) {
		return Particle.put(this.url('v1/sims', iccid), auth);
	}

	static get(uri, auth) {
		return Particle.request({ uri, auth, method: 'get' });
	}

	static head(uri, auth) {
		return Particle.request({ uri, auth, method: 'head' });
	}

	static post(uri, form, auth) {
		return Particle.request({ uri, form, auth, method: 'post' });
	}

	static put(uri, form, auth) {
		return Particle.request({ uri, form, auth, method: 'put' });
	}

	static delete(uri, form, auth) {
		return Particle.request({ uri, form, auth, method: 'delete' });
	}

	static request({ uri, method, form = undefined, auth }) {
		return new Promise((fulfill, reject) => {
			const req = request(method, uri);
			if (auth) { req.set(Particle.headers(auth)); }
			if (form) {
				if (form.username) { req.type('form'); }
				else { req.type('json'); }
				req.send(form);
			}

			req.end((error, res) => {
				const body = res && res.body;
				if (error) {
					const code = error.status;
					let errorDescription = `${ code ? 'HTTP error' : 'Network error' } ${ code } from ${ uri }`;
					if (body && body.error_description) { errorDescription += ' - ' + body.error_description; }
					reject({ code, errorDescription, error });
				}
				else {
					fulfill(body);
				}
			});
		});
	}

	static headers(auth) {
		let header;
		if (!auth) { return undefined; }
		if (typeof auth === 'object') {
			const str = `${ auth.username }:${ auth.password }`;
			header = `Basic ${ (new Buffer(str, 'utf8')).toString('base64') }`;
		}
		else { header = `Bearer ${ auth }`; }
		return { Authorization: header };
	}
}

export default Particle;
