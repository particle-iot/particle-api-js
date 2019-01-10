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
 * `options` with key/value pairs for each option.
 */
class Particle {
	/**
	 * Contructor for the Cloud API wrapper.
	 *
	 * Create a new Particle object and call methods below on it.
	 *
	 * @param  {Object} options Options for this API call Options to be used for all requests (see [Defaults](../src/Defaults.js))
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
	 * @param  {Object} context       The invocation context, this takes precedence over the local context.
	 * @return {Object} The context to use.
	 * @private
	 */
	_buildContext(context) {
		return Object.assign(this.context, context);
	}

	/**
	 * Login to Particle Cloud using an existing Particle acccount.
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.username      Username for the Particle account
	 * @param  {String} options.password      Password for the Particle account
	 * @param  {Number} options.tokenDuration How long the access token should last in seconds
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
	 * If login failed with an 'mfa_required' error, this must be called with a valid OTP code to login
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.mfaToken Given as 'mfa_token' in the error body of `.login()`.
	 * @param  {String} options.otp      Current one-time-password generated from the authentication application
	 * @param  {Number} options.context  Request context
	 * @return {Promise}
	 */
	sendOtp({ mfaToken: mfa_token, otp, context }) {
		return this.request({ uri: '/oauth/token', form: {
			grant_type: 'urn:custom:mfa-otp',
			mfa_token,
			otp,
			client_id: this.clientId,
			client_secret: this.clientSecret
		}, method: 'post', context });
	}

	/**
	 * Enable MFA on the currently logged in user
	 * @param {Object} options	Options for this API call
	 * @param {Object} options.auth		access token
	 * @param {Object} options.context	Request context
	 * @return {Promise}
	 */
	enableMfa({ auth, context }) {
		return this.get('/v1/user/mfa-enable', auth, undefined, context);
	}

	/**
	 * Confirm MFA for the user. This must be called with current TOTP code, determined from the results of enableMfa(). You will be prompted to enter an OTP code every time you login after enrollment is confirmed.
	 * @param {Object} options	Options for this API call
	 * @param {Object} options.auth		access token
	 * @param {Object} options.mfaToken	Token given from previous step to
	 * @param {Object} options.otp		Current one-time-password generated from the authentication app
	 * @param {Object} options.context	Request context
	 * @return {Promise}
	 */
	confirmMfa({ auth, mfaToken: mfa_token, otp, context }) {
		return this.post('/v1/user/mfa-enable', { mfa_token, otp }, auth, context);
	}

	/**
	 * Disable MFA for the user.
	 * @param {Object} options	Options for this API call
	 * @param {Object} options.auth				access token
	 * @param {Object} options.currentPassword	User's current password
	 * @param {Object} options.context			Request context
	 * @return {Promise}
	 */
	disableMfa({ auth, currentPassword: current_password, context }) {
		return this.put('/v1/user/mfa-disable', { current_password }, auth, context);
	}

	/**
	 * Create Customer for Product.
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.username      Username for the Particle account
	 * @param  {String} options.password      Password for the Particle account
	 * @param  {String} options.product       List devices in this product ID or slug
	 * @return {Promise}
	 */
	createCustomer({ email, password, product, context }) {
		const uri =`/v1/products/${product}/customers`;
		return this.request({ uri: uri, form: {
			email,
			password,
			grant_type: 'client_credentials',
			client_id: this.clientId,
			client_secret: this.clientSecret
		}, method: 'post', context });
	}

	/**
	 * Login to Particle Cloud using an OAuth client.
	 * @param  {Object} options Options for this API call
	 * @param  {Object} options.context   Context information.
	 * @return {Promise}
	 */
	loginAsClientOwner({ context }) {
		return this.request({ uri: '/oauth/token', form: {
			grant_type: 'client_credentials',
			client_id: this.clientId,
			client_secret: this.clientSecret
		}, method: 'post', context });
	}

	/**
	 * Create a user account for the Particle Cloud
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.username Email of the new user
	 * @param  {String} options.password Password
	 * @param  {String} options.accountInfo Object that contains account information fields such as user real name, company name, business account flag etc
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
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.token the string token sent in the verification email
	 * @return {Promise}
	 */
	verifyUser({ token, context }) {
		return this.post('/v1/user/verify', {
			token
		}, undefined, context);
	}

	/**
	 * Send reset password email for a Particle Cloud user account
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.username Email of the user
	 * @return {Promise}
	 */
	resetPassword({ username, context }) {
		return this.post('/v1/user/password-reset', { username }, undefined, context);
	}

	/**
	 * Revoke an access token
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.username Username of the Particle cloud account that the token belongs to.
	 * @param  {String} options.password Password for the account
	 * @param  {String} options.token    Access token you wish to revoke
	 * @return {Promise}
	 */
	deleteAccessToken({ username, password, token, context }) {
		return this.delete(`/v1/access_tokens/${token}`, {
			access_token: token
		}, { username, password }, context);
	}

	/**
	 * Revoke the current session access token
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.auth         Access Token
	 * @return {Promise}
	 */
	deleteCurrentAccessToken({ auth, context }) {
		return this.delete('/v1/access_tokens/current', undefined, auth, context);
	}

	/**
	 * List all valid access tokens for a Particle Cloud account
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.username Username
	 * @param  {String} options.password Password
	 * @return {Promise}
	 */
	listAccessTokens({ username, password, context }) {
		return this.get('/v1/access_tokens', { username, password }, undefined, context);
	}

	/**
	 * Retrieves the information that is used to identify the current login for tracking.
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.auth      The access token
	 * @param  {Boolean} options.full      When true, retrieve all information for registering a user with the tracking API. When false,
	 *  retrieve only the unique tracking ID for the current login.
	 * @param  {Object} options.context   Context information.
	 * @returns {Promise<Object>} Resolve the tracking identify of the current login
	 */
	trackingIdentity({ auth, full = false, context } = {}) {
		return this.get('/v1/user/identify', auth, (full ? undefined : { tracking: 1 }), context);
	}

	/**
	 * List devices claimed to the account or product
	 * @param  {Object} options Options for this API call
	 * @param  {String} [options.deviceId]   (Product only) Filter results to devices with this ID (partial matching)
	 * @param  {String} [options.deviceName] (Product only) Filter results to devices with this name (partial matching)
	 * @param  {String} [options.sortAttr]   (Product only) The attribute by which to sort results. See API docs for options.
	 * @param  {String} [options.sortDir]    (Product only) The direction of sorting. See API docs for options.
	 * @param  {Number} [options.page]       (Product only) Current page of results
	 * @param  {Number} [options.perPage]    (Product only) Records per page
	 * @param  {String} [options.product]    List devices in this product ID or slug
	 * @param  {String} options.auth         Access Token
	 * @return {Promise}
	 */
	listDevices({ deviceId, deviceName, sortAttr, sortDir, page, perPage, product, auth, context }) {
		const uri = product ? `/v1/products/${product}/devices` : '/v1/devices';
		const query = product ? { deviceId, deviceName, sortAttr, sortDir, page, per_page: perPage } : undefined;
		return this.get(uri, auth, query, context);
	}

	/**
	 * Get detailed informationa about a device
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.deviceId  Device ID or Name
	 * @param  {String} [options.product] Device in this product ID or slug
	 * @param  {String} options.auth      Access token
	 * @return {Promise}
	 */
	getDevice({ deviceId, product, auth, context }) {
		const uri = this.deviceUri({ deviceId, product });
		return this.get(uri, auth, undefined, context);
	}

	/**
	 * Claim a device to the account. The device must be online and unclaimed.
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.deviceId Device ID
	 * @param  {String} options.auth     Access Token
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
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.deviceId Device ID
	 * @param  {String} options.product  Add to this product ID or slug
	 * @param  {String} options.auth     Access Token
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
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.deviceId Device ID or Name
	 * @param  {Boolean} [options.deny]  (Product only) Deny this quarantined device, instead of removing an already approved device
	 * @param  {String} options.product  Remove from this product ID or slug
	 * @param  {String} options.auth     Access Token
	 * @return {Promise}
	 */
	removeDevice({ deviceId, deny, product, auth, context }) {
		const uri = this.deviceUri({ deviceId, product });
		const data = product ? { deny } : undefined;
		return this.delete(uri, data, auth, context);
	}

	/**
	 * Unclaim a product device its the owner, but keep it in the product
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.deviceId Device ID or Name
	 * @param  {String} options.product  Remove from this product ID or slug
	 * @param  {String} options.auth     Access Token
	 * @return {Promise}
	 */
	removeDeviceOwner({ deviceId, deny, product, auth, context }) {
		const uri = `/v1/products/${product}/devices/${deviceId}/owner`;
		return this.delete(uri, undefined, auth, context);
	}

	/**
	 * Rename a device
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.deviceId Device ID or Name
	 * @param  {String} options.name     Desired Name
	 * @param  {String} [options.product] Rename device in this product ID or slug
	 * @param  {String} options.auth     Access Token
	 * @return {Promise}
	 */
	renameDevice({ deviceId, name, product, auth, context }) {
		return this.updateDevice({ deviceId, name, product, auth, context });
	}

	/**
	 * Instruct the device to turn on/off the LED in a rainbow pattern
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.deviceId Device ID or Name
	 * @param  {Boolean} options.signal   Signal on or off
	 * @param  {String} [options.product] Device in this product ID or slug
	 * @param  {String} options.auth     Access Token
	 * @return {Promise}
	 */
	signalDevice({ deviceId, signal, product, auth, context }) {
		return this.updateDevice({ deviceId, signal, product, auth, context });
	}

	/**
	 * Store some notes about device
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.deviceId  Device ID or Name
	 * @params {String} options.notes     Your notes about this device
	 * @param  {String} [options.product] Device in this product ID or slug
	 * @param  {String} options.auth      Access Token
	 * @return {Promise}
	 */
	setDeviceNotes({ deviceId, notes, product, auth, context }) {
		return this.updateDevice({ deviceId, notes, product, auth, context });
	}

	/**
	 * Mark device as being used in development of a product so it opts out of automatic firmware updates
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.deviceId      Device ID or Name
	 * @param  {Boolean} options.development  Set to true to mark as development, false to return to product fleet
	 * @param  {String} options.product       Device in this product ID or slug
	 * @param  {String} options.auth          Access Token
	 * @return {Promise}
	 */
	markAsDevelopmentDevice({ deviceId, development = true, product, auth, context }) {
		return this.updateDevice({ deviceId, development, product, auth, context });
	}

	/**
	 * Mark device as being used in development of a product so it opts out of automatic firmware updates
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.deviceId      Device ID or Name
	 * @params {Number} options.desiredFirmwareVersion Lock the product device to run this firmware version.
	 * @params {Boolean} [options.flash]      Immediately flash firmware indicated by desiredFirmwareVersion
	 * @param  {String} options.product       Device in this product ID or slug
	 * @param  {String} options.auth          Access Token
	 * @return {Promise}
	 */
	lockDeviceProductFirmware({ deviceId, desiredFirmwareVersion, flash, product, auth, context }) {
		return this.updateDevice({ deviceId, desiredFirmwareVersion, flash, product, auth, context });
	}

	/**
	 * Mark device as receiving automatic firmware updates
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.deviceId      Device ID or Name
	 * @param  {String} options.product       Device in this product ID or slug
	 * @param  {String} options.auth          Access Token
	 * @return {Promise}
	 */
	unlockDeviceProductFirmware({ deviceId, product, auth, context }) {
		return this.updateDevice({ deviceId, desiredFirmwareVersion: null, product, auth, context });
	}

	/**
	 * Update multiple device attributes at the same time
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.deviceId       Device ID or Name
	 * @param  {String} [options.name]         Desired Name
	 * @param  {Boolean} options.signal        Signal device on or off
	 * @params {String} [options.notes]        Your notes about this device
	 * @param  {Boolean} [options.development] (Product only) Set to true to mark as development, false to return to product fleet
	 * @params {Number} [options.desiredFirmwareVersion] (Product only) Lock the product device to run this firmware version.
	 *                                              Pass `null` to unlock firmware and go back to released firmware.
	 * @params {Boolean} [options.flash]       (Product only) Immediately flash firmware indicated by desiredFirmwareVersion
	 * @param  {String} [options.product]      Device in this product ID or slug
	 * @param  {String} options.auth           Access Token
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
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.productId Product ID where to create this device
	 * @param  {String} options.auth      Access Token
	 * @return {Promise}
	 */
	provisionDevice({ productId, auth, context }) {
		return this.post('/v1/devices', { product_id: productId }, auth, context);
	}

	/**
	 * Generate a claim code to use in the device claiming process.
	 * To generate a claim code for a product, the access token MUST belong to a
	 * customer of the product.
	 * @param  {Object} options Options for this API call
	 * @param  {String} [options.iccid] ICCID of the SIM card used in the Electron
	 * @param  {String} [options.product] Device in this product ID or slug
	 * @param  {String} options.auth  Access Token
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
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.deviceId Device ID or Name
	 * @param  {String} options.name     Variable name
	 * @param  {String} [options.product] Device in this product ID or slug
	 * @param  {String} options.auth     Access Token
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
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.deviceId      Device ID or Name
	 * @param  {String} options.product       Flash device in this product ID or slug
	 * @param  {Object} options.files         Object containing files to be compiled and flashed. Keys should be the filenames, including relative path, and the values should be a path or Buffer of the file contents in Node, or a File or Blob in the browser.
	 * @param  {String} [options.targetVersion=latest] System firmware version to compile against
	 * @param  {String} options.auth          String
	 * @return {Promise}
	 */
	flashDevice({ deviceId, product, files, targetVersion, auth, context }) {
		const uri = this.deviceUri({ deviceId, product });
		const form = {};
		if (targetVersion) {
			form.build_target_version = targetVersion;
		} else {
			form.latest = 'true';
		}
		return this.request({ uri, files, auth, form, context, method: 'put' });
	}

	/**
	 * DEPRECATED: Flash the Tinker application to a device. Instead compile and flash the Tinker source code.
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.deviceId Device ID or Name
	 * @param  {String} options.auth     Access Token
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
	 * @param  {Object} options Options for this API call
	 * @param  {Object} options.files         Object containing files to be compiled. Keys should be the filenames, including relative path, and the values should be a path or Buffer of the file contents in Node, or a File or Blob in the browser.
	 * @param  {Number} [options.platformId]    Platform id number of the device you are compiling for. Common values are 0=Core, 6=Photon, 10=Electron.
	 * @param  {String} [options.targetVersion=latest] System firmware version to compile against
	 * @param  {String} options.auth          Access Token
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
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.binaryId Binary ID received from a successful compile call
	 * @param  {String} options.auth     Access Token
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
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.deviceId  Device ID or Name
	 * @param  {(String|Buffer)} options.key       Public key contents
	 * @param  {String} [options.algorithm=rsa] Algorithm used to generate the public key. Valid values are `rsa` or `ecc`.
	 * @param  {String} options.auth      Access Token
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
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.deviceId Device ID or Name
	 * @param  {String} options.name     Function name
	 * @param  {String} options.argument Function argument
	 * @param  {String} [options.product] Device in this product ID or slug
	 * @param  {String} options.auth     Access Token
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
	 * @param  {Object} options Options for this API call
	 * @param  {String} [options.deviceId] Device ID or Name, or `mine` to indicate only your devices.
	 * @param  {String} [options.name]     Event Name
	 * @param  {String} [options.org]     Organization Slug
	 * @param  {String} [options.product] Events for this product ID or slug
	 * @param  {String} options.auth     Access Token
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
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.name      Event name
	 * @param  {String} options.data      Event data
	 * @param  {Boolean} options.isPrivate Should the event be publicly available?
	 * @param  {String} [options.product]  Event for this product ID or slug
	 * @param  {String} options.auth      Access Token
	 * @return {Promise}
	 */
	publishEvent({ name, data, isPrivate, product, auth, context }) {
		const uri = product ? `/v1/products/${product}/events` : '/v1/devices/events';
		const postData = { name, data, private: isPrivate };
		return this.post(uri, postData, auth, context);
	}

	/**
	 * Create a webhook
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.deviceId           Trigger webhook only for this device ID or Name
	 * @param  {String} options.name               Webhook name
	 * @param  {String} options.url                URL the webhook should hit
	 * @param  {String} [options.requestType=POST]        HTTP method to use
	 * @param  {Object} [options.headers]            Additional headers to add to the webhook
	 * @param  {Object} [options.json]               JSON data
	 * @param  {Object} [options.query]              Query string data
	 * @param  {String} [options.body]               Custom webhook request body
	 * @param  {Object} [options.responseTemplate]   Webhook response template
	 * @param  {Object} [options.responseTopic]      Webhook response topic
	 * @param  {Boolean} [options.rejectUnauthorized] Reject invalid HTTPS certificates
	 * @params {Boolean} [options.noDefaults]        Don't include default event data in the webhook request
	 * @param  {Object} [options.webhookAuth]        HTTP Basic Auth information
	 * @param  {Object} [options.form]               Form data
	 * @param  {String} [options.product]          Webhook for this product ID or slug
	 * @param  {String} options.auth               Access Token
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
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.hookId Webhook ID
	 * @param  {String} [options.product]          Webhook for this product ID or slug
	 * @param  {String} options.auth   Access Token
	 * @return {Promise}
	 */
	deleteWebhook({ hookId, product, auth, context }) {
		const uri = product ? `/v1/products/${product}/webhooks/${hookId}` : `/v1/webhooks/${hookId}`;
		return this.delete(uri, undefined, auth, context);
	}

	/**
	 * List all webhooks owned by the account or product
	 * @param  {Object} options Options for this API call
	 * @param  {String} [options.product]          Webhooks for this product ID or slug
	 * @param  {String} options.auth Access Token
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
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.integrationType  The kind of external integration. One of Webhook, AzureIotHub, GoogleCloudPubSub, GoogleMaps
	 * @param  {String} options.event            Event that triggers the integration
	 * @params {Object} options.settings         Settings specific to that integration type
	 * @param  {String} [options.deviceId]       Trigger integration only for this device ID or Name
	 * @param  {String} [options.product]        Integration for this product ID or slug
	 * @param  {String} options.auth             Access Token
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
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.integrationId    The integration to edit
	 * @param  {String} [options.event]          Change the event that triggers the integration
	 * @params {Object} [options.settings]       Change the settings specific to that integration type
	 * @param  {String} [options.deviceId]       Trigger integration only for this device ID or Name
	 * @param  {String} [options.product]        Integration for this product ID or slug
	 * @param  {String} options.auth             Access Token
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
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.integrationId    The integration to remove
	 * @param  {String} [options.product]        Integration for this product ID or slug
	 * @param  {String} options.auth             Access Token
	 * @return {Promise}
	 */
	deleteIntegration({ integrationId, product, auth, context }) {
		const uri = product ? `/v1/products/${product}/integrations/${integrationId}` : `/v1/integrations/${integrationId}`;
		return this.delete(uri, undefined, auth, context);
	}

	/**
	 * List all integrations owned by the account or product
	 * @param  {Object} options Options for this API call
	 * @param  {String} [options.product]        Integrations for this product ID or slug
	 * @param  {String} options.auth Access Token
	 * @return {Promise}
	 */
	listIntegrations({ product, auth, context }) {
		const uri = product ? `/v1/products/${product}/integrations` : '/v1/integrations';
		return this.get(uri, auth, undefined, context);
	}

	/**
	 * Get details about the current user
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.auth Access Token
	 * @return {Promise}
	 */
	getUserInfo({ auth, context }) {
		return this.get('/v1/user', auth, undefined, context);
	}

	/**
	 * Set details on the current user
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.auth Access Token
	 * @param  {String} options.accountInfo Set user's extended info fields (name, business account, company name, etc)
	 * @return {Promise}
	 */
	setUserInfo({ accountInfo, auth, context }) {
		const bodyObj = {
			account_info: accountInfo
		};

		return this.put('/v1/user', bodyObj, auth, context);
	}

	/**
	 * Change username (i.e, email)
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.auth Access Token
	 * @param  {String} options.currentPassword Current password
	 * @param  {String} options.username New email
	 * @return {Promise}
	 */
	changeUsername({ currentPassword, username, auth, context }) {
		const bodyObj = {
			current_password: currentPassword,
			username
		};

		return this.put('/v1/user', bodyObj, auth, context);
	}

	/**
	 * Change user's password
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.auth Access Token
	 * @param  {String} options.currentPassword Current password
	 * @param  {String} options.password New password
	 * @return {Promise}
	 */
	changeUserPassword({ currentPassword, password, auth, context }) {
		const bodyObj = {
			current_password: currentPassword,
			password
		};

		return this.put('/v1/user', bodyObj, auth, context);
	}

	/**
	 * List SIM cards owned by a user or product
	 * @param  {Object} options Options for this API call
	 * @param  {String} [options.iccid]    (Product only) Filter to SIM cards matching this ICCID
	 * @param  {String} [options.deviceId] (Product only) Filter to SIM cards matching this device ID
	 * @param  {String} [options.deviceName] (Product only) Filter to SIM cards matching this device name
	 * @param  {Number} [options.page]     (Product only) Current page of results
	 * @param  {Number} [options.perPage]  (Product only) Records per page
	 * @param  {String} [options.product]  SIM cards for this product ID or slug
	 * @param  {String} options.auth       Access Token
	 * @return {Promise}
	 */
	listSIMs({ iccid, deviceId, deviceName, page, perPage, product, auth, context }) {
		const uri = product ? `/v1/products/${product}/sims` : '/v1/sims';
		const query = product ? { iccid, deviceId, deviceName, page, per_page: perPage } : undefined;
		return this.get(uri, auth, query, context);
	}

	/**
	 * Get data usage for one SIM card for the current billing period
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.iccid      ICCID of the SIM card
	 * @param  {String} [options.product]  SIM card for this product ID or slug
	 * @param  {String} options.auth       Access Token
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
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.product  SIM cards for this product ID or slug
	 * @param  {String} options.auth     Access Token
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
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.iccid        ICCID of the SIM card
	 * @param  {Array<String>} options.iccids (Product only) ICCID of multiple SIM cards to import
	 * @param  {String} options.country The ISO country code for the SIM cards
	 * @param  {String} [options.product]  SIM cards for this product ID or slug
	 * @param  {String} options.auth       Access Token
	 * @return {Promise}
	 */
	activateSIM({ iccid, iccids, country, promoCode, product, auth, context }) {
		// promoCode is deprecated
		iccids = iccids || [iccid];
		const uri = product ? `/v1/products/${product}/sims` : `/v1/sims/${iccid}`;
		const data = product ?
			{ sims: iccids, country } :
			{ country, promoCode, action: 'activate' };
		const method = product ? 'post' : 'put';

		return this.request({ uri, method, data, auth, context });
	}

	/**
	 * Deactivate a SIM card so it doesn't incur data usage in future months.
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.iccid      ICCID of the SIM card
	 * @param  {String} [options.product]  SIM cards for this product ID or slug
	 * @param  {String} options.auth       Access Token
	 * @return {Promise}
	 */
	deactivateSIM({ iccid, product, auth, context }) {
		const uri = product ? `/v1/products/${product}/sims/${iccid}` : `/v1/sims/${iccid}`;
		const data = { action: 'deactivate' };
		return this.put(uri, data, auth, context);
	}

	/**
	 * Reactivate a SIM card the was deactivated or unpause a SIM card that was automatically paused
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.iccid      ICCID of the SIM card
	 * @param  {Number} [options.mbLimit]  New monthly data limit. Necessary if unpausing a SIM card
	 * @param  {String} [options.product]  SIM cards for this product ID or slug
	 * @param  {String} options.auth       Access Token
	 * @return {Promise}
	 */
	reactivateSIM({ iccid, mbLimit, product, auth, context }) {
		const uri = product ? `/v1/products/${product}/sims/${iccid}` : `/v1/sims/${iccid}`;
		const data = { mb_limit: mbLimit, action: 'reactivate' };
		return this.put(uri, data, auth, context);
	}

	/**
	 * Update SIM card data limit
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.iccid        ICCID of the SIM card
	 * @param  {Array}  options.mbLimit     Data limit in megabyte for the SIM card
	 * @param  {String} [options.product]  SIM cards for this product ID or slug
	 * @param  {String} options.auth       Access Token
	 * @return {Promise}
	 */
	updateSIM({ iccid, mbLimit, product, auth, context }) {
		const uri = product ? `/v1/products/${product}/sims/${iccid}` : `/v1/sims/${iccid}`;
		const data = { mb_limit: mbLimit };
		return this.put(uri, data, auth, context);
	}

	/**
	 * Remove a SIM card from an account so it can be activated by a different account
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.iccid      ICCID of the SIM card
	 * @param  {String} [options.product]  SIM cards for this product ID or slug
	 * @param  {String} options.auth       Access Token
	 * @return {Promise}
	 */
	removeSIM({ iccid, product, auth, context }) {
		const uri = product ? `/v1/products/${product}/sims/${iccid}` : `/v1/sims/${iccid}`;
		return this.delete(uri, undefined, auth, context);
	}

	/**
	 * List valid build targets to be used for compiling
	 * @param  {Object} options Options for this API call
	 * @param  {Boolean} [options.onlyFeatured=false] Only list featured build targets
	 * @param  {String} options.auth       Access Token
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
	 * @param  {Object} options Options for this API call
	 * @param  {Number} options.page Page index (default, first page)
	 * @param  {Number} options.limit Number of items per page
	 * @param  {String} options.filter Search term for the libraries
	 * @param  {String} options.sort Ordering key for the library list
	 * @param  {Array<String>}  options.architectures List of architectures to filter
	 * @param  {String} options.category Category to filter
	 * @param  {String} options.scope The library scope to list. Default is 'all'. Other values are
	 * - 'all' - list public libraries and my private libraries
	 * - 'public' - list only public libraries
	 * - 'private' - list only my private libraries
	 * - 'mine' - list my libraries (public and private)
	 * - 'official' - list only official libraries
	 * - 'verified' - list only verified libraries
	 * - 'featured' - list only featured libraries
	 * @param  {String} options.excludeScopes  list of scopes to exclude
	 * @param  {String} options.category Category to filter
	 * @param  {String} options.auth Access Token
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
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.name Name of the library to fetch
	 * @param  {String} options.version Version of the library to fetch (default: latest)
	 * @param  {String} options.auth Access Token
	 * @return {Promise}
	 */
	getLibrary({ name, version, auth, context }) {
		return this.get(`/v1/libraries/${name}`, auth, { version }, context);
	}

	/**
	 * Firmware library details for each version
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.name Name of the library to fetch
	 * @param  {Number} options.page Page index (default, first page)
	 * @param  {Number} options.limit Number of items per page
	 * @param  {String} options.auth Access Token
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
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.archive Compressed archive file containing the library sources
	 *                                  Either a path or Buffer of the file contents in Node, or a File or Blob in the browser.
	 * @param  {String} options.auth Access Token
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
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.name Name of the library to publish
	 * @param  {String} options.auth Access Token
	 * @return {Promise}
	 */
	publishLibrary({ name, auth, context }) {
		return this.request({ uri: `/v1/libraries/${name}`,
			auth, context, method: 'patch', data: { visibility: 'public' } });
	}

	/**
	 * Delete one version of a library or an entire private library
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.name Name of the library to remove
	 * @param  {String} options.force Key to force deleting a public library
	 * @param  {String} options.auth Access Token
	 * @return {Promise}
	 */
	deleteLibrary({ name, force, auth, context }) {
		return this.delete(`/v1/libraries/${name}`, { force }, auth, context);
	}

	/**
	 * Download an external file that may not be on the API
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.url URL of the file.
	 * @return {Promise} Resolves to a buffer with the file data
	 */
	downloadFile({ url }) {
		let req = request.get(url);
		// Different API in Node and browser
		if (!request.getXHR) {
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
	 * @param  {Object} options Options for this API call
	 * @param  {String} [options.product] List clients for this product ID or slug
	 * @param  {String} options.auth Access Token
	 * @return {Promise}
	 */
	listOAuthClients({ product, auth, context }) {
		const uri = product ? `/v1/products/${product}/clients` : '/v1/clients';
		return this.get(uri, auth, undefined, context);
	}

	/**
	 * Create an OAuth client
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.name               Name of the OAuth client
	 * @param  {String} options.type               web, installed or web
	 * @param  {String} [options.redirect_uri]     URL to redirect after OAuth flow. Only for type web.
	 * @param  {Object} [options.scope]            Limits what the access tokens created by this client can do.
	 * @param  {String} [options.product]          Create client for this product ID or slug
	 * @param  {String} options.auth               Access Token
	 * @return {Promise}
	 */
	createOAuthClient({ name, type, redirect_uri, scope, product, auth, context }) {
		const uri = product ? `/v1/products/${product}/clients` : '/v1/clients';
		const data = { name, type, redirect_uri, scope };
		return this.post(uri, data, auth, context);
	}

	/**
	 * Update an OAuth client
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.clientId           The OAuth client to update
	 * @param  {String} [options.name]             New Name of the OAuth client
	 * @param  {Object} [options.scope]            New scope of the OAuth client
	 * @param  {String} [options.product]          Update client linked to this product ID or slug
	 * @param  {String} options.auth               Access Token
	 * @return {Promise}
	 */
	updateOAuthClient({ clientId, name, scope, product, auth, context }) {
		const uri = product ? `/v1/products/${product}/clients/${clientId}` : `/v1/clients/${clientId}`;
		const data = { name, scope };
		return this.put(uri, data, auth, context);
	}

	/**
	 * Delete an OAuth client
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.clientId           The OAuth client to update
	 * @param  {String} [options.product]          OAuth client linked to this product ID or slug
	 * @param  {String} options.auth               Access Token
	 * @return {Promise}
	 */
	deleteOAuthClient({ clientId, product, auth, context }) {
		const uri = product ? `/v1/products/${product}/clients/${clientId}` : `/v1/clients/${clientId}`;
		return this.delete(uri, undefined, auth, context);
	}

	/**
	 * List products the account has access to
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.auth Access Token
	 * @return {Promise}
	 */
	listProducts({ auth, context }) {
		return this.get('/v1/products', auth, undefined, context);
	}

	/**
	 * Get detailed information about a product
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.product  Product ID or slug
	 * @param  {String} options.auth     Access token
	 * @return {Promise}
	 */
	getProduct({ product, auth, context }) {
		return this.get(`/v1/products/${product}`, auth, undefined, context);
	}

	/**
	 * List product firmware versions
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.product Firmware for this product ID or slug
	 * @param  {String} options.auth Access Token
	 * @return {Promise}
	 */
	listProductFirmware({ product, auth, context }) {
		return this.get(`/v1/products/${product}/firmware`, auth, undefined, context);
	}

	/**
	 * List product firmware versions
	 * @param  {Object} options Options for this API call
	 * @param  {Object} options.file    Path or Buffer of the new firmware file
	 *                                  Either a path or Buffer of the file contents in Node, or a File or Blob in the browser.
	 * @param  {Number} options.version Version number of new firmware
	 * @param  {String} options.title   Short identifier for the new firmware
	 * @param  {String} [options.description] Longer description for the new firmware
	 * @param  {String} options.product Firmware for this product ID or slug
	 * @param  {String} options.auth Access Token
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
	 * @param  {Object} options Options for this API call
	 * @param  {Number} options.version Version number of firmware
	 * @param  {String} options.product Firmware for this product ID or slug
	 * @param  {String} options.auth    Access token
	 * @return {Promise}
	 */
	getProductFirmware({ version, product, auth, context }) {
		return this.get(`/v1/products/${product}/firmware/${version}`, auth, undefined, context);
	}

	/**
	 * Update information for a product firmware version
	 * @param  {Object} options Options for this API call
	 * @param  {Number} options.version Version number of new firmware
	 * @param  {String} [options.title]   New title
	 * @param  {String} [options.description] New description
	 * @param  {String} options.product Firmware for this product ID or slug
	 * @param  {String} options.auth Access Token
	 * @return {Promise}
	 */
	updateProductFirmware({ version, title, description, product, auth, context }) {
		const uri = `/v1/products/${product}/firmware/${version}`;
		return this.put(uri, { title, description }, auth, context);
	}

	/**
	 * Download a product firmware binary
	 * @param  {Object} options Options for this API call
	 * @param  {Number} options.version Version number of new firmware
	 * @param  {String} options.product Firmware for this product ID or slug
	 * @param  {String} options.auth    Access Token
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
	 * @param  {Object} options Options for this API call
	 * @param  {Number} options.version Version number of new firmware
	 * @param  {String} options.product Firmware for this product ID or slug
	 * @param  {String} options.auth Access Token
	 * @return {Promise}
	 */
	releaseProductFirmware({ version, product, auth, context }) {
		const uri = `/v1/products/${product}/firmware/release`;
		return this.put(uri, { version }, auth, context);
	}

	/**
	 * List product team members
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.product Team for this product ID or slug
	 * @param  {String} options.auth Access Token
	 * @return {Promise}
	 */
	listTeamMembers({ product, auth, context }) {
		return this.get(`/v1/products/${product}/team`, auth, undefined, context);
	}

	/**
	 * Invite Particle user to a product team
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.username  Username for the Particle account
	 * @param  {String} options.product Team for this product ID or slug
	 * @param  {String} options.auth Access Token
	 * @return {Promise}
	 */
	inviteTeamMember({ username, product, auth, context }) {
		return this.post(`/v1/products/${product}/team`, { username }, auth, context);
	}

	/**
	 * Remove Particle user to a product team
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.username  Username for the Particle account
	 * @param  {String} options.product Team for this product ID or slug
	 * @param  {String} options.auth Access Token
	 * @return {Promise}
	 */
	removeTeamMember({ username, product, auth, context }) {
		return this.delete(`/v1/products/${product}/team/${username}`, undefined, auth, context);
	}

	/**
	 * Fetch details about a serial number
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.serialNumber The serial number printed on the barcode of the device packaging
	 * @param  {String} options.auth Access Token
	 * @return {Promise}
	 */
	lookupSerialNumber({ serialNumber, auth, context }) {
		return this.get(`/v1/serial_numbers/${serialNumber}`, auth, undefined, context);
	}


	/**
	 * API URI to access a device
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.deviceId  Device ID to access
	 * @param  {String} [options.product] Device only in this product ID or slug
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
