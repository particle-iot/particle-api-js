import VError from 'VError';

class CustomError extends VError {
	constructor() {
		super(...arguments);
		this.name = this.constructor.name;
	}

	static matches(error) {
		return error.name === this.name;
	}
}

export default CustomError;
