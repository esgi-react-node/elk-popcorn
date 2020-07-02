"use strict";

// Node.js standard helper for resolving urls
const {resolve} = require("path");

// Plugin for dynamically generating HTML file from templates
const HtmlWebpackPlugin = require("html-webpack-plugin");

// Webpack configuration
module.exports = {
    // Enable optimization of the code on production environments
    mode: process.env.NODE_ENV || "development",

    // Entrypoint to use for generating the optimized bundle
    entry: resolve("src", "index.js"),

    output: {
        // Folder in which to generate the production file
        path: resolve("public"),

        // Filename for the generated bundle
        filename: "index.js"
    },

    module: {
        rules: [
            // Babel configuration for Webpack
            { test: /\.js$/, loader: "babel-loader" }
        ]
    },

    devServer: {
        // Webpack development server exposed host
        host: "0.0.0.0",
        // Webpack development server exposed port
        port: 8080,
        // Webpack development server exposed socket address
        sockHost: "0.0.0.0",
        // Webpack development server exposed socket port
        sockPort: 8080,
        // Webpack development server content base for serving the development server
        contentBase: resolve("public")
    },

    plugins: [
        new HtmlWebpackPlugin({
            // Template to use for generating the optimized index file
            template: resolve("src", "index.html"),

            // Inject the bundle script's path as a script tag in the body of the template
            inject: "body"
        })
    ]
};
