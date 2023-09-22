
const fixtures = {
	'libraries.json': require('./libraries.json'),
	'library.json': require('./library.json'),
	'libraryVersions.json': require('./libraryVersions.json')
};

function read(filename) {
	if (!fixtures[filename]) {
		throw new Error(`Fixture ${filename} doesn't exit`);
	}
	return fixtures[filename];
}

module.exports = { read };
