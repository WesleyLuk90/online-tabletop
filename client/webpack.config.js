const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const PnpWebpackPlugin = require(`pnp-webpack-plugin`);

module.exports = {
    devtool: "inline-source-map",
    entry: "./src/index.tsx",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "build"),
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.tsx?$/,
                use: require.resolve("ts-loader"),
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Output Management",
            template: path.resolve(__dirname, "public/index.html"),
        }),
    ],
    resolve: {
        plugins: [PnpWebpackPlugin],
        extensions: [".ts", ".tsx"],
        alias: {
            engine: path.resolve(__dirname, "../engine/src"),
        },
    },
    resolveLoader: {
        plugins: [PnpWebpackPlugin.moduleLoader(module)],
    },
};
