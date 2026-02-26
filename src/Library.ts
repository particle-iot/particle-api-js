import type { LibraryAttributes } from './types';

interface LibraryApiData {
	attributes: LibraryAttributes;
	links?: { download?: string };
}

interface LibraryClientInterface {
	downloadFile(uri: string): Promise<Buffer>;
}

class Library {
	client!: LibraryClientInterface;
	downloadUrl: string | undefined;
	name?: string;
	version?: string;
	author?: string;
	sentence?: string;
	paragraph?: string;
	url?: string;
	repository?: string;
	architectures?: string[];
	visibility?: string;
	mine?: boolean;

	constructor(client: LibraryClientInterface, data: LibraryApiData) {
		Object.defineProperty(this, 'client', { value: client });
		this._assignAttributes(data);
		this.downloadUrl = data.links && data.links.download;
	}

	_assignAttributes(data: LibraryApiData): void {
		Object.assign(this, data.attributes);
	}

	download(): Promise<Buffer> {
		if (!this.downloadUrl) {
			return Promise.reject(new Error('No download URL for this library'));
		}
		return this.client.downloadFile(this.downloadUrl);
	}
}

namespace Library {
	export type ApiData = LibraryApiData;
	export type ClientInterface = LibraryClientInterface;
}

export = Library;
