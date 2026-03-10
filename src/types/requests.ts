import type { SharedRequestOptions } from './common';
import type { AccountInfo, LogicFunctionSource, LogicTrigger } from './responses';

export interface LoginOptions extends SharedRequestOptions {
	username: string;
	password: string;
	tokenDuration?: number;
}

export interface SendOtpOptions extends SharedRequestOptions {
	mfaToken: string;
	otp: string;
}

export interface LoginAsClientOwnerOptions extends SharedRequestOptions {}

export interface EnableMfaOptions extends SharedRequestOptions {}

export interface ConfirmMfaOptions extends SharedRequestOptions {
	mfaToken: string;
	otp: string;
	invalidateTokens?: boolean;
}

export interface DisableMfaOptions extends SharedRequestOptions {
	currentPassword: string;
}

export interface CreateUserOptions extends SharedRequestOptions {
	username: string;
	password: string;
	accountInfo?: AccountInfo;
	utm?: Record<string, string>;
}

export interface ResetPasswordOptions extends SharedRequestOptions {
	username: string;
}

export interface SetUserInfoOptions extends SharedRequestOptions {
	accountInfo?: AccountInfo;
}

export interface ChangeUsernameOptions extends SharedRequestOptions {
	username: string;
	currentPassword: string;
	invalidateTokens?: boolean;
}

export interface ChangeUserPasswordOptions extends SharedRequestOptions {
	password: string;
	currentPassword: string;
	invalidateTokens?: boolean;
}

export interface DeleteUserOptions extends SharedRequestOptions {
	password: string;
}

export interface TrackingIdentityOptions extends SharedRequestOptions {
	full?: boolean;
}

export interface DeleteAccessTokenOptions extends SharedRequestOptions {
	token: string;
}

export interface DeleteCurrentAccessTokenOptions extends SharedRequestOptions {}
export interface DeleteActiveAccessTokensOptions extends SharedRequestOptions {}

export interface ListDevicesOptions extends SharedRequestOptions {
	deviceId?: string;
	deviceName?: string;
	groups?: string[];
	sortAttr?: string;
	sortDir?: string;
	page?: number;
	perPage?: number;
	product?: string | number;
}

export interface GetDeviceOptions extends SharedRequestOptions {
	deviceId: string;
	product?: string | number;
}

export interface ClaimDeviceOptions extends SharedRequestOptions {
	deviceId: string;
	requestTransfer?: boolean;
}

export interface RemoveDeviceOptions extends SharedRequestOptions {
	deviceId: string;
	product?: string | number;
	deny?: boolean;
}

export interface RemoveDeviceOwnerOptions extends SharedRequestOptions {
	deviceId: string;
	product: string | number;
}

export interface UpdateDeviceOptions extends SharedRequestOptions {
	deviceId: string;
	name?: string;
	signal?: boolean;
	notes?: string;
	development?: boolean;
	desiredFirmwareVersion?: number | null;
	flash?: boolean;
	product?: string | number;
}

export interface RenameDeviceOptions extends SharedRequestOptions {
	deviceId: string;
	name: string;
	product?: string | number;
}

export interface SignalDeviceOptions extends SharedRequestOptions {
	deviceId: string;
	signal: boolean;
	product?: string | number;
}

export interface FlashDeviceOptions extends SharedRequestOptions {
	deviceId: string;
	files: Record<string, string | Buffer | NodeJS.ReadableStream | Blob>;
	targetVersion?: string;
	product?: string | number;
}

export interface CallFunctionOptions extends SharedRequestOptions {
	deviceId: string;
	name: string;
	argument?: string;
	product?: string | number;
}

export interface GetVariableOptions extends SharedRequestOptions {
	deviceId: string;
	name: string;
	product?: string | number;
}

export interface UnprotectDeviceOptions extends SharedRequestOptions {
	deviceId: string;
	org?: string;
	product?: string | number;
	action: 'prepare' | 'confirm';
	serverNonce?: string;
	deviceNonce?: string;
	deviceSignature?: string;
	devicePublicKeyFingerprint?: string;
}

export interface DownloadManufacturingBackupOptions extends SharedRequestOptions {
	deviceId: string;
}

export interface CompileCodeOptions extends SharedRequestOptions {
	files: Record<string, string | Buffer | NodeJS.ReadableStream | Blob>;
	platformId?: number;
	targetVersion?: string;
}

export interface DownloadFirmwareBinaryOptions extends SharedRequestOptions {
	binaryId: string;
}

export interface SendPublicKeyOptions extends SharedRequestOptions {
	deviceId: string;
	key: string | Buffer;
	algorithm?: string;
}

export interface ProvisionDeviceOptions extends SharedRequestOptions {
	productId: string | number;
}

export interface GetEventStreamOptions extends SharedRequestOptions {
	deviceId?: string;
	name?: string;
	org?: string;
	product?: string | number;
}

export interface PublishEventOptions extends SharedRequestOptions {
	name: string;
	data?: string;
	isPrivate?: boolean;
	ttl?: number;
	product?: string | number;
}

export interface ListWebhooksOptions extends SharedRequestOptions {
	product?: string | number;
}

export interface CreateWebhookOptions extends SharedRequestOptions {
	event: string;
	url: string;
	device?: string;
	rejectUnauthorized?: boolean;
	noDefaults?: boolean;
	hook?: {
		method?: string;
		auth?: Record<string, string>;
		headers?: Record<string, string>;
		query?: Record<string, string>;
		json?: object;
		form?: object;
		body?: string;
		responseTemplate?: string;
		responseEvent?: string;
		errorResponseEvent?: string;
	};
	product?: string | number;
}

export interface DeleteWebhookOptions extends SharedRequestOptions {
	hookId: string;
	product?: string | number;
}

export interface ListIntegrationsOptions extends SharedRequestOptions {
	product?: string | number;
}

export interface CreateIntegrationOptions extends SharedRequestOptions {
	event: string;
	settings: Record<string, string | number | boolean | object>;
	deviceId?: string;
	product?: string | number;
}

export interface EditIntegrationOptions extends SharedRequestOptions {
	integrationId: string;
	event?: string;
	settings?: Record<string, string | number | boolean | object>;
	deviceId?: string;
	product?: string | number;
}

export interface DeleteIntegrationOptions extends SharedRequestOptions {
	integrationId: string;
	product?: string | number;
}

export interface ListSIMsOptions extends SharedRequestOptions {
	iccid?: string;
	deviceId?: string;
	deviceName?: string;
	page?: number;
	perPage?: number;
	product?: string | number;
}

export interface CheckSIMOptions extends SharedRequestOptions {
	iccid: string;
}

export interface RemoveSIMOptions extends SharedRequestOptions {
	iccid: string;
	product?: string | number;
}

export interface GetSIMDataUsageOptions extends SharedRequestOptions {
	iccid: string;
	product?: string | number;
}

export interface GetFleetDataUsageOptions extends SharedRequestOptions {
	product: string | number;
}

export interface ListProductsOptions extends SharedRequestOptions {}

export interface GetProductOptions extends SharedRequestOptions {
	product: string | number;
}

export interface ListProductFirmwareOptions extends SharedRequestOptions {
	product: string | number;
}

export interface UploadProductFirmwareOptions extends SharedRequestOptions {
	product: string | number;
	file: string | Buffer | NodeJS.ReadableStream | Blob;
	version: number;
	title: string;
	description?: string;
}

export interface GetProductFirmwareOptions extends SharedRequestOptions {
	product: string | number;
	version: number;
}

export interface UpdateProductFirmwareOptions extends SharedRequestOptions {
	product: string | number;
	version: number;
	title?: string;
	description?: string;
}

export interface ReleaseFirmwareOptions extends SharedRequestOptions {
	product: string | number;
	version: number;
	product_default?: boolean;
	groups?: string[];
	intelligent?: boolean;
}

export interface DownloadProductFirmwareOptions extends SharedRequestOptions {
	product: string | number;
	version: number;
}

export interface AddDeviceToProductOptions extends SharedRequestOptions {
	product: string | number;
	deviceId?: string;
	file?: string | Buffer | NodeJS.ReadableStream | Blob;
}

export interface GetProductConfigurationOptions extends SharedRequestOptions {
	product: string | number;
}

export interface GetProductConfigurationSchemaOptions extends SharedRequestOptions {
	product: string | number;
}

export interface GetProductDeviceConfigurationOptions extends SharedRequestOptions {
	product: string | number;
	deviceId: string;
}

export interface GetProductDeviceConfigurationSchemaOptions extends SharedRequestOptions {
	product: string | number;
	deviceId: string;
}

export interface SetProductConfigurationOptions extends SharedRequestOptions {
	product: string | number;
	config: Record<string, string | number | boolean | object | null>;
}

export interface SetProductDeviceConfigurationOptions extends SharedRequestOptions {
	product: string | number;
	deviceId: string;
	config: Record<string, string | number | boolean | object | null>;
}

export interface GetProductLocationsOptions extends SharedRequestOptions {
	product: string | number;
	dateRange?: string;
	rectBl?: string;
	rectTr?: string;
	deviceId?: string;
	deviceName?: string;
	groups?: string[];
	page?: number;
	perPage?: number;
}

export interface GetProductDeviceLocationsOptions extends SharedRequestOptions {
	product: string | number;
	deviceId: string;
	dateRange?: string;
	rectBl?: string;
	rectTr?: string;
}

export interface ListOAuthClientsOptions extends SharedRequestOptions {
	product?: string | number;
}

export interface CreateOAuthClientOptions extends SharedRequestOptions {
	name: string;
	type: string;
	redirect_uri?: string;
	scope?: Record<string, string>;
	product?: string | number;
}

export interface UpdateOAuthClientOptions extends SharedRequestOptions {
	clientId: string;
	name?: string;
	scope?: Record<string, string>;
	product?: string | number;
}

export interface DeleteOAuthClientOptions extends SharedRequestOptions {
	clientId: string;
	product?: string | number;
}

export interface ListLibrariesOptions extends SharedRequestOptions {
	page?: number;
	limit?: number;
	filter?: string;
	sort?: string;
	architectures?: string[];
	category?: string;
	scope?: string;
	excludeScopes?: string[];
}

export interface GetLibraryOptions extends SharedRequestOptions {
	name: string;
	version?: string;
}

export interface GetLibraryVersionsOptions extends SharedRequestOptions {
	name: string;
	page?: number;
	limit?: number;
}

export interface ContributeLibraryOptions extends SharedRequestOptions {
	archive: string | Buffer | NodeJS.ReadableStream | Blob;
}

export interface PublishLibraryOptions extends SharedRequestOptions {
	name: string;
}

export interface DeleteLibraryOptions extends SharedRequestOptions {
	name: string;
	force?: string;
}

export interface ListBuildTargetsOptions extends SharedRequestOptions {
	onlyFeatured?: boolean;
}

export interface ListDeviceOsVersionsOptions extends SharedRequestOptions {
	platformId?: number;
	internalVersion?: number;
	page?: number;
	perPage?: number;
}

export interface GetDeviceOsVersionOptions extends SharedRequestOptions {
	version: string;
	platformId?: number;
}

export interface GetClaimCodeOptions extends SharedRequestOptions {
	iccid?: string;
	product?: string | number;
}

export interface LookupSerialNumberOptions extends SharedRequestOptions {
	serialNumber: string;
}

export interface DownloadFileOptions extends SharedRequestOptions {
	uri: string;
}

export interface ListTeamMembersOptions extends SharedRequestOptions {
	product: string | number;
}

export interface InviteTeamMemberOptions extends SharedRequestOptions {
	username: string;
	product: string | number;
}

export interface RemoveTeamMemberOptions extends SharedRequestOptions {
	username: string;
	product: string | number;
}

export interface CreateCustomerOptions extends SharedRequestOptions {
	email: string;
	password: string;
	product: string | number;
}

export interface ExecuteLogicOptions extends SharedRequestOptions {
	org?: string;
	logic: {
		source: { type: 'JavaScript'; code: string };
		event?: {
			event_name?: string;
			event_data?: string;
			device_id?: string;
			product_id?: string;
		};
		api_username?: string;
	};
}

export interface ListLogicFunctionsOptions extends SharedRequestOptions {
	org?: string;
	todayStats?: boolean;
}

export interface GetLogicFunctionOptions extends SharedRequestOptions {
	org?: string;
	logicFunctionId: string;
}

export interface CreateLogicFunctionOptions extends SharedRequestOptions {
	org?: string;
	logicFunction: {
		name: string;
		description?: string;
		enabled?: boolean;
		source: LogicFunctionSource;
		logic_triggers?: Partial<LogicTrigger>[];
		api_username?: string;
	};
}

export interface UpdateLogicFunctionOptions extends SharedRequestOptions {
	org?: string;
	logicFunctionId: string;
	logicFunction: {
		name?: string;
		description?: string;
		enabled?: boolean;
		source?: LogicFunctionSource;
		logic_triggers?: Partial<LogicTrigger>[];
	};
}

export interface DeleteLogicFunctionOptions extends SharedRequestOptions {
	org?: string;
	logicFunctionId: string;
}

export interface ListLogicRunsOptions extends SharedRequestOptions {
	org?: string;
	logicFunctionId: string;
}

export interface GetLogicRunOptions extends SharedRequestOptions {
	org?: string;
	logicFunctionId: string;
	logicRunId: string;
}

export interface GetLogicRunLogsOptions extends SharedRequestOptions {
	org?: string;
	logicFunctionId: string;
	logicRunId: string;
}

export interface ListLedgersOptions extends SharedRequestOptions {
	org?: string;
	scope?: 'Owner' | 'Device' | 'Product';
	page?: number;
	perPage?: number;
	archived?: boolean;
}

export interface CreateLedgerOptions extends SharedRequestOptions {
	org?: string;
	ledger: {
		name: string;
		description?: string;
		scope: 'Owner' | 'Device' | 'Product';
		direction: 'Upstream' | 'Downstream';
	};
}

export interface GetLedgerOptions extends SharedRequestOptions {
	org?: string;
	ledgerName: string;
}

export interface UpdateLedgerOptions extends SharedRequestOptions {
	org?: string;
	ledgerName: string;
	ledger: {
		description?: string;
		direction?: 'Upstream' | 'Downstream';
	};
}

export interface ArchiveLedgerOptions extends SharedRequestOptions {
	org?: string;
	ledgerName: string;
}

export interface ListLedgerInstancesOptions extends SharedRequestOptions {
	org?: string;
	ledgerName: string;
	page?: number;
	perPage?: number;
}

export interface GetLedgerInstanceOptions extends SharedRequestOptions {
	org?: string;
	ledgerName: string;
	scopeValue: string;
}

export interface SetLedgerInstanceOptions extends SharedRequestOptions {
	org?: string;
	ledgerName: string;
	scopeValue: string;
	instance: { data: Record<string, string | number | boolean | object | null> };
	setMode?: 'Replace' | 'Merge';
}

export interface DeleteLedgerInstanceOptions extends SharedRequestOptions {
	org?: string;
	ledgerName: string;
	scopeValue: string;
}

export interface ListLedgerInstanceVersionsOptions extends SharedRequestOptions {
	org?: string;
	ledgerName: string;
	scopeValue: string;
	replacedBefore?: string;
	replacedAfter?: string;
}

export interface GetLedgerInstanceVersionOptions extends SharedRequestOptions {
	org?: string;
	ledgerName: string;
	scopeValue: string;
	version: string;
}

export interface EnvVarScopeOptions extends SharedRequestOptions {
	product?: string | number;
	org?: string;
	deviceId?: string;
	sandbox?: boolean;
}

export interface ListEnvVarsOptions extends EnvVarScopeOptions {}

export interface EnvVarOp {
	op: 'Set' | 'Unset';
	key: string;
	value?: string;
}

export interface UpdateEnvVarsOptions extends EnvVarScopeOptions {
	ops: EnvVarOp[];
}

export interface SetEnvVarOptions extends EnvVarScopeOptions {
	key: string;
	value: string;
}

export interface DeleteEnvVarOptions extends EnvVarScopeOptions {
	key: string;
}

export interface RenderEnvVarsOptions extends EnvVarScopeOptions {}

export interface ReviewEnvVarsRolloutOptions extends EnvVarScopeOptions {}

export interface StartEnvVarsRolloutOptions extends EnvVarScopeOptions {
	when: 'Immediate' | 'Connect';
}
