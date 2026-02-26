import Defaults = require('./Defaults');
import EventStream = require('./EventStream');
import Agent = require('./Agent');
import Client = require('./Client');
import type { RequestResponse, AgentRequestOptions, GetHeadOptions, MutateOptions, ToolContext, ProjectContext } from './types';

class Particle {
	baseUrl!: string;
	clientId!: string;
	clientSecret!: string;
	tokenDuration!: number;
	auth: string | undefined;
	context: { tool?: ToolContext; project?: ProjectContext };
	agent: Agent;
	_defaultAuth?: string;

	constructor(options: { baseUrl?: string; clientId?: string; clientSecret?: string; tokenDuration?: number; auth?: string } = {}) {
		if (options.auth) {
			this.setDefaultAuth(options.auth);
		}

		Object.assign(this, Defaults, options);
		this.context = {};

		this.agent = new Agent(this.baseUrl);
	}

	_isValidContext(name: string, context: ToolContext | ProjectContext | undefined): boolean {
		return (name === 'tool' || name === 'project') && context !== undefined;
	}

	setContext(name: 'tool' | 'project', context: ToolContext | ProjectContext | undefined): void {
		if (context !== undefined) {
			if (this._isValidContext(name, context)) {
				if (name === 'tool') {
					this.context.tool = context as ToolContext;
				} else {
					this.context.project = context as ProjectContext;
				}
			} else {
				throw Error('unknown context name or undefined context: ' + name);
			}
		}
	}

	_buildContext(context: { tool?: ToolContext; project?: ProjectContext } | undefined): { tool?: ToolContext; project?: ProjectContext } {
		return Object.assign(this.context, context);
	}

	login({ username, password, tokenDuration = this.tokenDuration, headers, context }: { username: string; password: string; tokenDuration?: number; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
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

	sendOtp({ mfaToken, otp, headers, context }: { mfaToken: string; otp: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
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

	enableMfa({ auth, headers, context }: { auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.get({ uri: '/v1/user/mfa-enable', auth, headers, context });
	}

	confirmMfa({ mfaToken, otp, invalidateTokens = false, auth, headers, context }: { mfaToken: string; otp: string; invalidateTokens?: boolean; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		const data: { mfa_token: string; otp: string; invalidate_tokens?: boolean } = { mfa_token: mfaToken, otp };

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

	disableMfa({ currentPassword, auth, headers, context }: { currentPassword: string; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.put({
			uri: '/v1/user/mfa-disable',
			auth,
			headers,
			data: { current_password: currentPassword },
			context
		});
	}

	createCustomer({ email, password, product, headers, context }: { email: string; password: string; product: string | number; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
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

	loginAsClientOwner({ headers, context }: { headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } } = {}): Promise<RequestResponse> {
		return this.request({
			uri: '/oauth/token',
			method: 'post',
			headers,
			form: {
				grant_type: 'client_credentials',
				client_id: this.clientId,
				client_secret: this.clientSecret
			},
			context
		});
	}

	createUser({ username, password, accountInfo, utm, headers, context }: { username: string; password: string; accountInfo?: Record<string, string | number | boolean>; utm?: Record<string, string>; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.post({
			uri: '/v1/users',
			headers,
			data: {
				username,
				password,
				account_info: accountInfo,
				utm
			},
			context
		});
	}

	verifyUser({ token, headers, context }: { token: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.post({
			uri: '/v1/user/verify',
			headers,
			data: { token },
			context
		});
	}

	resetPassword({ username, headers, context }: { username: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.post({
			uri: '/v1/user/password-reset',
			headers,
			data: { username },
			context
		});
	}

	deleteAccessToken({ token, headers, context }: { token: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.delete({
			uri: `/v1/access_tokens/${token}`,
			headers,
			context
		});
	}

	deleteCurrentAccessToken({ auth, headers, context }: { auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.delete({
			uri: '/v1/access_tokens/current',
			auth,
			headers,
			context
		});
	}

	deleteActiveAccessTokens({ auth, headers, context }: { auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.delete({
			uri: '/v1/access_tokens',
			auth,
			headers,
			context
		});
	}

	deleteUser({ auth, password, headers, context }: { auth?: string; password: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.delete({
			uri: '/v1/user',
			data: { password },
			auth,
			headers,
			context
		});
	}

	trackingIdentity({ full = false, auth, headers, context }: { full?: boolean; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } } = {}): Promise<RequestResponse> {
		return this.get({
			uri: '/v1/user/identify',
			auth,
			headers,
			query: (full ? undefined : { tracking: 1 }),
			context
		});
	}

	listDevices({ deviceId, deviceName, groups, sortAttr, sortDir, page, perPage, product, auth, headers, context }: { deviceId?: string; deviceName?: string; groups?: string[]; sortAttr?: string; sortDir?: string; page?: number; perPage?: number; product?: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		let uri: string;
		let query: Record<string, string | number | string[] | undefined> | undefined;

		if (product) {
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

	getDevice({ deviceId, product, auth, headers, context }: { deviceId: string; product?: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		const uri = this.deviceUri({ deviceId, product });
		return this.get({ uri, auth, headers, context });
	}

	claimDevice({ deviceId, requestTransfer, auth, headers, context }: { deviceId: string; requestTransfer?: boolean; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
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

	addDeviceToProduct({ deviceId, product, file, auth, headers, context }: { deviceId?: string; product: string | number; file?: string | Buffer | NodeJS.ReadableStream | Blob; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		let files: Record<string, string | Buffer | NodeJS.ReadableStream | Blob> | undefined;
		let data: Record<string, string> | undefined;

		if (file) {
			files = { file };
		} else if (deviceId) {
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

	removeDevice({ deviceId, deny, product, auth, headers, context }: { deviceId: string; deny?: boolean; product?: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		const uri = this.deviceUri({ deviceId, product });
		const data = product ? { deny } : undefined;
		return this.delete({ uri, data, auth, headers, context });
	}

	removeDeviceOwner({ deviceId, product, auth, headers, context }: { deviceId: string; product: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		const uri = `/v1/products/${product}/devices/${deviceId}/owner`;
		return this.delete({ uri, auth, headers, context });
	}

	renameDevice({ deviceId, name, product, auth, headers, context }: { deviceId: string; name: string; product?: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.updateDevice({ deviceId, name, product, auth, headers, context });
	}

	signalDevice({ deviceId, signal, product, auth, headers, context }: { deviceId: string; signal: boolean; product?: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.updateDevice({ deviceId, signal, product, auth, headers, context });
	}

	setDeviceNotes({ deviceId, notes, product, auth, headers, context }: { deviceId: string; notes: string; product?: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.updateDevice({ deviceId, notes, product, auth, headers, context });
	}

	markAsDevelopmentDevice({ deviceId, development = true, product, auth, headers, context }: { deviceId: string; development?: boolean; product: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.updateDevice({ deviceId, development, product, auth, headers, context });
	}

	lockDeviceProductFirmware({ deviceId, desiredFirmwareVersion, flash, product, auth, headers, context }: { deviceId: string; desiredFirmwareVersion: number; flash?: boolean; product: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.updateDevice({ deviceId, desiredFirmwareVersion, flash, product, auth, headers, context });
	}

	unlockDeviceProductFirmware({ deviceId, product, auth, headers, context }: { deviceId: string; product: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.updateDevice({ deviceId, desiredFirmwareVersion: null, product, auth, headers, context });
	}

	updateDevice({ deviceId, name, signal, notes, development, desiredFirmwareVersion, flash, product, auth, headers, context }: { deviceId: string; name?: string; signal?: boolean; notes?: string; development?: boolean; desiredFirmwareVersion?: number | null; flash?: boolean; product?: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		let signalValue: string | undefined;
		if (signal !== undefined) {
			signalValue = signal ? '1' : '0';
		}

		const uri = this.deviceUri({ deviceId, product });
		const data = product ?
			{ name, signal: signalValue, notes, development, desired_firmware_version: desiredFirmwareVersion, flash } :
			{ name, signal: signalValue, notes };

		return this.put({ uri, auth, headers, data, context });
	}

	unprotectDevice({ deviceId, org, product, action, serverNonce, deviceNonce, deviceSignature, devicePublicKeyFingerprint, auth, headers, context }: { deviceId: string; org?: string; product?: string | number; action: 'prepare' | 'confirm'; serverNonce?: string; deviceNonce?: string; deviceSignature?: string; devicePublicKeyFingerprint?: string; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		const data: { action: string; device_nonce?: string; server_nonce?: string; device_signature?: string; device_public_key_fingerprint?: string } = { action };
		if (deviceNonce !== undefined) {
			data.device_nonce = deviceNonce;
		}
		if (serverNonce !== undefined) {
			data.server_nonce = serverNonce;
		}
		if (deviceSignature !== undefined) {
			data.device_signature = deviceSignature;
		}
		if (devicePublicKeyFingerprint !== undefined) {
			data.device_public_key_fingerprint = devicePublicKeyFingerprint;
		}
		const uri = this.deviceUri({ deviceId, product, org }) + '/unprotect';
		return this.put({ uri, data, auth, headers, context });
	}

	provisionDevice({ productId, auth, headers, context }: { productId: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.post({
			uri: '/v1/devices',
			auth,
			headers,
			data: { product_id: productId },
			context
		});
	}

	getClaimCode({ iccid, product, auth, headers, context }: { iccid?: string; product?: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		const uri = product ? `/v1/products/${product}/device_claims` : '/v1/device_claims';
		return this.post({ uri, auth, headers, data: { iccid }, context });
	}

	validatePromoCode({ promoCode, auth, headers, context }: { promoCode: string; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.get({
			uri: `/v1/promo_code/${promoCode}`,
			auth,
			headers,
			context
		});
	}

	getVariable({ deviceId, name, product, auth, headers, context }: { deviceId: string; name: string; product?: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		const uri = product ?
			`/v1/products/${product}/devices/${deviceId}/${name}` :
			`/v1/devices/${deviceId}/${name}`;

		return this.get({ uri, auth, headers, context });
	}

	flashDevice({ deviceId, product, files, targetVersion, auth, headers, context }: { deviceId: string; product?: string | number; files: Record<string, string | Buffer | NodeJS.ReadableStream | Blob>; targetVersion?: string; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		const uri = this.deviceUri({ deviceId, product });
		const form: Record<string, string> = {};

		if (targetVersion) {
			form.build_target_version = targetVersion;
		} else {
			form.latest = 'true';
		}

		return this.request({ uri, method: 'put', auth, headers, files, form, context });
	}

	flashTinker({ deviceId, auth, headers, context }: { deviceId: string; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		/* eslint-disable no-console */
		const consoleWithWarning = console as { warning?: (...args: string[]) => void };
		if (console && consoleWithWarning.warning) {
			consoleWithWarning.warning('Particle.flashTinker is deprecated');
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

	compileCode({ files, platformId, targetVersion, auth, headers, context }: { files: Record<string, string | Buffer | NodeJS.ReadableStream | Blob>; platformId?: number; targetVersion?: string; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		const form: Record<string, string | number | undefined> = { platform_id: platformId };

		if (targetVersion) {
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
			form: form as Record<string, string | number | boolean | undefined>,
			context
		});
	}

	downloadFirmwareBinary({ binaryId, auth, headers, context }: { binaryId: string; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.request({
			uri: `/v1/binaries/${binaryId}`,
			method: 'get',
			auth,
			headers,
			context,
			isBuffer: true
		});
	}

	sendPublicKey({ deviceId, key, algorithm, auth, headers, context }: { deviceId: string; key: string | Buffer; algorithm?: string; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.post({
			uri: `/v1/provisioning/${deviceId}`,
			auth,
			headers,
			data: {
				deviceID: deviceId,
				publicKey: (typeof key === 'string' ? key : key.toString()),
				filename: 'particle-api',
				order: `manual_${Date.now()}`,
				algorithm: algorithm || 'rsa'
			},
			context
		});
	}

	callFunction({ deviceId, name, argument, product, auth, headers, context }: { deviceId: string; name: string; argument?: string; product?: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		const uri = product ?
			`/v1/products/${product}/devices/${deviceId}/${name}` :
			`/v1/devices/${deviceId}/${name}`;
		return this.post({ uri, auth, headers, data: { args: argument }, context });
	}

	getEventStream({ deviceId, name, org, product, auth }: { deviceId?: string; name?: string; org?: string; product?: string | number; auth?: string }): Promise<EventStream> {
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

		const activeAuth = this._getActiveAuthToken(auth) || '';
		return new EventStream(`${this.baseUrl}${uri}`, activeAuth).connect();
	}

	publishEvent({ name, data, isPrivate, product, auth, headers, context }: { name: string; data?: string; isPrivate?: boolean; product?: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		const uri = product ? `/v1/products/${product}/events` : '/v1/devices/events';
		const postData = { name, data, private: isPrivate };
		return this.post({ uri, auth, headers, data: postData, context });
	}

	createWebhook({ event, url, device, rejectUnauthorized, noDefaults, hook, product, auth, headers, context }: { event: string; url: string; device?: string; rejectUnauthorized?: boolean; noDefaults?: boolean; hook?: { method?: string; auth?: Record<string, string>; headers?: Record<string, string>; query?: Record<string, string>; json?: object; form?: object; body?: string; responseTemplate?: string; responseEvent?: string; errorResponseEvent?: string }; product?: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		const uri = product ? `/v1/products/${product}/webhooks` : '/v1/webhooks';
		const data: Record<string, string | boolean | object | undefined> = { event, url, deviceId: device, rejectUnauthorized, noDefaults };

		if (hook) {
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

		if (!data.requestType) {
			data.requestType = 'POST';
		}

		return this.post({ uri, auth, headers, data, context });
	}

	deleteWebhook({ hookId, product, auth, headers, context }: { hookId: string; product?: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		const uri = product ? `/v1/products/${product}/webhooks/${hookId}` : `/v1/webhooks/${hookId}`;
		return this.delete({ uri, auth, headers, context });
	}

	listWebhooks({ product, auth, headers, context }: { product?: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		const uri = product ? `/v1/products/${product}/webhooks` : '/v1/webhooks';
		return this.get({ uri, auth, headers, context });
	}

	createIntegration({ event, settings, deviceId, product, auth, headers, context }: { event: string; settings: Record<string, string | number | boolean | object>; deviceId?: string; product?: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		const uri = product ? `/v1/products/${product}/integrations` : '/v1/integrations';
		const data = Object.assign({ event, deviceid: deviceId }, settings);
		return this.post({ uri, data, auth, headers, context });
	}

	editIntegration({ integrationId, event, settings, deviceId, product, auth, headers, context }: { integrationId: string; event?: string; settings?: Record<string, string | number | boolean | object>; deviceId?: string; product?: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		const uri = product ? `/v1/products/${product}/integrations/${integrationId}` : `/v1/integrations/${integrationId}`;
		const data = Object.assign({ event, deviceid: deviceId }, settings);
		return this.put({ uri, auth, headers, data, context });
	}

	deleteIntegration({ integrationId, product, auth, headers, context }: { integrationId: string; product?: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		const uri = product ? `/v1/products/${product}/integrations/${integrationId}` : `/v1/integrations/${integrationId}`;
		return this.delete({ uri, auth, headers, context });
	}

	listIntegrations({ product, auth, headers, context }: { product?: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		const uri = product ? `/v1/products/${product}/integrations` : '/v1/integrations';
		return this.get({ uri, auth, headers, context });
	}

	getUserInfo({ auth, headers, context }: { auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.get({ uri: '/v1/user', auth, headers, context });
	}

	setUserInfo({ accountInfo, auth, headers, context }: { accountInfo?: Record<string, string | number | boolean>; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		const data = { account_info: accountInfo };
		return this.put({ uri: '/v1/user', auth, headers, data, context });
	}

	changeUsername({ currentPassword, username, invalidateTokens = false, auth, headers, context }: { currentPassword: string; username: string; invalidateTokens?: boolean; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		const data: { username: string; current_password: string; invalidate_tokens?: boolean } = { username, current_password: currentPassword };

		if (invalidateTokens) {
			data.invalidate_tokens = true;
		}

		return this.put({ uri: '/v1/user', auth, headers, data, context });
	}

	changeUserPassword({ currentPassword, password, invalidateTokens = false, auth, headers, context }: { currentPassword: string; password: string; invalidateTokens?: boolean; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		const data: { password: string; current_password: string; invalidate_tokens?: boolean } = { password, current_password: currentPassword };

		if (invalidateTokens) {
			data.invalidate_tokens = true;
		}

		return this.put({ uri: '/v1/user', auth, headers, data, context });
	}

	listSIMs({ iccid, deviceId, deviceName, page, perPage, product, auth, headers, context }: { iccid?: string; deviceId?: string; deviceName?: string; page?: number; perPage?: number; product?: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		const uri = product ? `/v1/products/${product}/sims` : '/v1/sims';
		const query = product ? { iccid, deviceId, deviceName, page, per_page: perPage } : undefined;
		return this.get({ uri, auth, headers, query, context });
	}

	getSIMDataUsage({ iccid, product, auth, headers, context }: { iccid: string; product?: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		const uri = product ?
			`/v1/products/${product}/sims/${iccid}/data_usage` :
			`/v1/sims/${iccid}/data_usage`;

		return this.get({ uri, auth, headers, context });
	}

	getFleetDataUsage({ product, auth, headers, context }: { product: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.get({
			uri: `/v1/products/${product}/sims/data_usage`,
			auth,
			headers,
			context
		});
	}

	checkSIM({ iccid, auth, headers, context }: { iccid: string; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.head({ uri: `/v1/sims/${iccid}`, auth, headers, context });
	}

	activateSIM({ iccid, iccids, country, promoCode, product, auth, headers, context }: { iccid?: string; iccids?: string[]; country: string; promoCode?: string; product?: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		const resolvedIccids = iccids || [iccid];
		const uri = product ? `/v1/products/${product}/sims` : `/v1/sims/${iccid}`;
		const data = product ?
			{ sims: resolvedIccids, country } :
			{ country, promoCode, action: 'activate' };
		const method: AgentRequestOptions['method'] = product ? 'post' : 'put';

		return this.request({ uri, method, headers, data, auth, context });
	}

	deactivateSIM({ iccid, product, auth, headers, context }: { iccid: string; product?: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		const uri = product ? `/v1/products/${product}/sims/${iccid}` : `/v1/sims/${iccid}`;
		const data = { action: 'deactivate' };
		return this.put({ uri, auth, headers, data, context });
	}

	reactivateSIM({ iccid, mbLimit, product, auth, headers, context }: { iccid: string; mbLimit?: number; product?: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		const uri = product ? `/v1/products/${product}/sims/${iccid}` : `/v1/sims/${iccid}`;
		const data = { mb_limit: mbLimit, action: 'reactivate' };
		return this.put({ uri, auth, headers, data, context });
	}

	updateSIM({ iccid, mbLimit, product, auth, headers, context }: { iccid: string; mbLimit: number; product?: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		const uri = product ? `/v1/products/${product}/sims/${iccid}` : `/v1/sims/${iccid}`;
		const data = { mb_limit: mbLimit };
		return this.put({ uri, auth, headers, data, context });
	}

	removeSIM({ iccid, product, auth, headers, context }: { iccid: string; product?: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		const uri = product ? `/v1/products/${product}/sims/${iccid}` : `/v1/sims/${iccid}`;
		return this.delete({ uri, auth, headers, context });
	}

	listBuildTargets({ onlyFeatured, auth, headers, context }: { onlyFeatured?: boolean; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		const query = onlyFeatured ? { featured: !!onlyFeatured } : undefined;
		return this.get({ uri: '/v1/build_targets', auth, headers, query, context });
	}

	listLibraries({ page, limit, filter, sort, architectures, category, scope, excludeScopes, auth, headers, context }: { page?: number; limit?: number; filter?: string; sort?: string; architectures?: string[]; category?: string; scope?: string; excludeScopes?: string[]; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
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

	_asList(value: string[] | string | undefined): string | undefined {
		return (Array.isArray(value) ? value.join(',') : value);
	}

	getLibrary({ name, version, auth, headers, context }: { name: string; version?: string; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.get({
			uri: `/v1/libraries/${name}`,
			auth,
			headers,
			query: { version },
			context
		});
	}

	getLibraryVersions({ name, page, limit, auth, headers, context }: { name: string; page?: number; limit?: number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.get({
			uri: `/v1/libraries/${name}/versions`,
			auth,
			headers,
			query: { page, limit },
			context
		});
	}

	contributeLibrary({ archive, auth, headers, context }: { archive: string | Buffer | NodeJS.ReadableStream | Blob; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
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

	publishLibrary({ name, auth, headers, context }: { name: string; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.request({
			uri: `/v1/libraries/${name}`,
			method: 'patch',
			auth,
			headers,
			data: { visibility: 'public' },
			context
		});
	}

	deleteLibrary({ name, force, auth, headers, context }: { name: string; force?: string; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.delete({
			uri: `/v1/libraries/${name}`,
			auth,
			headers,
			data: { force },
			context
		});
	}

	downloadFile({ uri, headers, context }: { uri: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.request({ uri, method: 'get', headers, context, isBuffer: true });
	}

	listOAuthClients({ product, auth, headers, context }: { product?: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		const uri = product ? `/v1/products/${product}/clients` : '/v1/clients';
		return this.get({ uri, auth, headers, context });
	}

	createOAuthClient({ name, type, redirect_uri, scope, product, auth, headers, context }: { name: string; type: string; redirect_uri?: string; scope?: Record<string, string>; product?: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		const uri = product ? `/v1/products/${product}/clients` : '/v1/clients';
		const data = { name, type, redirect_uri, scope };
		return this.post({ uri, auth, headers, data, context });
	}

	updateOAuthClient({ clientId, name, scope, product, auth, headers, context }: { clientId: string; name?: string; scope?: Record<string, string>; product?: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		const uri = product ? `/v1/products/${product}/clients/${clientId}` : `/v1/clients/${clientId}`;
		const data = { name, scope };
		return this.put({ uri, data, auth, headers, context });
	}

	deleteOAuthClient({ clientId, product, auth, headers, context }: { clientId: string; product?: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		const uri = product ? `/v1/products/${product}/clients/${clientId}` : `/v1/clients/${clientId}`;
		return this.delete({ uri, auth, headers, context });
	}

	listProducts({ auth, headers, context }: { auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.get({ uri: '/v1/products', auth, headers, context });
	}

	getProduct({ product, auth, headers, context }: { product: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.get({ uri: `/v1/products/${product}`, auth, headers, context });
	}

	listProductFirmware({ product, auth, headers, context }: { product: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.get({ uri: `/v1/products/${product}/firmware`, auth, headers, context });
	}

	uploadProductFirmware({ file, version, title, description, product, auth, headers, context }: { file: string | Buffer | NodeJS.ReadableStream | Blob; version: number; title: string; description?: string; product: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
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

	getProductFirmware({ version, product, auth, headers, context }: { version: number; product: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.get({
			uri: `/v1/products/${product}/firmware/${version}`,
			auth,
			headers,
			context
		});
	}

	updateProductFirmware({ version, title, description, product, auth, headers, context }: { version: number; title?: string; description?: string; product: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		const uri = `/v1/products/${product}/firmware/${version}`;
		return this.put({ uri, auth, headers, data: { title, description }, context });
	}

	downloadProductFirmware({ version, product, auth, headers, context }: { version: number; product: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.request({
			uri: `/v1/products/${product}/firmware/${version}/binary`,
			method: 'get',
			auth,
			headers,
			context,
			isBuffer: true
		});
	}

	downloadManufacturingBackup({ deviceId, auth, headers, context }: { deviceId: string; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.request({
			uri: `/v1/devices/${deviceId}/backup_files`,
			method: 'put',
			auth,
			headers,
			context,
			isBuffer: true
		});
	}

	releaseProductFirmware({ version, product, auth, headers, context }: { version: number; product: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		const uri = `/v1/products/${product}/firmware/release`;
		return this.put({ uri, auth, headers, data: { version }, context });
	}

	listTeamMembers({ product, auth, headers, context }: { product: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.get({
			uri: `/v1/products/${product}/team`,
			auth,
			headers,
			context
		});
	}

	inviteTeamMember({ username, product, auth, headers, context }: { username: string; product: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.post({
			uri: `/v1/products/${product}/team`,
			auth,
			headers,
			data: { username },
			context
		});
	}

	removeTeamMember({ username, product, auth, headers, context }: { username: string; product: string | number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.delete({
			uri: `/v1/products/${product}/team/${username}`,
			auth,
			headers,
			context
		});
	}

	lookupSerialNumber({ serialNumber, auth, headers, context }: { serialNumber: string; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.get({
			uri: `/v1/serial_numbers/${serialNumber}`,
			auth,
			headers,
			context
		});
	}

	createMeshNetwork({ name, deviceId, iccid, auth, headers, context }: { name: string; deviceId: string; iccid?: string; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.post({
			uri: '/v1/networks',
			auth,
			headers,
			data: { name, device_id: deviceId, iccid },
			context
		});
	}

	removeMeshNetwork({ networkId, auth, headers, context }: { networkId: string; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.delete({ uri: `/v1/networks/${networkId}`, auth, headers, context });
	}

	listMeshNetworks({ page, perPage, auth, headers, context }: { page?: number; perPage?: number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		const query = page ? { page, per_page: perPage } : undefined;
		return this.get({ uri: '/v1/networks', auth, headers, query, context });
	}

	getMeshNetwork({ networkId, auth, headers, context }: { networkId: string; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.get({ uri: `/v1/networks/${networkId}`, auth, headers, context });
	}

	updateMeshNetwork({ networkId, action, deviceId, auth, headers, context }: { networkId: string; action: string; deviceId: string; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.put({
			uri: `/v1/networks/${networkId}`,
			auth,
			headers,
			data: { action, device_id: deviceId },
			context
		});
	}

	addMeshNetworkDevice({ networkId, deviceId, auth, headers, context }: { networkId: string; deviceId: string; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.updateMeshNetwork({
			action: 'add-device',
			networkId,
			deviceId,
			auth,
			headers,
			context
		});
	}

	removeMeshNetworkDevice({ networkId, deviceId, auth, headers, context }: { networkId?: string; deviceId: string; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		if (!networkId) {
			return this.delete({
				uri: `/v1/devices/${deviceId}/network`,
				auth,
				headers,
				context
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

	listMeshNetworkDevices({ networkId, role, page, perPage, auth, headers, context }: { networkId: string; role?: string; page?: number; perPage?: number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		const query = (role || page) ? { role, page, per_page: perPage } : undefined;
		return this.get({
			uri: `/v1/networks/${networkId}/devices`,
			auth,
			headers,
			query,
			context
		});
	}

	getProductConfiguration({ auth, product, headers, context }: { auth?: string; product: string | number; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.get({
			uri: `/v1/products/${product}/config`,
			auth,
			headers,
			context
		});
	}

	getProductConfigurationSchema({ auth, product, headers = {}, context }: { auth?: string; product: string | number; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		headers.accept = 'application/schema+json';
		return this.get({
			uri: `/v1/products/${product}/config`,
			auth,
			headers,
			context
		});
	}

	getProductDeviceConfiguration({ auth, product, deviceId, headers, context }: { auth?: string; product: string | number; deviceId: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.get({
			uri: `/v1/products/${product}/config/${deviceId}`,
			auth,
			headers,
			context
		});
	}

	getProductDeviceConfigurationSchema({ auth, product, deviceId, headers = {}, context }: { auth?: string; product: string | number; deviceId: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		headers.accept = 'application/schema+json';
		return this.get({
			uri: `/v1/products/${product}/config/${deviceId}`,
			auth,
			headers,
			context
		});
	}

	setProductConfiguration({ auth, product, config, headers, context }: { auth?: string; product: string | number; config: Record<string, string | number | boolean | object | null>; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.put({
			uri: `/v1/products/${product}/config`,
			auth,
			data: config,
			headers,
			context
		});
	}

	setProductDeviceConfiguration({ auth, product, deviceId, config, headers, context }: { auth?: string; product: string | number; deviceId: string; config: Record<string, string | number | boolean | object | null>; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.put({
			uri: `/v1/products/${product}/config/${deviceId}`,
			data: config,
			auth,
			headers,
			context
		});
	}

	getProductLocations({ auth, product, dateRange, rectBl, rectTr, deviceId, deviceName, groups, page, perPage, headers, context }: { auth?: string; product: string | number; dateRange?: string; rectBl?: string; rectTr?: string; deviceId?: string; deviceName?: string; groups?: string[]; page?: number; perPage?: number; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
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

	getProductDeviceLocations({ auth, product, dateRange, rectBl, rectTr, deviceId, headers, context }: { auth?: string; product: string | number; dateRange?: string; rectBl?: string; rectTr?: string; deviceId: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
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

	executeLogic({ auth, org, logic, headers, context }: { auth?: string; org?: string; logic: { source: { type: 'JavaScript'; code: string }; event?: { event_name?: string; event_data?: string; device_id?: string; product_id?: string }; api_username?: string }; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.post({
			uri: this._namespacedPath(org, 'logic/execute'),
			auth,
			data: logic,
			headers,
			context
		});
	}

	createLogicFunction({ auth, org, logicFunction, headers, context }: { auth?: string; org?: string; logicFunction: { name: string; description?: string; enabled?: boolean; source: { type: 'JavaScript'; code: string }; logic_triggers?: object[]; api_username?: string }; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.post({
			uri: this._namespacedPath(org, 'logic/functions'),
			auth,
			data: { logic_function: logicFunction },
			headers,
			context
		});
	}

	getLogicFunction({ auth, org, logicFunctionId, headers, context }: { auth?: string; org?: string; logicFunctionId: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.get({
			uri: this._namespacedPath(org, `logic/functions/${logicFunctionId}`),
			auth,
			headers,
			context
		});
	}

	updateLogicFunction({ auth, org, logicFunctionId, logicFunction, headers, context }: { auth?: string; org?: string; logicFunctionId: string; logicFunction: { name?: string; description?: string; enabled?: boolean; source?: { type: 'JavaScript'; code: string }; logic_triggers?: object[] }; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.put({
			uri: this._namespacedPath(org, `logic/functions/${logicFunctionId}`),
			auth,
			data: { logic_function: logicFunction },
			headers,
			context
		});
	}

	deleteLogicFunction({ auth, org, logicFunctionId, headers, context }: { auth?: string; org?: string; logicFunctionId: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.delete({
			uri: this._namespacedPath(org, `logic/functions/${logicFunctionId}`),
			auth,
			headers,
			context
		});
	}

	listLogicFunctions({ auth, org, todayStats, headers, context }: { auth?: string; org?: string; todayStats?: boolean; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
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

	listLogicRuns({ auth, org, logicFunctionId, headers, context }: { auth?: string; org?: string; logicFunctionId: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.get({
			uri: this._namespacedPath(org, `logic/functions/${logicFunctionId}/runs`),
			auth,
			headers,
			context
		});
	}

	getLogicRun({ auth, org, logicFunctionId, logicRunId, headers, context }: { auth?: string; org?: string; logicFunctionId: string; logicRunId: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.get({
			uri: this._namespacedPath(org, `logic/functions/${logicFunctionId}/runs/${logicRunId}`),
			auth,
			headers,
			context
		});
	}

	getLogicRunLogs({ auth, org, logicFunctionId, logicRunId, headers, context }: { auth?: string; org?: string; logicFunctionId: string; logicRunId: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.get({
			uri: this._namespacedPath(org, `logic/functions/${logicFunctionId}/runs/${logicRunId}/logs`),
			auth,
			headers,
			context
		});
	}

	createLedger({ auth, org, ledger, headers, context }: { auth?: string; org?: string; ledger: { name: string; description?: string; scope: 'Owner' | 'Device' | 'Product'; direction: 'Upstream' | 'Downstream' }; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.post({
			uri: this._namespacedPath(org, 'ledgers'),
			auth,
			data: { ledger },
			headers,
			context
		});
	}

	getLedger({ auth, org, ledgerName, headers, context }: { auth?: string; org?: string; ledgerName: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.get({
			uri: this._namespacedPath(org, `ledgers/${ledgerName}`),
			auth,
			headers,
			context
		});
	}

	updateLedger({ auth, org, ledgerName, ledger, headers, context }: { auth?: string; org?: string; ledgerName: string; ledger: { description?: string; direction?: 'Upstream' | 'Downstream' }; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.put({
			uri: this._namespacedPath(org, `ledgers/${ledgerName}`),
			auth,
			data: { ledger },
			headers,
			context
		});
	}

	archiveLedger({ auth, org, ledgerName, headers, context }: { auth?: string; org?: string; ledgerName: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.delete({
			uri: this._namespacedPath(org, `ledgers/${ledgerName}`),
			auth,
			headers,
			context
		});
	}

	listLedgers({ auth, org, scope, page, perPage, archived, headers, context }: { auth?: string; org?: string; scope?: 'Owner' | 'Device' | 'Product'; page?: number; perPage?: number; archived?: boolean; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
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

	getLedgerInstance({ auth, org, ledgerName, scopeValue, headers, context }: { auth?: string; org?: string; ledgerName: string; scopeValue: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.get({
			uri: this._namespacedPath(org, `ledgers/${ledgerName}/instances/${scopeValue}`),
			auth,
			headers,
			context
		});
	}

	setLedgerInstance({ auth, org, ledgerName, scopeValue, instance, setMode, headers, context }: { auth?: string; org?: string; ledgerName: string; scopeValue: string; instance: { data: Record<string, string | number | boolean | object | null> }; setMode?: 'Replace' | 'Merge'; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.put({
			uri: this._namespacedPath(org, `ledgers/${ledgerName}/instances/${scopeValue}`),
			query: {
				set_mode: setMode
			},
			auth,
			data: { instance },
			headers,
			context
		});
	}

	deleteLedgerInstance({ auth, org, ledgerName, scopeValue, headers, context }: { auth?: string; org?: string; ledgerName: string; scopeValue: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.delete({
			uri: this._namespacedPath(org, `ledgers/${ledgerName}/instances/${scopeValue}`),
			auth,
			headers,
			context
		});
	}

	listLedgerInstances({ auth, org, ledgerName, page, perPage, headers, context }: { auth?: string; org?: string; ledgerName: string; page?: number; perPage?: number; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
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

	listLedgerInstanceVersions({ auth, org, ledgerName, scopeValue, replacedBefore, replacedAfter, headers, context }: { auth?: string; org?: string; ledgerName: string; scopeValue: string; replacedBefore?: string; replacedAfter?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
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

	getLedgerInstanceVersion({ auth, org, ledgerName, scopeValue, version, headers, context }: { auth?: string; org?: string; ledgerName: string; scopeValue: string; version: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		return this.get({
			uri: this._namespacedPath(org, `ledgers/${ledgerName}/instances/${scopeValue}/versions/${version}`),
			auth,
			headers,
			context
		});
	}

	listDeviceOsVersions({ platformId, internalVersion, page, perPage, auth, headers, context }: { platformId?: number; internalVersion?: number; page?: number; perPage?: number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		const query = {
			platform_id: platformId,
			internal_version: internalVersion,
			page,
			per_page: perPage
		};

		return this.get({
			uri: '/v1/device-os/versions',
			query,
			auth,
			headers,
			context
		});
	}

	getDeviceOsVersion({ version, platformId, auth, headers, context }: { version: string; platformId?: number; auth?: string; headers?: Record<string, string>; context?: { tool?: ToolContext; project?: ProjectContext } }): Promise<RequestResponse> {
		const query = platformId ? { platform_id: platformId } : {};
		return this.get({
			uri: `/v1/device-os/versions/${version}`,
			query,
			auth,
			headers,
			context
		});
	}

	setDefaultAuth(auth: string): void {
		if (typeof auth === 'string' && auth.length !== 0) {
			this._defaultAuth = auth;
		} else {
			throw new Error('Must pass a non-empty string representing an auth token!');
		}
	}

	_getActiveAuthToken(auth?: string): string | undefined {
		return auth || this._defaultAuth;
	}

	deviceUri({ deviceId, product, org }: { deviceId: string; product?: string | number; org?: string }): string {
		if (org) {
			return `/v1/orgs/${org}/devices/${deviceId}`;
		}
		if (product) {
			return `/v1/products/${product}/devices/${deviceId}`;
		}
		return `/v1/devices/${deviceId}`;
	}

	_namespacedPath(org: string | undefined, path: string): string {
		return org ? `/v1/orgs/${org}/${path}` : `/v1/${path}`;
	}

	get({ uri, auth, headers, query, context }: GetHeadOptions): Promise<RequestResponse> {
		context = this._buildContext(context);
		auth = this._getActiveAuthToken(auth);
		return this.agent.get({ uri, auth, headers, query, context });
	}

	head({ uri, auth, headers, query, context }: GetHeadOptions): Promise<RequestResponse> {
		context = this._buildContext(context);
		auth = this._getActiveAuthToken(auth);
		return this.agent.head({ uri, auth, headers, query, context });
	}

	post({ uri, auth, headers, data, context }: MutateOptions): Promise<RequestResponse> {
		context = this._buildContext(context);
		auth = this._getActiveAuthToken(auth);
		return this.agent.post({ uri, auth, headers, data, context });
	}

	put({ uri, auth, headers, data, query, context }: MutateOptions): Promise<RequestResponse> {
		context = this._buildContext(context);
		auth = this._getActiveAuthToken(auth);
		return this.agent.put({ uri, auth, headers, data, query, context });
	}

	delete({ uri, auth, headers, data, context }: MutateOptions): Promise<RequestResponse> {
		context = this._buildContext(context);
		auth = this._getActiveAuthToken(auth);
		return this.agent.delete({ uri, auth, headers, data, context });
	}

	request(args: AgentRequestOptions): Promise<RequestResponse> {
		args.context = this._buildContext(args.context);
		args.auth = this._getActiveAuthToken(args.auth);
		return this.agent.request(args);
	}

	client(options: { auth?: string } = {}): Client {
		return new Client(Object.assign({ api: this as object as Client.Api }, options));
	}

	setBaseUrl(baseUrl: string): void {
		this.baseUrl = baseUrl;
		this.agent.setBaseUrl(baseUrl);
	}
}

export = Particle;
