export default class Library {
	constructor(client, data) {
		this.client = client;
		this._assignAttributes(data);
		this.downloadUrl = data.links && data.links.download;
	}

	_assignAttributes(data) {
		Object.assign(this, data.attributes);
	}

	download() {
		if (!this.downloadUrl) {
			return Promise.reject('No download URL for this library');
		}
		return this.client.downloadFile(this.downloadUrl);
	}
}
