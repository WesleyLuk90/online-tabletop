const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const PnpWebpackPlugin = require(`pnp-webpack-plugin`);

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    entry: "./src/index.tsx",
    devServer: {
        contentBase: path.join(__dirname, "build"),
        compress: true,
        port: 3000,
        proxy: {
            "/api": "http://localhost:3001",
        },
    },
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
                    loader: require.resolve("babel-loader"),
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
            title: "Online Tabletop",
            template: path.resolve(__dirname, "public/index.html"),
        }),
    ],
    resolve: {
        plugins: [PnpWebpackPlugin],
        extensions: [".ts", ".tsx", ".js"],
        alias: {
            engine: path.resolve(__dirname, "../engine/src"),
        },
    },
    resolveLoader: {
        plugins: [PnpWebpackPlugin.moduleLoader(module)],
    },
};
