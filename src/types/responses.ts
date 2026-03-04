import type { PaginationMeta } from './common';

export interface LoginResponse {
	token_type: 'bearer';
	access_token: string;
	expires_in: number;
	refresh_token: string;
}

export interface MfaRequiredResponse {
	error: 'mfa_required';
	error_description: string;
	mfa_token: string;
}

export interface AccessTokenInfo {
	token: string;
	expires_at: string;
	client: string;
}

export interface CurrentTokenInfo {
	expires_at: string;
	client_id: string;
	scopes: string[];
	orgs: Array<{ id: string; slug: string }>;
}

export interface AccountInfo {
	first_name?: string;
	last_name?: string;
	business_account?: boolean;
	company_name?: string;
}

export interface MfaStatus {
	enabled: boolean;
}

export interface TeamMember {
	username: string;
	friendly_name?: string;
	no_mfa?: boolean;
	scopes?: string[];
	is_programmatic?: boolean;
	product_id?: number | null;
}

export interface UserInfo {
	username: string;
	tos: number;
	account_info: AccountInfo;
	mfa: MfaStatus;
	memberships: object[];
	scim_provisioned: boolean;
	no_password: boolean;
	wifi_device_count: number;
	cellular_device_count: number;
}

export interface DeviceInfo {
	id: string;
	name: string;
	last_app: string | null;
	last_heard: string | null;
	last_handshake_at: string | null;
	online: boolean;
	connected: boolean;
	platform_id: number;
	cellular: boolean;
	product_id: number;
	functions?: string[];
	variables?: Record<string, string>;
	firmware_version?: number;
	quarantined?: boolean;
	groups?: string[];
	denied?: boolean;
	notes?: string | null;
}

export interface DeviceListResponse {
	devices: DeviceInfo[];
	meta?: PaginationMeta;
}

export interface DeviceVariableResponse {
	name: string;
	result: string | number | boolean;
	coreInfo: {
		name: string;
		deviceID: string;
		connected: boolean;
		last_handshake_at: string;
	};
}

export interface FunctionCallResponse {
	id: string;
	name: string;
	connected: boolean;
	return_value: number;
}

export interface ClaimResponse {
	ok: boolean;
	deviceID: string;
	claimed: boolean;
}

export interface CompileResponse {
	ok: boolean;
	binary_id: string;
	binary_url: string;
	expires_at: string;
	sizeInfo: string;
}

export interface ProductFirmwareInfo {
	version: number;
	title: string;
	description?: string;
	size: number;
	device_count: number;
	current: boolean;
	uploaded_at: string;
}

export interface EventData {
	data: string;
	ttl: number;
	published_at: string;
	coreid: string;
	name?: string;
	userid?: string;
	version?: number;
	productID?: number;
}

export interface WebhookInfo {
	id: string;
	event: string;
	created_at: string;
	url: string;
	requestType: 'GET' | 'POST' | 'PUT' | 'DELETE';
	name?: string | null;
	deviceID?: string;
	disabled?: boolean;
}

export interface CreateWebhookResponse {
	ok: boolean;
	id: string;
	url: string;
	event: string;
	name: string | null;
	created_at: string;
	hookUrl: string;
}

export interface IntegrationInfo {
	id: string;
	event: string;
	created_at: string;
	integration_type: string;
	url: string;
	requestType: string;
}

export interface ProductSettings {
	location?: object;
	known_application?: { opt_in: boolean };
	quarantine?: boolean;
}

export interface ProductInfo {
	id: number;
	platform_id: number;
	name: string;
	slug: string;
	description?: string;
	user?: string;
	org?: string;
	organization_id?: string;
	groups?: string[];
	settings?: ProductSettings;
	device_protection?: string;
}

export interface OrganizationInfo {
	id: string;
	slug: string;
	name: string;
	description?: string;
}

export interface NetworkInfo {
	id: string;
	name: string;
	[key: string]: string | number | boolean | object | null | undefined;
}

export interface SimInfo {
	iccid: string;
	status: 'active' | 'inactive' | 'deactivated';
	base_country_code?: string;
	last_status_change_action?: string;
	activated_on?: string;
	device_id?: string;
	device_name?: string;
	carrier?: string;
}

export interface SimDataUsage {
	usage_by_day: Array<{
		date: string;
		mbs_used: number;
		mbs_used_cumulative: number;
	}>;
	quota: number;
	used: number;
}

export interface OAuthClientInfo {
	name: string;
	type: 'installed' | 'web';
	id: string;
	secret?: string;
	product_id?: number;
}

export interface BuildTarget {
	platforms: number[];
	prereleases: number[];
	firmware_vendor: string;
	version: string;
}

export interface BuildTargetsResponse {
	targets: BuildTarget[];
	platforms: Record<string, number>;
	default_versions: Record<string, string>;
}

export interface LogicTrigger {
	id: string;
	type: 'Scheduled' | 'Event';
	logic_function_id: string;
	enabled: boolean;
	version: number;
	cron?: string;
	start_at?: string;
	end_at?: string | null;
	last_scheduled_at?: string;
	next_unscheduled_at?: string;
	product_id?: number;
	event?: string;
}

export interface LogicFunctionSource {
	type: 'JavaScript';
	code: string;
}

export interface LogicFunctionStats {
	success: number;
	failure: number;
	timeout: number;
}

export interface LogicFunction {
	id: string;
	owner_id: string;
	version: number;
	enabled: boolean;
	name: string;
	description: string;
	template_slug: string | null;
	source: LogicFunctionSource;
	created_at: string;
	updated_at: string;
	created_by: string;
	updated_by: string;
	logic_triggers: LogicTrigger[];
	today_stats?: LogicFunctionStats;
	org_slug?: string;
}

export interface LogicRun {
	id: string;
	owner_id: string;
	logic_function_id: string;
	logic_trigger_type: string;
	logic_trigger_id: string;
	status: 'Success' | 'Failure' | 'Timeout';
	started_at: string;
	finished_at: string;
	log_filename: string;
}

export interface LogicRunLog {
	level: 'Info' | 'Warning' | 'Error';
	timestamp: string;
	args: (string | number | boolean | object | null)[];
}

export interface ExecuteLogicResponse {
	result: {
		status: 'Success' | 'Failure';
		logs: LogicRunLog[];
	};
}

export interface LedgerScope {
	type: 'Owner' | 'Device' | 'Product';
	value: string;
	name?: string;
	not_owned?: boolean;
}

export interface LedgerDefinition {
	scope: 'Owner' | 'Device' | 'Product';
	name: string;
	description: string;
	direction: 'Upstream' | 'Downstream';
	updated_at: string;
	created_at: string;
	archived_at: string | null;
}

export interface LedgerInstance {
	name: string;
	scope: LedgerScope;
	size_bytes: number;
	data: Record<string, string | number | boolean | object | null>;
	updated_at: string;
	created_at: string;
	replaced_at?: string;
}

export interface LedgerInstanceListResponse {
	instances: LedgerInstance[];
	meta: PaginationMeta;
}

export interface LedgerVersionListResponse {
	versions: LedgerInstance[];
	meta: { has_more: boolean };
}

export interface SecretUsage {
	name: string;
	id: string;
}

export interface SecretInfo {
	name: string;
	created_at: string;
	updated_at: string;
	last_accessed_at: string | null;
	integrations: SecretUsage[];
	logic_functions: SecretUsage[];
}

export interface LocationGeometry {
	type: 'Point' | 'LineString';
	coordinates: number[] | number[][];
}

export interface DeviceLocationInfo {
	device_id: string;
	product_id: number;
	device_name?: string;
	groups?: string[];
	gps_lock: boolean;
	last_heard: string;
	timestamps?: string[];
	online: boolean;
	geometry: LocationGeometry;
}

export interface LocationListResponse {
	locations: DeviceLocationInfo[];
	meta: PaginationMeta & { devices_found: number };
}

export interface LibraryAttributes {
	name: string;
	version: string;
	author: string;
	sentence?: string;
	paragraph?: string;
	url?: string;
	repository?: string;
	architectures?: string[];
	visibility?: string;
	mine?: boolean;
}

export interface LibraryInfo {
	id: string;
	type: string;
	attributes: LibraryAttributes;
	links?: { download?: string };
}

export interface DeviceOsVersion {
	version: string;
	platform_id: number;
	release_date?: string;
	module_version?: number;
}

export interface EnableMfaResponse {
	mfa_token: string;
	qr_url: string;
	secret?: string;
}

export interface ConfirmMfaResponse {
	enrolled: boolean;
	tokens?: string[];
}

export interface CreateCustomerResponse {
	token_type: string;
	access_token: string;
	expires_in: number;
	refresh_token: string;
}

export interface TrackingIdentityResponse {
	id: string;
	email: string;
}

export interface ClaimCodeResponse {
	claim_code: string;
	device_ids: string[];
}

export interface SerialNumberResponse {
	serial_number: string;
	device_id: string;
	platform_id?: number;
}

export interface ProductConfigurationResponse {
	configuration: Record<string, string | number | boolean | object | null>;
	[key: string]: string | number | boolean | object | null | undefined;
}

export interface EnvVarValue {
	value: string;
}

export interface EnvVarInherited {
	from: 'Owner' | 'Product' | 'Firmware';
	value: string;
}

export interface EnvVarsOnDevice {
	rendered: Record<string, string>;
	last_reported_at: string;
	development_env?: boolean;
}

export interface EnvVarsSnapshot {
	own: Record<string, EnvVarValue>;
	inherited?: Record<string, EnvVarInherited>;
	rollout_at: string | null;
	rollout_by: string | null;
}

export interface EnvVarsLatest {
	own: Record<string, EnvVarValue>;
	inherited?: Record<string, EnvVarInherited>;
	created_at: string | null;
	updated_at: string | null;
	created_by: string | null;
	updated_by: string | null;
}

export interface EnvVarsResponse {
	on_device?: EnvVarsOnDevice;
	last_snapshot: EnvVarsSnapshot | null;
	latest: EnvVarsLatest;
}

export interface EnvVarsRolloutStartResponse {
	success: boolean;
}

export interface EnvVarsRenderResponse {
	env: Record<string, string>;
	last_updated_at: string | null;
	rollout_at: string | null;
	rollout_by: string | null;
}

export interface EnvVarsRolloutChange {
	op: 'Added' | 'Changed' | 'Removed';
	key: string;
	before?: string;
	after?: string;
}

export interface EnvVarsRolloutDiff {
	changes: EnvVarsRolloutChange[];
	unchanged: Record<string, string>;
}

export interface EnvVarsRolloutResponse {
	from_snapshot: EnvVarsRolloutDiff;
	from_device?: EnvVarsRolloutDiff;
}
