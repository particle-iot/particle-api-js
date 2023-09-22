const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env) => {
	return {
		mode: env.mode,
		target: 'web',
		entry: './src/Particle.js',
		devtool: 'source-map',
		output: {
			filename: `particle${env.mode === 'production' ? '.min' : ''}.js`,
			path: path.resolve(__dirname, 'dist'),
			clean: true,
			library: {
				name: 'Particle',
				type: 'var'
			}
		},
		optimization: {
			minimize: env.mode === 'production',
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
				buffer: require.resolve('buffer'),
				events: require.resolve('events'),
				url: require.resolve('url')
			}
		},
		plugins: [
			new webpack.ProvidePlugin({
				Buffer: ['buffer', 'Buffer'],
				process: 'process/browser',
			})
		]
	};
};
