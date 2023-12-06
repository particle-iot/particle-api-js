// Karma configuration
// Generated on Wed Jul 20 2016 12:00:09 GMT-0400 (EDT)
const webpackConf = require('./webpack.config.js');
const webpack = require('webpack');

module.exports = function karmaCfg(config){
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['webpack', 'mocha', 'chai'],

        // list of files / patterns to load in the browser
        files: [
            'dist/particle.min.js',
            'test/*.spec.js',
            'test/*.integration.js'
        ],

        // list of files to exclude
        exclude: [
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'src/**/*.js': ['webpack'],
            'test/**/*.js': ['webpack']
        },

        // Transform test files to a single browser consumable file
        webpack: {
            mode: 'development',
            target: 'web',
            devtool: 'inline-source-map',
            output: webpackConf.output,
            externals: webpackConf.externals,
            resolve: webpackConf.resolve,
            plugins: [
                new webpack.ProvidePlugin({ Buffer: ['buffer', 'Buffer'] }),
                new webpack.EnvironmentPlugin({
                    SKIP_AGENT_TEST: process.env.SKIP_AGENT_TEST || false
                })
            ]
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Firefox'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    });
};
