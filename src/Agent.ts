import fetch, { type Response } from 'node-fetch';
import FormData = require('form-data');
import qs = require('qs');
import fs = require('../fs');
import packageJson = require('../package.json');
import type {
	RequestResponse,
	AgentRequestOptions,
	AgentBuildRequestOptions,
	AgentSanitizedFiles,
	AgentFile,
	GetHeadOptions,
	MutateOptions,
	ToolContext,
	ProjectContext
} from './types';

class Agent {
	baseUrl!: string;

	constructor(baseUrl: string) {
		this.setBaseUrl(baseUrl);
	}

	setBaseUrl(baseUrl: string): void {
		this.baseUrl = baseUrl;
	}

	get(options: GetHeadOptions): Promise<RequestResponse> {
		return this.request({ ...options, method: 'get' });
	}

	head(options: GetHeadOptions): Promise<RequestResponse> {
		return this.request({ ...options, method: 'head' });
	}

	post(options: MutateOptions): Promise<RequestResponse> {
		return this.request({ ...options, method: 'post' });
	}

	put(options: MutateOptions): Promise<RequestResponse> {
		return this.request({ ...options, method: 'put' });
	}

	delete(options: MutateOptions): Promise<RequestResponse> {
		return this.request({ ...options, method: 'delete' });
	}

	request({
		uri,
		method,
		headers = undefined,
		data = undefined,
		auth,
		query = undefined,
		form = undefined,
		files = undefined,
		context = undefined,
		isBuffer = false
	}: AgentRequestOptions): Promise<RequestResponse> {
		const requestFiles = this._sanitizeFiles(files);
		const requestParams = this._buildRequest({ uri, method, headers, data, auth, query, form, context, files: requestFiles });
		return this._promiseResponse(requestParams, isBuffer);
	}

	private _promiseResponse(
		requestParams: [string, RequestInit],
		isBuffer: boolean,
		makerequest: (url: string, init?: RequestInit) => Promise<Response> = fetch as (url: string, init?: RequestInit) => Promise<Response>
	): Promise<RequestResponse> {
		let status: number;
		return makerequest(requestParams[0], requestParams[1])
			.then((resp: Response) => {
				status = resp.status;
				if (!resp.ok) {
					return resp.text().then((err: string) => {
						const objError = JSON.parse(err) as Record<string, string>;
						const response = Object.assign(resp, { text: err });
						throw Object.assign(objError, { response });
					});
				}
				if (status === 204) {
					return { body: {}, statusCode: 204 } as RequestResponse;
				}
				if (isBuffer) {
					return resp.blob().then((blob) =>
						blob.arrayBuffer().then((arrayBuffer) => {
							if (!this.isForBrowser()) {
								return Buffer.from(arrayBuffer) as RequestResponse;
							}
							return arrayBuffer as RequestResponse;
						})
					);
				}
				return resp.json().then((body) => ({
					body: body as object,
					statusCode: status
				} as RequestResponse));
			}).catch((error: Error & { error_description?: string }) => {
				const errorType = status ? `HTTP error ${status}` : 'Network error';
				let errorDescription = `${errorType} from ${requestParams[0]}`;
				let shortErrorDescription: string | undefined;
				if (error.error_description) {
					errorDescription = `${errorDescription} - ${error.error_description}`;
					shortErrorDescription = error.error_description;
				}
				const reason = new Error(errorDescription) as Error & {
					statusCode?: number;
					errorDescription?: string;
					shortErrorDescription?: string;
					error?: Error & { error_description?: string };
					body?: object;
				};
				Object.assign(reason, {
					statusCode: status,
					errorDescription,
					shortErrorDescription,
					error,
					body: error
				});
				throw reason;
			}) as Promise<RequestResponse>;
	}

	private _buildRequest({ uri, method, headers, data, auth, query, form, files, context }: AgentBuildRequestOptions): [string, RequestInit] {
		let actualUri = uri;
		if (this.baseUrl && uri[0] === '/') {
			actualUri = `${this.baseUrl}${uri}`;
		}
		if (query) {
			const queryParams = qs.stringify(query);
			if (queryParams) {
				const hasParams = actualUri.includes('?');
				actualUri = `${actualUri}${hasParams ? '&' : '?'}${queryParams}`;
			}
		}

		const pkg = packageJson as { name: string; version: string; repository: { url: string } };
		const userAgentHeader = { 'User-Agent': `${pkg.name}/${pkg.version} (${pkg.repository.url})` };
		let body: BodyInit | undefined;
		let contentTypeHeader: Record<string, string> | undefined;
		if (files) {
			contentTypeHeader = {};
			body = this._getFromData(files, form) as unknown as BodyInit;
		} else if (form) {
			contentTypeHeader = { 'Content-Type': 'application/x-www-form-urlencoded' };
			body = qs.stringify(form);
		} else if (data) {
			if (data instanceof FormData) {
				body = data as unknown as BodyInit;
			} else {
				contentTypeHeader = { 'Content-Type': 'application/json' };
				body = JSON.stringify(data);
			}
		}
		const finalHeaders: Record<string, string> = Object.assign({},
			userAgentHeader,
			contentTypeHeader,
			this._getAuthorizationHeader(auth),
			this._getContextHeaders(context),
			headers
		);

		return [actualUri, { method, body, headers: finalHeaders }];
	}

	isForBrowser(): boolean {
		return typeof window !== 'undefined';
	}

	private _getFromData(files: AgentSanitizedFiles, form?: Record<string, string | number | boolean | undefined>): FormData {
		const formData = new FormData();
		for (const [name, file] of Object.entries(files)) {
			let path: string | { filepath: string } = file.path;
			let fileData: AgentFile['data'] = file.data;
			if (!this.isForBrowser()) {
				const nodeFormData = this._getNodeFormData(file);
				path = nodeFormData.path;
				fileData = nodeFormData.file;
			}
			formData.append(name, fileData as string | Buffer, path as string);
		}
		if (form) {
			for (const [name, value] of Object.entries(form)) {
				if (value !== undefined) {
					formData.append(name, String(value));
				}
			}
		}
		return formData;
	}

	private _getNodeFormData(file: AgentFile): { file: AgentFile['data']; path: { filepath: string } } {
		let fileData: AgentFile['data'] = file.data;
		if (typeof file.data === 'string') {
			fileData = (fs as { createReadStream: (path: string) => NodeJS.ReadableStream }).createReadStream(file.data);
		}
		return {
			file: fileData,
			path: { filepath: file.path }
		};
	}

	private _getContextHeaders(context: { tool?: ToolContext; project?: ProjectContext } = {}): Record<string, string> {
		return Object.assign({},
			this._getToolContext(context.tool),
			this._getProjectContext(context.project)
		);
	}

	private _getToolContext(tool: ToolContext = { name: '' }): Record<string, string> {
		let value = '';
		if (tool.name) {
			value += this._toolIdent(tool);
			if (tool.components) {
				for (const component of tool.components) {
					value += ', ' + this._toolIdent(component);
				}
			}
		}
		if (value) {
			return { 'X-Particle-Tool': value };
		}
		return {};
	}

	private _toolIdent(tool: Omit<ToolContext, 'components'>): string {
		return this._nameAtVersion(tool.name, tool.version);
	}

	private _nameAtVersion(name: string, version?: string | number): string {
		let value = '';
		if (name) {
			value += name;
			if (version !== undefined) {
				value += '@' + version;
			}
		}
		return value;
	}

	private _getProjectContext(project: ProjectContext = { name: '' }): Record<string, string> {
		const value = this._buildSemicolonSeparatedProperties(project, 'name');
		if (value) {
			return { 'X-Particle-Project': value };
		}
		return {};
	}

	private _buildSemicolonSeparatedProperties(obj: Record<string, string | number>, primaryProperty: string): string {
		let value = '';
		if (obj[primaryProperty]) {
			value += obj[primaryProperty];
			for (const prop in obj) {
				if (prop !== primaryProperty && Object.hasOwnProperty.call(obj, prop)) {
					value += '; ' + prop + '=' + obj[prop];
				}
			}
		}
		return value;
	}

	private _getAuthorizationHeader(auth?: string): Record<string, string> {
		if (typeof auth === 'string') {
			return { Authorization: `Bearer ${auth}` };
		}
		return {};
	}

	private _sanitizeFiles(files?: AgentRequestOptions['files']): AgentSanitizedFiles | undefined {
		let requestFiles: AgentSanitizedFiles | undefined;
		if (files) {
			requestFiles = {};
			Object.keys(files).forEach((k, i) => {
				const name = i ? `file${i + 1}` : 'file';
				requestFiles![name] = {
					data: files[k],
					path: k
				};
			});
		}
		return requestFiles;
	}
}

export = Agent;
