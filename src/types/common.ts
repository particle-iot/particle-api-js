import { type Agent } from 'http';

export interface JSONResponse<T = object> {
	statusCode: number;
	body: T;
}

export type RequestResponse<T = object> = JSONResponse<T> | Buffer | ArrayBuffer;

export interface RequestError {
	statusCode: number;
	errorDescription: string;
	shortErrorDescription: string;
	body: object;
	error: Error;
}

export interface ToolContext {
	name: string;
	version?: string | number;
	components?: Omit<ToolContext, 'components'>[];
}

export interface ProjectContext {
	name: string;
	[key: string]: string | number;
}

export interface ParticleOptions {
	baseUrl?: string;
	clientId?: string;
	clientSecret?: string;
	tokenDuration?: number;
	auth?: string;
	httpAgent?: Agent;
}

export interface SharedRequestOptions {
	auth?: string;
	headers?: Record<string, string>;
	context?: { tool?: ToolContext; project?: ProjectContext };
}

export interface PaginationMeta {
	page: number;
	per_page: number;
	total_pages: number;
	total?: number;
}

export interface OKResponse {
	ok: boolean;
}

export interface AgentFile {
	data: string | Buffer | NodeJS.ReadableStream | Blob;
	path: string;
}

export type AgentSanitizedFiles = Record<string, AgentFile>;

export interface AgentRequestOptions {
	uri: string;
	method: 'get' | 'head' | 'post' | 'put' | 'delete' | 'patch';
	auth?: string;
	headers?: Record<string, string>;
	data?: Record<string, unknown> | FormData;
	query?: Record<string, unknown>;
	form?: Record<string, string | number | boolean | undefined>;
	files?: Record<string, string | Buffer | NodeJS.ReadableStream | Blob>;
	context?: { tool?: ToolContext; project?: ProjectContext };
	isBuffer?: boolean;
}

export interface AgentBuildRequestOptions extends Omit<AgentRequestOptions, 'files' | 'isBuffer'> {
	files?: AgentSanitizedFiles;
}

export type GetHeadOptions = Pick<AgentRequestOptions, 'uri' | 'auth' | 'headers' | 'query' | 'context'>;
export type MutateOptions = Omit<AgentRequestOptions, 'method' | 'isBuffer'>;
