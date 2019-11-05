const webpack = require('webpack');
const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const package = require('./package.json');
const dateFormat = require('dateformat');

const now = new Date();

module.exports = {
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.BannerPlugin({
            banner: `@license ${package.name} v${package.version}, ${dateFormat(now, "isoDateTime")}
(c) ${dateFormat(now, "yyyy")} ${package.author.name} <${package.author.email}>
License: ${package.license}`
        })
    ].concat([
        new MiniCssExtractPlugin({
            filename: 'angular-iscroll.css',
        }),
        new CompressionPlugin({
            test: /\.js(\?.*)?$/i,
        })
    ]),
    name: 'library',
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    //mode: 'development',
    entry: './src/lib/angular-iscroll.js',
    output: {
        path: path.resolve(__dirname, 'dist/lib'),
        filename: 'angular-iscroll.js',
        library: 'angularIscroll',
        libraryTarget: 'umd'
    },
    optimization: {
        usedExports: true,
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }]
            },
            {
                test: /\.(sa|sc|c)ss$/,
                /* Exclude fonts while working with images, e.g. .svg can be both image or font. */
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'scss/'
                        }
                    },
                ]
            }
        ],
    },
    externals: {
        lodash: {
            commonjs: 'lodash',
            commonjs2:
                'lodash',
            amd:
                'lodash',
            root:
                '_',
        },
        angular: {
            commonjs: 'angular',
            commonjs2:
                'angular',
            amd:
                'angular',
            root:
                'angular',
        },
    },
};
