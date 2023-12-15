const Defaults = require('./Defaults');
const EventStream = require('./EventStream');
const Agent = require('./Agent');
const Client = require('./Client');

// Hack to avoid importing the type on every @return statement
/**
 * @typedef {import('./Agent').RequestResponse} RequestResponse
 */
/**
 * @typedef {import('./Agent').RequestError} RequestError
 */
/**
 * @typedef {import('./Agent').Auth} Auth
 */

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
     * @param {Object} options                  Options for this API call Options to be used for all requests (see [Defaults](../src/Defaults.js))
     * @param {string} [options.baseUrl]
     * @param {string} [options.clientSecret]
     * @param {string} [options.clientId]
     * @param {number} [options.tokenDuration]
     * @param {Auth}   [options.auth]           The access token or basic auth object. If not specified here, will have to be added to every request
     */
    constructor(options = {}){
        if (options.auth) {
            this.setDefaultAuth(options.auth);
        }

        // todo - this seems a bit dangerous - would be better to put all options/context in a contained object
        Object.assign(this, Defaults, options);
        this.context = {};
        this.agent = new Agent(this.baseUrl);
    }

    _isValidContext(name, context){
        return (name === 'tool' || name === 'project') && context !== undefined;
    }

    setContext(name, context){
        if (context !== undefined){
            if (this._isValidContext(name, context)){
                this.context[name] = context;
            } else {
                throw Error('unknown context name or undefined context: ' + name);
            }
        }
    }

    /**
     * Builds the final context from the context parameter and the context items in the api.
     * @param   {Object} context  The invocation context, this takes precedence over the local context.
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
    // @ts-ignore
    login({ username, password, tokenDuration = this.tokenDuration, headers, context }){
        return this.request({
            uri: '/oauth/token',
            method: 'post',
            headers,
            form: {
                username,
                password,
                grant_type: 'password',
                // @ts-ignore
                client_id: this.clientId,
                // @ts-ignore
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
                // @ts-ignore
                client_id: this.clientId,
                // @ts-ignore
                client_secret: this.clientSecret
            },
            context
        });
    }

    /**
     * Enable MFA on the currently logged in user
     * @param {Object} options            Options for this API call
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
     * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object} [options.context]  Request context
     * @returns {Promise} A promise
     */
    enableMfa({ auth, headers, context }){
        return this.get({ uri: '/v1/user/mfa-enable', auth, headers, context });
    }

    /**
     * Confirm MFA for the user. This must be called with current TOTP code, determined from the results of enableMfa(). You will be prompted to enter an OTP code every time you login after enrollment is confirmed.
     * @param {Object} options                    Options for this API call
     * @param {Auth} [options.auth]               The access token or basic auth object. Can be ignored if provided in constructor
     * @param {Object} options.mfaToken           Token given from previous step to
     * @param {Object} options.otp                Current one-time-password generated from the authentication app
     * @param {Boolean} options.invalidateTokens  Should all tokens be invalidated
     * @param {Object} [options.headers]          Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object} [options.context]          Request context
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
     * @param {Auth} [options.auth]             The access token or basic auth object. Can be ignored if provided in constructor
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
                // @ts-ignore
                client_id: this.clientId,
                // @ts-ignore
                client_secret: this.clientSecret
            },
            context
        });
    }

    /**
     * Login to Particle Cloud using an OAuth client.
     * @param {Object} options            Options for this API call
     * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object} [options.context]  Request context
     * @returns {Promise} A promise
     */
    loginAsClientOwner({ headers, context }){
        return this.request({
            uri: '/oauth/token',
            method: 'post',
            headers,
            form: {
                grant_type: 'client_credentials',
                // @ts-ignore
                client_id: this.clientId,
                // @ts-ignore
                client_secret: this.clientSecret
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Object}  [options]          Options for this API call
     * @param {Auth}    [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
     * @param {Boolean} [options.full]     When true, retrieve all information for registering a user with the tracking API. When false,
     *                                     retrieve only the unique tracking ID for the current login.
     * @param {Object}  [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object}  [options.context]  Request context
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
     * @param {Object}         options               Options for this API call
     * @param {String}         [options.deviceId]    (Product only) Filter results to devices with this ID (partial matching)
     * @param {String}         [options.deviceName]  (Product only) Filter results to devices with this name (partial matching)
     * @param {Array.<string>} [options.groups]      (Product only) A list of full group names to filter results to devices belonging to these groups only.
     * @param {String}         [options.sortAttr]    (Product only) The attribute by which to sort results. See API docs for options.
     * @param {String}         [options.sortDir]     (Product only) The direction of sorting. See API docs for options.
     * @param {Number}         [options.page]        (Product only) Current page of results
     * @param {Number}         [options.perPage]     (Product only) Records per page
     * @param {String}         [options.product]     List devices in this product ID or slug
     * @param {Auth}           [options.auth]        The access token or basic auth object. Can be ignored if provided in constructor
     * @param {Object}         [options.headers]     Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object}         [options.context]     Request context
     * @returns {Promise} A promise
     */
    listDevices({ deviceId, deviceName, groups, sortAttr, sortDir, page, perPage, product, auth, headers, context }){
        let uri, query;

        if (product){
            uri = `/v1/products/${product}/devices`;
            query = {
                deviceId,
                deviceName,
                groups: Array.isArray(groups) ? groups.join(',') : undefined,
                sortAttr,
                sortDir,
                page,
                per_page: perPage
            };
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Object}  options                  Options for this API call
     * @param {String}  options.deviceId         Device ID
     * @param {Auth}    [options.auth]           The access token or basic auth object. Can be ignored if provided in constructor
     * @param {boolean} options.requestTransfer  True to request the device be transfered from another user
     * @param {Object}  [options.headers]        Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object}  [options.context]        Request context
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Object}  options            Options for this API call
     * @param {String}  options.deviceId   Device ID or Name
     * @param {Boolean} [options.deny]     (Product only) Deny this quarantined device, instead of removing an already approved device
     * @param {String}  options.product    Remove from this product ID or slug
     * @param {Auth}    [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
     * @param {Object}  [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object}  [options.context]  Request context
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]        The access token or basic auth object. Can be ignored if provided in constructor
     * @param {Object} [options.headers]     Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object} [options.context]     Request context
     * @returns {Promise} A promise
     */
    markAsDevelopmentDevice({ deviceId, development = true, product, auth, headers, context }){
        return this.updateDevice({ deviceId, development, product, auth, headers, context });
    }

    /**
     * Mark device as being used in development of a product, so it opts out of automatic firmware updates
     * @param {Object}  options                         Options for this API call
     * @param {String}  options.deviceId                Device ID or Name
     * @param {Number}  options.desiredFirmwareVersion  Lock the product device to run this firmware version.
     * @param {Boolean} [options.flash]                 Immediately flash firmware indicated by desiredFirmwareVersion
     * @param {String}  options.product                 Device in this product ID or slug
     * @param {Auth}    [options.auth]                  The access token or basic auth object. Can be ignored if provided in constructor
     * @param {Object}  [options.headers]               Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object}  [options.context]               Request context
     * @returns {Promise} A promise
     */
    lockDeviceProductFirmware({ deviceId, desiredFirmwareVersion, flash, product, auth, headers, context }){
        return this.updateDevice({ deviceId, desiredFirmwareVersion, flash, product, auth, headers, context });
    }

    /**
     * Mark device as receiving automatic firmware updates
     * @param {Object} options            Options for this API call
     * @param {String} options.deviceId   Device ID or Name
     * @param {String} options.product    Device in this product ID or slug
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
     * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object} [options.context]  Request context
     * @returns {Promise} A promise
     */
    unlockDeviceProductFirmware({ deviceId, product, auth, headers, context }){
        return this.updateDevice({ deviceId, desiredFirmwareVersion: null, product, auth, headers, context });
    }

    /**
     * Update multiple device attributes at the same time
     * @param {Object}        options                           Options for this API call
     * @param {String}        options.deviceId                  Device ID or Name
     * @param {String}        [options.name]                    Desired Name
     * @param {Boolean}       [options.signal]                  Signal device on or off
     * @param {String}        [options.notes]                   Your notes about this device
     * @param {Boolean}       [options.development]             (Product only) Set to true to mark as development, false to return to product fleet
     * @param {Number | null} [options.desiredFirmwareVersion]  (Product only) Lock the product device to run this firmware version.
     *                                                          Pass `null` to unlock firmware and go back to released firmware.
     * @param {Boolean}       [options.flash]                   (Product only) Immediately flash firmware indicated by desiredFirmwareVersion
     * @param {String}        [options.product]                 Device in this product ID or slug
     * @param {Auth}          [options.auth]                    The access token or basic auth object. Can be ignored if provided in constructor
     * @param {Object}        [options.headers]                 Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object}        [options.context]                 Request context
     * @returns {Promise} A promise
     */
    updateDevice({ deviceId, name, signal, notes, development, desiredFirmwareVersion, flash, product, auth, headers, context }){
        let signalValue;
        if (signal !== undefined){
            signalValue = signal ? '1' : '0';
        }

        const uri = this.deviceUri({ deviceId, product });
        const data = product ?
            { name, signal: signalValue, notes, development, desired_firmware_version: desiredFirmwareVersion, flash } :
            { name, signal: signalValue, notes };

        return this.put({ uri, auth, headers, data, context });
    }

    /**
     * Provision a new device for products that allow self-provisioning
     * @param {Object} options            Options for this API call
     * @param {String} options.productId  Product ID where to create this device
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]                  The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
     * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object} [options.context]  Request context
     * @returns {Promise} A promise
     */
    flashTinker({ deviceId, auth, headers, context }){
        /* eslint-disable no-console */
        /* @ts-ignore */
        if (console && console.warning){
            // @ts-ignore
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
     * @param {Auth}   [options.auth]                  The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
     * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object} [options.context]  Request context
     * @returns {Promise<RequestResponse, RequestError>} A promise
     */
    downloadFirmwareBinary({ binaryId, auth, headers, context }){
        return this.request({
            uri: `/v1/binaries/${binaryId}`,
            method: 'get',
            auth,
            headers,
            context,
            isBuffer: true
        });
    }

    /**
     * Send a new device public key to the Particle Cloud
     * @param {Object}          options                  Options for this API call
     * @param {String}          options.deviceId         Device ID or Name
     * @param {String | Buffer} options.key              Public key contents
     * @param {String}          [options.algorithm=rsa]  Algorithm used to generate the public key. Valid values are `rsa` or `ecc`.
     * @param {Auth}            [options.auth]           The access token or basic auth object. Can be ignored if provided in constructor
     * @param {Object}          [options.headers]        Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object}          [options.context]        Request context
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]      The access token or basic auth object. Can be ignored if provided in constructor
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

        auth = this._getActiveAuthToken(auth);
        return new EventStream(`${this.baseUrl}${uri}`, auth).connect();
    }

    /**
     * Publish a event to the Particle Cloud
     * @param {Object}  options            Options for this API call
     * @param {String}  options.name       Event name
     * @param {String}  options.data       Event data
     * @param {Boolean} options.isPrivate  Should the event be publicly available?
     * @param {String}  [options.product]  Event for this product ID or slug
     * @param {Auth}    [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
     * @param {Object}  [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object}  [options.context]  Request context
     * @returns {Promise} A promise
     */
    publishEvent({ name, data, isPrivate, product, auth, headers, context }){
        const uri = product ? `/v1/products/${product}/events` : '/v1/devices/events';
        const postData = { name, data, private: isPrivate };
        return this.post({ uri, auth, headers, data: postData, context });
    }

    /**
     * @typedef  {Object}  Hook
     * @property {String}  [method=POST]         Type of web request triggered by the Webhook (GET, POST, PUT, or DELETE)
     * @property {Object}  [auth]                Auth data like `{ username: 'me', password: '1234' }` to send via basic auth header with the Webhook request
     * @property {Object}  [headers]             Additional headers to add to the Webhook like `{ 'X-ONE': '1', X-TWO: '2' }`
     * @property {Object}  [query]               Query params to add to the Webhook request like `{ foo: 'foo', bar: 'bar' }`
     * @property {Object}  [json]                JSON data to send with the Webhook request - sets `Content-Type` to `application/json`
     * @property {Object}  [form]                Form data to send with the Webhook request - sets `Content-Type` to `application/x-www-form-urlencoded`
     * @property {String}  [body]                Custom body to send with the Webhook request
     * @property {Object}  [responseTemplate]    Template to use to customize the Webhook response body
     * @property {Object}  [responseEvent]       The Webhook response event name that your devices can subscribe to
     * @property {Object}  [errorResponseEvent]  The Webhook error response event name that your devices can subscribe to
     */

    /**
     * Create a webhook
     * @param {Object}  options                       Options for this API call
     * @param {String}  options.event                 The name of the Particle event that should trigger the Webhook
     * @param {String}  options.url                   The web address that will be targeted when the Webhook is triggered
     * @param {String}  [options.device]              Trigger Webhook only for this device ID or Name
     * @param {Boolean} [options.rejectUnauthorized]  Set to `false` to skip SSL certificate validation of the target URL
     * @param {Boolean} [options.noDefaults]          Don't include default event data in the webhook request
     * @param {Hook}    [options.hook]                Webhook configuration settings
     * @param {String}  [options.product]             Webhook for this product ID or slug
     * @param {Auth}    [options.auth]                The access token or basic auth object. Can be ignored if provided in constructor
     * @param {Object}  [options.headers]             Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object}  [options.context]             Request context
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
     * @param {Auth}   [options.auth] The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth] The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]      The access token or basic auth object. Can be ignored if provided in constructor
     * @param {Object} [options.headers]   Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object} [options.context]   Request context
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
     * @param {Auth}   [options.auth]         The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]         The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]       The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Object}  options                   Options for this API call
     * @param {Auth}    [options.auth]            The access token or basic auth object. Can be ignored if provided in constructor
     * @param {String}  options.currentPassword   Current password
     * @param {String}  options.username          New email
     * @param {Boolean} options.invalidateTokens  Should all tokens be invalidated
     * @param {Object}  [options.headers]         Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object}  [options.context]         Request context
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
     * @param {Object}  options                   Options for this API call
     * @param {Auth}    [options.auth]            The access token or basic auth object. Can be ignored if provided in constructor
     * @param {String}  options.currentPassword   Current password
     * @param {String}  options.password          New password
     * @param {Boolean} options.invalidateTokens  Should all tokens be invalidated
     * @param {Object}  [options.headers]         Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object}  [options.context]         Request context
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
     * @param {Auth}   [options.auth]        The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
     * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object} [options.context]  Request context
     * @returns {Promise} A promise
     */
    checkSIM({ iccid, auth, headers, context }){
        return this.head({ uri: `/v1/sims/${iccid}`, auth, headers, context });
    }

    /**
     * Activate and add SIM cards to an account or product
     * @param {Object}        options              Options for this API call
     * @param {String}        options.iccid        ICCID of the SIM card
     * @param {Array<String>} options.iccids       (Product only) ICCID of multiple SIM cards to import
     * @param {String}        options.country      The ISO country code for the SIM cards
     * @param {String}        [options.product]    SIM cards for this product ID or slug
     * @param {Auth}          [options.auth]       The access token or basic auth object. Can be ignored if provided in constructor
     * @param {Object}        [options.headers]    Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object}        [options.context]    Request context
     * @param {any}           [options.promoCode]
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Object}  options                       Options for this API call
     * @param {Boolean} [options.onlyFeatured=false]  Only list featured build targets
     * @param {Auth}    [options.auth]                The access token or basic auth object. Can be ignored if provided in constructor
     * @param {Object}  [options.headers]             Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object}  [options.context]             Request context
     * @returns {Promise} A promise
     */
    listBuildTargets({ onlyFeatured, auth, headers, context }){
        const query = onlyFeatured ? { featured: !!onlyFeatured } : undefined;
        return this.get({ uri: '/v1/build_targets', auth, headers, query, context });
    }

    /**
     * List firmware libraries
     * @param {Object}         options                Options for this API call
     * @param {Number}         options.page           Page index (default, first page)
     * @param {Number}         options.limit          Number of items per page
     * @param {String}         options.filter         Search term for the libraries
     * @param {String}         options.sort           Ordering key for the library list
     * @param {Array<String>}  options.architectures  List of architectures to filter
     * @param {String}         options.category       Category to filter
     * @param {String}         options.scope          The library scope to list. Default is 'all'. Other values are
     *                                                - 'all' - list public libraries and my private libraries
     *                                                - 'public' - list only public libraries
     *                                                - 'private' - list only my private libraries
     *                                                - 'mine' - list my libraries (public and private)
     *                                                - 'official' - list only official libraries
     *                                                - 'verified' - list only verified libraries
     *                                                - 'featured' - list only featured libraries
     * @param {String}         options.excludeScopes  list of scopes to exclude
     * @param {String}         options.category       Category to filter
     * @param {Auth}           [options.auth]         The access token or basic auth object. Can be ignored if provided in constructor
     * @param {Object}         [options.headers]      Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object}         [options.context]      Request context
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Object}          options            Options for this API call
     * @param {String | Buffer} options.archive    Compressed archive file containing the library sources
     *                                             Either a path or Buffer of the file contents in Node, or a File or Blob in the browser.
     * @param {Auth}            [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
     * @param {Object}          [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object}          [options.context]  Request context
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
        return this.request({ uri, method: 'get', headers, context, isBuffer: true });
    }

    /**
     * List OAuth client created by the account
     * @param {Object} options            Options for this API call
     * @param {String} [options.product]  List clients for this product ID or slug
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]          The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]         The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]         The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
     * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object} [options.context]  Request context
     * @returns {Promise<RequestResponse, RequestError>} A promise that resolves with either the requested data or an error object
     */
    downloadProductFirmware({ version, product, auth, headers, context }){
        return this.request({
            uri: `/v1/products/${product}/firmware/${version}/binary`,
            method: 'get',
            auth,
            headers,
            context,
            isBuffer: true
        });
    }

    /**
     * Release a product firmware version as the default version
     * @param {Object} options            Options for this API call
     * @param {Number} options.version    Version number of new firmware
     * @param {String} options.product    Firmware for this product ID or slug
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]        The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]       The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
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
     * @param {Object} options            Options for this API call
     * @param {String} options.product    Config for this product ID or slug
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
     * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object} [options.context]  Request context
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
     * @param {Object} options            Options for this API call
     * @param {String} options.product    Config for this product ID or slug
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
     * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object} [options.context]  Request context
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
     * @param {Object} options            Options for this API call
     * @param {String} options.product    Config for this product ID or slug
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
     * @param {String} options.deviceId   Device ID to access
     * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object} [options.context]  Request context
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
     * @param {Object} options            Options for this API call
     * @param {String} options.product    Config for this product ID or slug
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
     * @param {String} options.deviceId   Device ID to access
     * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object} [options.context]  Request context
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
     * @param {Object} options            Options for this API call
     * @param {String} options.product    Config for this product ID or slug
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
     * @param {Object} options.config     Product configuration to update
     * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object} [options.context]  Request context
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
     * @param {Object} options            Options for this API call
     * @param {String} options.product    Config for this product ID or slug
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
     * @param {Object} options.config     Product configuration to update
     * @param {String} options.deviceId   Device ID to access
     * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object} [options.context]  Request context
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
     * @param {Object} options             Options for this API call
     * @param {String} options.product     Locations for this product ID or slug
     * @param {Auth}   [options.auth]      The access token or basic auth object. Can be ignored if provided in constructor
     * @param {String} options.dateRange   Start and end date in ISO8601 format, separated by comma, to query
     * @param {String} options.rectBl      Bottom left of the rectangular bounding box to query. Latitude and longitude separated by comma
     * @param {String} options.rectTr      Top right of the rectangular bounding box to query. Latitude and longitude separated by comma
     * @param {String} options.deviceId    Device ID prefix to include in the query
     * @param {String} options.deviceName  Device name prefix to include in the query
     * @param {String} options.groups      Array of group names to include in the query
     * @param {String} options.page        Page of results to display. Defaults to 1
     * @param {String} options.perPage     Number of results per page. Defaults to 20. Maximum of 100
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
     * @param {Object} options            Options for this API call
     * @param {String} options.product    Locations for this product ID or slug
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
     * @param {String} options.dateRange  Start and end date in ISO8601 format, separated by comma, to query
     * @param {String} options.rectBl     Bottom left of the rectangular bounding box to query. Latitude and longitude separated by comma
     * @param {String} options.rectTr     Top right of the rectangular bounding box to query. Latitude and longitude separated by comma
     * @param {String} options.deviceId   Device ID to query
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
     * Executes the provided logic function once and returns the result. No logs, runs, etc are saved
     *
     * NOTE: Any external interactions such as Particle.publish will actually occur when the logic is executed.
     *
     * @param {Object} options            The options for creating the logic function.
     * @param {Auth}   [options.auth]     The access token or basic auth object. Can be ignored if provided in constructor
     * @param {string} [options.org]      The Organization ID or slug. If not provided, the request will go to your sandbox account.
     * @param {Object} options.logic      The logic "function" which will be executed once
     * @param {Object} [options.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object} [options.context]  Request context
     *
     * @returns {Promise<RequestResponse>} A promise that resolves to the created logic function data.
     */
    executeLogic({ auth, org, logic, headers, context }) {
        return this.post({
            uri: this._namespacedPath(org, 'logic/execute'),
            auth,
            data: logic,
            headers,
            context
        });
    }

    /**
     * Creates a new logic function in the specified organization or sandbox using the provided function data.
     *
     * When you create a logic function with Event logic triggers, events will immediately
     * start being handled by the function code.
     *
     * When you create a Scheduled logic trigger, it will immediately be scheduled at the next time
     * according to the cron and start_at properties.
     *
     * @param {Object} options                The options for creating the logic function.
     * @param {Auth}   [options.auth]         The access token or basic auth object. Can be ignored if provided in constructor
     * @param {string} [options.org]          The Organization ID or slug. If not provided, the request will go to your sandbox account.
     * @param {string} options.logicFunction  The logic function object containing the function details.
     * @param {Object} [options.headers]      Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object} [options.context]      Request context
     *
     * @returns {Promise<RequestResponse>} A promise that resolves to the created logic function data.
     */
    createLogicFunction({ auth, org, logicFunction, headers, context }) {
        return this.post({
            uri: this._namespacedPath(org, 'logic/functions'),
            auth,
            data: { logic_function: logicFunction },
            headers,
            context
        });
    }

    /**
     * Get a logic function in the specified organization or sandbox by logic function ID.
     *
     * @param {Object} options                 The options for the logic function.
     * @param {Auth}   [options.auth]          The access token or basic auth object. Can be ignored if provided in constructor
     * @param {string} [options.org]           The Organization ID or slug. If not provided, the request will go to your sandbox account.
     * @param {string} options.logicFunctionId The ID of the logic function to retrieve.
     * @param {Object} [options.headers]       Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object} [options.context]       Request context
     *
     * @returns {Promise<RequestResponse>} A promise that resolves to the specified logic function data.
     */
    getLogicFunction({ auth, org, logicFunctionId, headers, context }) {
        return this.get({
            uri: this._namespacedPath(org, `logic/functions/${logicFunctionId}`),
            auth,
            headers,
            context
        });
    }

    /**
     * Updates an existing logic function in the specified organization or sandbox using the provided function data.
     *
     * If you include an id on a logic trigger, it will update the logic trigger in place.
     *
     * @param {Object} options                  The options for updating the logic function.
     * @param {Auth}   [options.auth]           The access token or basic auth object. Can be ignored if provided in constructor
     * @param {string} [options.org]            The Organization ID or slug. If not provided, the request will go to your sandbox account.
     * @param {string} options.logicFunctionId  The ID of the logic function to update.
     * @param {string} options.logicFunction    The logic function object containing the logic function details.
     * @param {Object} [options.headers]        Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object} [options.context]        Request context.
     *
     * @returns {Promise<RequestResponse>} A promise that resolves to the updated logic function data.
     */
    updateLogicFunction({ auth, org, logicFunctionId, logicFunction, headers, context }) {
        return this.put({
            uri: this._namespacedPath(org, `logic/functions/${logicFunctionId}`),
            auth,
            data: { logic_function: logicFunction },
            headers,
            context
        });
    }

    /**
     * Deletes a logic function in the specified organization or sandbox by logic function ID.
     *
     * @param {Object} options                  The options for deleting the logic function.
     * @param {Auth}   [options.auth]           The access token or basic auth object. Can be ignored if provided in constructor
     * @param {string} [options.org]            The Organization ID or slug. If not provided, the request will go to your sandbox account.
     * @param {string} options.logicFunctionId  The ID of the logic function to delete.
     * @param {Object} [options.headers]        Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object} [options.context]        Request context.
     *
     * @returns {Promise<RequestResponse>} A promise that resolves to an object containing the deleted logic function ID.
     */
    deleteLogicFunction({ auth, org, logicFunctionId, headers, context }) {
        return this.delete({
            uri: this._namespacedPath(org, `logic/functions/${logicFunctionId}`),
            auth,
            headers,
            context
        });
    }

    /**
     * Lists all logic functions in the specified organization or sandbox.
     *
     * @param {Object}  options               The options for listing logic functions.
     * @param {Auth}    [options.auth]        The access token or basic auth object. Can be ignored if provided in constructor
     * @param {string}  [options.org]         The Organization ID or slug. If not provided, the request will go to your sandbox account.
     * @param {boolean} [options.todayStats]  Whether to include today's stats in the response
     * @param {Object}  [options.headers]     Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object}  [options.context]     Request context.
     *
     * @returns {Promise<RequestResponse>} A promise that resolves to an array of logic functions data.
     */
    listLogicFunctions({ auth, org, todayStats, headers, context }) {
        return this.get({
            uri: this._namespacedPath(org, 'logic/functions'),
            query: {
                today_stats: todayStats
            },
            auth,
            headers,
            context
        });
    }

    /**
     * Lists all logic runs for the specified logic function in the specified organization or sandbox.
     *
     * @param {Object} options                  The options for the request.
     * @param {Auth}   [options.auth]           The access token or basic auth object. Can be ignored if provided in constructor
     * @param {string} [options.org]            The Organization ID or slug. If not provided, the request will go to your sandbox account.
     * @param {number} options.logicFunctionId  The ID of the logic function for which to retrieve the logic runs.
     * @param {Object} [options.headers]        Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object} [options.context]        Request context
     *
     * @returns {Promise<RequestResponse>} A promise that resolves to an array of logic run data.
     */
    listLogicRuns({ auth, org, logicFunctionId, headers, context }) {
        return this.get({
            uri: this._namespacedPath(org, `logic/functions/${logicFunctionId}/runs`),
            auth,
            headers,
            context
        });
    }

    /**
     * Retrieves a logic run by its ID for the specified logic function in the specified organization or sandbox.
     *
     * @param {Object} options                  The options for the request.
     * @param {Auth}   [options.auth]           The access token or basic auth object. Can be ignored if provided in constructor
     * @param {string} [options.org]            The Organization ID or slug. If not provided, the request will go to your sandbox account.
     * @param {number} options.logicFunctionId  The ID of the logic function for which to retrieve the logic run.
     * @param {number} options.logicRunId       The ID of the logic run to retrieve.
     * @param {Object} [options.headers]        Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object} [options.context]        Request context
     *
     * @returns {Promise<RequestResponse>} A promise that resolves to an array of logic run data for the specified logic run ID.
     */
    getLogicRun({ auth, org, logicFunctionId, logicRunId, headers, context }) {
        return this.get({
            uri: this._namespacedPath(org, `logic/functions/${logicFunctionId}/runs/${logicRunId}`),
            auth,
            headers,
            context
        });
    }

    /**
     * Retrieves the logs for a logic run by its ID for the specified logic function in the specified organization or sandbox.
     *
     * @param {Object} options                  The options for the request.
     * @param {Auth}   [options.auth]           The access token or basic auth object. Can be ignored if provided in constructor
     * @param {string} [options.org]            The unique identifier of the organization.
     * @param {number} options.logicFunctionId  The ID of the logic function for which to retrieve the logic run logs.
     * @param {number} options.logicRunId       The ID of the logic run for which to retrieve the logs.
     * @param {Object} [options.headers]        Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object} [options.context]        Request context
     *
     * @returns {Promise<RequestResponse>} A promise that resolves to the logs for the specified logic run ID.
     */
    getLogicRunLogs({ auth, org, logicFunctionId, logicRunId, headers, context }) {
        return this.get({
            uri: this._namespacedPath(org, `logic/functions/${logicFunctionId}/runs/${logicRunId}/logs`),
            auth,
            headers,
            context
        });
    }

    /**
     * Creates a new ledger definition in the specified organization or sandbox.
     *
     * @param {Object} options              The options for creating the ledger definition.
     * @param {Auth}   [options.auth]       The access token or basic auth object. Can be ignored if provided in constructor
     * @param {string} [options.org]        The Organization ID or slug. If not provided, the request will go to your sandbox account.
     * @param {object} options.ledger       The ledger definition object.
     * @param {Object} [options.headers]    Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object} [options.context]    Request context
     *
     * @returns {Promise<RequestResponse>} A promise that resolves to the created ledger definition data.
     */
    createLedger({ auth, org, ledger, headers, context }) {
        return this.post({
            uri: this._namespacedPath(org, 'ledgers'),
            auth,
            data: { ledger },
            headers,
            context
        });
    }

    /**
     * Get a ledger definition in the specified organization or sandbox by ledger name.
     *
     * @param {Object} options             The options for the ledger definition.
     * @param {Auth}   [options.auth]      The access token or basic auth object. Can be ignored if provided in constructor
     * @param {string} [options.org]       The Organization ID or slug. If not provided, the request will go to your sandbox account.
     * @param {string} options.ledgerName  The ID of the ledger definition to retrieve.
     * @param {Object} [options.headers]   Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object} [options.context]   Request context
     *
     * @returns {Promise<RequestResponse>} A promise that resolves to the specified ledger definition data.
     */
    getLedger({ auth, org, ledgerName, headers, context }) {
        return this.get({
            uri: this._namespacedPath(org, `ledgers/${ledgerName}`),
            auth,
            headers,
            context
        });
    }

    /**
     * Updates an existing ledger definition in the specified organization or sandbox.
     *
     * @param {Object} options             The options for updating the ledger definition.
     * @param {Auth}   [options.auth]      The access token or basic auth object. Can be ignored if provided in constructor
     * @param {string} [options.org]       The Organization ID or slug. If not provided, the request will go to your sandbox account.
     * @param {string} options.ledgerName  Name of the ledger definition to update.
     * @param {object} options.ledger      The ledger definition object.
     * @param {Object} [options.headers]   Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object} [options.context]   Request context.
     *
     * @returns {Promise<RequestResponse>} A promise that resolves to the updated ledger definition data.
     */
    updateLedger({ auth, org, ledgerName, ledger, headers, context }) {
        return this.put({
            uri: this._namespacedPath(org, `ledgers/${ledgerName}`),
            auth,
            data: { ledger },
            headers,
            context
        });
    }

    /**
     * Archives a ledger definition in the specified organization or sandbox by ledger name.
     *
     * @param {Object} options             The options for archiving the ledger definition.
     * @param {Auth}   [options.auth]      The access token or basic auth object. Can be ignored if provided in constructor
     * @param {string} [options.org]       The Organization ID or slug. If not provided, the request will go to your sandbox account.
     * @param {string} options.ledgerName  Name of the ledger definition to archive.
     * @param {Object} [options.headers]   Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object} [options.context]   Request context.
     *
     * @returns {Promise<RequestResponse>} A promise that resolves to an object confirming the ledger definition was archived.
     */
    archiveLedger({ auth, org, ledgerName, headers, context }) {
        return this.delete({
            uri: this._namespacedPath(org, `ledgers/${ledgerName}`),
            auth,
            headers,
            context
        });
    }

    /**
     * @typedef {"Owner" | "Product" | "Device"} Scope
     */

    /**
     * Lists all ledger definitions in the specified organization or sandbox.
     *
     * @param {Object}  options             The options for listing ledger definitions.
     * @param {Auth}    [options.auth]      The access token or basic auth object. Can be ignored if provided in constructor
     * @param {string}  [options.org]       The Organization ID or slug. If not provided, the request will go to your sandbox account.
     * @param {Scope}   [options.scope]     Filter to show only ledgers of the specified scope
     * @param {boolean} [options.archived]  Filter to show only archived ledger or non-archived ledgers. If not provided, all ledgers are returned.
     * @param {number}  [options.page]      Page of results to display
     * @param {number}  [options.perPage]   Number of results per page. Default is 100
     * @param {Object}  [options.headers]   Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object}  [options.context]   Request context.
     *
     * @returns {Promise<RequestResponse>} A promise that resolves to an array of ledger definition data.
     */
    listLedgers({ auth, org, scope, page, perPage, archived, headers, context }) {
        return this.get({
            uri: this._namespacedPath(org, 'ledgers'),
            query: {
                scope,
                page,
                per_page: perPage,
                archived
            },
            auth,
            headers,
            context
        });
    }

    /**
     * Get ledger instance data.
     *
     * @param {Object} options             The options for the ledger instance.
     * @param {Auth}   [options.auth]      The access token or basic auth object. Can be ignored if provided in constructor
     * @param {string} [options.org]       The Organization ID or slug. If not provided, the request will go to your sandbox account.
     * @param {string} options.ledgerName  Ledger name.
     * @param {string} options.scopeValue  Scope value.
     * @param {Object} [options.headers]   Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object} [options.context]   Request context
     *
     * @returns {Promise<RequestResponse>} A promise that resolves to the specified ledger instance data.
     */
    getLedgerInstance({ auth, org, ledgerName, scopeValue, headers, context }) {
        return this.get({
            uri: this._namespacedPath(org, `ledgers/${ledgerName}/instances/${scopeValue}`),
            auth,
            headers,
            context
        });
    }

    /**
     * Set ledger instance data.
     *
     * @param {Object} options             The options for updating the ledger instance.
     * @param {Auth}   [options.auth]      The access token or basic auth object. Can be ignored if provided in constructor
     * @param {string} [options.org]       The Organization ID or slug. If not provided, the request will go to your sandbox account.
     * @param {string} options.ledgerName  Ledger name.
     * @param {string} options.scopeValue  Scope value.
     * @param {object} options.data        The data to set to the instance
     * @param {Object} [options.headers]   Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object} [options.context]   Request context.
     *
     * @returns {Promise<RequestResponse>} A promise that resolves to the updated ledger instance data.
     */
    setLedgerInstance({ auth, org, ledgerName, scopeValue, data, headers, context }) {
        return this.put({
            uri: this._namespacedPath(org, `ledgers/${ledgerName}/instances/${scopeValue}`),
            auth,
            data: { data },
            headers,
            context
        });
    }

    /**
     * Delete a ledger instance in the specified organization or sandbox by ledger name.
     *
     * @param {Object} options             The options for archiving the ledger instance.
     * @param {Auth}   [options.auth]      The access token or basic auth object. Can be ignored if provided in constructor
     * @param {string} [options.org]       The Organization ID or slug. If not provided, the request will go to your sandbox account.
     * @param {string} options.ledgerName  Name of the ledger instance to archive.
     * @param {string} options.scopeValue  Scope value.
     * @param {Object} [options.headers]   Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object} [options.context]   Request context.
     *
     * @returns {Promise<RequestResponse>} A promise that resolves to an object confirming the ledger instance was deleted.
     */
    deleteLedgerInstance({ auth, org, ledgerName, scopeValue, headers, context }) {
        return this.delete({
            uri: this._namespacedPath(org, `ledgers/${ledgerName}/instances/${scopeValue}`),
            auth,
            headers,
            context
        });
    }

    /**
     * Lists ledger instances in the specified organization or sandbox.
     *
     * @param {Object} options             The options for listing ledger instances.
     * @param {Auth}   [options.auth]      The access token or basic auth object. Can be ignored if provided in constructor
     * @param {string} [options.org]       The unique identifier of the organization.
     * @param {string} options.ledgerName  Name of the ledger instance to archive.
     * @param {number} [options.page]      Page of results to display
     * @param {number} [options.perPage]   Number of results per page. Default is 100
     * @param {Object} [options.headers]   Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object} [options.context]   Request context.
     *
     * @returns {Promise<RequestResponse>} A promise that resolves to an array of ledger instance data.
     */
    listLedgerInstances({ auth, org, ledgerName, page, perPage, headers, context }) {
        return this.get({
            uri: this._namespacedPath(org, `ledgers/${ledgerName}/instances`),
            query: {
                page,
                per_page: perPage
            },
            auth,
            headers,
            context
        });
    }

    /**
     * List ledger instance versions
     *
     * @param {Object} options                   The options for the ledger instance.
     * @param {Auth}   [options.auth]            The access token or basic auth object. Can be ignored if provided in constructor
     * @param {string} [options.org]             The Organization ID or slug. If not provided, the request will go to your sandbox account.
     * @param {string} options.ledgerName        Ledger name.
     * @param {string} options.scopeValue        Scope value.
     * @param {string} [options.replacedBefore]  ISO date string to filter to instances replaced before this time
     * @param {string} [options.replacedAfter]   ISO date string to filter to instances replaced after this time
     * @param {Object} [options.headers]         Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object} [options.context]         Request context
     *
     * @returns {Promise<RequestResponse>} A promise that resolves to an array of ledger instance data.
     */
    listLedgerInstanceVersions({ auth, org, ledgerName, scopeValue, replacedBefore, replacedAfter, headers, context }) {
        return this.get({
            uri: this._namespacedPath(org, `ledgers/${ledgerName}/instances/${scopeValue}/versions`),
            query: {
                replaced_before: replacedBefore,
                replaced_after: replacedAfter
            },
            auth,
            headers,
            context
        });
    }

    /**
     * Get specific ledger instance version
     *
     * @param {Object} options             The options for the ledger instance.
     * @param {Auth}   [options.auth]      The access token or basic auth object. Can be ignored if provided in constructor
     * @param {string} [options.org]       The Organization ID or slug. If not provided, the request will go to your sandbox account.
     * @param {string} options.ledgerName  Ledger name.
     * @param {string} options.scopeValue  Scope value.
     * @param {string} options.version     Version of the ledger instance
     * @param {Object} [options.headers]   Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {Object} [options.context]   Request context
     *
     * @returns {Promise<RequestResponse>} A promise that resolves to the specified ledger instance data.
     */
    getLedgerInstanceVersion({ auth, org, ledgerName, scopeValue, version, headers, context }) {
        return this.get({
            uri: this._namespacedPath(org, `ledgers/${ledgerName}/instances/${scopeValue}/versions/${version}`),
            auth,
            headers,
            context
        });
    }

    /**
     * Set default auth token that will be used in each method if `auth` is not provided
     * @param {Auth} auth The access token or basic auth object
     * @throws {Error} When not auth string is provided
     */
    setDefaultAuth(auth){
        if (typeof auth === 'string' && auth.length !== 0) {
            this._defaultAuth = auth;
        } else if (typeof auth === 'object' && 'username' in auth && 'password' in auth) {
            this._defaultAuth = auth;
        } else {
            throw new Error('Must pass a non-empty string or object with username and password for basic auth!');
        }
    }
    /**
     * Return provided token if truthy else use default auth if truthy else undefined
     * @param {any} auth Optional auth token or undefined
     * @private
     * @returns {String|undefined} a Particle auth token or undefined
     */
    _getActiveAuthToken(auth) {
        return auth || this._defaultAuth;
    }
    /**
     * API URI to access a device
     * @param {Object} options           Options for this API call
     * @param {String} options.deviceId  Device ID to access
     * @param {String} [options.product] Device only in this product ID or slug
     * @private
     * @returns {string} URI
     */
    deviceUri({ deviceId, product }){
        return product ? `/v1/products/${product}/devices/${deviceId}` : `/v1/devices/${deviceId}`;
    }

    /**
     * Helper for building API paths that support sandbox and org prefixes based on org presence
     * @param {string | undefined} org slug or ID
     * @param {string}             path will be appended to the end of the org/sandbox prefix
     * @returns {string} the full combined path
     * @private
     */
    _namespacedPath(org, path) {
        return org ? `/v1/orgs/${org}/${path}` : `/v1/${path}`;
    }

    /**
     * Make a GET request
     * @param {object} params
     * @param {string} params.uri        The URI to request
     * @param {Auth}   [params.auth]     Authorization token to use
     * @param {object} [params.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {object} [params.query]    Key/Value pairs of query params or a correctly formatted string
     * @param {object} [params.context]  The invocation context, describing the tool and project
     * @returns {Promise<RequestResponse, RequestError>} A promise that resolves with either the requested data or an error object
     */
    get({ uri, auth, headers, query, context }){
        context = this._buildContext(context);
        auth = this._getActiveAuthToken(auth);
        return this.agent.get({ uri, auth, headers, query, context });
    }

    /**
     * Make a HEAD request
     * @param {object} params
     * @param {string} params.uri        The URI to request
     * @param {Auth}   [params.auth]     Authorization token to use
     * @param {object} [params.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {object} [params.query]    Key/Value pairs of query params or a correctly formatted string
     * @param {object} [params.context]  The invocation context, describing the tool and project
     * @returns {Promise<RequestResponse, RequestError>} A promise that resolves with either the requested data or an error object
     */
    head({ uri, auth, headers, query, context }){
        context = this._buildContext(context);
        auth = this._getActiveAuthToken(auth);
        return this.agent.head({ uri, auth, headers, query, context });
    }

    /**
     * Make a POST request
     * @param {object}          params
     * @param {string}          params.uri        The URI to request
     * @param {Auth}            [params.auth]     Authorization token to use
     * @param {object}          [params.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {string | object} [params.data]     Key/Value pairs of query params or a correctly formatted string
     * @param {object}          [params.context]  The invocation context, describing the tool and project
     * @returns {Promise<RequestResponse, RequestError>} A promise that resolves with either the requested data or an error object
     */
    post({ uri, auth, headers, data, context }){
        context = this._buildContext(context);
        auth = this._getActiveAuthToken(auth);
        return this.agent.post({ uri, auth, headers, data, context });
    }

    /**
     * Make a PUT request
     * @param {object}          params
     * @param {string}          params.uri        The URI to request
     * @param {Auth}            [params.auth]     Authorization token to use
     * @param {object}          [params.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {string | object} [params.data]     Key/Value pairs of query params or a correctly formatted string
     * @param {object}          [params.context]  The invocation context, describing the tool and project
     * @returns {Promise<RequestResponse, RequestError>} A promise that resolves with either the requested data or an error object
     */
    put({ uri, auth, headers, data, context }){
        context = this._buildContext(context);
        auth = this._getActiveAuthToken(auth);
        return this.agent.put({ uri, auth, headers, data, context });
    }

    /**
     * Make a DELETE request
     * @param {object}          params
     * @param {string}          params.uri        The URI to request
     * @param {Auth}            [params.auth]     Authorization token to use
     * @param {object}          [params.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {string | object} [params.data]     Key/Value pairs of query params or a correctly formatted string
     * @param {object}          [params.context]  The invocation context, describing the tool and project
     * @returns {Promise<RequestResponse, RequestError>} A promise that resolves with either the requested data or an error object
     */
    delete({ uri, auth, headers, data, context }){
        context = this._buildContext(context);
        auth = this._getActiveAuthToken(auth);
        return this.agent.delete({ uri, auth, headers, data, context });
    }

    /**
     *
     * @param {Object}  args             An obj with all the possible request configurations
     * @param {String}  args.uri         The URI to request
     * @param {String}  args.method      The method used to request the URI, should be in uppercase.
     * @param {Object}  [args.headers]   Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {object}  [args.data]      Arbitrary data to send as the body.
     * @param {Auth}    [args.auth]      Authorization
     * @param {Object}  [args.query]     Query parameters
     * @param {Object}  [args.form]      Form fields
     * @param {Object}  [args.files]     Array of file names and file content
     * @param {Object}  [args.context]   The invocation context, describing the tool and project.
     * @param {boolean} [args.isBuffer]  Indicate if the response should be treated as Buffer instead of JSON
     * @returns {Promise<RequestResponse, RequestError>} A promise that resolves with either the requested data or an error object
     */
    request(args){
        args.context = this._buildContext(args.context);
        args.auth = this._getActiveAuthToken(args.auth);
        return this.agent.request(args);
    }

    client(options = {}){
        // @ts-ignore
        return new Client(Object.assign({ api: this }, options));
    }

    // Internal method used to target Particle's APIs other than the default
    setBaseUrl(baseUrl){
        this.baseUrl = baseUrl;
        this.agent.setBaseUrl(baseUrl);
    }
}

// Aliases for backwards compatibility
Particle.prototype.removeAccessToken = Particle.prototype.deleteAccessToken;

module.exports = Particle;
