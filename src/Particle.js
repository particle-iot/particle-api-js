import 'babel-polyfill';
import request from 'superagent';
import prefix from 'superagent-prefix';
import Defaults from './Defaults';

class Particle {

	constructor(options = Defaults) {
		Object.assign(this, options);
		this.prefix = prefix(this.baseUrl);
	}

	login({ username, password, tokenDuration = this.tokenDuration }) {
		return this.request({ uri: '/oauth/token', form: {
			username,
			password,
			grant_type: 'password',
			client_id: this.clientId,
			client_secret: this.clientSecret,
			expires_in: tokenDuration,
		}, method: 'post' });
	}

	createUser({ username, password }) {
		return this.post('/v1/users', {
			username, password,
		});
	}

	removeAccessToken({ username, password, token }) {
		return this.delete(`/v1/access_tokens/${token}`, {
			access_token: token,
		}, { username, password });
	}

	listAccessTokens({ username, password }) {
		return this.get('/v1/access_tokens', { username, password });
	}

	listDevices({ auth }) {
		return this.get('/v1/devices', auth);
	}

	getDevice({ deviceId, auth }) {
		return this.get(`/v1/devices/${deviceId}`, auth);
	}

	claimDevice({ deviceId, auth }) {
		return this.post('/v1/devices', {
			id: deviceId,
		}, auth);
	}

	removeDevice({ deviceId, auth }) {
		return this.delete(`/v1/devices/${deviceId}`, null, auth);
	}

	renameDevice({ deviceId, name, auth }) {
		return this.put(`/v1/devices/${deviceId}`, { name }, auth);
	}

	getClaimCode({ auth, iccid = undefined }) {
		return this.post('/v1/device_claims', { iccid }, auth);
	}

	validatePromoCode({auth, promoCode}) {
		return this.get(`/v1/promo_code/${promoCode}`, auth);
	}

	changeProduct({ deviceId, productId, shouldUpdate, auth }) {
		return this.put(`/v1/devices/${deviceId}`, {
			product_id: productId,
			update_after_claim: shouldUpdate || false,
		}, auth);
	}

	getVariable({ deviceId, name, auth }) {
		return this.get(`/v1/devices/${deviceId}/${name}`, auth);
	}

	signalDevice({ deviceId, signal, auth }) {
		return this.put(`/v1/devices/${deviceId}`, {
			signal: ( !!signal ? 1 : 0 ),
		}, auth);
	}

	flashDevice({ deviceId, files, targetVersion, auth }) {
		const form = {};
		if (targetVersion) {
			form.build_target_version = targetVersion;
		} else {
			form.latest = true;
		}
		return this.request({ uri: `/v1/devices/${deviceId}`,
			files, auth, form, method: 'put' });
	}

	flashTinker({ deviceId, auth }) {
		return this.put(`/v1/devices/${deviceId}`, {
			app: 'tinker',
		}, auth);
	}

	compileCode({ files, platformId, targetVersion, auth }) {
		const form = { platform_id: platformId };
		if (targetVersion) {
			form.build_target_version = targetVersion;
		} else {
			form.latest = true;
		}
		return this.request({ uri: '/v1/binaries',
			files, auth, form, method: 'post' });
	}

	sendPublicKey({ deviceId, key, algorithm, auth }) {
		return this.post(`/v1/provisioning/${deviceId}`, {
			deviceID: deviceId,
			publicKey: ( typeof key === 'string' ? key : key.toString() ),
			filename: 'particle-api',
			order: `manual_${ Date.now() }`,
			algorithm: algorithm || 'rsa'
		}, auth);
	}

	callFunction({ deviceId, name, argument, auth }) {
		return this.post(`/v1/devices/${deviceId}/${name}`, {
			args: argument,
		}, auth);
	}

	getEventStream({ deviceId, name, auth }) {
		let uri;
		if (!deviceId) {
			uri = '/v1/events';
		} else if (deviceId.toLowerCase() === 'mine') {
			uri = '/v1/devices/events';
		} else {
			uri = `/v1/devices/${deviceId}/events`;
		}

		if (name) {
			uri += `/${name}`;
		}
		// TODO: Add tests for event stream?
		return this.get(uri, auth);
	}

	publishEvent({ name, data, isPrivate, auth }) {
		return this.post('/v1/devices/events', {
			name,
			data,
			'private': isPrivate
		}, auth);
	}

	createWebhook({ deviceId, name, url, requestType, headers, json, query, rejectUnauthorized, webhookAuth, form, auth }) {
		const data = { event: name, url, requestType, headers, json, query, rejectUnauthorized, auth: webhookAuth, form };
		if (deviceId === 'mine') {
			data.mydevices = true;
		} else {
			data.deviceid = deviceId;
		}
		return this.post('/v1/webhooks', data, auth);
	}

	deleteWebhook({ hookId, auth }) {
		return this.delete(`/v1/webhooks/${hookId}`, null, auth);
	}

	listWebhooks({ auth }) {
		return this.get('/v1/webhooks', auth);
	}

	getUserInfo({ auth }) {
		return this.get('/v1/user', auth);
	}

	setUserInfo({ stripeToken, auth }) {
		return this.put('/v1/user', {
			stripe_token: stripeToken,
		}, auth);
	}

	checkSIM({ iccid, auth }) {
		return this.head(`/v1/sims/${iccid}`, auth);
	}

	activateSIM({ iccid, countryCode, promoCode, auth }) {
		return this.put(`/v1/sims/${iccid}`, {
			country: countryCode,
			promo_code: promoCode,
			action: 'activate',
		}, auth);
	}

	listBuildTargets({ auth, onlyFeatured = undefined }) {
		let query;
		if (onlyFeatured !== undefined) {
			query = { featured: !!onlyFeatured };
		}
		return this.get('/v1/build_targets', auth, query);
	}

	get(uri, auth, query = undefined) {
		return this.request({ uri, auth, method: 'get', query: query });
	}

	head(uri, auth) {
		return this.request({ uri, auth, method: 'head' });
	}

	post(uri, data, auth) {
		return this.request({ uri, data, auth, method: 'post' });
	}

	put(uri, data, auth) {
		return this.request({ uri, data, auth, method: 'put' });
	}

	delete(uri, data, auth) {
		return this.request({ uri, data, auth, method: 'delete' });
	}

	request({ uri, method, data = undefined, auth, query = undefined, form = undefined, files = undefined }) {
		return new Promise((fulfill, reject) => {
			const req = request(method, uri);
			req.use(this.prefix);
			this.headers(req, auth);
			if (query) {
				req.query(query);
			}
			if (files) {
				Object.keys(files).forEach((k, i) => {
					req.attach(`file${i + 1}`, files[k], k);
				});
				if (form) {
					Object.keys(form).forEach(k => {
						req.field(k, form[k]);
					});
				}
			} else if (form) {
				req.type('form');
				req.send(form);
			} else if (data) {
				req.send(data);
			}

			req.end((error, res) => {
				const body = res && res.body;
				if (error) {
					const statusCode = error.status;
					let errorDescription = `${statusCode ? 'HTTP error' : 'Network error'} ${statusCode} from ${uri}`;
					if (body && body.error_description) {
						errorDescription += ' - ' + body.error_description;
					}
					reject({ statusCode, errorDescription, error });
				} else {
					fulfill({
						body: body,
						statusCode: res.statusCode,
					});
				}
			});
		});
	}

	headers(req, auth) {
		if (!auth) {
			return;
		}

		if (typeof auth === 'object') {
			req.auth(auth.username, auth.password);
		} else {
			req.set({ Authorization: `Bearer ${auth}` });
		}
	}
}

export default Particle;
