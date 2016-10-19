const fs = require('fs'); // import syntax doesn't work inside karma

const fixtureNames = [
	'libraries.json',
	'library.json',
	'libraryVersions.json',
	'test-library-publish-0.0.1.tar.gz',
	'test-library-publish-0.0.2.tar.gz'
];

function readFixtures(fixtureNames) {
	const fixtures = {};
	for (let idx in fixtureNames) {
		const name = fixtureNames[idx];
		fixtures[name] = fs.readFileSync(`${__dirname}/${name}`);
	}
	return fixtures;
}

const fixtures = readFixtures(fixtureNames);

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
