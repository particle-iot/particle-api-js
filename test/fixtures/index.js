const fs = require('fs'); // import syntax doesn't work inside karma

const fixtures = {
	'libraries.json': fs.readFileSync(__dirname + '/libraries.json'),
	'library.json': fs.readFileSync(__dirname + '/library.json'),
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
