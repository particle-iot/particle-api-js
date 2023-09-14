const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env) => {
	return {
		mode: env.mode || 'development',
		target: 'web',
		entry: './src/Particle.js',
		devtool: 'source-map',
		externals: [nodeExternals()],
		output: {
			filename: `particle${env.mode === 'production' ? '.min' : ''}.js`,
			path: path.resolve(__dirname, 'dist'),
			clean: true,
			globalObject: 'this',
			library: {
				name: 'particle-api-js',
				type: 'umd',
				umdNamedDefine: true,
				export: 'default'
			}
		},
		optimization: {
			minimize: true,
			minimizer: [new TerserPlugin({
				extractComments: false,
				terserOptions: {
					format: {
						comments: false
					}
				}
			})]
		},
		resolve: {
			fallback: {
				buffer: require.resolve('buffer')
			}
		},
		plugins: [
			new webpack.ProvidePlugin({
				Buffer: ['buffer', 'Buffer'],
			})
		]
	};
};
