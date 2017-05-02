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
		// todo - this seems a bit dangerous - would be better to put all options/context in a contained object
		Object.assign(this, Defaults, options);
		this.context = {};
		this.agent = new Agent(this.baseUrl);
	}

	_isValidContext(name, context) {
		return (name==='tool' || name==='project') && context!==undefined;
	}

	setContext(name, context) {
		if (context!==undefined) {
			if (this._isValidContext(name, context)) {
				this.context[name] = context;
			} else {
				throw Error('uknown context name or undefined context: '+name);
			}
		}
	}

	/**
	 * Builds the final context from the context parameter and the context items in the api.
	 * @param {Object} context       The invocation context, this takes precedence over the local context.
	 * @return {Object} The context to use.
	 * @private
	 */
	_buildContext(context) {
		return Object.assign(this.context, context);
	}

	/**
	 * Retrieves the information that is used to identify the current login for tracking.
	 * @param {string} auth      The access token
	 * @param {Boolean} full      When true, retrieve all information for registering a user with the tracking API. When false,
	 *  retrieve only the unique tracking ID for the current login.
	 * @param {object} context   Context information.
	 * @returns {Promise<object>} Resolve the tracking identify of the current login
	 */
	trackingIdentity({ auth, full = false, context } = {}) {
		return this.get('/v1/user/identify', auth, (full ? undefined : { tracking: 1 }), context);
	}

	/**
	 * Login to Particle Cloud using an existing Particle acccount.
	 * @param  {String} $0.username      Username for the Particle account
	 * @param  {String} $0.password      Password for the Particle account
	 * @param  {Number} $0.tokenDuration How long the access token should last in seconds
	 * @return {Promise}
	 */
	login({ username, password, tokenDuration = this.tokenDuration, context }) {
		return this.request({ uri: '/oauth/token', form: {
			username,
			password,
			grant_type: 'password',
			client_id: this.clientId,
			client_secret: this.clientSecret,
			expires_in: tokenDuration
		}, method: 'post', context });
	}

	/**
	 * Create a user account for the Particle Cloud
	 * @param  {String} $0.username Email of the new user
	 * @param  {String} $0.password Password
	 * @param  {String} $0.accountInfo Object that contains account information fields such as user real name, company name, business account flag etc
	 * @return {Promise}
	 */
	createUser({ username, password, accountInfo, context }) {
		return this.post('/v1/users', {
			username,
			password,
			account_info : accountInfo
		}, undefined, context);
	}

	/**
	 * Verify new user account via verification email
	 * @param  {String} $0.token the string token sent in the verification email
	 * @return {Promise}
	 */
	verifyUser({ token, context }) {
		return this.post('/v1/user/verify', {
			token
		}, undefined, context);
	}

	/**
	 * Send reset password email for a Particle Cloud user account
	 * @param  {String} $0.username Email of the user
	 * @return {Promise}
	 */
	resetPassword({ username, context }) {
		return this.post('/v1/user/password-reset', { username }, undefined, context);
	}

	/**
	 * Revoke an access token
	 * @param  {String} $0.username Username of the Particle cloud account that the token belongs to.
	 * @param  {String} $0.password Password for the account
	 * @param  {String} $0.token    Access token you wish to revoke
	 * @return {Promise}
	 */
	deleteAccessToken({ username, password, token, context }) {
		return this.delete(`/v1/access_tokens/${token}`, {
			access_token: token
		}, { username, password }, context);
	}

	/**
	 * List all valid access tokens for a Particle Cloud account
	 * @param  {String} $0.username Username
	 * @param  {String} $0.password Password
	 * @return {Promise}
	 */
	listAccessTokens({ username, password, context }) {
		return this.get('/v1/access_tokens', { username, password }, undefined, context);
	}

	/**
	 * List devices claimed to the account or product
	 * @param  {String} [$0.deviceId]   (Product only) Filter results to devices with this ID (partial matching)
	 * @param  {String} [$0.deviceName] (Product only) Filter results to devices with this name (partial matching)
	 * @param  {String} [$0.sortAttr]   (Product only) The attribute by which to sort results. See API docs for options.
	 * @param  {String} [$0.sortDir]    (Product only) The direction of sorting. See API docs for options.
	 * @param  {Number} [$0.page]       (Product only) Current page of results
	 * @param  {Number} [$0.perPage]    (Product only) Records per page
	 * @param  {String} [$0.product]    List devices in this product ID or slug
	 * @param  {String} $0.auth         Access Token
	 * @return {Promise}
	 */
	listDevices({ deviceId, deviceName, sortAttr, sortDir, page, perPage, product, auth, context }) {
		const uri = product ? `/v1/products/${product}/devices` : '/v1/devices';
		const query = product ? { deviceId, deviceName, sortAttr, sortDir, page, perPage } : undefined;
		return this.get(uri, auth, query, context);
	}

	/**
	 * Get detailed informationa about a device
	 * @param  {String} $0.deviceId  Device ID or Name
	 * @param  {String} [$0.product] Device in this product ID or slug
	 * @param  {String} $0.auth      Access token
	 * @return {Promise}
	 */
	getDevice({ deviceId, product, auth, context }) {
		const uri = this.deviceUri({ deviceId, product });
		return this.get(uri, auth, undefined, context);
	}

	/**
	 * Claim a device to the account. The device must be online and unclaimed.
	 * @param  {String} $0.deviceId Device ID
	 * @param  {String} $0.auth     Access Token
	 * @return {Promise}
	 */
	claimDevice({ deviceId, requestTransfer, auth, context }) {
		return this.post('/v1/devices', {
			id: deviceId,
			request_transfer: !!requestTransfer
		}, auth, context);
	}

	/**
	 * Add a device to a product or move device out of quarantine.
	 * @param  {String} $0.deviceId Device ID
	 * @param  {String} $0.product  Add to this product ID or slug
	 * @param  {String} $0.auth     Access Token
	 * @return {Promise}
	 */
	addDeviceToProduct({ deviceId, product, auth, context }) {
		const uri = `/v1/products/${product}/devices`;
		return this.post(uri, {
			id: deviceId
		}, auth, context);
	}

	/**
	 * Unclaim / Remove a device from your account or product, or deny quarantine
	 * @param  {String} $0.deviceId Device ID or Name
	 * @param  {Boolean} [$0.deny]  (Product only) Deny this quarantined device, instead of removing an already approved device
	 * @param  {String} $0.product  Remove from this product ID or slug
	 * @param  {String} $0.auth     Access Token
	 * @return {Promise}
	 */
	removeDevice({ deviceId, deny, product, auth, context }) {
		const uri = this.deviceUri({ deviceId, product });
		const data = product ? { deny } : undefined;
		return this.delete(uri, data, auth, context);
	}

	/**
	 * Unclaim a product device its the owner, but keep it in the product
	 * @param  {String} $0.deviceId Device ID or Name
	 * @param  {String} $0.product  Remove from this product ID or slug
	 * @param  {String} $0.auth     Access Token
	 * @return {Promise}
	 */
	removeDeviceOwner({ deviceId, deny, product, auth, context }) {
		const uri = `/v1/products/${product}/devices/${deviceId}/owner`;
		return this.delete(uri, undefined, auth, context);
	}

	/**
	 * Rename a device
	 * @param  {String} $0.deviceId Device ID or Name
	 * @param  {String} $0.name     Desired Name
	 * @param  {String} [$0.product] Rename device in this product ID or slug
	 * @param  {String} $0.auth     Access Token
	 * @return {Promise}
	 */
	renameDevice({ deviceId, name, product, auth, context }) {
		return this.updateDevice({ deviceId, name, product, auth, context });
	}

	/**
	 * Instruct the device to turn on/off the LED in a rainbow pattern
	 * @param  {String} $0.deviceId Device ID or Name
	 * @param  {Boolean} $0.signal   Signal on or off
	 * @param  {String} [$0.product] Device in this product ID or slug
	 * @param  {String} $0.auth     Access Token
	 * @return {Promise}
	 */
	signalDevice({ deviceId, signal, product, auth, context }) {
		return this.updateDevice({ deviceId, signal, product, auth, context });
	}

	/**
	 * Store some notes about device
	 * @param  {String} $0.deviceId  Device ID or Name
	 * @params {String} $0.notes     Your notes about this device
	 * @param  {String} [$0.product] Device in this product ID or slug
	 * @param  {String} $0.auth      Access Token
	 * @return {Promise}
	 */
	setDeviceNotes({ deviceId, notes, product, auth, context }) {
		return this.updateDevice({ deviceId, notes, product, auth, context });
	}

	/**
	 * Mark device as being used in development of a product so it opts out of automatic firmware updates
	 * @param  {String} $0.deviceId      Device ID or Name
	 * @param  {Boolean} $0.development  Set to true to mark as development, false to return to product fleet
	 * @param  {String} $0.product       Device in this product ID or slug
	 * @param  {String} $0.auth          Access Token
	 * @return {Promise}
	 */
	markAsDevelopmentDevice({ deviceId, development = true, product, auth, context }) {
		return this.updateDevice({ deviceId, development, product, auth, context });
	}

	/**
	 * Mark device as being used in development of a product so it opts out of automatic firmware updates
	 * @param  {String} $0.deviceId      Device ID or Name
	 * @params {Number} $0.desiredFirmwareVersion Lock the product device to run this firmware version.
	 * @params {Boolean} [$0.flash]      Immediately flash firmware indicated by desiredFirmwareVersion
	 * @param  {String} $0.product       Device in this product ID or slug
	 * @param  {String} $0.auth          Access Token
	 * @return {Promise}
	 */
	lockDeviceProductFirmware({ deviceId, desiredFirmwareVersion, flash, product, auth, context }) {
		return this.updateDevice({ deviceId, desiredFirmwareVersion, flash, product, auth, context });
	}

	/**
	 * Mark device as receiving automatic firmware updates
	 * @param  {String} $0.deviceId      Device ID or Name
	 * @param  {String} $0.product       Device in this product ID or slug
	 * @param  {String} $0.auth          Access Token
	 * @return {Promise}
	 */
	unlockDeviceProductFirmware({ deviceId, product, auth, context }) {
		return this.updateDevice({ deviceId, desiredFirmwareVersion: null, product, auth, context });
	}

	/**
	 * Update multiple device attributes at the same time
	 * @param  {String} $0.deviceId       Device ID or Name
	 * @param  {String} [$0.name]         Desired Name
	 * @param  {Boolean} $0.signal        Signal device on or off
	 * @params {String} [$0.notes]        Your notes about this device
	 * @param  {Boolean} [$0.development] (Product only) Set to true to mark as development, false to return to product fleet
	 * @params {Number} [$0.desiredFirmwareVersion] (Product only) Lock the product device to run this firmware version.
	 *                                              Pass `null` to unlock firmware and go back to released firmware.
	 * @params {Boolean} [$0.flash]       (Product only) Immediately flash firmware indicated by desiredFirmwareVersion
	 * @param  {String} [$0.product]      Device in this product ID or slug
	 * @param  {String} $0.auth           Access Token
	 * @return {Promise}
	 */
	updateDevice({ deviceId, name, signal, notes, development, desiredFirmwareVersion, flash, product, auth, context }) {
		signal = signal ? '1' : '0';
		const uri = this.deviceUri({ deviceId, product });
		const data = product ?
			{ name, signal, notes, development, desired_firmware_version: desiredFirmwareVersion, flash } :
			{ name, signal, notes };
		return this.put(uri, data, auth, context);
	}

	/**
	 * Provision a new device for products that allow self-provisioning
	 * @param  {String} $0.productId Product ID where to create this device
	 * @param  {String} $0.auth      Access Token
	 * @return {Promise}
	 */
	provisionDevice({ productId, auth, context }) {
		return this.post('/v1/devices', { product_id: productId }, auth, context);
	}

	/**
	 * Generate a claim code to use in the device claiming process.
	 * To generate a claim code for a product, the access token MUST belong to a
	 * customer of the product.
	 * @param  {String} [$0.iccid] ICCID of the SIM card used in the Electron
	 * @param  {String} [$0.product] Device in this product ID or slug
	 * @param  {String} $0.auth  Access Token
	 * @return {Promise}
	 */
	getClaimCode({ iccid, product, auth, context }) {
		const uri = product ? `/v1/products/${product}/device_claims` : '/v1/device_claims';
		return this.post(uri, { iccid }, auth, context);
	}

	validatePromoCode({ auth, promoCode, context }) {
		return this.get(`/v1/promo_code/${promoCode}`, auth, undefined, context);
	}

	changeProduct({ deviceId, productId, auth, context }) {
		return this.put(`/v1/devices/${deviceId}`, {
			product_id: productId
		}, auth, context);
	}

	/**
	 * Get the value of a device variable
	 * @param  {String} $0.deviceId Device ID or Name
	 * @param  {String} $0.name     Variable name
	 * @param  {String} [$0.product] Device in this product ID or slug
	 * @param  {String} $0.auth     Access Token
	 * @return {Promise}
	 */
	getVariable({ deviceId, name, product, auth, context }) {
		const uri = product ?
			`/v1/products/${product}/devices/${deviceId}/${name}` :
			`/v1/devices/${deviceId}/${name}`;
		return this.get(uri, auth, undefined, context);
	}

	/**
	 * Compile and flash application firmware to a device. Pass a pre-compiled binary to flash it directly to the device.
	 * @param  {String} $0.deviceId      Device ID or Name
	 * @param  {Object} $0.files         Object containing files to be compiled and flashed. Keys should be the filenames, and the values should be a path or Buffer of the file contents.
	 * @param  {String} [$0.targetVersion=latest] System firmware version to compile against
	 * @param  {String} $0.auth          String
	 * @return {Promise}
	 */
	flashDevice({ deviceId, files, targetVersion, auth, context }) {
		const form = {};
		if (targetVersion) {
			form.build_target_version = targetVersion;
		} else {
			form.latest = 'true';
		}
		return this.request({ uri: `/v1/devices/${deviceId}`,
			files, auth, form, context, method: 'put' });
	}

	/**
	 * DEPRECATED: Flash the Tinker application to a device. Instead compile and flash the Tinker source code.
	 * @param  {String} $0.deviceId Device ID or Name
	 * @param  {String} $0.auth     Access Token
	 * @return {Promise}
	 */
	flashTinker({ deviceId, auth, context }) {
		/* eslint-disable no-console */
		if (console && console.warning) {
			console.warning('Particle.flashTinker is deprecated');
		}
		/* eslint-enable no-console */
		return this.put(`/v1/devices/${deviceId}`, {
			app: 'tinker'
		}, auth, context);
	}

	/**
	 * Compile firmware using the Particle Cloud
	 * @param  {Object} $0.files         Object containing files to be compiled. Keys should be the filenames, and the values should be a path or Buffer of the file contents.
	 * @param  {Number} [$0.platformId]    Platform id number of the device you are compiling for. Common values are 0=Core, 6=Photon, 10=Electron.
	 * @param  {String} [$0.targetVersion=latest] System firmware version to compile against
	 * @param  {String} $0.auth          Access Token
	 * @return {Promise}
	 */
	compileCode({ files, platformId, targetVersion, auth, context }) {
		const form = { platform_id: platformId };
		if (targetVersion) {
			form.build_target_version = targetVersion;
		} else {
			form.latest = 'true';
		}
		return this.request({ uri: '/v1/binaries',
			files, auth, form, context, method: 'post' });
	}

	/**
	 * Download a firmware binary
	 * @param  {String} $0.binaryId Binary ID received from a successful compile call
	 * @param  {String} $0.auth     Access Token
	 * @return {Request}
	 */
	downloadFirmwareBinary({ binaryId, auth, context }) {
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
	sendPublicKey({ deviceId, key, algorithm, auth, context }) {
		return this.post(`/v1/provisioning/${deviceId}`, {
			deviceID: deviceId,
			publicKey: ( typeof key === 'string' ? key : key.toString() ),
			filename: 'particle-api',
			order: `manual_${ Date.now() }`,
			algorithm: algorithm || 'rsa'
		}, auth, context);
	}

	/**
	 * Call a device function
	 * @param  {String} $0.deviceId Device ID or Name
	 * @param  {String} $0.name     Function name
	 * @param  {String} $0.argument Function argument
	 * @param  {String} [$0.product] Device in this product ID or slug
	 * @param  {String} $0.auth     Access Token
	 * @return {Promise}
	 */
	callFunction({ deviceId, name, argument, product, auth, context }) {
		const uri = product ?
			`/v1/products/${product}/devices/${deviceId}/${name}` :
			`/v1/devices/${deviceId}/${name}`;
		return this.post(uri, { args: argument }, auth, context);
	}

	/**
	 * Get a stream of events
	 * @param  {String} [$0.deviceId] Device ID or Name, or `mine` to indicate only your devices.
	 * @param  {String} [$0.name]     Event Name
	 * @param  {String} [$0.org]     Organization Slug
	 * @param  {String} [$0.product] Events for this product ID or slug
	 * @param  {String} $0.auth     Access Token
	 * @return {Promise} If the promise resolves, the resolution value will be an EventStream object that will
	 * emit 'event' events, as well as the specific named event.
	 */
	getEventStream({ deviceId, name, org, product, auth, context }) {
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
	 * @param  {String} [$0.product]  Event for this product ID or slug
	 * @param  {String} $0.auth      Access Token
	 * @return {Promise}
	 */
	publishEvent({ name, data, isPrivate, product, auth, context }) {
		const uri = product ? `/v1/products/${product}/events` : '/v1/devices/events';
		const postData = { name, data, private: isPrivate };
		return this.post(uri, postData, auth, context);
	}

	/**
	 * Create a webhook
	 * @param  {String} $0.deviceId           Trigger webhook only for this device ID or Name
	 * @param  {String} $0.name               Webhook name
	 * @param  {String} $0.url                URL the webhook should hit
	 * @param  {String} [$0.requestType=POST]        HTTP method to use
	 * @param  {Object} [$0.headers]            Additional headers to add to the webhook
	 * @param  {Object} [$0.json]               JSON data
	 * @param  {Object} [$0.query]              Query string data
	 * @param  {String} [$0.body]               Custom webhook request body
	 * @param  {Object} [$0.responseTemplate]   Webhook response template
	 * @param  {Object} [$0.responseTopic]      Webhook response topic
	 * @param  {Boolean} [$0.rejectUnauthorized] Reject invalid HTTPS certificates
	 * @params {Boolean} [$0.noDefaults]        Don't include default event data in the webhook request
	 * @param  {Object} [$0.webhookAuth]        HTTP Basic Auth information
	 * @param  {Object} [$0.form]               Form data
	 * @param  {String} [$0.product]          Webhook for this product ID or slug
	 * @param  {String} $0.auth               Access Token
	 * @return {Promise}
	 */
	createWebhook({ deviceId, name, url, requestType, headers, json, query, body, responseTemplate, responseTopic, rejectUnauthorized, webhookAuth, noDefaults, form, product, auth, context }) {
		// deviceId: 'mine' is deprecated since webhooks only trigger on your device anyways
		if (deviceId === 'mine') {
			deviceId = undefined;
		}
		const uri = product ? `/v1/products/${product}/webhooks` : '/v1/webhooks';
		const data = { event: name, deviceid: deviceId, url, requestType, headers, json, query, body, responseTemplate, responseTopic, rejectUnauthorized, auth: webhookAuth, noDefaults, form };
		return this.post(uri, data, auth, context);
	}

	/**
	 * Delete a webhook
	 * @param  {String} $0.hookId Webhook ID
	 * @param  {String} [$0.product]          Webhook for this product ID or slug
	 * @param  {String} $0.auth   Access Token
	 * @return {Promise}
	 */
	deleteWebhook({ hookId, product, auth, context }) {
		const uri = product ? `/v1/products/${product}/webhooks/${hookId}` : `/v1/webhooks/${hookId}`;
		return this.delete(uri, undefined, auth, context);
	}

	/**
	 * List all webhooks owned by the account or product
	 * @param  {String} [$0.product]          Webhooks for this product ID or slug
	 * @param  {String} $0.auth Access Token
	 * @return {Promise}
	 */
	listWebhooks({ product, auth, context }) {
		const uri = product ? `/v1/products/${product}/webhooks` : '/v1/webhooks';
		return this.get(uri, auth, undefined, context);
	}

	/**
	 * Create an integration to send events to an external service
     *
	 * See the API docs for details https://docs.particle.io/reference/api/#integrations-webhooks-
	 *
	 * @param  {String} $0.integrationType  The kind of external integration. One of Webhook, AzureIotHub, GoogleCloudPubSub, GoogleMaps
	 * @param  {String} $0.event            Event that triggers the integration
	 * @params {Object} $0.settings         Settings specific to that integration type
	 * @param  {String} [$0.deviceId]       Trigger integration only for this device ID or Name
	 * @param  {String} [$0.product]        Integration for this product ID or slug
	 * @param  {String} $0.auth             Access Token
	 * @return {Promise}
	 */
	createIntegration({ integrationType, event, settings, deviceId, product, auth, context }) {
		const uri = product ? `/v1/products/${product}/integrations` : '/v1/integrations';
		const data = Object.assign({ event, deviceid: deviceId }, settings);
		return this.post(uri, data, auth, context);
	}

	/**
	 * Edit an integration to send events to an external service
	 *
	 * See the API docs for details https://docs.particle.io/reference/api/#integrations-webhooks-
	 *
	 * @param  {String} $0.integrationId    The integration to edit
	 * @param  {String} [$0.event]          Change the event that triggers the integration
	 * @params {Object} [$0.settings]       Change the settings specific to that integration type
	 * @param  {String} [$0.deviceId]       Trigger integration only for this device ID or Name
	 * @param  {String} [$0.product]        Integration for this product ID or slug
	 * @param  {String} $0.auth             Access Token
	 * @return {Promise}
	 */
	editIntegration({ integrationId, event, settings, deviceId, product, auth, context }) {
		const uri = product ? `/v1/products/${product}/integrations/${integrationId}` : `/v1/integrations/${integrationId}`;
		const data = Object.assign({ event, deviceid: deviceId }, settings);
		return this.put(uri, data, auth, context);
	}

	/**
	 * Delete an integration to send events to an external service
	 *
	 * @param  {String} $0.integrationId    The integration to remove
	 * @param  {String} [$0.product]        Integration for this product ID or slug
	 * @param  {String} $0.auth             Access Token
	 * @return {Promise}
	 */
	deleteIntegration({ integrationId, product, auth, context }) {
		const uri = product ? `/v1/products/${product}/integrations/${integrationId}` : `/v1/integrations/${integrationId}`;
		return this.delete(uri, undefined, auth, context);
	}

	/**
	 * List all integrations owned by the account or product
	 * @param  {String} [$0.product]        Integrations for this product ID or slug
	 * @param  {String} $0.auth Access Token
	 * @return {Promise}
	 */
	listIntegrations({ product, auth, context }) {
		const uri = product ? `/v1/products/${product}/integrations` : '/v1/integrations';
		return this.get(uri, auth, undefined, context);
	}

	/**
	 * Get details about the current user
	 * @param  {String} $0.auth Access Token
	 * @return {Promise}
	 */
	getUserInfo({ auth, context }) {
		return this.get('/v1/user', auth, undefined, context);
	}

	/**
	 * Set details on the current user
	 * @param  {String} $0.auth Access Token
	 * @param  {String} $0.stripeToken Set user's stripe token for payment
	 * @param  {String} $0.accountInfo Set user's extended info fields (name, business account, company name, etc)
	 * @param  {String} $0.password Change authenticated user password
	 * @return {Promise}
	 */
	setUserInfo({ stripeToken, accountInfo, password, auth, context }) {
		const bodyObj = {};

		(stripeToken ? bodyObj.stripe_token = stripeToken : null);
		(accountInfo ? bodyObj.account_info = accountInfo : null);
		(password ? bodyObj.password = password : null);

		return this.put('/v1/user', bodyObj, auth, context);
	}

	/**
	 * List SIM cards owned by a user or product
	 * @param  {String} [$0.iccid]    (Product only) Filter to SIM cards matching this ICCID
	 * @param  {String} [$0.deviceId] (Product only) Filter to SIM cards matching this device ID
	 * @param  {String} [$0.deviceName] (Product only) Filter to SIM cards matching this device name
	 * @param  {Number} [$0.page]     (Product only) Current page of results
	 * @param  {Number} [$0.perPage]  (Product only) Records per page
	 * @param  {String} [$0.product]  SIM cards for this product ID or slug
	 * @param  {String} $0.auth       Access Token
	 * @return {Promise}
	 */
	listSIMs({ iccid, deviceId, deviceName, page, perPage, product, auth, context }) {
		const uri = product ? `/v1/products/${product}/sims` : '/v1/sims';
		const query = product ? { iccid, deviceId, deviceName, page, perPage } : undefined;
		return this.get(uri, auth, query, context);
	}

	/**
	 * Get data usage for one SIM card for the current billing period
	 * @param  {String} $0.iccid      ICCID of the SIM card
	 * @param  {String} [$0.product]  SIM card for this product ID or slug
	 * @param  {String} $0.auth       Access Token
	 * @return {Promise}
	 */
	getSIMDataUsage({ iccid, product, auth, context }) {
		const uri = product ?
			`/v1/products/${product}/sims/${iccid}/data_usage` :
			`/v1/sims/${iccid}/data_usage`;
		return this.get(uri, auth, undefined, context);
	}

	/**
	 * Get data usage for all SIM cards in a product the current billing period
	 * @param  {String} $0.product  SIM cards for this product ID or slug
	 * @param  {String} $0.auth     Access Token
	 * @return {Promise}
	 */
	getFleetDataUsage({ product, auth, context }) {
		return this.get(`/v1/products/${product}/sims/data_usage`, auth, undefined, context);
	}

	checkSIM({ iccid, auth, context }) {
		return this.head(`/v1/sims/${iccid}`, auth, undefined, context);
	}

	/**
	 * Activate and add SIM cards to an account or product
	 * @param  {String} $0.iccid        ICCID of the SIM card
	 * @param  {Array<String>} $0.iccids (Product only) ICCID of multiple SIM cards to import
	 * @param  {String} $0.countryCode The ISO country code for the SIM cards
	 * @param  {String} [$0.product]  SIM cards for this product ID or slug
	 * @param  {String} $0.auth       Access Token
	 * @return {Promise}
	 */
	activateSIM({ iccid, iccids, countryCode, promoCode, product, auth, context }) {
		// promoCode is deprecated
		iccids = iccids || [iccid];
		const uri = product ? `/v1/products/${product}/sims` : `/v1/sims/${iccid}`;
		const data = product ?
			{ sims: iccids, countryCode } :
			{ countryCode, promoCode, action: 'activate' };
		const method = product ? 'post' : 'put';

		return this.request({ uri, method, data, auth, context });
	}

	/**
	 * Deactivate a SIM card so it doesn't incur data usage in future months.
	 * @param  {String} $0.iccid      ICCID of the SIM card
	 * @param  {String} [$0.product]  SIM cards for this product ID or slug
	 * @param  {String} $0.auth       Access Token
	 * @return {Promise}
	 */
	deactivateSIM({ iccid, product, auth, context }) {
		const uri = product ? `/v1/products/${product}/sims/${iccid}` : `/v1/sims/${iccid}`;
		const data = { action: 'deactivate' };
		return this.put(uri, data, auth, context);
	}

	/**
	 * Reactivate a SIM card the was deactivated or unpause a SIM card that was automatically paused
	 * @param  {String} $0.iccid      ICCID of the SIM card
	 * @param  {Number} [$0.mbLimit]  New monthly data limit. Necessary if unpausing a SIM card
	 * @param  {String} [$0.product]  SIM cards for this product ID or slug
	 * @param  {String} $0.auth       Access Token
	 * @return {Promise}
	 */
	reactivateSIM({ iccid, mbLimit, product, auth, context }) {
		const uri = product ? `/v1/products/${product}/sims/${iccid}` : `/v1/sims/${iccid}`;
		const data = { mb_limit: mbLimit, action: 'reactivate' };
		return this.put(uri, data, auth, context);
	}

	/**
	 * Update SIM card data limit
	 * @param  {String} $0.iccid        ICCID of the SIM card
	 * @param  {Array}  $0.mbLimit     Data limit in megabyte for the SIM card
	 * @param  {String} [$0.product]  SIM cards for this product ID or slug
	 * @param  {String} $0.auth       Access Token
	 * @return {Promise}
	 */
	updateSIM({ iccid, mbLimit, product, auth, context }) {
		const uri = product ? `/v1/products/${product}/sims/${iccid}` : `/v1/sims/${iccid}`;
		const data = { mb_limit: mbLimit };
		return this.put(uri, data, auth, context);
	}

	/**
	 * Remove a SIM card from an account so it can be activated by a different account
	 * @param  {String} $0.iccid      ICCID of the SIM card
	 * @param  {String} [$0.product]  SIM cards for this product ID or slug
	 * @param  {String} $0.auth       Access Token
	 * @return {Promise}
	 */
	removeSIM({ iccid, product, auth, context }) {
		const uri = product ? `/v1/products/${product}/sims/${iccid}` : `/v1/sims/${iccid}`;
		return this.delete(uri, undefined, auth, context);
	}

	/**
	 * List valid build targets to be used for compiling
	 * @param  {Boolean} [$0.onlyFeatured=false] Only list featured build targets
	 * @param  {String} $0.auth       Access Token
	 * @return {Promise}
	 */
	listBuildTargets({ onlyFeatured, auth, context }) {
		let query;
		if (onlyFeatured !== undefined) {
			query = { featured: !!onlyFeatured };
		}
		return this.get('/v1/build_targets', auth, query, context);
	}

	/**
	 * List firmware libraries
	 * @param  {Number} $0.page Page index (default, first page)
	 * @param  {Number} $0.limit Number of items per page
	 * @param  {String} $0.filter Search term for the libraries
	 * @param  {String} $0.sort Ordering key for the library list
	 * @param  {Array<String>}  $0.architectures List of architectures to filter
	 * @param  {String} $0.category Category to filter
	 * @param  {String} $0.scope The library scope to list. Default is 'all'. Other values are
	 * - 'all' - list public libraries and my private libraries
	 * - 'public' - list only public libraries
	 * - 'private' - list only my private libraries
	 * - 'mine' - list my libraries (public and private)
	 * - 'official' - list only official libraries
	 * - 'verified' - list only verified libraries
	 * - 'featured' - list only featured libraries
	 * @param  {String} $0.excludeScopes  list of scopes to exclude
	 * @param  {String} $0.category Category to filter
	 * @param  {String} $0.auth Access Token
	 * @return {Promise}
	 */
	listLibraries({ page, limit, filter, sort, architectures, category, scope, excludeScopes, auth, context }) {
		return this.get('/v1/libraries', auth, {
			page,
			filter,
			limit,
			sort,
			architectures: this._asList(architectures),
			category,
			scope,
			excludeScopes: this._asList(excludeScopes)
		}, context);
	}

	_asList(value) {
		return (Array.isArray(value) ? value.join(',') : value);
	}

	/**
	 * Get firmware library details
	 * @param  {String} $0.name Name of the library to fetch
	 * @param  {String} $0.version Version of the library to fetch (default: latest)
	 * @param  {String} $0.auth Access Token
	 * @return {Promise}
	 */
	getLibrary({ name, version, auth, context }) {
		return this.get(`/v1/libraries/${name}`, auth, { version }, context);
	}

	/**
	 * Firmware library details for each version
	 * @param  {String} $0.name Name of the library to fetch
	 * @param  {Number} $0.page Page index (default, first page)
	 * @param  {Number} $0.limit Number of items per page
	 * @param  {String} $0.auth Access Token
	 * @return {Promise}
	 */
	getLibraryVersions({ name, page, limit, auth, context }) {
		return this.get(`/v1/libraries/${name}/versions`, auth, {
			page,
			limit
		}, context);
	}

	/**
	 * Contribute a new library version from a compressed archive
	 * @param  {String} $0.archive Compressed archive file containing the library sources
	 * @param  {String} $0.auth Access Token
	 * @return {Promise}
	 */
	contributeLibrary({ archive, auth, context }) {
		const files = {
			'archive.tar.gz': archive
		};

		return this.request({ uri: '/v1/libraries',
			files, auth, context, method: 'post' });
	}

	/**
	 * Publish the latest version of a library to the public
	 * @param  {String} $0.name Name of the library to publish
	 * @param  {String} $0.auth Access Token
	 * @return {Promise}
	 */
	publishLibrary({ name, auth, context }) {
		return this.request({ uri: `/v1/libraries/${name}`,
			auth, context, method: 'patch', data: { visibility: 'public' } });
	}

	/**
	 * Delete one version of a library or an entire private library
	 * @param  {String} $0.name Name of the library to remove
	 * @param  {String} $0.force Key to force deleting a public library
	 * @param  {String} $0.auth Access Token
	 * @return {Promise}
	 */
	deleteLibrary({ name, force, auth, context }) {
		return this.delete(`/v1/libraries/${name}`, { force }, auth, context);
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

	/**
	 * List OAuth client created by the account
	 * @param  {String} [$0.product] List clients for this product ID or slug
	 * @param  {String} $0.auth Access Token
	 * @return {Promise}
	 */
	listOAuthClients({ product, auth, context }) {
		const uri = product ? `/v1/products/${product}/clients` : '/v1/clients';
		return this.get(uri, auth, undefined, context);
	}

	/**
	 * Create an OAuth client
	 * @param  {String} $0.name               Name of the OAuth client
	 * @param  {String} $0.type               web, installed or web
	 * @param  {String} [$0.redirect_uri]     URL to redirect after OAuth flow. Only for type web.
	 * @param  {Object} [$0.scope]            Limits what the access tokens created by this client can do.
	 * @param  {String} [$0.product]          Create client for this product ID or slug
	 * @param  {String} $0.auth               Access Token
	 * @return {Promise}
	 */
	createOAuthClient({ name, type, redirect_uri, scope, product, auth, context }) {
		const uri = product ? `/v1/products/${product}/clients` : '/v1/clients';
		const data = { name, type, redirect_uri, scope };
		return this.post(uri, data, auth, context);
	}

	/**
	 * Update an OAuth client
	 * @param  {String} $0.clientId           The OAuth client to update
	 * @param  {String} [$0.name]             New Name of the OAuth client
	 * @param  {Object} [$0.scope]            New scope of the OAuth client
	 * @param  {String} [$0.product]          Update client linked to this product ID or slug
	 * @param  {String} $0.auth               Access Token
	 * @return {Promise}
	 */
	updateOAuthClient({ clientId, name, scope, product, auth, context }) {
		const uri = product ? `/v1/products/${product}/clients/${clientId}` : `/v1/clients/${clientId}`;
		const data = { name, scope };
		return this.put(uri, data, auth, context);
	}

	/**
	 * Delete an OAuth client
	 * @param  {String} $0.clientId           The OAuth client to update
	 * @param  {String} [$0.product]          OAuth client linked to this product ID or slug
	 * @param  {String} $0.auth               Access Token
	 * @return {Promise}
	 */
	deleteOAuthClient({ clientId, product, auth, context }) {
		const uri = product ? `/v1/products/${product}/clients/${clientId}` : `/v1/clients/${clientId}`;
		return this.delete(uri, undefined, auth, context);
	}

	/**
	 * List products the account has access to
	 * @param  {String} $0.auth Access Token
	 * @return {Promise}
	 */
	listProducts({ auth, context }) {
		return this.get('/v1/products', auth, undefined, context);
	}

	/**
	 * Get detailed information about a product
	 * @param  {String} $0.product  Product ID or slug
	 * @param  {String} $0.auth     Access token
	 * @return {Promise}
	 */
	getProduct({ product, auth, context }) {
		return this.get(`/v1/products/${product}`, auth, undefined, context);
	}

	/**
	 * List product firmware versions
	 * @param  {String} $0.product Firmware for this product ID or slug
	 * @param  {String} $0.auth Access Token
	 * @return {Promise}
	 */
	listProductFirmware({ product, auth, context }) {
		return this.get(`/v1/products/${product}/firmware`, auth, undefined, context);
	}

	/**
	 * List product firmware versions
	 * @param  {Object} $0.file    Path or Buffer of the new firmware file
	 * @param  {Number} $0.version Version number of new firmware
	 * @param  {String} $0.title   Short identifier for the new firmware
	 * @param  {String} [$0.description] Longer description for the new firmware
	 * @param  {String} $0.product Firmware for this product ID or slug
	 * @param  {String} $0.auth Access Token
	 * @return {Promise}
	 */
	uploadProductFirmware({ file, version, title, description, product, auth, context }) {
		return this.request({
			uri: `/v1/products/${product}/firmware`,
			method: 'post',
			files: {
				'firmware.bin': file
			},
			form: {
				version,
				title,
				description
			},
			context,
			auth
		});
	}

	/**
	 * Get information about a product firmware version
	 * @param  {Number} $0.version Version number of firmware
	 * @param  {String} $0.product Firmware for this product ID or slug
	 * @param  {String} $0.auth    Access token
	 * @return {Promise}
	 */
	getProductFirmware({ version, product, auth, context }) {
		return this.get(`/v1/products/${product}/firmware/${version}`, auth, undefined, context);
	}

	/**
	 * Update information for a product firmware version
	 * @param  {Number} $0.version Version number of new firmware
	 * @param  {String} [$0.title]   New title
	 * @param  {String} [$0.description] New description
	 * @param  {String} $0.product Firmware for this product ID or slug
	 * @param  {String} $0.auth Access Token
	 * @return {Promise}
	 */
	updateProductFirmware({ version, title, description, product, auth, context }) {
		const uri = `/v1/products/${product}/firmware/${version}`;
		return this.put(uri, { title, description }, auth, context);
	}

	/**
	 * Download a product firmware binary
	 * @param  {Number} $0.version Version number of new firmware
	 * @param  {String} $0.product Firmware for this product ID or slug
	 * @param  {String} $0.auth    Access Token
	 * @return {Request}
	 */
	downloadProductFirmware({ version, product, auth, context }) {
		const uri = `/v1/products/${product}/firmware/${version}/binary`;
		const req = request('get', uri);
		req.use(this.prefix);
		this.headers(req, auth);
		if (this.debug) {
			this.debug(req);
		}
		return req;
	}

	/**
	 * Release a product firmware version as the default version
	 * @param  {Number} $0.version Version number of new firmware
	 * @param  {String} $0.product Firmware for this product ID or slug
	 * @param  {String} $0.auth Access Token
	 * @return {Promise}
	 */
	releaseProductFirmware({ version, product, auth, context }) {
		const uri = `/v1/products/${product}/firmware/release`;
		return this.put(uri, { version }, auth, context);
	}

	/**
	 * List product team members
	 * @param  {String} $0.product Team for this product ID or slug
	 * @param  {String} $0.auth Access Token
	 * @return {Promise}
	 */
	listTeamMembers({ product, auth, context }) {
		return this.get(`/v1/products/${product}/team`, auth, undefined, context);
	}

	/**
	 * Invite Particle user to a product team
	 * @param  {String} $0.username  Username for the Particle account
	 * @param  {String} $0.product Team for this product ID or slug
	 * @param  {String} $0.auth Access Token
	 * @return {Promise}
	 */
	inviteTeamMember({ username, product, auth, context }) {
		return this.post(`/v1/products/${product}/team`, { username }, auth, context);
	}

	/**
	 * Remove Particle user to a product team
	 * @param  {String} $0.username  Username for the Particle account
	 * @param  {String} $0.product Team for this product ID or slug
	 * @param  {String} $0.auth Access Token
	 * @return {Promise}
	 */
	removeTeamMember({ username, product, auth, context }) {
		return this.delete(`/v1/products/${product}/team/${username}`, undefined, auth, context);
	}

	/**
	 * API URI to access a device
	 * @param  {String} $0.deviceId  Device ID to access
	 * @param  {String} [$0.product] Device only in this product ID or slug
	 * @private
	 * @returns {string}
	 */
	deviceUri({ deviceId, product }) {
		return product ? `/v1/products/${product}/devices/${deviceId}` : `/v1/devices/${deviceId}`;
	}

	get(uri, auth, query, context) {
		context = this._buildContext(context);
		return this.agent.get(uri, auth, query, context);
	}

	head(uri, auth, query, context) {
		context = this._buildContext(context);
		return this.agent.head(uri, auth, query, context);
	}

	post(uri, data, auth, context) {
		context = this._buildContext(context);
		return this.agent.post(uri, data, auth, context);
	}

	put(uri, data, auth, context) {
		context = this._buildContext(context);
		return this.agent.put(uri, data, auth, context);
	}

	delete(uri, data, auth, context) {
		context = this._buildContext(context);
		return this.agent.delete(uri, data, auth, context);
	}

	request(args) {
		args.context = this._buildContext(args.context);
		return this.agent.request(args);
	}

	client(options = {}) {
		return new Client(Object.assign({ api: this }, options));
	}
}

// Aliases for backwards compatibility
Particle.prototype.removeAccessToken = Particle.prototype.deleteAccessToken;

export default Particle;
