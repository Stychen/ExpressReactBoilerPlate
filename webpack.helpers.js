
const path = require('path');
const HtmlwebpackPlugin = require('html-webpack-plugin');

const config = require("./server/config.json");
const pkg = require('./package.json');

/**
 * Constants
 */

// Paths
const ROOT_PATH = path.resolve(__dirname);
const PUBLIC_PATH = path.resolve(ROOT_PATH, 'public');
const TEST_PATH = path.resolve(ROOT_PATH, 'test');
const CLIENT_PATH = path.resolve(ROOT_PATH, 'client');
const PAGES_PATH = path.resolve(CLIENT_PATH, 'pages');
exports.ROOT_PATH = ROOT_PATH;
exports.PUBLIC_PATH = PUBLIC_PATH;
exports.TEST_PATH = TEST_PATH;
exports.CLIENT_PATH = CLIENT_PATH;
exports.PAGES_PATH = PAGES_PATH;

// Pages paths
const HOME_PATH = path.resolve(PAGES_PATH, 'home');
const ABOUT_PATH = path.resolve(PAGES_PATH, 'about');
exports.HOME_PATH = HOME_PATH;
exports.ABOUT_PATH = ABOUT_PATH;

const entries = [
    {
        entryName: 'home',
        entryPath: HOME_PATH
    },
    {
        entryName: 'about',
        entryPath: ABOUT_PATH
    }
];
exports.entries = entries;

const webpackDevEntries = [
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client',
    'react-hot-loader'
];


/**
 * Helpers
 */

function createEntryObject(entries) {
    var entryObject = {};

    for (var i = 0; i < entries.length; i++) {
        const curObj = entries[i];
        entryObject[curObj.entryName] = curObj.entryPath;
    }

    return entryObject;
}
exports.createEntryObject = createEntryObject;

function createDevEntryObjects(entries) {
    var entryObject = {};

    for (var i = 0; i < entries.length; i++) {
        const curObj = entries[i];
        entryObject[curObj.entryName] = webpackDevEntries.concat([curObj.entryPath]);
    }

    return entryObject;
}
exports.createDevEntryObjects = createDevEntryObjects;

function createProdEntryObjects(entries) {
    var entryObject = createEntryObject(entries);
    entryObject["vendor"] = Object.keys(pkg.dependencies);
    return entryObject;
}
exports.createProdEntryObjects = createProdEntryObjects;


const contextScript = "<% if (this.context) { %>  const PAGE_CONTEXT = <%-JSON.stringify(context)%>; <% } %>";

function createHTMLWebpackPluginObjects(entries) {
    var htmlWebpackPlugins = [];

    for (var i = 0; i < entries.length; i++) {
        const curObj = entries[i];
        const htmlWebpackObject = new HtmlwebpackPlugin({
            title: config.appName,
            chunks: [curObj.entryName, 'vendor'],
            filename: 'html/' + curObj.entryName + '.ejs',
            inject: true,
            template: '!!ejs!client/template/index.ejs',

            // optional
            contextScript: contextScript // Will contain the page context variables from express server
        });
        htmlWebpackPlugins.push(htmlWebpackObject);
    }

    return htmlWebpackPlugins;
}
exports.createHTMLWebpackPluginObjects = createHTMLWebpackPluginObjects;