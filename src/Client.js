const Library = require('./Library');
let Particle;

class Client {
    constructor({ auth, api = new Particle() }){
        this.auth = auth;
        this.api = api;
    }

    ready(){
        return Boolean(this.auth);
    }

    /**
     * Get firmware library objects
     * @param  {Object} query The query parameters for libraries. See Particle.listLibraries
     * @returns {Promise} A promise
     */
    libraries(query = {}){
        return this.api.listLibraries(Object.assign({}, query, { auth: this.auth }))
            .then(payload => {
                const libraries = payload.body.data || [];
                return libraries.map(l => new Library(this, l));
            });
    }

    /**
     * Get one firmware library object
     * @param  {String} name Name of the library to fetch
     * @param  {Object} query The query parameters for libraries. See Particle.getLibrary
     * @returns {Promise} A promise
     */
    library(name, query = {}){
        return this.api.getLibrary(Object.assign({}, query, { name, auth: this.auth }))
            .then(payload => {
                const library = payload.body.data || {};
                return new Library(this, library);
            });
    }

    /**
     * Get list of library versions
     * @param  {String} name Name of the library to fetch
     * @param  {Object} query The query parameters for versions. See Particle.getLibraryVersions
     * @returns {Promise} A promise
     */
    libraryVersions(name, query = {}){
        return this.api.getLibraryVersions(Object.assign({}, query, { name, auth: this.auth }))
            .then(payload => {
                const libraries = payload.body.data || [];
                return libraries.map(l => new Library(this, l));
            });
    }

    /**
     * Contribute a new library version
     * @param  {Buffer} archive The compressed archive with the library source
     * @returns {Promise} A promise
     */
    contributeLibrary(archive){
        return this.api.contributeLibrary({ archive, auth: this.auth })
            .then(payload => {
                const library = payload.body.data || {};
                return new Library(this, library);
            }, error => {
                this._throwError(error);
            });
    }

    /**
     * Make the the most recent private library version public
     * @param  {string} name The name of the library to publish
     * @return {Promise} To publish the library
     */
    publishLibrary(name){
        return this.api.publishLibrary({ name, auth: this.auth })
            .then(payload => {
                const library = payload.body.data || {};
                return new Library(this, library);
            }, error => {
                this._throwError(error);
            });
    }

    /**
     * Delete an entire published library
     * @param {object} params	Specific params of the library to delete
     * @param {string} params.name	Name of the library to delete
     * @param {string} params.force	Key to force deleting a public library
     * @returns {Promise} A promise
     */
    deleteLibrary({ name, force }){
        return this.api.deleteLibrary({ name, force, auth: this.auth })
            .then(() => true, error => this._throwError(error));
    }

    _throwError(error){
        if (error.body && error.body.errors){
            const errorMessages = error.body.errors.map((e) => e.message).join('\n');
            throw new Error(errorMessages);
        }
        throw error;
    }

    downloadFile(uri){
        return this.api.downloadFile({ uri });
    }

    /**
     * @param {Object} files Object containing files to be compiled
     * @param {Number} platformId Platform id number of the device you are compiling for
     * @param {String} targetVersion System firmware version to compile against
     * @returns {Promise} A promise
     * @deprecated Will be removed in 6.5
     */
    compileCode(files, platformId, targetVersion){
        return this.api.compileCode({ files, platformId, targetVersion, auth: this.auth });
    }

    /**
     * @param {object} params
     * @param {string} params.deviceId	Device ID or Name
     * @param {boolean} params.signal	Signal on or off
     * @returns {Promise} A promise
     * @deprecated Will be removed in 6.5
     */
    signalDevice({ signal, deviceId }){
        return this.api.signalDevice({ signal, deviceId, auth: this.auth });
    }

    /**
     * @returns {Promise} A promise
     * @deprecated Will be removed in 6.5
     */
    listDevices(){
        return this.api.listDevices({ auth: this.auth });
    }

    /**
     * @returns {Promise} A promise
     * @deprecated Will be removed in 6.5
     */
    listBuildTargets(){
        return this.api.listBuildTargets({ onlyFeatured: true, auth: this.auth })
            .then(payload => {
                let targets = [];
                for (let target of payload.body.targets){
                    for (let platform of target.platforms){
                        targets.push({
                            version: target.version,
                            platform: platform,
                            prerelease: target.prereleases.indexOf(platform) > -1,
                            firmware_vendor: target.firmware_vendor
                        });
                    }
                }
                return targets;
            }, () => {});
    }

    trackingIdentity({ full = false, context = undefined }={}){
        return this.api.trackingIdentity({ full, context, auth: this.auth })
            .then(payload => {
                return payload.body;
            });
    }
}

module.exports = Client;
Particle = require('./Particle'); // Move it to after the export to avoid issue with circular reference
