import path from "path";

import { outDir, srcDir, libName } from "./constant";

export default {
    entry: path.resolve(__dirname, "../src/index.ts"),
    devtool: "source-map",
    output: {
        path: path.resolve(__dirname, outDir),
        filename: libName + ".js",
        library: libName,
        libraryTarget: "umd",
        umdNamedDefine: true,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader",
                exclude: /(node_modules|bower_components)/
            }
        ]
    },
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    }
};
