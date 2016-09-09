// IMPORTS
const Clean = require('clean-webpack-plugin');
const Webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = require("./server/config.json");
const helpers = require("./webpack.helpers");
const TARGET = process.env.npm_lifecycle_event;
process.env.BABEL_ENV = TARGET;
console.log("[Webpack Config] target: " + TARGET);


const entryObject = helpers.createEntryObject(helpers.entries);
const HTMLWebpackPluginObjects = helpers.createHTMLWebpackPluginObjects(helpers.entries);

const commonConfig = {
    entry: entryObject,
    output: {
        path: helpers.PUBLIC_PATH,
        filename: 'js/[name].js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: ['react-hot', 'babel'],
                include: helpers.CLIENT_PATH
            }
        ]
    },
    preLoaders: [
        {
            test: /\.jsx?$/,
            loaders: ['eslint', 'jscs'],
            include: helpers.CLIENT_PATH
        }
    ],
    plugins: HTMLWebpackPluginObjects.concat([
        // Additional plugins here
    ])
};

var webpackConfig = commonConfig;

/**
 * Development
 */
if (TARGET === 'start' || TARGET ==='start:dev') {
    const devEntries = helpers.createDevEntryObjects(helpers.entries);
    webpackConfig = merge(commonConfig, {
        entry: devEntries,
        output: {
            path: helpers.ROOT_PATH,
            filename: 'js/[name].js',
            publicPath: 'http://localhost:' + config.port + '/'
        },
        devtool: 'eval-source-map',
        devServer: {
            historyApiFallback: true,
            hot: true,
            inline: true,
            progress: true
        },
        module: {
            loaders: [
                {
                    test: /\.css$/,
                    loaders: ['style', 'css'],
                    include: helpers.CLIENT_PATH
                },
                {
                    test: /\.scss$/,
                    loaders: ['style', 'css', 'sass'],
                    include: helpers.CLIENT_PATH
                }
            ]
        },
        plugins: [
            new Webpack.HotModuleReplacementPlugin(),
            new Webpack.NoErrorsPlugin()
        ]
    });

}

/**
 * Test
 */
if (TARGET === 'test' || TARGET === 'tdd') {
    webpackConfig = merge(common, {
        entry: {},
        output: {},
        devtool: 'inline-source-map',
        resolve: {
            alias: {
                'app': helpers.CLIENT_PATH
            }
        },
        module: {
            preLoaders: [
                {
                    test: /\.jsx?$/,
                    loaders: ['isparta-instrumenter'],
                    include: helpers.CLIENT_PATH
                }
            ],
            loaders: [
                {
                    test: /\.jsx?$/,
                    loaders: ['babel'],
                    include: helpers.TEST_PATH
                }
            ]
        }
    });
}

/**
 * PRODUCTION BUILD
 */
if (TARGET === 'build' || TARGET === 'stats') {
    webpackConfig = merge(commonConfig, {
        entry: helpers.createProdEntryObjects(helpers.entries),
        output: {
            path: helpers.PUBLIC_PATH,
            filename: 'js/[name].[chunkhash].js?'
        },
        devtool: 'source-map',
        module: {
            loaders: [
                {
                    test: /\.scss$/,
                    loader: ExtractTextPlugin.extract('style', 'css!sass'),
                    include: helpers.CLIENT_PATH
                },
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract('style', 'css'),
                    include: helpers.CLIENT_PATH
                },
                {
                    test: /\.json$/,
                    loader: 'json-loader'
                }
            ]
        },
        plugins: [
            new Clean(['public']),
            new ExtractTextPlugin('styles/[name].[chunkhash].css'),
            new Webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                minChunks: Infinity,
                filename: 'js/[name].[chunkhash].js'
            }),
            new Webpack.DefinePlugin({
                'process.env': {
                    // This affects react lib size
                    'NODE_ENV': JSON.stringify('production')
                }
            }),
            new Webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            })
        ]
    })
}

module.exports = webpackConfig;