/**
 * Used only to auto generate html files for DEVELOPMENT MODE
 */

// IMPORTS
var Clean = require('clean-webpack-plugin');
const Webpack = require('webpack');

const helpers = require("./webpack.helpers");


const entryObject = helpers.createEntryObject(helpers.entries);
const HTMLWebpackPluginObjects = helpers.createHTMLWebpackPluginObjects(helpers.entries);

module.exports = {
    entry: entryObject,
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        path: helpers.PUBLIC_PATH,
        filename: 'js/[name].js'
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
    plugins: HTMLWebpackPluginObjects.concat([
        // Additional plugins here
        new Clean(['public']),
    ])
};