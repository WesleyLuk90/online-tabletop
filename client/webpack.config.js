const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const PnpWebpackPlugin = require(`pnp-webpack-plugin`);
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const isDevelopment = process.env.NODE_ENV !== "production";

module.exports = {
    mode: isDevelopment ? "development" : "production",
    devtool: "inline-source-map",
    entry: "./src/index.tsx",
    devServer: {
        contentBase: path.join(__dirname, "build"),
        compress: true,
        port: 3000,
        hot: true,
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
                use: [
                    {
                        loader: require.resolve("babel-loader"),
                        options: {
                            plugins: [
                                isDevelopment &&
                                    require.resolve("react-refresh/babel"),
                            ].filter(Boolean),
                        },
                    },
                    { loader: require.resolve("ts-loader") },
                ],
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
        isDevelopment && new ReactRefreshWebpackPlugin(),
    ].filter(Boolean),
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
