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

import request from 'superagent';
import prefix from 'superagent-prefix';
import path from 'path';


export default class Agent {

	constructor(baseUrl) {
		this.prefix = prefix(baseUrl);
	}

	get(uri, auth, query) {
		return this.request({uri, auth, method: 'get', query: query});
	}

	head(uri, auth) {
		return this.request({uri, auth, method: 'head'});
	}

	post(uri, data, auth) {
		return this.request({uri, data, auth, method: 'post'});
	}

	put(uri, data, auth) {
		return this.request({uri, data, auth, method: 'put'});
	}

	delete(uri, data, auth) {
		return this.request({uri, data, auth, method: 'delete'});
	}


	/**
	 *
	 * @param {String} uri           The URI to request
	 * @param {String} method        The method used to request the URI, should be in uppercase.
	 * @param {String} data          Arbitrary data to send as the body.
	 * @param {Object} auth          Authorization
	 * @param {String} query         Query parameters
	 * @param {Object} form          Form fields
	 * @param {Object} files         array of file names and file content
	 * @return {Promise} A promise. fulfilled with {body, statusCode}, rejected with { statusCode, errorDescription, error, body }
	 */
	request({uri, method, data = undefined, auth, query = undefined, form = undefined, files = undefined}) {
		const requestFiles = this._sanitizeFiles(files);
		return this._request({uri, method, data, auth, query, form, files: requestFiles});
	}

	/**
	 *
	 * @param {String} uri           The URI to request
	 * @param {String} method        The method used to request the URI, should be in uppercase.
	 * @param {String} data          Arbitrary data to send as the body.
	 * @param {Object} auth          Authorization
	 * @param {String} query         Query parameters
	 * @param {Object} form          Form fields
	 * @param {Object} files         array of file names and file content
	 * @return {Promise} A promise. fulfilled with {body, statusCode}, rejected with { statusCode, errorDescription, error, body }
	 */
	_request({uri, method, data, auth, query, form, files}) {
		const req = this._buildRequest({uri, method, data, auth, query, form, files});
		return this._promiseResponse(req);
	}

	/**
	 * Promises to send the request and retreive the response.
	 * @param {Request} req The request to send
	 * @returns {Promise}   The promise to send the request and retrieve the response.
	 * @private
	 */
	_promiseResponse(req) {
		return new Promise((fulfill, reject) => this._sendRequest(req, fulfill, reject));
	}

	/**
	 * Sends the given request, calling the fulfill or reject methods for success/failure.
	 * @param {object} request   The request to send
	 * @param {function} fulfill    Called on success with the response
	 * @param {function} reject     Called on failure with the failure reason.
	 * @private
	 * @returns {undefined} Nothing
	 */
	_sendRequest(request, fulfill, reject) {
		request.end((error, res) => {
			const body = res && res.body;
			if (error) {
				const uri = request.url;
				const statusCode = error.status;
				let errorDescription = `${statusCode ? 'HTTP error ' + statusCode : 'Network error'} from ${uri}`;
				if (body && body.error_description) {
					errorDescription += ' - ' + body.error_description;
				}
				const reason = new Error(errorDescription);
				Object.assign(reason, {statusCode, errorDescription, error, body});
				reject(reason);
			} else {
				fulfill({
					body: body,
					statusCode: res.statusCode
				});
			}
		});
	}

	_buildRequest({uri, method, data, auth, query, form, files, makerequest=request}) {
		const req = makerequest(method, uri);
		if (this.prefix) {
			req.use(this.prefix);
		}
		this._authorizationHeader(req, auth);
		if (query) {
			req.query(query);
		}
		if (files) {
			for (let [name, file] of Object.entries(files)) {
				req._getFormData().append(name, file.data, {
					filename: file.path,
					relativePath: path.dirname(file.path)
				});
			}
			if (form) {
				for (let [name, value] of Object.entries(form)) {
					req.field(name, value);
				}
			}
		} else if (form) {
			req.type('form');
			req.send(form);
		} else if (data) {
			req.send(data);
		}
		return req;
	}

	/**
	 * Adds an authorization header.
	 * @param {Request} req     The request to add the authorization header to.
	 * @param {object|string}  auth    The authorization. Either a string authorization bearer token,
	 *  or a username/password object.
	 * @returns {Request} req   The original request.
	 */
	_authorizationHeader(req, auth) {
		if (auth) {
			if (auth.username !== undefined) {
				req.auth(auth.username, auth.password);
			} else {
				req.set({Authorization: `Bearer ${auth}`});
			}
		}
		return req;
	}

	/**
	 *
	 * @param {Array} files converts the file names to file, file1, file2.
	 * @returns {object} the renamed files.
	 */
	_sanitizeFiles(files) {
		let requestFiles;
		if (files) {
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

