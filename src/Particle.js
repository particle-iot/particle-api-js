import request from 'superagent';
import binaryParser from './superagent-binary-parser';
import Defaults from './Defaults';
import EventStream from './EventStream';
import Agent from './Agent';
import Client from './Client';

/**
 * Particle Cloud API wrapper.
 *
 * See <https://docs.particle.io/reference/javascript/> for examples
 * of using the `Particle` class.
 *
 * Most Particle methods take a single unnamed argument object documented as
 * `$0` with key/value pairs for each option.
 */
class Particle {
	/**
	 * Contructor for the Cloud API wrapper.
	 *
	 * Create a new Particle object and call methods below on it.
	 *
	 * @param  {Object} options Options to be used for all requests (see [Defaults](../src/Defaults.js))
	 */
	constructor(options = {}) {
		Object.assign(this, Defaults, options);
		this.agent = new Agent(this.baseUrl);
	}

	/**
	 * Login to Particle Cloud using an existing Particle acccount.
	 * @param  {String} $0.username      Username for the Particle account
	 * @param  {String} $0.password      Password for the Particle account
	 * @param  {Number} $0.tokenDuration How long the access token should last in seconds
	 * @return {Promise}
	 */
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

	/**
	 * Create a user account for the Particle Cloud
	 * @param  {String} $0.username Email of the new user
	 * @param  {String} $0.password Password
	 * @return {Promise}
	 */
	createUser({ username, password }) {
		return this.post('/v1/users', {
			username, password,
		});
	}

	/**
	 * Send reset password email for a Particle Cloud user account
	 * @param  {String} $0.username Email of the user
	 * @return {Promise}
	 */
	resetPassword({ username }) {
		return this.post('/v1/user/password-reset', { username });
	}

	/**
	 * Revoke an access token
	 * @param  {String} $0.username Username of the Particle cloud account that the token belongs to.
	 * @param  {String} $0.password Password for the account
	 * @param  {String} $0.token    Access token you wish to revoke
	 * @return {Promise}
	 */
	removeAccessToken({ username, password, token }) {
		return this.delete(`/v1/access_tokens/${token}`, {
			access_token: token,
		}, { username, password });
	}

	/**
	 * List all valid access tokens for a Particle Cloud account
	 * @param  {String} $0.username Username
	 * @param  {String} $0.password Password
	 * @return {Promise}
	 */
	listAccessTokens({ username, password }) {
		return this.get('/v1/access_tokens', { username, password });
	}

	/**
	 * List devices claimed to the account
	 * @param  {String} $0.auth Access Token
	 * @return {Promise}
	 */
	listDevices({ auth }) {
		return this.get('/v1/devices', auth);
	}

	/**
	 * Get detailed informationa about a device
	 * @param  {String} $0.deviceId Device ID or Name
	 * @param  {String} $0.auth     Access token
	 * @return {Promise}
	 */
	getDevice({ deviceId, auth }) {
		return this.get(`/v1/devices/${deviceId}`, auth);
	}

	/**
	 * Claim a device to the account. The device must be online and unclaimed.
	 * @param  {String} $0.deviceId Device ID
	 * @param  {String} $0.auth     Access Token
	 * @return {Promise}
	 */
	claimDevice({ deviceId, requestTransfer, auth }) {
		return this.post('/v1/devices', {
			id: deviceId,
			request_transfer: !!requestTransfer
		}, auth);
	}

	/**
	 * Unclaim / Remove a device from your account
	 * @param  {String} $0.deviceId Device ID or Name
	 * @param  {String} $0.auth     Access Token
	 * @return {Promise}
	 */
	removeDevice({ deviceId, auth }) {
		return this.delete(`/v1/devices/${deviceId}`, null, auth);
	}

	/**
	 * Rename a device
	 * @param  {String} $0.deviceId Device ID or Name
	 * @param  {String} $0.name     Desired Name
	 * @param  {String} $0.auth     Access Token
	 * @return {Promise}
	 */
	renameDevice({ deviceId, name, auth }) {
		return this.put(`/v1/devices/${deviceId}`, { name }, auth);
	}

	/**
	 * Generate a claim code to use in the device claiming process.
	 * @param  {String} $0.auth  Access Token
	 * @param  {String} [$0.iccid] ICCID of the SIM card used in the Electron
	 * @return {Promise}
	 */
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

	/**
	 * Get the value of a device variable
	 * @param  {String} $0.deviceId Device ID or Name
	 * @param  {String} $0.name     Variable name
	 * @param  {String} $0.auth     Access Token
	 * @return {Promise}
	 */
	getVariable({ deviceId, name, auth }) {
		return this.get(`/v1/devices/${deviceId}/${name}`, auth);
	}

	/**
	 * Instruct the device to turn on/off the LED in a rainbow pattern
	 * @param  {String} $0.deviceId Device ID or Name
	 * @param  {Boolean} $0.signal   Signal on or off
	 * @param  {String} $0.auth     Access Token
	 * @return {Promise}
	 */
	signalDevice({ deviceId, signal, auth }) {
		return this.put(`/v1/devices/${deviceId}`, {
			signal: ( !!signal ? '1' : '0' ),
		}, auth);
	}

	/**
	 * Compile and flash application firmware to a device
	 * @param  {String} $0.deviceId      Device ID or Name
	 * @param  {Object} $0.files         Object containing files to be compiled. Keys should be the filenames, and the values should be a path or Buffer of the file contents.
	 * @param  {String} [$0.targetVersion=latest] System firmware version to compile against
	 * @param  {String} $0.auth          String
	 * @return {Promise}
	 */
	flashDevice({ deviceId, files, targetVersion, auth }) {
		const form = {};
		if (targetVersion) {
			form.build_target_version = targetVersion;
		} else {
			form.latest = 'true';
		}
		return this.request({ uri: `/v1/devices/${deviceId}`,
			files, auth, form, method: 'put' });
	}

	/**
	 * Flash the Tinker application to a device
	 * @param  {String} $0.deviceId Device ID or Name
	 * @param  {String} $0.auth     Access Token
	 * @return {Promise}
	 */
	flashTinker({ deviceId, auth }) {
		return this.put(`/v1/devices/${deviceId}`, {
			app: 'tinker',
		}, auth);
	}

	/**
	 * Compile firmware using the Particle Cloud
	 * @param  {Object} $0.files         Object containing files to be compiled. Keys should be the filenames, and the values should be a path or Buffer of the file contents.
	 * @param  {Number} [$0.platformId]    Platform id number of the device you are compiling for. Common values are 0=Core, 6=Photon, 10=Electron.
	 * @param  {String} [$0.targetVersion=latest] System firmware version to compile against
	 * @param  {String} $0.auth          Access Token
	 * @return {Promise}
	 */
	compileCode({ files, platformId, targetVersion, auth }) {
		const form = { platform_id: platformId };
		if (targetVersion) {
			form.build_target_version = targetVersion;
		} else {
			form.latest = 'true';
		}
		return this.request({ uri: '/v1/binaries',
			files, auth, form, method: 'post' });
	}

	/**
	 * Download a firmware binary
	 * @param  {String} $0.binaryId Binary ID received from a successful compile call
	 * @param  {String} $0.auth     Access Token
	 * @return {Request}
	 */
	downloadFirmwareBinary({ binaryId, auth }) {
		const uri = `/v1/binaries/${binaryId}`;
		const req = request('get', uri);
		req.use(this.prefix);
		this.headers(req, auth);
		if (this.debug) {
			this.debug(req);
		}
		return req;
	}

	/**
	 * Send a new device public key to the Particle Cloud
	 * @param  {String} $0.deviceId  Device ID or Name
	 * @param  {(String|Buffer)} $0.key       Public key contents
	 * @param  {String} [$0.algorithm=rsa] Algorithm used to generate the public key. Valid values are `rsa` or `ecc`.
	 * @param  {String} $0.auth      Access Token
	 * @return {Promise}
	 */
	sendPublicKey({ deviceId, key, algorithm, auth }) {
		return this.post(`/v1/provisioning/${deviceId}`, {
			deviceID: deviceId,
			publicKey: ( typeof key === 'string' ? key : key.toString() ),
			filename: 'particle-api',
			order: `manual_${ Date.now() }`,
			algorithm: algorithm || 'rsa'
		}, auth);
	}

	/**
	 * Call a device function
	 * @param  {String} $0.deviceId Device ID or Name
	 * @param  {String} $0.name     Function name
	 * @param  {String} $0.argument Function argument
	 * @param  {String} $0.auth     Access Token
	 * @return {Promise}
	 */
	callFunction({ deviceId, name, argument, auth }) {
		return this.post(`/v1/devices/${deviceId}/${name}`, {
			args: argument,
		}, auth);
	}

	/**
	 * Get a stream of events
	 * @param  {String} [$0.deviceId] Device ID or Name, or `mine` to indicate only your devices.
	 * @param  {String} [$0.name]     Event Name
	 * @param  {String} [$0.org]     Organization Slug
	 * @param  {String} [$0.product]     Product Slug or Product ID
	 * @param  {String} $0.auth     Access Token
	 * @return {Promise} If the promise resolves, the resolution value will be an EventStream object that will
	 * emit 'event' events, as well as the specific named event.
	 */
	getEventStream({ deviceId, name, org, product, auth }) {
		let uri = '/v1/';
		if (org) {
			uri += `orgs/${org}/`;
		}

		if (product) {
			uri += `products/${product}/`;
		}

		if (deviceId) {
			uri += 'devices/';
			if (!(deviceId.toLowerCase() === 'mine')) {
				uri += `${deviceId}/`;
			}
		}

		uri += 'events';

		if (name) {
			uri += `/${encodeURIComponent(name)}`;
		}

		return new EventStream(`${this.baseUrl}${uri}`, auth, { debug: this.debug }).connect();
	}

	/**
	 * Publish a event to the Particle Cloud
	 * @param  {String} $0.name      Event name
	 * @param  {String} $0.data      Event data
	 * @param  {Boolean} $0.isPrivate Should the event be publicly available?
	 * @param  {String} $0.auth      Access Token
	 * @return {Promise}
	 */
	publishEvent({ name, data, isPrivate, auth }) {
		return this.post('/v1/devices/events', {
			name,
			data,
			'private': isPrivate
		}, auth);
	}

	/**
	 * Create a webhook
	 * @param  {String} $0.deviceId           Device ID or Name
	 * @param  {String} $0.name               Webhook name
	 * @param  {String} $0.url                URL the webhook should hit
	 * @param  {String} [$0.requestType=POST]        HTTP method to use
	 * @param  {Object} [$0.headers]            Additional headers to add to the webhook
	 * @param  {Object} [$0.json]               JSON data
	 * @param  {Object} [$0.query]              Query string data
	 * @param  {Object} [$0.responseTemplate]   Webhook response template
	 * @param  {Object} [$0.responseTopic]      Webhook response topic
	 * @param  {Boolean} [$0.rejectUnauthorized] Reject invalid HTTPS certificates
	 * @param  {Object} [$0.webhookAuth]        HTTP Basic Auth information
	 * @param  {Object} [$0.form]               Form data
	 * @param  {String} $0.auth               Access Token
	 * @return {Promise}
	 */
	createWebhook({ deviceId, name, url, requestType, headers, json, query, responseTemplate, responseTopic, rejectUnauthorized, webhookAuth, form, auth }) {
		const data = { event: name, url, requestType, headers, json, query, responseTemplate, responseTopic, rejectUnauthorized, auth: webhookAuth, form };
		if (deviceId === 'mine') {
			data.mydevices = true;
		} else {
			data.deviceid = deviceId;
		}
		return this.post('/v1/webhooks', data, auth);
	}

	/**
	 * Delete a webhook
	 * @param  {String} $0.hookId Webhook ID
	 * @param  {String} $0.auth   Access Token
	 * @return {Promise}
	 */
	deleteWebhook({ hookId, auth }) {
		return this.delete(`/v1/webhooks/${hookId}`, null, auth);
	}

	/**
	 * List all webhooks owned by the account
	 * @param  {String} $0.auth Access Token
	 * @return {Promise}
	 */
	listWebhooks({ auth }) {
		return this.get('/v1/webhooks', auth);
	}

	/**
	 * Get details about the current user
	 * @param  {String} $0.auth Access Token
	 * @return {Promise}
	 */
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

	/**
	 * List valid build targets to be used for compiling
	 * @param  {String} $0.auth         Access Token
	 * @param  {Boolean} [$0.onlyFeatured=false] Only list featured build targets
	 * @return {Promise}
	 */
	listBuildTargets({ auth, onlyFeatured = undefined }) {
		let query;
		if (onlyFeatured !== undefined) {
			query = { featured: !!onlyFeatured };
		}
		return this.get('/v1/build_targets', auth, query);
	}

	/**
	 * List firmware libraries
	 * @param  {String} $0.auth Access Token
	 * @param  {Number} $0.page Page index (default, first page)
	 * @param  {Number} $0.limit Number of items per page
	 * @param  {String} $0.filter Search term for the libraries
	 * @param  {String} $0.sort Ordering key for the library list
	 * @param  {Array<String>}  $0.architectures List of architectures to filter
	 * @param  {String} $0.category Category to filter
	 * @return {Promise}
	 */
	listLibraries({ auth, page, limit, filter, sort, architectures, category }) {
		return this.get('/v1/libraries', auth, {
			page,
			filter,
			limit,
			sort,
			architectures: (Array.isArray(architectures) ? architectures.join(',') : architectures),
			category
		});
	}

	/**
	 * Get firmware library details
	 * @param  {String} $0.auth Access Token
	 * @param  {String} $0.name Name of the library to fetch
	 * @param  {String} $0.version Version of the library to fetch (default: latest)
	 * @return {Promise}
	 */
	getLibrary({ auth, name, version }) {
		return this.get(`/v1/libraries/${name}`, auth, { version });
	}

	/**
	 * Firmware library details for each version
	 * @param  {String} $0.auth Access Token
	 * @param  {String} $0.name Name of the library to fetch
	 * @param  {Number} $0.page Page index (default, first page)
	 * @param  {Number} $0.limit Number of items per page
	 * @return {Promise}
	 */
	getLibraryVersions({ auth, name, page, limit }) {
		return this.get(`/v1/libraries/${name}/versions`, auth, {
			page,
			limit
		});
	}

	/**
	 * Publish a new library version int the compressed archive
	 * @param  {String} $0.auth Access Token
	 * @param  {String} $0.archive Compressed archive file containing the library sources
	 * @return {Promise}
	 */
	publishLibrary({ auth, archive }) {
		const files = {
			'archive.tar.gz': archive
		};

		return this.request({ uri: '/v1/libraries',
			files, auth, method: 'post' });
	}

	/**
	 * Download an external file that may not be on the API
	 * @param  {String} $0.url URL of the file.
	 * @return {Promise} Resolves to a buffer with the file data
	 */
	downloadFile({ url }) {
		let req = request.get(url);
		if (req.buffer) {
			req = req.buffer(true).parse(binaryParser);
		} else if (req.responseType) {
			req = req.responseType('arraybuffer').then(res => {
				res.body = res.xhr.response;
				return res;
			});
		}
		return req.then(res => res.body);
	}

	get(uri, auth, query = undefined) {
		return this.agent.get(uri, auth, query);
	}

	head(uri, auth) {
		return this.agent.head(uri, auth);
	}

	post(uri, data, auth) {
		return this.agent.post(uri, data, auth);
	}

	put(uri, data, auth) {
		return this.agent.put(uri, data, auth);
	}

	delete(uri, data, auth) {
		return this.agent.delete(uri, data, auth);
	}

	request(args) {
		return this.agent.request(args);
	}

	client(options = {}) {
		return new Client(Object.assign({ api: this}, options));
	}
}

export default Particle;
