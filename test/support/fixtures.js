import fs from 'fs';
import path from 'path';

const fixtureDir = "../fixtures";

function fixturePath(filename) {
	return path.join(__dirname, fixtureDir, filename);
}

function read(filename) {
	return fs.readFileSync(fixturePath(filename));
}

function readJSON(filename) {
	return JSON.parse(read(filename));
}

export {
	readJSON,
	read
};
