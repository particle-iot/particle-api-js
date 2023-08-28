/*
 ******************************************************************************
 Copyright (c) 2016 Particle Industries, Inc.  All rights reserved.

 This program is free software; you can redistribute it and/or
 modify it under the terms of the GNU Lesser General Public
 License as published by the Free Software Foundation, either
 version 3 of the License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 Lesser General Public License for more details.

 You should have received a copy of the GNU Lesser General Public
 License along with this program; if not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************
 */

import fetch from 'node-fetch';
import FormData from 'form-data';

export default class Agent {
	constructor(baseUrl){
		this.setBaseUrl(baseUrl);
	}

	setBaseUrl(baseUrl) {
		this.baseUrl = baseUrl;
	}

	get({ uri, auth, headers, query, context }) {
		return this.request({ uri, method: 'get', auth, headers, query, context });
	}

	head({ uri, auth, headers, query, context }) {
		return this.request({ uri, method: 'head', auth, headers, query, context });
	}

	post({ uri, headers, data, auth, context }) {
		return this.request({ uri, method: 'post', auth, headers, data, context });
	}

	put({ uri, auth, headers, data, context }) {
		return this.request({ uri, method: 'put', auth, headers, data, context });
	}

	delete({ uri, auth, headers, data, context }) {
		return this.request({ uri, method: 'delete', auth, headers, data, context });
	}


	/**
	 *
	 * @param {Object} config		An obj with all the possible request configurations
	 * @param {String} config.uri		The URI to request
	 * @param {String} config.method        The method used to request the URI, should be in uppercase.
	 * @param {Object} config.headers       Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {String} config.data          Arbitrary data to send as the body.
	 * @param {Object} config.auth          Authorization
	 * @param {String|Object} config.query  Query parameters
	 * @param {Object} config.form          Form fields
	 * @param {Object} config.files         array of file names and file content
	 * @param {Object} config.context       the invocation context, describing the tool and project.
	 * @return {Promise} A promise. fulfilled with {body, statusCode}, rejected with { statusCode, errorDescription, error, body }
	 */
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
		buffer = false
	}){
		const requestFiles = this._sanitizeFiles(files);
		return this._request({ uri, method, headers, data, auth, query, form, context, files: requestFiles, buffer });
	}

	/**
	 *
	 * @param {String} uri           The URI to request
	 * @param {String} method        The method used to request the URI, should be in uppercase.
	 * @param {Object} headers       Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
	 * @param {String} data          Arbitrary data to send as the body.
	 * @param {Object} auth          Authorization
	 * @param {String|Object} query  Query parameters
	 * @param {Object} form          Form fields
	 * @param {Object} files         array of file names and file content
	 * @param {Object} context       the invocation context
	 * @return {Promise} A promise. fulfilled with {body, statusCode}, rejected with { statusCode, errorDescription, error }
	 */
	_request({ uri, method, headers, data, auth, query, form, files, context, buffer }){
		const req = this._buildRequest({ uri, method, headers, data, auth, query, form, context, files });
		return this._promiseResponse(req, buffer);
	}

	/**
	 * Promises to send the request and retreive the response.
	 * @param {[string, object]} requestParams	First argument is the URI to request, the second one are the options.
	 * @returns {Promise}				The promise to send the request and retrieve the response.
	 * @private
	 */
	_promiseResponse(requestParams, buffer, makerequest = fetch) {
		let status;
		return makerequest(...requestParams)
			.then((resp) => {
				if (!resp.ok) {
					const err = new Error(); // TODO: Create error object
					Object.assign(err, resp);
					throw err;
				}
				if (buffer) {
					return resp.blob();
				}
				status = resp.status;
				return resp.json();
			}).then((body) => {
				if (buffer) {
					return blob.arrayBuffer();
				}
				return {
					body,
					statusCode: status
				};
			}).catch((error) => {
				const statusCode = error.status;
				const errorType = statusCode ? `HTTP error ${statusCode}` : 'Network error';
				let errorDescription = `${errorType} from ${requestParams[0]}`;
				let shortErrorDescription;
				if (error && error.statusText) { // Failed fetch request
					errorDescription = `${errorDescription} - ${error.statusText}`;
					shortErrorDescription = error.statusText;
				}
				const reason = new Error(errorDescription);
				Object.assign(reason, { statusCode, errorDescription, shortErrorDescription, error });
				return reason;
			});
	}

	_buildRequest({ uri, method, headers, data, auth, query, form, files, context }){
		let actualUri = uri;
		if (this.baseUrl) {
			actualUri = `${this.baseUrl}${uri}`;
		}
		if (query) {
			let queryParams;
			if (typeof query === 'string') {
				queryParams = query;
			} else {
				queryParams = new URLSearchParams(query).toString();
			}
			const hasParams = actualUri.includes('?');
			actualUri = `${actualUri}${hasParams ? '&' : '?'}${queryParams}`;
		}

		let body;
		let contentType = { 'Content-Type': 'application/x-www-form-urlencoded' };
		if (files){
			const formData = new FormData();
			for (let [name, file] of Object.entries(files)){
				let path = file.path;
				if (!this.isForBrowser()) {
					path = { filepath: file.path }; // Different API for nodejs
				}
				formData.append(name, file.data, path);
			}
			if (form){
				for (let [name, value] of Object.entries(form)){
					formData.append(name, value);
				}
			}
			contentType = {}; // Needed to allow fetch create it's own
			body = formData;
		} else if (form){
			body = new URLSearchParams(form);
		} else if (data){
			body = new URLSearchParams(data);
		}
		const finalHeaders = Object.assign({},
			contentType,
			this._getAuthorizationHeader(auth),
			this._getContextHeaders(context),
			headers
		);

		return [actualUri, { method, body, headers: finalHeaders }];
	}

	isForBrowser() {
		return typeof window !== 'undefined';
	}

	_getContextHeaders(context = {}) {
		return Object.assign({},
			this._getToolContext(context.tool),
			this._getProjectContext(context.project)
		);
	}

	_getToolContext(tool = {}){
		let value = '';
		if (tool.name){
			value += this._toolIdent(tool);
			if (tool.components){
				for (let component of tool.components){
					value += ', '+this._toolIdent(component);
				}
			}
		}
		if (value){
			return { 'X-Particle-Tool': value };
		}
		return {};
	}

	_toolIdent(tool){
		return this._nameAtVersion(tool.name, tool.version);
	}

	_nameAtVersion(name, version){
		let value = '';
		if (name){
			value += name;
			if (version){
				value += '@'+version;
			}
		}
		return value;
	}

	_getProjectContext(project = {}){
		let value = this._buildSemicolonSeparatedProperties(project, 'name');
		if (value){
			return { 'X-Particle-Project': value };
		}
		return {};
	}

	/**
	 * Creates a string like primaryPropertyValue; name=value; name1=value
	 * from the properties of an object.
	 * @param {object} obj               The object to create the string from
	 * @param {string} primaryProperty   The name of the primary property which is the default value and must be defined.
	 * @private
	 * @return {string} The formatted string representing the object properties and the default property.
	 */
	_buildSemicolonSeparatedProperties(obj, primaryProperty){
		let value = '';
		if (obj[primaryProperty]){
			value += obj[primaryProperty];
			for (let prop in obj){
				if (prop!==primaryProperty && obj.hasOwnProperty(prop)){
					value += '; '+prop+'='+obj[prop];
				}
			}
		}
		return value;
	}

	/**
	 * Adds an authorization header.
	 * @param {string}  auth    The authorization bearer token.
	 * @returns {object} The original request.
	 */
	_getAuthorizationHeader(auth){
		if (auth) {
			return { Authorization: `Bearer ${auth}` };
		}
		return {};
	}

	/**
	 *
	 * @param {Object} files converts the file names to file, file1, file2.
	 * @returns {object} the renamed files.
	 */
	_sanitizeFiles(files){
		let requestFiles;
		if (files){
			requestFiles = {};
			Object.keys(files).forEach((k, i) => {
				const name = i ? `file${i + 1}` : 'file';
				requestFiles[name] = {
					data: files[k],
					path: k
				};
			});
		}
		return requestFiles;
	}
}

