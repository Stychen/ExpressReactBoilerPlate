import express from "express";
import httpProxy from "http-proxy";
import path from "path";

// Webpack Requirements
import webpack from "webpack";
import webpackConfig from "../webpack.config.js";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";

// Local
import config from "./config.json";
import routes from "./routes/routes";

// Servers
const proxy = httpProxy.createProxyServer();
const app = express();

// Setup Environment
const nodeEnv = process.env.NODE_ENV;
const isProduction = nodeEnv === 'production';
const port = isProduction ? process.env.PORT : config.port;
console.log("[Debug] Node Environment: " + nodeEnv);

// SETUP WEBPACK DEV SERVER in Development mode
if (nodeEnv === "development") {
    const compiler = webpack(webpackConfig);
    app.use(webpackDevMiddleware(compiler, {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath,
        stats: {
            colors: true
        }
    }));
    app.use(webpackHotMiddleware(compiler, {
        log: console.log
    }));
}

// Set App variables
app.set("port", port);

// Static Files
const publicPath = path.resolve(__dirname, "../public");
app.use(express.static(publicPath));

// View settings
const buildPath = path.join(__dirname, "../public", "html");
app.set("views", buildPath);
app.set("view engine", "ejs");

// Route settings
app.use(routes);


app.listen(app.get("port"), () => {
    console.log("[Debug] Server running on port " + port);
});
