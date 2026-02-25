interface LibraryData {
	attributes?: LibraryAttributes;
	links?: {
		download?: string;
	};
	[key: string]: any;
}

interface LibraryAttributes {
	name?: string;
	version?: string;
	description?: string;
	author?: string;
	license?: string;
	visibility?: string;
	official?: boolean;
	verified?: boolean;
	installs?: number;
	architectures?: string[];
	repository?: string;
	homepage?: string;
	[key: string]: any;
}

interface LibraryClient {
	downloadFile(url: string): Promise<Buffer | ArrayBuffer>;
}

/**
 * Represents a version of a library contributed in the cloud.
 */
class Library {
	private client!: LibraryClient; // Use definite assignment assertion since it's set in constructor
	public downloadUrl?: string;

	// Library attributes - dynamically assigned from LibraryAttributes
	public name?: string;
	public version?: string;
	public description?: string;
	public author?: string;
	public license?: string;
	public visibility?: string;
	public official?: boolean;
	public verified?: boolean;
	public installs?: number;
	public architectures?: string[];
	public repository?: string;
	public homepage?: string;

	constructor(client: LibraryClient, data: LibraryData) {
		// Make client non-enumerable so it doesn't show up in Object.keys, JSON.stringify, etc
		Object.defineProperty(this, 'client', { value: client });
		this._assignAttributes(data);
		this.downloadUrl = data.links && data.links.download;
	}

	private _assignAttributes(data: LibraryData): void {
		if (data.attributes) {
			Object.assign(this, data.attributes);
		}
	}

	/**
	 * Download the compressed file containing the source code for this library version.
	 * @return {Promise} Resolves to the .tar.gz compressed source code
	 */
	download(): Promise<Buffer | ArrayBuffer> {
		if (!this.downloadUrl) {
			return Promise.reject(new Error('No download URL for this library'));
		}
		return this.client.downloadFile(this.downloadUrl);
	}

	/* TODO: add a versions() method to fetch an array of library objects */
}

export = Library;

