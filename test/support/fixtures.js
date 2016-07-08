import fs from 'fs';
import path from 'path';

const fixtureDir = "test/fixtures";

function readFixture(filename) {
	const lines = fs.readFileSync(path.join(fixtureDir, filename));
	return JSON.parse(lines);
}

export default readFixture;
