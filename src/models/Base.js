export default class Base {
	constructor(client, data) {
		// Make client non-enumerable so it doesn't show up in Object.keys, JSON.stringify, etc
		Object.defineProperty(this, 'client', { value: client });
		this._assignAttributes(data);
	}

	_assignAttributes(data) {
		Object.assign(this, data);
	}
}
