module.exports = {
	extends: ['eslint-config-particle'],
	parserOptions: {
		ecmaVersion: 8,
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
		'no-control-regex': 'off',
		camelcase: ["error", {
			properties: 'never',
			allow: ['redirect_uri']
		}]
	}
};
