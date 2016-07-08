export default class Library {
	constructor(client, data) {
		this.client = client;
		this._assignAttributes(data);
	}

	_assignAttributes(data) {
		Object.assign(this, data.attributes);
	}
}
