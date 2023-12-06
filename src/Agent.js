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

const fetch = require('node-fetch');
const FormData = require('form-data');
const qs = require('qs');
const fs = require('../fs');
const packageJson = require('../package.json');

/**
 * @typedef {string} AccessToken
 */

/**
 * @typedef {object} BasicAuth
 * @property {string} username
 * @property {string} password
 */

/**
 * @typedef {AccessToken | BasicAuth} Auth Prefer using an access token over basic auth for better security
 */

/**
 * The object returned for a basic request
 * @typedef {object} JSONResponse
 * @property {number} statusCode  The HTTP response status
 * @property {object} body        The endpoint's response parsed as a JSON
 */

/**
 * The possible response from an API request
 * @typedef {JSONResponse | Buffer | ArrayBuffer} RequestResponse	The type is based on
 * the request config and whether is on browser or node
 */

/**
 * The error object generated in case of a failed request
 * @typedef {object} RequestError
 * @property {number} statusCode             The HTTP response status
 * @property {string} errorDescription       Details on what caused the failed request
 * @property {string} shortErrorDescription  Summarized version of the fail reason
 * @property {object} body                   The response object from the request
 * @property {object} error                  The error object from the request
 */

class Agent {
    constructor(baseUrl){
        this.setBaseUrl(baseUrl);
    }

    setBaseUrl(baseUrl) {
        this.baseUrl = baseUrl;
    }

    /**
     * Make a GET request
     * @param {object} params            Configurations to customize the request
     * @param {string} params.uri        The URI to request
     * @param {Auth}   [params.auth]     Authorization token to use
     * @param {object} [params.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {object} [params.query]    Key/Value pairs of query params
     * @param {object} [params.context]  The invocation context, describing the tool and project
     * @returns {Promise<RequestResponse, RequestError>} A promise that resolves with either the requested data or an error object
     */
    get({ uri, auth, headers, query, context }) {
        return this.request({ uri, method: 'get', auth, headers, query, context });
    }

    /**
     * Make a HEAD request
     * @param {object} params            Configurations to customize the request
     * @param {string} params.uri        The URI to request
     * @param {Auth}   [params.auth]     Authorization token to use
     * @param {object} [params.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {object} [params.query]    Key/Value pairs of query params
     * @param {object} [params.context]  The invocation context, describing the tool and project
     * @returns {Promise<RequestResponse, RequestError>} A promise that resolves with either the requested data or an error object
     */
    head({ uri, auth, headers, query, context }) {
        return this.request({ uri, method: 'head', auth, headers, query, context });
    }

    /**
     * Make a POST request
     * @param {object} params            Configurations to customize the request
     * @param {string} params.uri        The URI to request
     * @param {Auth}   [params.auth]     Authorization token to use
     * @param {object} [params.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {object} [params.data]     Key/Value pairs of query params
     * @param {object} [params.context]  The invocation context, describing the tool and project
     * @returns {Promise<RequestResponse, RequestError>} A promise that resolves with either the requested data or an error object
     */
    post({ uri, headers, data, auth, context }) {
        return this.request({ uri, method: 'post', auth, headers, data, context });
    }

    /**
     * Make a PUT request
     * @param {object} params            Configurations to customize the request
     * @param {string} params.uri        The URI to request
     * @param {Auth}   [params.auth]     Authorization token to use
     * @param {object} [params.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {object} [params.data]     Key/VAlue pairs of query params
     * @param {object} [params.context]  The invocation context, describing the tool and project
     * @returns {Promise<RequestResponse, RequestError>} A promise that resolves with either the requested data or an error object
     */
    put({ uri, auth, headers, data, context }) {
        return this.request({ uri, method: 'put', auth, headers, data, context });
    }

    /**
     * Make a DELETE request
     * @param {object} params            Configurations to customize the request
     * @param {string} params.uri        The URI to request
     * @param {Auth}   [params.auth]     Authorization token to use
     * @param {object} [params.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {object} [params.data]     Key/Value pairs of query params
     * @param {object} [params.context]  The invocation context, describing the tool and project
     * @returns {Promise<RequestResponse, RequestError>} A promise that resolves with either the requested data or an error object
     */
    delete({ uri, auth, headers, data, context }) {
        return this.request({ uri, method: 'delete', auth, headers, data, context });
    }

    /**
     *
     * @param {object}  config                  An obj with all the possible request configurations
     * @param {string}  config.uri              The URI to request
     * @param {string}  config.method           The method used to request the URI, should be in uppercase.
     * @param {object}  [config.headers]        Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {object}  [config.data]           Arbitrary data to send as the body.
     * @param {Auth}    [config.auth]           Authorization
     * @param {object}  [config.query]          Query parameters
     * @param {object}  [config.form]           Form fields
     * @param {object}  [config.files]          Array of file names and file content
     * @param {object}  [config.context]        The invocation context, describing the tool and project.
     * @param {boolean} [config.isBuffer=false] Indicate if the response should be treated as Buffer instead of JSON
     * @returns {Promise<RequestResponse, RequestError>} A promise that resolves with either the requested data or an error object
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
        isBuffer = false
    }){
        const requestFiles = this._sanitizeFiles(files);
        const requestParams = this._buildRequest({ uri, method, headers, data, auth, query, form, context, files: requestFiles });
        return this._promiseResponse(requestParams, isBuffer);
    }

    /**
     * Promises to send the request and retrieve the response.
     * @param {[string, object]} requestParams        First argument is the URI to request, the second one are the options.
     * @param {boolean}          isBuffer             Indicate if the response body should be returned as a Buffer (Node) / ArrayBuffer (browser) instead of JSON
     * @param {function}         [makerequest=fetch]  The fetch function to use. Override for testing.
     * @returns {Promise<RequestResponse, RequestError>} A promise that resolves with either the requested data or an error object
     * @private
     */
    _promiseResponse(requestParams, isBuffer, makerequest = fetch) {
        let status;
        return makerequest(...requestParams)
            .then((resp) => {
                status = resp.status;
                if (!resp.ok) {
                    return resp.text().then((err) => {
                        const objError = JSON.parse(err);
                        // particle-commnds/src/cmd/api expects response.text. to be a string
                        const response = Object.assign(resp, { text: err });
                        throw Object.assign(objError, { response });
                    });
                }
                if (status === 204) { // Can't do resp.json() since there is no body to parse
                    return '';
                }
                if (isBuffer) {
                    return resp.blob();
                }
                return resp.json();
            }).then((body) => {
                if (isBuffer) {
                    return body.arrayBuffer().then((arrayBuffer) => {
                        if (!this.isForBrowser()) {
                            return Buffer.from(arrayBuffer);
                        }
                        return arrayBuffer;
                    });
                }
                return {
                    body,
                    statusCode: status
                };
            }).catch((error) => {
                const errorType = status ? `HTTP error ${status}` : 'Network error';
                let errorDescription = `${errorType} from ${requestParams[0]}`;
                let shortErrorDescription;
                if (error.error_description) { // Fetch responded with ok false
                    errorDescription = `${errorDescription} - ${error.error_description}`;
                    shortErrorDescription = error.error_description;
                }
                const reason = new Error(errorDescription);
                Object.assign(reason, {
                    statusCode: status,
                    errorDescription,
                    shortErrorDescription,
                    error,
                    body: error
                });
                throw reason;
            });
    }

    /**
     * Generate the params in a format valid for 'fetch'
     * @param {object} config            Configurations to customize the request
     * @param {string} config.uri        The URI to request
     * @param {string} config.method     The method used to request the URI, should be in uppercase.
     * @param {object} [config.headers]  Key/Value pairs like `{ 'X-FOO': 'foo', X-BAR: 'bar' }` to send as headers.
     * @param {object} [config.data]     Arbitrary data to send as the body.
     * @param {Auth}   [config.auth]     Authorization
     * @param {object} [config.query]    Query parameters
     * @param {object} [config.form]     Form fields
     * @param {object} [config.files]    Array of file names and file content
     * @param {object} [config.context]  The invocation context, describing the tool and project.
     * @returns {[string, object]} The uri to make the request too, and extra configs
     * @private
     */
    _buildRequest({ uri, method, headers, data, auth, query, form, files, context }){
        let actualUri = uri;
        if (this.baseUrl && uri[0] === '/') {
            actualUri = `${this.baseUrl}${uri}`;
        }
        if (query) {
            const queryParams = qs.stringify(query);
            const hasParams = actualUri.includes('?');
            actualUri = `${actualUri}${hasParams ? '&' : '?'}${queryParams}`;
        }

        const userAgentHeader = { 'User-Agent': `${packageJson.name}/${packageJson.version} (${packageJson.repository.url})` };
        let body;
        let contentTypeHeader;
        if (files){
            // @ts-ignore
            contentTypeHeader = {}; // Needed to allow fetch create its own
            body = this._getFromData(files, form);
        } else if (form){
            contentTypeHeader = { 'Content-Type': 'application/x-www-form-urlencoded' };
            body = qs.stringify(form);
        } else if (data){
            contentTypeHeader = { 'Content-Type': 'application/json' };
            body = JSON.stringify(data);
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

    isForBrowser() {
        return typeof window !== 'undefined';
    }

    _getFromData(files, form) {
        const formData = new FormData();
        for (let [name, file] of Object.entries(files)){
            let path = file.path;
            let fileData = file.data;
            if (!this.isForBrowser()) {
                const nodeFormData = this._getNodeFormData(file);
                path = nodeFormData.path;
                fileData = nodeFormData.file;
            }
            formData.append(name, fileData, path);
        }
        if (form){
            for (let [name, value] of Object.entries(form)){
                formData.append(name, value);
            }
        }
        return formData;
    }

    _getNodeFormData(file) {
        let fileData = file.data;
        if (typeof file.data === 'string') {
            fileData = fs.createReadStream(file.data);
        }
        return {
            file: fileData,
            path: { filepath: file.path } // Different API for nodejs
        };
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
     * @param {Auth} [auth]  The authorization bearer token.
     * @returns {object} The original request.
     */
    _getAuthorizationHeader(auth){
        if (!auth) {
            return {};
        }
        if (typeof auth === 'string') {
            return { Authorization: `Bearer ${auth}` };
        }
        let encoded;
        if (this.isForBrowser()) {
            encoded = btoa(`${auth.username}:${auth.password}`);
        } else {
            encoded = Buffer.from(`${auth.username}:${auth.password}`)
                .toString('base64');
        }
        return { Authorization: `Basic ${encoded}` };
    }

    /**
     *
     * @param {Object} files  converts the file names to file, file1, file2.
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

module.exports = Agent;
