module.exports = {
	extends: ['eslint-config-particle'],
	parserOptions: {
		sourceType: 'module'
	},
	env: {
		browser: true,
		commonjs: true,
		es6: true,
		node: true,
		mocha: true,
		worker: true,
		serviceworker: true
	},
	rules: {
		'no-prototype-builtins': 'off',
		'no-redeclare': 'off',
		camelcase: ['error', {
			properties: 'never',
			allow: ['redirect_uri']
		}]
	}
};
