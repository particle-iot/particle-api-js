import Library = require('./Library');

// Define interfaces locally since they're not exported from Library
interface LibraryData {
	attributes?: any;
	links?: {
		download?: string;
	};
	[key: string]: any;
}

interface LibraryClient {
	downloadFile(url: string): Promise<Buffer | ArrayBuffer>;
}

// Forward declaration to avoid circular dependency
interface ParticleAPI {
	listLibraries(options: any): Promise<any>;
	getLibrary(options: any): Promise<any>;
	getLibraryVersions(options: any): Promise<any>;
	contributeLibrary(options: any): Promise<any>;
	publishLibrary(options: any): Promise<any>;
	deleteLibrary(options: any): Promise<any>;
	downloadFile(options: any): Promise<Buffer | ArrayBuffer>;
	compileCode(options: any): Promise<any>;
	signalDevice(options: any): Promise<any>;
	listDevices(options: any): Promise<any>;
	listBuildTargets(options: any): Promise<any>;
	trackingIdentity(options: any): Promise<any>;
}

interface ClientError {
	body?: {
		errors?: Array<{ message: string }>;
	};
}

interface BuildTarget {
	version: string;
	platform: string;
	prerelease: boolean;
	firmware_vendor: string;
}

class Client implements LibraryClient {
	private auth: string;
	private api: ParticleAPI;

	constructor({ auth, api }: { auth: string; api: ParticleAPI }) {
		this.auth = auth;
		this.api = api;
	}

	ready(): boolean {
		return Boolean(this.auth);
	}

	/**
	 * Get firmware library objects
	 */
	libraries(query: Record<string, any> = {}): Promise<Library[]> {
		return this.api.listLibraries(Object.assign({}, query, { auth: this.auth }))
			.then(payload => {
				const libraries = payload.body.data || [];
				return libraries.map((l: LibraryData) => new Library(this, l));
			});
	}

	/**
	 * Get one firmware library object
	 */
	library(name: string, query: Record<string, any> = {}): Promise<Library> {
		return this.api.getLibrary(Object.assign({}, query, { name, auth: this.auth }))
			.then(payload => {
				const library = payload.body.data || {};
				return new Library(this, library);
			});
	}

	/**
	 * Get list of library versions
	 */
	libraryVersions(name: string, query: Record<string, any> = {}): Promise<Library[]> {
		return this.api.getLibraryVersions(Object.assign({}, query, { name, auth: this.auth }))
			.then(payload => {
				const libraries = payload.body.data || [];
				return libraries.map((l: LibraryData) => new Library(this, l));
			});
	}

	/**
	 * Contribute a new library version
	 */
	contributeLibrary(archive: Buffer): Promise<Library> {
		return this.api.contributeLibrary({ archive, auth: this.auth })
			.then(payload => {
				const library = payload.body.data || {};
				return new Library(this, library);
			}, (error: ClientError) => {
				this._throwError(error);
			});
	}

	/**
	 * Make the the most recent private library version public
	 */
	publishLibrary(name: string): Promise<Library> {
		return this.api.publishLibrary({ name, auth: this.auth })
			.then(payload => {
				const library = payload.body.data || {};
				return new Library(this, library);
			}, (error: ClientError) => {
				this._throwError(error);
			});
	}

	/**
	 * Delete an entire published library
	 */
	deleteLibrary({ name, force }: { name: string; force?: string }): Promise<boolean> {
		return this.api.deleteLibrary({ name, force, auth: this.auth })
			.then(() => true, (error: ClientError) => this._throwError(error));
	}

	private _throwError(error: ClientError): never {
		if (error.body && error.body.errors) {
			const errorMessages = error.body.errors.map((e) => e.message).join('\n');
			throw new Error(errorMessages);
		}
		throw error;
	}

	downloadFile(uri: string): Promise<Buffer | ArrayBuffer> {
		return this.api.downloadFile({ uri });
	}

	/**
	 * @deprecated Will be removed in 6.5
	 */
	compileCode(
		files: Record<string, any>,
		platformId: number,
		targetVersion: string
	): Promise<any> {
		return this.api.compileCode({ files, platformId, targetVersion, auth: this.auth });
	}

	/**
	 * @deprecated Will be removed in 6.5
	 */
	signalDevice({ signal, deviceId }: { signal: boolean; deviceId: string }): Promise<any> {
		return this.api.signalDevice({ signal, deviceId, auth: this.auth });
	}

	/**
	 * @deprecated Will be removed in 6.5
	 */
	listDevices(): Promise<any> {
		return this.api.listDevices({ auth: this.auth });
	}

	/**
	 * @deprecated Will be removed in 6.5
	 */
	listBuildTargets(): Promise<BuildTarget[]> {
		return this.api.listBuildTargets({ onlyFeatured: true, auth: this.auth })
			.then(payload => {
				const targets: BuildTarget[] = [];
				for (const target of payload.body.targets) {
					for (const platform of target.platforms) {
						targets.push({
							version: target.version,
							platform: platform,
							prerelease: target.prereleases.indexOf(platform) > -1,
							firmware_vendor: target.firmware_vendor
						});
					}
				}
				return targets;
			}, () => []);
	}

	trackingIdentity({
		full = false,
		context = undefined
	}: {
		full?: boolean;
		context?: any;
	} = {}): Promise<any> {
		return this.api.trackingIdentity({ full, context, auth: this.auth })
			.then(payload => {
				return payload.body;
			});
	}
}

