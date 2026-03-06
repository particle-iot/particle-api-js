import Library = require('./Library');
import type { JSONResponse, BuildTargetsResponse, CompileResponse, DeviceInfo, LibraryInfo, OKResponse, TrackingIdentityResponse } from './types';

type LibraryApiData = Library.ApiData;

interface ParticleApi {
	listLibraries(options: Record<string, string | number | boolean | undefined>): Promise<JSONResponse<{ data: LibraryInfo[] }>>;
	getLibrary(options: Record<string, string | number | boolean | undefined>): Promise<JSONResponse<{ data: LibraryInfo }>>;
	getLibraryVersions(options: Record<string, string | number | boolean | undefined>): Promise<JSONResponse<{ data: LibraryInfo[] }>>;
	contributeLibrary(options: Record<string, string | number | boolean | Buffer | undefined>): Promise<JSONResponse<{ data: LibraryInfo }>>;
	publishLibrary(options: Record<string, string | number | boolean | undefined>): Promise<JSONResponse<{ data: LibraryInfo }>>;
	deleteLibrary(options: Record<string, string | number | boolean | undefined>): Promise<JSONResponse<OKResponse>>;
	downloadFile(options: { uri: string; headers?: Record<string, string> }): Promise<Buffer | ArrayBuffer>;
	compileCode(options: Record<string, string | number | boolean | object | undefined>): Promise<JSONResponse<CompileResponse>>;
	signalDevice(options: Record<string, string | number | boolean | undefined>): Promise<JSONResponse<DeviceInfo>>;
	listDevices(options: Record<string, string | number | boolean | undefined>): Promise<JSONResponse<DeviceInfo[]>>;
	listBuildTargets(options: Record<string, string | number | boolean | undefined>): Promise<JSONResponse<BuildTargetsResponse>>;
	trackingIdentity(options: Record<string, string | number | boolean | object | undefined>): Promise<JSONResponse<TrackingIdentityResponse>>;
}

interface ClientOptions {
	auth?: string;
	api?: ParticleApi;
}

class Client {
	auth: string | undefined;
	api: ParticleApi;

	constructor({ auth, api }: ClientOptions) {
		this.auth = auth;
		if (api) {
			this.api = api;
		} else {
			const ParticleClass: new (options?: Record<string, string | number | boolean | undefined>) => ParticleApi = require('./Particle');
			this.api = new ParticleClass();
		}
	}

	ready(): boolean {
		return Boolean(this.auth);
	}

	libraries(query: Record<string, string | number | boolean | undefined> = {}): Promise<Library[]> {
		return this.api.listLibraries(Object.assign({}, query, { auth: this.auth }))
			.then((payload) => {
				const libraries = payload.body.data || [];
				return libraries.map((l) => new Library(this, l));
			});
	}

	library(name: string, query: Record<string, string | number | boolean | undefined> = {}): Promise<Library> {
		return this.api.getLibrary(Object.assign({}, query, { name, auth: this.auth }))
			.then((payload) => {
				const library = payload.body.data || {} as LibraryApiData;
				return new Library(this, library as LibraryApiData);
			});
	}

	libraryVersions(name?: string, query: Record<string, string | number | boolean | undefined> = {}): Promise<Library[]> {
		return this.api.getLibraryVersions(Object.assign({}, query, { name, auth: this.auth }))
			.then((payload) => {
				const libraries = payload.body.data || [];
				return libraries.map((l) => new Library(this, l));
			});
	}

	contributeLibrary(archive: string | Buffer): Promise<Library | undefined> {
		return this.api.contributeLibrary({ archive, auth: this.auth })
			.then((payload) => {
				const library = payload.body.data || {} as LibraryApiData;
				return new Library(this, library as LibraryApiData);
			}, (error: { body?: { errors?: Array<{ message: string }> } }) => {
				this._throwError(error);
			});
	}

	publishLibrary(name: string): Promise<Library | undefined> {
		return this.api.publishLibrary({ name, auth: this.auth })
			.then((payload) => {
				const library = payload.body.data || {} as LibraryApiData;
				return new Library(this, library as LibraryApiData);
			}, (error: { body?: { errors?: Array<{ message: string }> } }) => {
				this._throwError(error);
			});
	}

	deleteLibrary({ name, force }: { name: string; force?: string }): Promise<boolean | undefined> {
		return this.api.deleteLibrary({ name, force, auth: this.auth })
			.then(() => true, (error: { body?: { errors?: Array<{ message: string }> } }) => this._throwError(error));
	}

	_throwError(error: { body?: { errors?: Array<{ message: string }> } }): never {
		if (error.body && error.body.errors) {
			const errorMessages = error.body.errors.map((e) => e.message).join('\n');
			throw new Error(errorMessages);
		}
		throw error;
	}

	downloadFile(uri: string): Promise<Buffer> {
		return this.api.downloadFile({ uri }) as Promise<Buffer>;
	}

	compileCode(files: Record<string, string | Buffer>, platformId: number, targetVersion: string): Promise<JSONResponse<CompileResponse>> {
		return this.api.compileCode({ files, platformId, targetVersion, auth: this.auth });
	}

	signalDevice({ signal, deviceId }: { signal: boolean; deviceId: string }): Promise<JSONResponse<DeviceInfo>> {
		return this.api.signalDevice({ signal, deviceId, auth: this.auth });
	}

	listDevices(): Promise<JSONResponse<DeviceInfo[]>> {
		return this.api.listDevices({ auth: this.auth });
	}

	listBuildTargets(): Promise<Array<{ version: string; platform: number; prerelease: boolean; firmware_vendor: string }>> {
		return this.api.listBuildTargets({ onlyFeatured: true, auth: this.auth })
			.then((payload) => {
				const targets: Array<{ version: string; platform: number; prerelease: boolean; firmware_vendor: string }> = [];
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

	trackingIdentity({ full = false, context }: { full?: boolean; context?: object } = {}): Promise<{ id: string; email: string }> {
		return this.api.trackingIdentity({ full, context, auth: this.auth })
			.then((payload) => {
				return payload.body;
			});
	}
}

namespace Client {
	export type Api = ParticleApi;
}

export = Client;
