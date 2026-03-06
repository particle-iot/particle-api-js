import libraries from './libraries.json';
import library from './library.json';
import libraryVersions from './libraryVersions.json';

const fixtures: Record<string, object> = {
	'libraries.json': libraries,
	'library.json': library,
	'libraryVersions.json': libraryVersions
};

function read(filename: string): object {
	if (!fixtures[filename]) {
		throw new Error(`Fixture ${filename} doesn't exist`);
	}
	return fixtures[filename];
}

export { read };
