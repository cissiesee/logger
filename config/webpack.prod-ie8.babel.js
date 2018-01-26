import path from "path";
import merge from "webpack-merge";
import UglifyJsPlugin from "webpack/lib/optimize/UglifyJsPlugin";
import prodConfig from "./webpack.prod.babel";

import { outDir, libName } from "./constant";

module.exports = merge(prodConfig, {
    entry: ["es5-shim", "es5-shim/es5-sham", path.resolve(__dirname, "../src/index.ts")],
    output: {
        path: path.resolve(__dirname, outDir),
        filename: libName + ".ie8.min.js",
        library: libName,
        libraryTarget: "umd",
        umdNamedDefine: true
    },
    plugins: [
        new UglifyJsPlugin({
            compress: {
                properties: false
            }
        })
    ]
});