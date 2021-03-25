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
	constructor(options = {}){
		// todo - this seems a bit dangerous - would be better to put all options/context in a contained object
		Object.assign(this, Defaults, options);
		this.context = {};
		this.agent = new Agent(this.baseUrl);
	}

	_isValidContext(name, context){
		return (name==='tool' || name==='project') && context!==undefined;
	}

	setContext(name, context){
		if (context!==undefined){
			if (this._isValidContext(name, context)){
				this.context[name] = context;
			} else {
				throw Error('uknown context name or undefined context: '+name);
			}
		}
	}

	/**
	 * Builds the final context from the context parameter and the context items in the api.
	 * @param  {Object} context       The invocation context, this takes precedence over the local context.
	 * @returns {Object} The context to use.
	 * @private
	 */
	_buildContext(context){
		return Object.assign(this.context, context);
	}

	/**
	 * Login to Particle Cloud using an existing Particle acccount.
	 * @param  {Object} options                Options for this API call
	 * @param  {String} options.username       Username for the Particle account
	 * @param  {String} options.password       Password for the Particle account
	 * @param  {Number} options.tokenDuration  How long the access token should last in seconds
	 * @param  {Object} [options.headers]      Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param  {Number} [options.context]      Request context
	 * @returns {Promise} A promise
	 */
	login({ username, password, tokenDuration = this.tokenDuration, headers, context }){
		return this.request({
			uri: '/oauth/token',
			method: 'post',
			headers,
			form: {
				username,
				password,
				grant_type: 'password',
				client_id: this.clientId,
				client_secret: this.clientSecret,
				expires_in: tokenDuration
			},
			context
		});
	}

	/**
	 * If login failed with an 'mfa_required' error, this must be called with a valid OTP code to login
	 * @param  {Object} options            Options for this API call
	 * @param  {String} options.mfaToken   Given as 'mfa_token' in the error body of `.login()`.
	 * @param  {String} options.otp        Current one-time-password generated from the authentication application
	 * @param  {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param  {Number} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	sendOtp({ mfaToken, otp, headers, context }){
		return this.request({
			uri: '/oauth/token',
			method: 'post',
			headers,
			form: {
				grant_type: 'urn:custom:mfa-otp',
				mfa_token: mfaToken,
				otp,
				client_id: this.clientId,
				client_secret: this.clientSecret
			},
			context
		});
	}

	/**
	 * Enable MFA on the currently logged in user
	 * @param {Object} options             Options for this API call
	 * @param {Object} options.auth        Access token
	 * @param  {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]   Request context
	 * @returns {Promise} A promise
	 */
	enableMfa({ auth, headers, context }){
		return this.get({ uri: '/v1/user/mfa-enable', auth, headers, context });
	}

	/**
	 * Confirm MFA for the user. This must be called with current TOTP code, determined from the results of enableMfa(). You will be prompted to enter an OTP code every time you login after enrollment is confirmed.
	 * @param {Object} options            Options for this API call
	 * @param {Object} options.auth       Access token
	 * @param {Object} options.mfaToken   Token given from previous step to
	 * @param {Object} options.otp        Current one-time-password generated from the authentication app
	 * @param {Boolean} options.invalidateTokens Should all tokens be invalidated
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	confirmMfa({ mfaToken, otp, invalidateTokens = false, auth, headers, context }){
		let data =  { mfa_token: mfaToken, otp };

		if (invalidateTokens) {
			data.invalidate_tokens = true;
		}

		return this.post({
			uri: '/v1/user/mfa-enable',
			auth,
			headers,
			data,
			context
		});
	}

	/**
	 * Disable MFA for the user.
	 * @param {Object} options                  Options for this API call
	 * @param {Object} options.auth             Access token
	 * @param {Object} options.currentPassword  User's current password
	 * @param {Object} [options.headers]        Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]        Request context
	 * @returns {Promise} A promise
	 */
	disableMfa({ currentPassword, auth, headers, context }){
		return this.put({
			uri: '/v1/user/mfa-disable',
			auth,
			headers,
			data: { current_password: currentPassword },
			context
		});
	}

	/**
	 * Create Customer for Product.
	 * @param {Object} options            Options for this API call
	 * @param {String} options.email      Username for the Particle account
	 * @param {String} options.password   Password for the Particle account
	 * @param {String} options.product    Create the customer in this product ID or slug
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	createCustomer({ email, password, product, headers, context }){
		return this.request({
			uri: `/v1/products/${product}/customers`,
			method: 'post',
			headers,
			form: {
				email,
				password,
				grant_type: 'client_credentials',
				client_id: this.clientId,
				client_secret: this.clientSecret
			},
			context
		});
	}

	/**
	 * Login to Particle Cloud using an OAuth client.
	 * @param {Object} options                Options for this API call
	 * @param {Number} options.tokenDuration  How long the access token should last in seconds
	 * @param {Object} [options.headers]      Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]      Request context
	 * @returns {Promise} A promise
	 */
	loginAsClientOwner({ tokenDuration = this.tokenDuration, headers, context }){
		return this.request({
			uri: '/oauth/token',
			method: 'post',
			headers,
			form: {
				grant_type: 'client_credentials',
				client_id: this.clientId,
				client_secret: this.clientSecret,
				expires_in: tokenDuration
			},
			context
		});
	}

	/**
	 * Create a user account for the Particle Cloud
	 * @param {Object} options              Options for this API call
	 * @param {String} options.username     Email of the new user
	 * @param {String} options.password     Password
	 * @param {String} options.accountInfo  Object that contains account information fields such as user real name, company name, business account flag etc
	 * @param {Object} [options.headers]    Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]    Request context
	 * @returns {Promise} A promise
	 */
	createUser({ username, password, accountInfo, headers, context }){
		return this.post({
			uri: '/v1/users',
			headers,
			data: {
				username,
				password,
				account_info : accountInfo
			},
			context
		});
	}

	/**
	 * Verify new user account via verification email
	 * @param {Object} options            Options for this API call
	 * @param {String} options.token      The string token sent in the verification email
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	verifyUser({ token, headers, context }){
		return this.post({
			uri: '/v1/user/verify',
			headers,
			data: { token },
			context
		});
	}

	/**
	 * Send reset password email for a Particle Cloud user account
	 * @param {Object} options            Options for this API call
	 * @param {String} options.username   Email of the user
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	resetPassword({ username, headers, context }){
		return this.post({
			uri: '/v1/user/password-reset',
			headers,
			data: { username },
			context
		});
	}

	/**
	 * Revoke an access token
	 * @param {Object} options            Options for this API call
	 * @param {String} options.username   Username of the Particle cloud account that the token belongs to.
	 * @param {String} options.password   Password for the account
	 * @param {String} options.token      Access token you wish to revoke
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	deleteAccessToken({ username, password, token, headers, context }){
		return this.delete({
			uri: `/v1/access_tokens/${token}`,
			auth: { username, password },
			headers,
			data: { access_token: token },
			context
		});
	}

	/**
	 * Revoke the current session access token
	 * @param {Object} options            Options for this API call
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	deleteCurrentAccessToken({ auth, headers, context }){
		return this.delete({
			uri: '/v1/access_tokens/current',
			auth,
			headers,
			context
		});
	}

	/**
	 * Revoke all active access tokens
	 * @param {Object} options            Options for this API call
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	deleteActiveAccessTokens({ auth, headers, context }){
		return this.delete({
			uri: '/v1/access_tokens',
			auth,
			headers,
			context
		});
	}

	/**
	 * Delete the current user
	 * @param {Object} options            Options for this API call
	 * @param {String} options.auth       Access Token
	 * @param {String} options.password   Password
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	deleteUser({ auth, password, headers, context }){
		return this.delete({
			uri: '/v1/user',
			data: { password },
			auth,
			headers,
			context
		});
	}

	/**
	 * List all valid access tokens for a Particle Cloud account
	 * @param {Object} options            Options for this API call
	 * @param {String} options.username   Username
	 * @param {String} options.password   Password
	 * @param {String} options.otp        Current one-time-password generated from the authentication application
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	listAccessTokens({ username, password, otp, headers, context }){
		return this.get({
			uri: '/v1/access_tokens',
			auth: { username, password },
			query: otp ? { otp } : undefined,
			headers,
			context
		});
	}

	/**
	 * Retrieves the information that is used to identify the current login for tracking.
	 * @param {Object} options            Options for this API call
	 * @param {String} options.auth       The access token
	 * @param {Boolean} options.full      When true, retrieve all information for registering a user with the tracking API. When false,
	 *                                    retrieve only the unique tracking ID for the current login.
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise<Object>} Resolve the tracking identify of the current login
	 */
	trackingIdentity({ full = false, auth, headers, context } = {}){
		return this.get({
			uri: '/v1/user/identify',
			auth,
			headers,
			query: (full ? undefined : { tracking: 1 }),
			context
		});
	}

	/**
	 * List devices claimed to the account or product
	 * @param {Object} options                   Options for this API call
	 * @param {String} [options.deviceId]        (Product only) Filter results to devices with this ID (partial matching)
	 * @param {String} [options.deviceName]      (Product only) Filter results to devices with this name (partial matching)
	 * @param {Array.<string>} [options.groups]  (Product only) A list of full group names to filter results to devices belonging to these groups only.
	 * @param {String} [options.sortAttr]        (Product only) The attribute by which to sort results. See API docs for options.
	 * @param {String} [options.sortDir]         (Product only) The direction of sorting. See API docs for options.
	 * @param {Number} [options.page]            (Product only) Current page of results
	 * @param {Number} [options.perPage]         (Product only) Records per page
	 * @param {String} [options.product]         List devices in this product ID or slug
	 * @param {String} options.auth              Access Token
	 * @param {Object} [options.headers]         Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]         Request context
	 * @returns {Promise} A promise
	 */
	listDevices({ deviceId, deviceName, groups, sortAttr, sortDir, page, perPage, product, auth, headers, context }){
		let uri, query;

		if (product){
			uri = `/v1/products/${product}/devices`;
			groups = Array.isArray(groups) ? groups.join(',') : undefined;
			query = { deviceId, deviceName, groups, sortAttr, sortDir, page, per_page: perPage };
		} else {
			uri = '/v1/devices';
		}

		return this.get({ uri, auth, headers, query, context });
	}

	/**
	 * Get detailed informationa about a device
	 * @param {Object} options            Options for this API call
	 * @param {String} options.deviceId   Device ID or Name
	 * @param {String} [options.product]  Device in this product ID or slug
	 * @param {String} options.auth       Access token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	getDevice({ deviceId, product, auth, headers, context }){
		const uri = this.deviceUri({ deviceId, product });
		return this.get({ uri, auth, headers, context });
	}

	/**
	 * Claim a device to the account. The device must be online and unclaimed.
	 * @param {Object} options            Options for this API call
	 * @param {String} options.deviceId   Device ID
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	claimDevice({ deviceId, requestTransfer, auth, headers, context }){
		return this.post({
			uri: '/v1/devices',
			auth,
			headers,
			data: {
				id: deviceId,
				request_transfer: !!requestTransfer
			},
			context
		});
	}

	/**
	 * Add a device to a product or move device out of quarantine.
	 * @param {Object} options            Options for this API call
	 * @param {String} options.deviceId   Device ID
	 * @param {Object} options.file       A file that contains a single-column list of device IDs, device serial numbers, device IMEIs, or devie ICCIDs.
	 *                                    Node: Either a path or Buffer. Browser: a File or Blob.
	 * @param {String} options.product    Add to this product ID or slug
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	addDeviceToProduct({ deviceId, product, file, auth, headers, context }){
		let files, data;

		if (file){
			files = { file };
		} else if (deviceId){
			data = { id: deviceId };
		}

		return this.request({
			uri: `/v1/products/${product}/devices`,
			method: 'post',
			headers,
			data,
			files,
			auth,
			context
		});
	}

	/**
	 * Unclaim / Remove a device from your account or product, or deny quarantine
	 * @param {Object} options            Options for this API call
	 * @param {String} options.deviceId   Device ID or Name
	 * @param {Boolean} [options.deny]    (Product only) Deny this quarantined device, instead of removing an already approved device
	 * @param {String} options.product    Remove from this product ID or slug
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	removeDevice({ deviceId, deny, product, auth, headers, context }){
		const uri = this.deviceUri({ deviceId, product });
		const data = product ? { deny } : undefined;
		return this.delete({ uri, data, auth, headers, context });
	}

	/**
	 * Unclaim a product device its the owner, but keep it in the product
	 * @param {Object} options            Options for this API call
	 * @param {String} options.deviceId   Device ID or Name
	 * @param {String} options.product    Remove from this product ID or slug
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	removeDeviceOwner({ deviceId, product, auth, headers, context }){
		const uri = `/v1/products/${product}/devices/${deviceId}/owner`;
		return this.delete({ uri, auth, headers, context });
	}

	/**
	 * Rename a device
	 * @param {Object} options            Options for this API call
	 * @param {String} options.deviceId   Device ID or Name
	 * @param {String} options.name       Desired Name
	 * @param {String} [options.product]  Rename device in this product ID or slug
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	renameDevice({ deviceId, name, product, auth, headers, context }){
		return this.updateDevice({ deviceId, name, product, auth, headers, context });
	}

	/**
	 * Instruct the device to turn on/off the LED in a rainbow pattern
	 * @param {Object} options            Options for this API call
	 * @param {String} options.deviceId   Device ID or Name
	 * @param {Boolean} options.signal    Signal on or off
	 * @param {String} [options.product]  Device in this product ID or slug
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	signalDevice({ deviceId, signal, product, auth, headers, context }){
		return this.updateDevice({ deviceId, signal, product, auth, headers, context });
	}

	/**
	 * Store some notes about device
	 * @param {Object} options            Options for this API call
	 * @param {String} options.deviceId   Device ID or Name
	 * @param {String} options.notes      Your notes about this device
	 * @param {String} [options.product]  Device in this product ID or slug
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	setDeviceNotes({ deviceId, notes, product, auth, headers, context }){
		return this.updateDevice({ deviceId, notes, product, auth, headers, context });
	}

	/**
	 * Mark device as being used in development of a product so it opts out of automatic firmware updates
	 * @param {Object} options               Options for this API call
	 * @param {String} options.deviceId      Device ID or Name
	 * @param {Boolean} options.development  Set to true to mark as development, false to return to product fleet
	 * @param {String} options.product       Device in this product ID or slug
	 * @param {String} options.auth          Access Token
	 * @param {Object} [options.headers]     Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]     Request context
	 * @returns {Promise} A promise
	 */
	markAsDevelopmentDevice({ deviceId, development = true, product, auth, headers, context }){
		return this.updateDevice({ deviceId, development, product, auth, headers, context });
	}

	/**
	 * Mark device as being used in development of a product so it opts out of automatic firmware updates
	 * @param {Object} options                         Options for this API call
	 * @param {String} options.deviceId                Device ID or Name
	 * @param {Number} options.desiredFirmwareVersion  Lock the product device to run this firmware version.
	 * @param {Boolean} [options.flash]                Immediately flash firmware indicated by desiredFirmwareVersion
	 * @param {String} options.product                 Device in this product ID or slug
	 * @param {String} options.auth                    Access Token
	 * @param {Object} [options.headers]               Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]               Request context
	 * @returns {Promise} A promise
	 */
	lockDeviceProductFirmware({ deviceId, desiredFirmwareVersion, flash, product, auth, context }){
		return this.updateDevice({ deviceId, desiredFirmwareVersion, flash, product, auth, context });
	}

	/**
	 * Mark device as receiving automatic firmware updates
	 * @param {Object} options            Options for this API call
	 * @param {String} options.deviceId   Device ID or Name
	 * @param {String} options.product    Device in this product ID or slug
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	unlockDeviceProductFirmware({ deviceId, product, auth, headers, context }){
		return this.updateDevice({ deviceId, desiredFirmwareVersion: null, product, auth, headers, context });
	}

	/**
	 * Update multiple device attributes at the same time
	 * @param {Object} options                           Options for this API call
	 * @param {String} options.deviceId                  Device ID or Name
	 * @param {String} [options.name]                    Desired Name
	 * @param {Boolean} options.signal                   Signal device on or off
	 * @param {String} [options.notes]                   Your notes about this device
	 * @param {Boolean} [options.development]            (Product only) Set to true to mark as development, false to return to product fleet
	 * @param {Number} [options.desiredFirmwareVersion]  (Product only) Lock the product device to run this firmware version.
	 *                                                   Pass `null` to unlock firmware and go back to released firmware.
	 * @param {Boolean} [options.flash]                  (Product only) Immediately flash firmware indicated by desiredFirmwareVersion
	 * @param {String} [options.product]                 Device in this product ID or slug
	 * @param {String} options.auth                      Access Token
	 * @param {Object} [options.headers]                 Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]                 Request context
	 * @returns {Promise} A promise
	 */
	updateDevice({ deviceId, name, signal, notes, development, desiredFirmwareVersion, flash, product, auth, headers, context }){
		if (signal !== undefined){
			signal = signal ? '1' : '0';
		}

		const uri = this.deviceUri({ deviceId, product });
		const data = product ?
			{ name, signal, notes, development, desired_firmware_version: desiredFirmwareVersion, flash } :
			{ name, signal, notes };

		return this.put({ uri, auth, headers, data, context });
	}

	/**
	 * Provision a new device for products that allow self-provisioning
	 * @param {Object} options            Options for this API call
	 * @param {String} options.productId  Product ID where to create this device
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	provisionDevice({ productId, auth, headers, context }){
		return this.post({
			uri: '/v1/devices',
			auth,
			headers,
			data: { product_id: productId },
			context
		});
	}

	/**
	 * Generate a claim code to use in the device claiming process.
	 * To generate a claim code for a product, the access token MUST belong to a
	 * customer of the product.
	 * @param {Object} options            Options for this API call
	 * @param {String} [options.iccid]    ICCID of the SIM card used in the Electron
	 * @param {String} [options.product]  Device in this product ID or slug
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	getClaimCode({ iccid, product, auth, headers, context }){
		const uri = product ? `/v1/products/${product}/device_claims` : '/v1/device_claims';
		return this.post({ uri, auth, headers, data: { iccid }, context });
	}

	validatePromoCode({ promoCode, auth, headers, context }){
		return this.get({
			uri: `/v1/promo_code/${promoCode}`,
			auth,
			headers,
			context
		});
	}

	changeProduct({ deviceId, productId, auth, headers, context }){
		return this.put({
			uri: `/v1/devices/${deviceId}`,
			auth,
			headers,
			data: { product_id: productId },
			context
		});
	}

	/**
	 * Get the value of a device variable
	 * @param {Object} options            Options for this API call
	 * @param {String} options.deviceId   Device ID or Name
	 * @param {String} options.name       Variable name
	 * @param {String} [options.product]  Device in this product ID or slug
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	getVariable({ deviceId, name, product, auth, headers, context }){
		const uri = product ?
			`/v1/products/${product}/devices/${deviceId}/${name}` :
			`/v1/devices/${deviceId}/${name}`;

		return this.get({ uri, auth, headers, context });
	}

	/**
	 * Compile and flash application firmware to a device. Pass a pre-compiled binary to flash it directly to the device.
	 * @param {Object} options                         Options for this API call
	 * @param {String} options.deviceId                Device ID or Name
	 * @param {String} options.product                 Flash device in this product ID or slug
	 * @param {Object} options.files                   Object containing files to be compiled and flashed. Keys should be the filenames, including relative path, and the values should be a path or Buffer of the file contents in Node, or a File or Blob in the browser.
	 * @param {String} [options.targetVersion=latest]  System firmware version to compile against
	 * @param {String} options.auth                    Access Token
	 * @param {Object} [options.headers]               Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]               Request context
	 * @returns {Promise} A promise
	 */
	flashDevice({ deviceId, product, files, targetVersion, auth, headers, context }){
		const uri = this.deviceUri({ deviceId, product });
		const form = {};

		if (targetVersion){
			form.build_target_version = targetVersion;
		} else {
			form.latest = 'true';
		}

		return this.request({ uri, method: 'put', auth, headers, files, form, context });
	}

	/**
	 * DEPRECATED: Flash the Tinker application to a device. Instead compile and flash the Tinker source code.
	 * @param {Object} options            Options for this API call
	 * @param {String} options.deviceId   Device ID or Name
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	flashTinker({ deviceId, auth, headers, context }){
		/* eslint-disable no-console */
		if (console && console.warning){
			console.warning('Particle.flashTinker is deprecated');
		}
		/* eslint-enable no-console */
		return this.put({
			uri: `/v1/devices/${deviceId}`,
			headers,
			data: { app: 'tinker' },
			auth,
			context
		});
	}

	/**
	 * Compile firmware using the Particle Cloud
	 * @param {Object} options                         Options for this API call
	 * @param {Object} options.files                   Object containing files to be compiled. Keys should be the filenames, including relative path, and the values should be a path or Buffer of the file contents in Node, or a File or Blob in the browser.
	 * @param {Number} [options.platformId]            Platform id number of the device you are compiling for. Common values are 0=Core, 6=Photon, 10=Electron.
	 * @param {String} [options.targetVersion=latest]  System firmware version to compile against
	 * @param {String} options.auth                    Access Token
	 * @param {Object} [options.headers]               Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]               Request context
	 * @returns {Promise} A promise
	 */
	compileCode({ files, platformId, targetVersion, auth, headers, context }){
		const form = { platform_id: platformId };

		if (targetVersion){
			form.build_target_version = targetVersion;
		} else {
			form.latest = 'true';
		}

		return this.request({
			uri: '/v1/binaries',
			method: 'post',
			auth,
			headers,
			files,
			form,
			context
		});
	}

	/**
	 * Download a firmware binary
	 * @param {Object} options            Options for this API call
	 * @param {String} options.binaryId   Binary ID received from a successful compile call
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Request} A promise
	 */
	downloadFirmwareBinary({ binaryId, auth, headers, context }){
		let req = this.request({
			uri: `/v1/binaries/${binaryId}`,
			method: 'get',
			auth,
			headers,
			context,
			raw: true
		});

		return this._provideFileData(req);
	}

	/**
	 * Send a new device public key to the Particle Cloud
	 * @param {Object} options                  Options for this API call
	 * @param {String} options.deviceId         Device ID or Name
	 * @param {(String|Buffer)} options.key     Public key contents
	 * @param {String} [options.algorithm=rsa]  Algorithm used to generate the public key. Valid values are `rsa` or `ecc`.
	 * @param {String} options.auth             Access Token
	 * @param {Object} [options.headers]        Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]        Request context
	 * @returns {Promise} A promise
	 */
	sendPublicKey({ deviceId, key, algorithm, auth, headers, context }){
		return this.post({
			uri: `/v1/provisioning/${deviceId}`,
			auth,
			headers,
			data: {
				deviceID: deviceId,
				publicKey: ( typeof key === 'string' ? key : key.toString() ),
				filename: 'particle-api',
				order: `manual_${ Date.now() }`,
				algorithm: algorithm || 'rsa'
			},
			context
		});
	}

	/**
	 * Call a device function
	 * @param {Object} options            Options for this API call
	 * @param {String} options.deviceId   Device ID or Name
	 * @param {String} options.name       Function name
	 * @param {String} options.argument   Function argument
	 * @param {String} [options.product]  Device in this product ID or slug
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	callFunction({ deviceId, name, argument, product, auth, headers, context }){
		const uri = product ?
			`/v1/products/${product}/devices/${deviceId}/${name}` :
			`/v1/devices/${deviceId}/${name}`;
		return this.post({ uri, auth, headers, data: { args: argument }, context });
	}

	/**
	 * Get a stream of events
	 * @param {Object} options             Options for this API call
	 * @param {String} [options.deviceId]  Device ID or Name, or `mine` to indicate only your devices.
	 * @param {String} [options.name]      Event Name
	 * @param {String} [options.org]       Organization Slug
	 * @param {String} [options.product]   Events for this product ID or slug
	 * @param {String} options.auth        Access Token
	 * @returns {Promise} If the promise resolves, the resolution value will be an EventStream object that will
	 * emit 'event' events.
	 */
	getEventStream({ deviceId, name, org, product, auth }){
		let uri = '/v1/';
		if (org){
			uri += `orgs/${org}/`;
		}

		if (product){
			uri += `products/${product}/`;
		}

		if (deviceId){
			uri += 'devices/';
			if (!(deviceId.toLowerCase() === 'mine')){
				uri += `${deviceId}/`;
			}
		}

		uri += 'events';

		if (name){
			uri += `/${encodeURIComponent(name)}`;
		}

		return new EventStream(`${this.baseUrl}${uri}`, auth).connect();
	}

	/**
	 * Publish a event to the Particle Cloud
	 * @param {Object} options             Options for this API call
	 * @param {String} options.name        Event name
	 * @param {String} options.data        Event data
	 * @param {Boolean} options.isPrivate  Should the event be publicly available?
	 * @param {String} [options.product]   Event for this product ID or slug
	 * @param {String} options.auth        Access Token
	 * @param {Object} [options.headers]   Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]   Request context
	 * @returns {Promise} A promise
	 */
	publishEvent({ name, data, isPrivate, product, auth, headers, context }){
		const uri = product ? `/v1/products/${product}/events` : '/v1/devices/events';
		const postData = { name, data, private: isPrivate };
		return this.post({ uri, auth, headers, data: postData, context });
	}

	/**
	 * Create a webhook
	 * @param {Object} options                            Options for this API call
	 * @param {String} options.event                      The name of the Particle event that should trigger the Webhook
	 * @param {String} options.url                        The web address that will be targeted when the Webhook is triggered
	 * @param {String} [options.device]                   Trigger Webhook only for this device ID or Name
	 * @param {Boolean} [options.rejectUnauthorized]      Set to `false` to skip SSL certificate validation of the target URL
	 * @param {Boolean} [options.noDefaults]              Don't include default event data in the webhook request
	 * @param {Object} [options.hook]                     Webhook configuration settings
	 * @param {String} [options.hook.method=POST]         Type of web request triggered by the Webhook (GET, POST, PUT, or DELETE)
	 * @param {Object} [options.hook.auth]                Auth data like `{ username: 'me', password: '1234' }` to send via basic auth header with the Webhook request
	 * @param {Object} [options.hook.headers]             Additional headers to add to the Webhook like `{ 'X-ONE': '1', X-TWO: '2' }`
	 * @param {Object} [options.hook.query]               Query params to add to the Webhook request like `{ foo: 'foo', bar: 'bar' }`
	 * @param {Object} [options.hook.json]                JSON data to send with the Webhook request - sets `Content-Type` to `application/json`
	 * @param {Object} [options.hook.form]                Form data to send with the Webhook request - sets `Content-Type` to `application/x-www-form-urlencoded`
	 * @param {String} [options.hook.body]                Custom body to send with the Webhook request
	 * @param {Object} [options.hook.responseTemplate]    Template to use to customize the Webhook response body
	 * @param {Object} [options.hook.responseEvent]       The Webhook response event name that your devices can subscribe to
	 * @param {Object} [options.hook.errorResponseEvent]  The Webhook error response event name that your devices can subscribe to
	 * @param {String} [options.product]                  Webhook for this product ID or slug
	 * @param {String} options.auth                       Access Token
	 * @param {Object} [options.headers]                  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]                  Request context
	 * @returns {Promise} A promise
	 */
	createWebhook({ event, url, device, rejectUnauthorized, noDefaults, hook, product, auth, headers, context }){
		const uri = product ? `/v1/products/${product}/webhooks` : '/v1/webhooks';
		const data = { event, url, deviceId: device, rejectUnauthorized, noDefaults };

		if (hook){
			data.requestType = hook.method;
			data.auth = hook.auth;
			data.headers = hook.headers;
			data.query = hook.query;
			data.json = hook.json;
			data.form = hook.form;
			data.body = hook.body;
			data.responseTemplate = hook.responseTemplate;
			data.responseTopic = hook.responseEvent;
			data.errorResponseTopic = hook.errorResponseEvent;
		}

		if (!data.requestType){
			data.requestType = 'POST';
		}

		return this.post({ uri, auth, headers, data, context });
	}

	/**
	 * Delete a webhook
	 * @param {Object} options            Options for this API call
	 * @param {String} options.hookId     Webhook ID
	 * @param {String} [options.product]  Webhook for this product ID or slug
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	deleteWebhook({ hookId, product, auth, headers, context }){
		const uri = product ? `/v1/products/${product}/webhooks/${hookId}` : `/v1/webhooks/${hookId}`;
		return this.delete({ uri, auth, headers, context });
	}

	/**
	 * List all webhooks owned by the account or product
	 * @param {Object} options            Options for this API call
	 * @param {String} [options.product]  Webhooks for this product ID or slug
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	listWebhooks({ product, auth, headers, context }){
		const uri = product ? `/v1/products/${product}/webhooks` : '/v1/webhooks';
		return this.get({ uri, auth, headers, context });
	}

	/**
	 * Create an integration to send events to an external service
     *
	 * See the API docs for details https://docs.particle.io/reference/api/#integrations-webhooks-
	 *
	 * @param {Object} options             Options for this API call
	 * @param {String} options.event       Event that triggers the integration
	 * @param {Object} options.settings    Settings specific to that integration type
	 * @param {String} [options.deviceId]  Trigger integration only for this device ID or Name
	 * @param {String} [options.product]   Integration for this product ID or slug
	 * @param {String} options.auth        Access Token
	 * @param {Object} [options.headers]   Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	createIntegration({ event, settings, deviceId, product, auth, headers, context }){
		const uri = product ? `/v1/products/${product}/integrations` : '/v1/integrations';
		const data = Object.assign({ event, deviceid: deviceId }, settings);
		return this.post({ uri, data, auth, headers, context });
	}

	/**
	 * Edit an integration to send events to an external service
	 *
	 * See the API docs for details https://docs.particle.io/reference/api/#integrations-webhooks-
	 *
	 * @param {Object} options                Options for this API call
	 * @param {String} options.integrationId  The integration to edit
	 * @param {String} [options.event]        Change the event that triggers the integration
	 * @param {Object} [options.settings]     Change the settings specific to that integration type
	 * @param {String} [options.deviceId]     Trigger integration only for this device ID or Name
	 * @param {String} [options.product]      Integration for this product ID or slug
	 * @param {String} options.auth           Access Token
	 * @param {Object} [options.headers]      Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]      Request context
	 * @returns {Promise} A promise
	 */
	editIntegration({ integrationId, event, settings, deviceId, product, auth, headers, context }){
		const uri = product ? `/v1/products/${product}/integrations/${integrationId}` : `/v1/integrations/${integrationId}`;
		const data = Object.assign({ event, deviceid: deviceId }, settings);
		return this.put({ uri, auth, headers, data, context });
	}

	/**
	 * Delete an integration to send events to an external service
	 *
	 * @param {Object} options                Options for this API call
	 * @param {String} options.integrationId  The integration to remove
	 * @param {String} [options.product]      Integration for this product ID or slug
	 * @param {String} options.auth           Access Token
	 * @param {Object} [options.headers]      Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]      Request context
	 * @returns {Promise} A promise
	 */
	deleteIntegration({ integrationId, product, auth, headers, context }){
		const uri = product ? `/v1/products/${product}/integrations/${integrationId}` : `/v1/integrations/${integrationId}`;
		return this.delete({ uri, auth, headers, context });
	}

	/**
	 * List all integrations owned by the account or product
	 * @param {Object} options            Options for this API call
	 * @param {String} [options.product]  Integrations for this product ID or slug
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	listIntegrations({ product, auth, headers, context }){
		const uri = product ? `/v1/products/${product}/integrations` : '/v1/integrations';
		return this.get({ uri, auth, headers, context });
	}

	/**
	 * Get details about the current user
	 * @param {Object} options            Options for this API call
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	getUserInfo({ auth, headers, context }){
		return this.get({ uri: '/v1/user', auth, headers, context });
	}

	/**
	 * Set details on the current user
	 * @param {Object} options              Options for this API call
	 * @param {String} options.auth         Access Token
	 * @param {String} options.accountInfo  Set user's extended info fields (name, business account, company name, etc)
	 * @param {Object} [options.headers]    Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]    Request context
	 * @returns {Promise} A promise
	 */
	setUserInfo({ accountInfo, auth, headers, context }){
		const data = { account_info: accountInfo };
		return this.put({ uri: '/v1/user', auth, headers, data, context });
	}

	/**
	 * Change username (i.e, email)
	 * @param {Object} options                  Options for this API call
	 * @param {String} options.auth             Access Token
	 * @param {String} options.currentPassword  Current password
	 * @param {String} options.username         New email
	 * @param {Boolean} options.invalidateTokens Should all tokens be invalidated
	 * @param {Object} [options.headers]        Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]        Request context
	 * @returns {Promise} A promise
	 */
	changeUsername({ currentPassword, username, invalidateTokens = false, auth, headers, context }){
		const data = { username, current_password: currentPassword };

		if (invalidateTokens) {
			data.invalidate_tokens = true;
		}

		return this.put({ uri: '/v1/user', auth, headers, data, context });
	}

	/**
	 * Change user's password
	 * @param {Object} options                   Options for this API call
	 * @param {String} options.auth              Access Token
	 * @param {String} options.currentPassword   Current password
	 * @param {String} options.password          New password
	 * @param {Boolean} options.invalidateTokens Should all tokens be invalidated
	 * @param {Object} [options.headers]         Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]         Request context
	 * @returns {Promise} A promise
	 */
	changeUserPassword({ currentPassword, password, invalidateTokens = false, auth, headers, context }){
		const data = { password, current_password: currentPassword };

		if (invalidateTokens) {
			data.invalidate_tokens = true;
		}

		return this.put({ uri: '/v1/user', auth, headers, data, context });
	}

	/**
	 * List SIM cards owned by a user or product
	 * @param {Object} options               Options for this API call
	 * @param {String} [options.iccid]       (Product only) Filter to SIM cards matching this ICCID
	 * @param {String} [options.deviceId]    (Product only) Filter to SIM cards matching this device ID
	 * @param {String} [options.deviceName]  (Product only) Filter to SIM cards matching this device name
	 * @param {Number} [options.page]        (Product only) Current page of results
	 * @param {Number} [options.perPage]     (Product only) Records per page
	 * @param {String} [options.product]     SIM cards for this product ID or slug
	 * @param {String} options.auth          Access Token
	 * @param {Object} [options.headers]     Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]     Request context
	 * @returns {Promise} A promise
	 */
	listSIMs({ iccid, deviceId, deviceName, page, perPage, product, auth, headers, context }){
		const uri = product ? `/v1/products/${product}/sims` : '/v1/sims';
		const query = product ? { iccid, deviceId, deviceName, page, per_page: perPage } : undefined;
		return this.get({ uri, auth, headers, query, context });
	}

	/**
	 * Get data usage for one SIM card for the current billing period
	 * @param {Object} options            Options for this API call
	 * @param {String} options.iccid      ICCID of the SIM card
	 * @param {String} [options.product]  SIM card for this product ID or slug
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	getSIMDataUsage({ iccid, product, auth, headers, context }){
		const uri = product ?
			`/v1/products/${product}/sims/${iccid}/data_usage` :
			`/v1/sims/${iccid}/data_usage`;

		return this.get({ uri, auth, headers, context });
	}

	/**
	 * Get data usage for all SIM cards in a product the current billing period
	 * @param {Object} options            Options for this API call
	 * @param {String} options.product    SIM cards for this product ID or slug
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	getFleetDataUsage({ product, auth, headers, context }){
		return this.get({
			uri: `/v1/products/${product}/sims/data_usage`,
			auth,
			headers,
			context
		});
	}

	/**
	 * Check SIM status
	 * @param {Object} options            Options for this API call
	 * @param {String} options.iccid      ICCID of the SIM card
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	checkSIM({ iccid, auth, headers, context }){
		return this.head({ uri: `/v1/sims/${iccid}`, auth, headers, context });
	}

	/**
	 * Activate and add SIM cards to an account or product
	 * @param {Object} options                Options for this API call
	 * @param {String} options.iccid          ICCID of the SIM card
	 * @param {Array<String>} options.iccids  (Product only) ICCID of multiple SIM cards to import
	 * @param {String} options.country        The ISO country code for the SIM cards
	 * @param {String} [options.product]      SIM cards for this product ID or slug
	 * @param {String} options.auth           Access Token
	 * @param {Object} [options.headers]      Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]      Request context
	 * @returns {Promise} A promise
	 */
	activateSIM({ iccid, iccids, country, promoCode, product, auth, headers, context }){
		// promoCode is deprecated
		iccids = iccids || [iccid];
		const uri = product ? `/v1/products/${product}/sims` : `/v1/sims/${iccid}`;
		const data = product ?
			{ sims: iccids, country } :
			{ country, promoCode, action: 'activate' };
		const method = product ? 'post' : 'put';

		return this.request({ uri, method, headers, data, auth, context });
	}

	/**
	 * Deactivate a SIM card so it doesn't incur data usage in future months.
	 * @param {Object} options            Options for this API call
	 * @param {String} options.iccid      ICCID of the SIM card
	 * @param {String} [options.product]  SIM cards for this product ID or slug
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	deactivateSIM({ iccid, product, auth, headers, context }){
		const uri = product ? `/v1/products/${product}/sims/${iccid}` : `/v1/sims/${iccid}`;
		const data = { action: 'deactivate' };
		return this.put({ uri, auth, headers, data, context });
	}

	/**
	 * Reactivate a SIM card the was deactivated or unpause a SIM card that was automatically paused
	 * @param {Object} options            Options for this API call
	 * @param {String} options.iccid      ICCID of the SIM card
	 * @param {Number} [options.mbLimit]  New monthly data limit. Necessary if unpausing a SIM card
	 * @param {String} [options.product]  SIM cards for this product ID or slug
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	reactivateSIM({ iccid, mbLimit, product, auth, headers, context }){
		const uri = product ? `/v1/products/${product}/sims/${iccid}` : `/v1/sims/${iccid}`;
		const data = { mb_limit: mbLimit, action: 'reactivate' };
		return this.put({ uri, auth, headers, data, context });
	}

	/**
	 * Update SIM card data limit
	 * @param {Object} options            Options for this API call
	 * @param {String} options.iccid      ICCID of the SIM card
	 * @param {Array}  options.mbLimit    Data limit in megabyte for the SIM card
	 * @param {String} [options.product]  SIM cards for this product ID or slug
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	updateSIM({ iccid, mbLimit, product, auth, headers, context }){
		const uri = product ? `/v1/products/${product}/sims/${iccid}` : `/v1/sims/${iccid}`;
		const data = { mb_limit: mbLimit };
		return this.put({ uri, auth, headers, data, context });
	}

	/**
	 * Remove a SIM card from an account so it can be activated by a different account
	 * @param {Object} options            Options for this API call
	 * @param {String} options.iccid      ICCID of the SIM card
	 * @param {String} [options.product]  SIM cards for this product ID or slug
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	removeSIM({ iccid, product, auth, headers, context }){
		const uri = product ? `/v1/products/${product}/sims/${iccid}` : `/v1/sims/${iccid}`;
		return this.delete({ uri, auth, headers, context });
	}

	/**
	 * List valid build targets to be used for compiling
	 * @param {Object} options                        Options for this API call
	 * @param {Boolean} [options.onlyFeatured=false]  Only list featured build targets
	 * @param {String} options.auth                   Access Token
	 * @param {Object} [options.headers]              Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]              Request context
	 * @returns {Promise} A promise
	 */
	listBuildTargets({ onlyFeatured, auth, headers, context }){
		const query = onlyFeatured ? { featured: !!onlyFeatured } : undefined;
		return this.get({ uri: '/v1/build_targets', auth, headers, query, context });
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
	 * @param {Object} [options.headers]              Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]              Request context
	 * @returns {Promise} A promise
	 */
	listLibraries({ page, limit, filter, sort, architectures, category, scope, excludeScopes, auth, headers, context }){
		return this.get({
			uri: '/v1/libraries',
			auth,
			headers,
			query: {
				page,
				filter,
				limit,
				sort,
				architectures: this._asList(architectures),
				category,
				scope,
				excludeScopes: this._asList(excludeScopes)
			},
			context
		});
	}

	_asList(value){
		return (Array.isArray(value) ? value.join(',') : value);
	}

	/**
	 * Get firmware library details
	 * @param {Object} options            Options for this API call
	 * @param {String} options.name       Name of the library to fetch
	 * @param {String} options.version    Version of the library to fetch (default: latest)
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	getLibrary({ name, version, auth, headers, context }){
		return this.get({
			uri: `/v1/libraries/${name}`,
			auth,
			headers,
			query: { version },
			context
		});
	}

	/**
	 * Firmware library details for each version
	 * @param {Object} options            Options for this API call
	 * @param {String} options.name       Name of the library to fetch
	 * @param {Number} options.page       Page index (default, first page)
	 * @param {Number} options.limit      Number of items per page
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	getLibraryVersions({ name, page, limit, auth, headers, context }){
		return this.get({
			uri: `/v1/libraries/${name}/versions`,
			auth,
			headers,
			query: { page, limit },
			context
		});
	}

	/**
	 * Contribute a new library version from a compressed archive
	 * @param {Object} options            Options for this API call
	 * @param {String} options.archive    Compressed archive file containing the library sources
	 *                                    Either a path or Buffer of the file contents in Node, or a File or Blob in the browser.
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	contributeLibrary({ archive, auth, headers, context }){
		const files = {
			'archive.tar.gz': archive
		};

		return this.request({
			uri: '/v1/libraries',
			method: 'post',
			auth,
			headers,
			files,
			context
		});
	}

	/**
	 * Publish the latest version of a library to the public
	 * @param {Object} options            Options for this API call
	 * @param {String} options.name       Name of the library to publish
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	publishLibrary({ name, auth, headers, context }){
		return this.request({
			uri: `/v1/libraries/${name}`,
			method: 'patch',
			auth,
			headers,
			data: { visibility: 'public' },
			context
		});
	}

	/**
	 * Delete one version of a library or an entire private library
	 * @param {Object} options            Options for this API call
	 * @param {String} options.name       Name of the library to remove
	 * @param {String} options.force      Key to force deleting a public library
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	deleteLibrary({ name, force, auth, headers, context }){
		return this.delete({
			uri: `/v1/libraries/${name}`,
			auth,
			headers,
			data: { force },
			context
		});
	}

	/**
	 * Download an external file that may not be on the API
	 * @param {Object} options            Options for this API call
	 * @param {String} options.uri        URL of the file.
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} Resolves to a buffer with the file data
	 */
	downloadFile({ uri, headers, context }){
		let req = this.request({ uri, method: 'get', headers, context, raw: true });
		return this._provideFileData(req);
	}

	/**
	 * List OAuth client created by the account
	 * @param {Object} options            Options for this API call
	 * @param {String} [options.product]  List clients for this product ID or slug
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	listOAuthClients({ product, auth, headers, context }){
		const uri = product ? `/v1/products/${product}/clients` : '/v1/clients';
		return this.get({ uri, auth, headers, context });
	}

	/**
	 * Create an OAuth client
	 * @param {Object} options                 Options for this API call
	 * @param {String} options.name            Name of the OAuth client
	 * @param {String} options.type            web, installed or web
	 * @param {String} [options.redirect_uri]  URL to redirect after OAuth flow. Only for type web.
	 * @param {Object} [options.scope]         Limits what the access tokens created by this client can do.
	 * @param {String} [options.product]       Create client for this product ID or slug
	 * @param {String} options.auth            Access Token
	 * @param {Object} [options.headers]       Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]       Request context
	 * @returns {Promise} A promise
	 */
	createOAuthClient({ name, type, redirect_uri, scope, product, auth, headers, context }){
		const uri = product ? `/v1/products/${product}/clients` : '/v1/clients';
		const data = { name, type, redirect_uri, scope };
		return this.post({ uri, auth, headers, data, context });
	}

	/**
	 * Update an OAuth client
	 * @param {Object} options            Options for this API call
	 * @param {String} options.clientId   The OAuth client to update
	 * @param {String} [options.name]     New Name of the OAuth client
	 * @param {Object} [options.scope]    New scope of the OAuth client
	 * @param {String} [options.product]  Update client linked to this product ID or slug
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	updateOAuthClient({ clientId, name, scope, product, auth, headers, context }){
		const uri = product ? `/v1/products/${product}/clients/${clientId}` : `/v1/clients/${clientId}`;
		const data = { name, scope };
		return this.put({ uri, data, auth, headers, context });
	}

	/**
	 * Delete an OAuth client
	 * @param {Object} options            Options for this API call
	 * @param {String} options.clientId   The OAuth client to update
	 * @param {String} [options.product]  OAuth client linked to this product ID or slug
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	deleteOAuthClient({ clientId, product, auth, headers, context }){
		const uri = product ? `/v1/products/${product}/clients/${clientId}` : `/v1/clients/${clientId}`;
		return this.delete({ uri, auth, headers, context });
	}

	/**
	 * List products the account has access to
	 * @param {Object} options            Options for this API call
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	listProducts({ auth, headers, context }){
		return this.get({ uri: '/v1/products', auth, headers, context });
	}

	/**
	 * Get detailed information about a product
	 * @param {Object} options            Options for this API call
	 * @param {String} options.product    Product ID or slug
	 * @param {String} options.auth       Access token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	getProduct({ product, auth, headers, context }){
		return this.get({ uri: `/v1/products/${product}`, auth, headers, context });
	}

	/**
	 * List product firmware versions
	 * @param {Object} options            Options for this API call
	 * @param {String} options.product    Firmware for this product ID or slug
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	listProductFirmware({ product, auth, headers, context }){
		return this.get({ uri: `/v1/products/${product}/firmware`, auth, headers, context });
	}

	/**
	 * List product firmware versions
	 * @param {Object} options                Options for this API call
	 * @param {Object} options.file           Path or Buffer of the new firmware file
	 *                                        Either a path or Buffer of the file contents in Node, or a File or Blob in the browser.
	 * @param {Number} options.version        Version number of new firmware
	 * @param {String} options.title          Short identifier for the new firmware
	 * @param {String} [options.description]  Longer description for the new firmware
	 * @param {String} options.product        Firmware for this product ID or slug
	 * @param {String} options.auth           Access Token
	 * @param {Object} [options.headers]      Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]      Request context
	 * @returns {Promise} A promise
	 */
	uploadProductFirmware({ file, version, title, description, product, auth, headers, context }){
		return this.request({
			uri: `/v1/products/${product}/firmware`,
			method: 'post',
			auth,
			headers,
			form: {
				version,
				title,
				description
			},
			files: {
				'firmware.bin': file
			},
			context
		});
	}

	/**
	 * Get information about a product firmware version
	 * @param {Object} options            Options for this API call
	 * @param {Number} options.version    Version number of firmware
	 * @param {String} options.product    Firmware for this product ID or slug
	 * @param {String} options.auth       Access token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	getProductFirmware({ version, product, auth, headers, context }){
		return this.get({
			uri: `/v1/products/${product}/firmware/${version}`,
			auth,
			headers,
			context
		});
	}

	/**
	 * Update information for a product firmware version
	 * @param {Object} options                Options for this API call
	 * @param {Number} options.version        Version number of new firmware
	 * @param {String} [options.title]        New title
	 * @param {String} [options.description]  New description
	 * @param {String} options.product        Firmware for this product ID or slug
	 * @param {String} options.auth           Access Token
	 * @param {Object} [options.headers]      Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]      Request context
	 * @returns {Promise} A promise
	 */
	updateProductFirmware({ version, title, description, product, auth, headers, context }){
		const uri = `/v1/products/${product}/firmware/${version}`;
		return this.put({ uri, auth, headers, data: { title, description }, context });
	}

	/**
	 * Download a product firmware binary
	 * @param {Object} options            Options for this API call
	 * @param {Number} options.version    Version number of new firmware
	 * @param {String} options.product    Firmware for this product ID or slug
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Request} A promise
	 */
	downloadProductFirmware({ version, product, auth, headers, context }){
		let req = this.request({
			uri: `/v1/products/${product}/firmware/${version}/binary`,
			method: 'get',
			auth,
			headers,
			context,
			raw: true
		});

		return this._provideFileData(req);
	}

	_provideFileData(req){
		if (this.agent.isForBrowser()){
			req = req.responseType('arraybuffer').then(res => {
				res.body = res.xhr.response;
				return res;
			});
		} else {
			req = req.buffer(true).parse(binaryParser);
		}
		return req.then(res => res.body);
	}

	/**
	 * Release a product firmware version as the default version
	 * @param {Object} options            Options for this API call
	 * @param {Number} options.version    Version number of new firmware
	 * @param {String} options.product    Firmware for this product ID or slug
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	releaseProductFirmware({ version, product, auth, headers, context }){
		const uri = `/v1/products/${product}/firmware/release`;
		return this.put({ uri, auth, headers, data: { version }, context });
	}

	/**
	 * List product team members
	 * @param {Object} options            Options for this API call
	 * @param {String} options.product    Team for this product ID or slug
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	listTeamMembers({ product, auth, headers, context }){
		return this.get({
			uri: `/v1/products/${product}/team`,
			auth,
			headers,
			context
		});
	}

	/**
	 * Invite Particle user to a product team
	 * @param {Object} options            Options for this API call
	 * @param {String} options.username   Username for the Particle account
	 * @param {String} options.product    Team for this product ID or slug
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	inviteTeamMember({ username, product, auth, headers, context }){
		return this.post({
			uri: `/v1/products/${product}/team`,
			auth,
			headers,
			data: { username },
			context
		});
	}

	/**
	 * Remove Particle user to a product team
	 * @param {Object} options            Options for this API call
	 * @param {String} options.username   Username for the Particle account
	 * @param {String} options.product    Team for this product ID or slug
	 * @param {String} options.auth       Access Token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	removeTeamMember({ username, product, auth, headers, context }){
		return this.delete({
			uri: `/v1/products/${product}/team/${username}`,
			auth,
			headers,
			context
		});
	}

	/**
	 * Fetch details about a serial number
	 * @param {Object} options               Options for this API call
	 * @param {String} options.serialNumber  The serial number printed on the barcode of the device packaging
	 * @param {String} options.auth          Access Token
	 * @param {Object} [options.headers]     Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]     Request context
	 * @returns {Promise} A promise
	 */
	lookupSerialNumber({ serialNumber, auth, headers, context }){
		return this.get({
			uri: `/v1/serial_numbers/${serialNumber}`,
			auth,
			headers,
			context
		});
	}

	/**
	 * Create a mesh network
	 * @param {Object} options            Options for this API call
	 * @param {String} options.name       Network name
	 * @param {String} options.deviceId   Gateway device ID
	 * @param {String} [options.iccid]    ICCID of the active SIM card (only for cellular gateway devices)
	 * @param {String} options.auth       Access token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise<Object>} A promise
	 */
	createMeshNetwork({ name, deviceId, iccid, auth, headers, context }){
		return this.post({
			uri: '/v1/networks',
			auth,
			headers,
			data: { name, device_id: deviceId, iccid },
			context
		});
	}

	/**
	 * Remove a mesh network.
	 * @param {Object} options            Options for this API call
	 * @param {String} options.networkId  Network ID or name
	 * @param {String} options.auth       Access token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise<Object>} A promise
	 */
	removeMeshNetwork({ networkId, auth, headers, context }){
		return this.delete({ uri: `/v1/networks/${networkId}`, auth, headers, context });
	}

	/**
	 * List all mesh networks
	 * @param {Object} options            Options for this API call
	 * @param {String} options.auth       Access token
	 * @param {Number} [options.page]     Current page of results
	 * @param {Number} [options.perPage]  Records per page
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise<Object>} A promise
	 */
	listMeshNetworks({ page, perPage, auth, headers, context }){
		const query = page ? { page, per_page: perPage } : undefined;
		return this.get({ uri: '/v1/networks', auth, headers, query, context });
	}

	/**
	 * Get information about a mesh network.
	 * @param {Object} options            Options for this API call
	 * @param {String} options.networkId  Network ID or name
	 * @param {String} options.auth       Access token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise<Object>} A promise
	 */
	getMeshNetwork({ networkId, auth, headers, context }){
		return this.get({ uri: `/v1/networks/${networkId}`, auth, headers, context });
	}

	/**
	 * Modify a mesh network.
	 * @param {Object} options            Options for this API call
	 * @param {String} options.networkId  Network ID or name
	 * @param {String} options.action     'add-device', 'remove-device', 'gateway-enable' or 'gateway-disable'
	 * @param {String} options.deviceId   Device ID
	 * @param {String} options.auth       Access token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise<Object>} A promise
	 */
	updateMeshNetwork({ networkId, action, deviceId, auth, headers, context }){
		return this.put({
			uri: `/v1/networks/${networkId}`,
			auth,
			headers,
			data: { action, device_id: deviceId },
			context
		});
	}

	/**
	 * Add a device to a mesh network.
	 * @param {Object} options            Options for this API call
	 * @param {String} options.networkId  Network ID or name
	 * @param {String} options.deviceId   Device ID
	 * @param {String} options.auth       Access token
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise<Object>} A promise
	 */
	addMeshNetworkDevice({ networkId, deviceId, auth, headers, context }){
		return this.updateMeshNetwork({
			action: 'add-device',
			networkId,
			deviceId,
			auth,
			headers,
			context
		});
	}

	/**
	 * Remove a device from a mesh network.
	 * @param {Object} options              Options for this API call
	 * @param {String} [options.networkId]  Network ID or name
	 * @param {String} options.deviceId     Device ID
	 * @param {String} options.auth         Access token
	 * @param {Object} [options.headers]    Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]    Request context
	 * @returns {Promise<Object>} A promise
	 */
	removeMeshNetworkDevice({ networkId, deviceId, auth, headers, context }){
		if (!networkId){
			return this.delete({
				uri: `/v1/devices/${deviceId}/network`,
				auth,
				headers, context
			});
		}
		return this.updateMeshNetwork({
			action: 'remove-device',
			networkId,
			deviceId,
			auth,
			headers,
			context
		});
	}

	/**
	 * List all devices of a mesh network.
	 * @param {Object} options            Options for this API call
	 * @param {String} options.networkId  Network ID or name
	 * @param {String} options.auth       Access token
	 * @param {Number} [options.role]     Device role: 'gateway' or 'node'
	 * @param {Number} [options.page]     Current page of results
	 * @param {Number} [options.perPage]  Records per page
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise<Object>} A promise
	 */
	listMeshNetworkDevices({ networkId, role, page, perPage, auth, headers, context }){
		const query = (role || page) ? { role, page, per_page: perPage } : undefined;
		return this.get({
			uri: `/v1/networks/${networkId}/devices`,
			auth,
			headers,
			query,
			context
		});
	}

	/**
	 * Get product configuration
	 * @param  {Object} options          Options for this API call
	 * @param  {String} options.product  Config for this product ID or slug
	 * @param  {String} options.auth     Access Token
	 * @param {Object} [options.headers] Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context] Request context
	 * @returns {Promise} A promise
	 */
	getProductConfiguration({ auth, product, headers, context }){
		return this.get({
			uri: `/v1/products/${product}/config`,
			auth,
			headers,
			context
		});
	}

	/**
	 * Get product configuration schema
	 * @param  {Object} options          Options for this API call
	 * @param  {String} options.product  Config for this product ID or slug
	 * @param  {String} options.auth     Access Token
	 * @param {Object} [options.headers] Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context] Request context
	 * @returns {Promise} A promise
	 */
	getProductConfigurationSchema({ auth, product, headers = {}, context }){
		headers.accept = 'application/schema+json';
		return this.get({
			uri: `/v1/products/${product}/config`,
			auth,
			headers,
			context
		});
	}

	/**
	 * Get product device's configuration
	 * @param  {Object} options          Options for this API call
	 * @param  {String} options.product  Config for this product ID or slug
	 * @param  {String} options.auth     Access Token
	 * @param  {String} options.deviceId Device ID to access
	 * @param {Object} [options.headers] Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context] Request context
	 * @returns {Promise} A promise
	 */
	getProductDeviceConfiguration({ auth, product, deviceId, headers, context }){
		return this.get({
			uri: `/v1/products/${product}/config/${deviceId}`,
			auth,
			headers,
			context
		});
	}

	/**
	 * Get product device's configuration schema
	 * @param  {Object} options          Options for this API call
	 * @param  {String} options.product  Config for this product ID or slug
	 * @param  {String} options.auth     Access Token
	 * @param  {String} options.deviceId Device ID to access
	 * @param {Object} [options.headers] Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context] Request context
	 * @returns {Promise} A promise
	 */
	getProductDeviceConfigurationSchema({ auth, product, deviceId, headers, context }){
		headers.accept = 'application/schema+json';
		return this.get({
			uri: `/v1/products/${product}/config/${deviceId}`,
			auth,
			headers,
			context
		});
	}

	/**
	 * Set product configuration
	 * @param  {Object} options          Options for this API call
	 * @param  {String} options.product  Config for this product ID or slug
	 * @param  {String} options.auth     Access Token
	 * @param  {Object} opitons.config   Product configuration to update
	 * @param {Object} [options.headers] Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context] Request context
	 * @returns {Promise} A promise
	 */
	setProductConfiguration({ auth, product, config, headers, context }){
		return this.put({
			uri: `/v1/products/${product}/config`,
			auth,
			data: config,
			headers,
			context
		});
	}

	/**
	 * Set product configuration for a specific device within the product
	 * @param  {Object} options          Options for this API call
	 * @param  {String} options.product  Config for this product ID or slug
	 * @param  {String} options.auth     Access Token
	 * @param  {Object} opitons.config   Product configuration to update
	 * @param  {String} options.deviceId Device ID to access
	 * @param {Object} [options.headers] Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context] Request context
	 * @returns {Promise} A promise
	 */
	setProductDeviceConfiguration({ auth, product, deviceId, config, headers, context }){
		return this.put({
			uri: `/v1/products/${product}/config/${deviceId}`,
			data: config,
			auth,
			headers,
			context
		});
	}

	/**
	 * Query location for devices within a product
	 * @param  {Object} options            Options for this API call
	 * @param  {String} options.product    Locations for this product ID or slug
	 * @param  {String} options.auth       Access Token
	 * @param  {String} options.dateRange  Start and end date in ISO8601 format, separated by comma, to query
	 * @param  {String} options.rectBl     Bottom left of the rectangular bounding box to query. Latitude and longitude separated by comma
	 * @param  {String} options.rectTr     Top right of the rectangular bounding box to query. Latitude and longitude separated by comma
	 * @param  {String} options.deviceId   Device ID prefix to include in the query
	 * @param  {String} options.deviceName Device name prefix to include in the query
	 * @param  {String} options.groups     Array of group names to include in the query
	 * @param  {String} options.page       Page of results to display. Defaults to 1
	 * @param  {String} options.perPage    Number of results per page. Defaults to 20. Maximum of 100
	 * @param {Object} [options.headers]   Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]   Request context
	 * @returns {Promise} A promise
	 */
	getProductLocations({ auth, product, dateRange, rectBl, rectTr, deviceId, deviceName, groups, page, perPage, headers, context }){
		return this.get({
			uri: `/v1/products/${product}/locations`,
			query: {
				date_range: dateRange,
				rect_bl: rectBl,
				rect_tr: rectTr,
				device_id: deviceId,
				device_name: deviceName,
				groups,
				page,
				per_page: perPage
			},
			auth,
			headers,
			context
		});
	}

	/**
	 * Query location for one device within a product
	 * @param  {Object} options           Options for this API call
	 * @param  {String} options.product   Locations for this product ID or slug
	 * @param  {String} options.auth      Access Token
	 * @param  {String} options.dateRange Start and end date in ISO8601 format, separated by comma, to query
	 * @param  {String} options.rectBl    Bottom left of the rectangular bounding box to query. Latitude and longitude separated by comma
	 * @param  {String} options.rectTr    Top right of the rectangular bounding box to query. Latitude and longitude separated by comma
	 * @param  {String} options.deviceId  Device ID to query
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {Object} [options.context]  Request context
	 * @returns {Promise} A promise
	 */
	getProductDeviceLocations({ auth, product, dateRange, rectBl, rectTr, deviceId, headers, context }){
		return this.get({
			uri: `/v1/products/${product}/locations/${deviceId}`,
			query: {
				date_range: dateRange,
				rect_bl: rectBl,
				rect_tr: rectTr
			},
			auth,
			headers,
			context
		});
	}

	/**
	 * API URI to access a device
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.deviceId  Device ID to access
	 * @param  {String} [options.product] Device only in this product ID or slug
	 * @private
	 * @returns {string} URI
	 */
	deviceUri({ deviceId, product }){
		return product ? `/v1/products/${product}/devices/${deviceId}` : `/v1/devices/${deviceId}`;
	}

	get({ uri, auth, headers, query, context }){
		context = this._buildContext(context);
		return this.agent.get({ uri, auth, headers, query, context });
	}

	head({ uri, auth, headers, query, context }){
		context = this._buildContext(context);
		return this.agent.head({ uri, auth, headers, query, context });
	}

	post({ uri, auth, headers, data, context }){
		context = this._buildContext(context);
		return this.agent.post({ uri, auth, headers, data, context });
	}

	put({ uri, auth, headers, data, context }){
		context = this._buildContext(context);
		return this.agent.put({ uri, auth, headers, data, context });
	}

	delete({ uri, auth, headers, data, context }){
		context = this._buildContext(context);
		return this.agent.delete({ uri, auth, headers, data, context });
	}

	request(args){
		args.context = this._buildContext(args.context);
		return this.agent.request(args);
	}

	client(options = {}){
		return new Client(Object.assign({ api: this }, options));
	}
}

// Aliases for backwards compatibility
Particle.prototype.removeAccessToken = Particle.prototype.deleteAccessToken;

export default Particle;
