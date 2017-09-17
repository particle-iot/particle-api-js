import NotImplementedError from '../errors/NotImplementedError';

/**
 * @interface
 */
export default class Base {
	/**
	 * @param {Object} [filter] Predicate used when fetching
	 * @return {Promise}
	 */
	fetch(filter={}) {
		throw new NotImplementedError();
	}

	/**
	 * @property {boolean} hasNextPage Indicates if collection has a next page
	 */
	get hasNextPage() {
		throw new NotImplementedError();
	}

	/**
	 * @return {Promise}
	 */
	nextPage() {
		throw new NotImplementedError();
	}

	/**
	 * @property {boolean} hasPrevPage Indicates if collection has a previous page
	 */
	get hasPrevPage() {
		throw new NotImplementedError();
	}

	/**
	 * @return {Promise}
	 */
	prevPage() {
		throw new NotImplementedError();
	}

	/**
	 * @property {number} page Indicates current page number
	 */
	get page() {
		throw new NotImplementedError();
	}
}
