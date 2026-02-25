import fetch from 'node-fetch';
import FormData from 'form-data';
import * as qs from 'qs';
import * as fs from '../fs';
import * as packageJson from '../package.json';

/**
 * The object returned for a basic request
 */
interface JSONResponse {
	statusCode: number;
	body: any;
}

/**
 * The possible response from an API request
 * The type is based on the request config and whether is on browser or node
 */
type RequestResponse = JSONResponse | Buffer | ArrayBuffer;

/**
 * The error object generated in case of a failed request
 */
interface RequestError {
	statusCode: number;
	errorDescription: string;
	shortErrorDescription: string;
	body: any;
	error: any;
}

interface RequestConfig {
	uri: string;
	method?: string;
	headers?: Record<string, string>;
	data?: any;
	auth?: string;
	query?: Record<string, any>;
	form?: Record<string, any>;
	files?: Record<string, any>;
	context?: {
		tool?: ToolContext;
		project?: ProjectContext;
	};
	isBuffer?: boolean;
}

interface ToolContext {
	name?: string;
	version?: string;
	components?: Array<{
		name: string;
		version?: string;
	}>;
}

interface ProjectContext {
	name?: string;
	[key: string]: string | number | undefined;
}

interface FileData {
	data: string | Buffer;
	path: string;
}

class Agent {
	private baseUrl?: string;

	constructor(baseUrl?: string) {
		if (baseUrl) {
			this.setBaseUrl(baseUrl);
		}
	}

	setBaseUrl(baseUrl: string): void {
		this.baseUrl = baseUrl;
	}

	/**
	 * Make a GET request
	 */
	get({ uri, auth, headers, query, context }: {
		uri: string;
		auth?: string;
		headers?: Record<string, string>;
		query?: Record<string, any>;
		context?: RequestConfig['context'];
	}): Promise<RequestResponse> {
		return this.request({ uri, method: 'get', auth, headers, query, context });
	}

	/**
	 * Make a HEAD request
	 */
	head({ uri, auth, headers, query, context }: {
		uri: string;
		auth?: string;
		headers?: Record<string, string>;
		query?: Record<string, any>;
		context?: RequestConfig['context'];
	}): Promise<RequestResponse> {
		return this.request({ uri, method: 'head', auth, headers, query, context });
	}

	/**
	 * Make a POST request
	 */
	post({ uri, headers, data, auth, context }: {
		uri: string;
		headers?: Record<string, string>;
		data?: any;
		auth?: string;
		context?: RequestConfig['context'];
	}): Promise<RequestResponse> {
		return this.request({ uri, method: 'post', auth, headers, data, context });
	}

	/**
	 * Make a PUT request
	 */
	put({ uri, auth, headers, data, query, context }: {
		uri: string;
		auth?: string;
		headers?: Record<string, string>;
		data?: any;
		query?: Record<string, any>;
		context?: RequestConfig['context'];
	}): Promise<RequestResponse> {
		return this.request({ uri, method: 'put', auth, headers, data, query, context });
	}

	/**
	 * Make a DELETE request
	 */
	delete({ uri, auth, headers, data, context }: {
		uri: string;
		auth?: string;
		headers?: Record<string, string>;
		data?: any;
		context?: RequestConfig['context'];
	}): Promise<RequestResponse> {
		return this.request({ uri, method: 'delete', auth, headers, data, context });
	}

	/**
	 * Make a generic HTTP request
	 */
	request({
		uri,
		method = 'GET',
		headers,
		data,
		auth,
		query,
		form,
		files,
		context,
		isBuffer = false
	}: RequestConfig): Promise<RequestResponse> {
		const requestFiles = this._sanitizeFiles(files);
		const requestParams = this._buildRequest({
			uri,
			method,
			headers,
			data,
			auth,
			query,
			form,
			context,
			files: requestFiles
		});
		return this._promiseResponse(requestParams, isBuffer);
	}

	/**
	 * Promises to send the request and retrieve the response.
	 */
	private async _promiseResponse(
		requestParams: [string, any],
		isBuffer: boolean,
		makerequest = fetch
	): Promise<RequestResponse> {
		let status: number;

		try {
			const resp = await makerequest(...requestParams);
			status = resp.status;

			if (!resp.ok) {
				const err = await resp.text();
				const objError = JSON.parse(err);
				// particle-commands/src/cmd/api expects response.text. to be a string
				const response = Object.assign(resp, { text: err });
				throw Object.assign(objError, { response });
			}

			if (status === 204) { // Can't do resp.json() since there is no body to parse
				return { body: '', statusCode: status };
			}

			if (isBuffer) {
				const blob = await resp.blob();
				const arrayBuffer = await blob.arrayBuffer();
				if (!this.isForBrowser()) {
					return Buffer.from(arrayBuffer);
				}
				return arrayBuffer;
			}

			const body = await resp.json();
			return { body, statusCode: status };

		} catch (error: any) {
			const errorType = status! ? `HTTP error ${status}` : 'Network error';
			let errorDescription = `${errorType} from ${requestParams[0]}`;
			let shortErrorDescription: string | undefined;

			if (error.error_description) { // Fetch responded with ok false
				errorDescription = `${errorDescription} - ${error.error_description}`;
				shortErrorDescription = error.error_description;
			}

			const reason = new Error(errorDescription) as any;
			Object.assign(reason, {
				statusCode: status!,
				errorDescription,
				shortErrorDescription,
				error,
				body: error
			});
			throw reason;
		}
	}

	/**
	 * Generate the params in a format valid for 'fetch'
	 */
	private _buildRequest({
		uri,
		method,
		headers,
		data,
		auth,
		query,
		form,
		files,
		context
	}: RequestConfig): [string, any] {
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

		const userAgentHeader = {
			'User-Agent': `${packageJson.name}/${packageJson.version} (${packageJson.repository.url})`
		};

		let body: any;
		let contentTypeHeader: Record<string, string> = {};

		if (files) {
			contentTypeHeader = {}; // Needed to allow fetch create its own
			body = this._getFromData(files, form);
		} else if (form) {
			contentTypeHeader = { 'Content-Type': 'application/x-www-form-urlencoded' };
			body = qs.stringify(form);
		} else if (data) {
			if (data instanceof FormData) {
				body = data;
			} else {
				contentTypeHeader = { 'Content-Type': 'application/json' };
				body = JSON.stringify(data);
			}
		}

		const finalHeaders = Object.assign({},
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

	private _getFromData(files: Record<string, FileData>, form?: Record<string, any>): FormData {
		const formData = new FormData();

		for (const [name, file] of Object.entries(files)) {
			let path = file.path;
			let fileData = file.data;

			if (!this.isForBrowser()) {
				const nodeFormData = this._getNodeFormData(file);
				path = nodeFormData.path;
				fileData = nodeFormData.file;
			}
			formData.append(name, fileData as any, path);
		}

		if (form) {
			for (const [name, value] of Object.entries(form)) {
				formData.append(name, value);
			}
		}

		return formData;
	}

	private _getNodeFormData(file: FileData): { file: any; path: any } {
		let fileData: any = file.data;
		if (typeof file.data === 'string') {
			fileData = fs.createReadStream(file.data);
		}
		return {
			file: fileData,
			path: { filepath: file.path } // Different API for nodejs
		};
	}

	private _getContextHeaders(context: RequestConfig['context'] = {}): Record<string, string> {
		return Object.assign({},
			this._getToolContext(context.tool),
			this._getProjectContext(context.project)
		);
	}

	private _getToolContext(tool: ToolContext = {}): Record<string, string> {
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

	private _toolIdent(tool: { name?: string; version?: string }): string {
		return this._nameAtVersion(tool.name, tool.version);
	}

	private _nameAtVersion(name?: string, version?: string): string {
		let value = '';
		if (name) {
			value += name;
			if (version) {
				value += '@' + version;
			}
		}
		return value;
	}

	private _getProjectContext(project: ProjectContext = {}): Record<string, string> {
		const value = this._buildSemicolonSeparatedProperties(project, 'name');
		if (value) {
			return { 'X-Particle-Project': value };
		}
		return {};
	}

	/**
	 * Creates a string like primaryPropertyValue; name=value; name1=value
	 * from the properties of an object.
	 */
	private _buildSemicolonSeparatedProperties(
		obj: Record<string, any>,
		primaryProperty: string
	): string {
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

	/**
	 * Adds an authorization header.
	 */
	private _getAuthorizationHeader(auth?: string): Record<string, string> {
		if (typeof auth === 'string') {
			return { Authorization: `Bearer ${auth}` };
		}
		return {};
	}

	/**
	 * Converts the file names to file, file1, file2.
	 */
	private _sanitizeFiles(files?: Record<string, any>): Record<string, FileData> | undefined {
		let requestFiles: Record<string, FileData> | undefined;
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

