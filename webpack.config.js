"use strict";

const {resolve} = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    entry: resolve("src", "index.js"),

    output: {
        path: resolve("dist"),
        filename: "index.js"
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader"
            }
        ]
    },

    devServer: {
        host: "0.0.0.0",
        port: 8080,
        sockHost: "0.0.0.0",
        sockPort: 8080,
        contentBase: resolve("dist")
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: resolve("src", "index.html"),
            inject: "body"
        })
    ]
};
