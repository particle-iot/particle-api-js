/* In order for the tests to run in the browser the fixture files must
 * be loaded statically into an object. The 'brfs' module will replace
 * the fs.readFileSync('static_path') call by the contents of the file.
 */
const fs = require('fs'); // import syntax doesn't work inside karma


const fixtures = {
	'libraries.json': fs.readFileSync(__dirname + '/libraries.json'),
	'library.json': fs.readFileSync(__dirname + '/library.json'),
	'libraryVersions.json': fs.readFileSync(__dirname + '/libraryVersions.json'),
	'test-library-publish-0.0.1.tar.gz': fs.readFileSync(__dirname + '/test-library-publish-0.0.1.tar.gz'),
	'test-library-publish-0.0.2.tar.gz': fs.readFileSync(__dirname + '/test-library-publish-0.0.2.tar.gz'),
};

function read(filename) {
	if (!fixtures[filename]) {
		throw new Error(`Fixture ${filename} doesn't exit`);
	}
	return fixtures[filename];
}

function readJSON(filename) {
	return JSON.parse(read(filename));
}

export {
	read, readJSON
};
