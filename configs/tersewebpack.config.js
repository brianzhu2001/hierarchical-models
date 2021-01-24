const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require("webpack");
const TerserPlugin = require('terser-webpack-plugin');

var common_config = {
    // mode: "development",
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader"
                //,
                // options: { presets: ["@babel/env"] }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            }

        ]
    },
    resolve: { extensions: ["*", ".js", ".jsx"] },
    devServer: {
        contentBase: path.join(__dirname, "../dist/"),
        port: 3000,
        publicPath: "http://localhost:3000/",
        hot: true
        // hotOnly: true
    },
    node: {
        fs: "empty"
    },
    optimization: {
        minimizer: [new TerserPlugin()],
    }
}


var Assignment1Config = Object.assign({}, common_config,{
    entry: './src/assignment1.jsx',
    output: {
        filename: './assignment1.js',
        path: path.resolve(__dirname, '../dist/')
    },
    plugins: [

        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new HtmlWebpackPlugin({
            filename: './index.html',
            title: 'Assignment 1!',
            template: './src/assignment1.html'
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: './src/static',
                    to: './'
                },
            ],
        }),
    ]
});

var Assignment1CreativeConfig = Object.assign({}, common_config,{
    entry: './src/a1create.jsx',
    output: {
        filename: './a1create.js',
        path: path.resolve(__dirname, '../dist')
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new HtmlWebpackPlugin({
            filename: './create.html',
            title: 'Assignment 1 Creative Component!',
            template: './src/a1create.html'
        }),
    ]
});


module.exports = [
    Assignment1Config, Assignment1CreativeConfig
];
