import { particle } from 'eslint-config-particle';

export default particle({
	rootDir: import.meta.dirname,
	testGlobals: 'mocha',
	globalIgnores: ['dist']
});
