import {CleanWebpackPlugin} from 'clean-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import dateFormat from 'dateformat';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import {fileURLToPath} from 'url';
import webpack from 'webpack';

import _package from './package.json' assert {type: 'json'};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const now = new Date(),
    timestamp = dateFormat(now, 'isoDateTime'),
    year = dateFormat(now, 'yyyy');

export default {
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.BannerPlugin({
            banner: `@license ${_package.name} v${_package.version}, ${timestamp}
(c) ${year} ${_package.author.name} <${_package.author.email}>
License: ${_package.license}`
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
