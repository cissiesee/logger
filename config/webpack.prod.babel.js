import path from "path";
import merge from "webpack-merge";
import UglifyJsPlugin from "webpack/lib/optimize/UglifyJsPlugin";
import TypedocWebpackPlugin from "typedoc-webpack-plugin";

import devConfig from "./webpack.dev.babel";

import { srcDir, outDir, libName } from "./constant";

module.exports = merge(devConfig, {
    output: {
        path: path.resolve(__dirname, outDir),
        filename: libName + ".min.js",
        library: libName,
        libraryTarget: "umd",
        umdNamedDefine: true,
    },
    plugins: [
        new UglifyJsPlugin(),
        new TypedocWebpackPlugin({
            target: "es6"
        }, path.resolve(__dirname, srcDir))
    ]
});