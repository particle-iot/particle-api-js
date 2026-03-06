import { particle } from 'eslint-config-particle';

export default [
	...particle({
		rootDir: import.meta.dirname,
		testGlobals: 'mocha',
		globalIgnores: ['dist', 'coverage', 'lib'],
		typescript: { tsconfig: './tsconfig.json' }
	}),
	{
		files: ['**/*.js'],
		languageOptions: {
			sourceType: 'commonjs'
		},
		rules: {
			'strict': 'off',
			'@typescript-eslint/no-require-imports': 'off'
		}
	},
	{
		files: ['src/**/*.ts'],
		rules: {
			'@typescript-eslint/no-require-imports': 'off',
			'@typescript-eslint/no-namespace': 'off'
		}
	},
	{
		files: ['test/**/*.ts'],
		rules: {
			'@typescript-eslint/no-unused-expressions': 'off'
		}
	}
];
