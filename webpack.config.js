/**
 *****************************************
 * Created by lifx
 * Created on 2017-10-19 10:25:41
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const
    path = require('path'),
    webpack = require('webpack'),
    dir = (...args) => path.resolve(__dirname, ...args),
    env = process.env.NODE_ENV;


/**
 *****************************************
 * 抛出配置
 *****************************************
 */
module.exports = {
    context: dir('./src'),
    entry: {
        paper: './index.js'
    },
    output: {
        path: dir('./dist'),
        filename: '[name].min.js',
        publicPath: './',
        library: 'paper',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                // include: /webpack-dev-server/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader'
            }
        ]
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
    },
    devtool: 'inline-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(env)
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_debugger: true,
                drop_console: true
            },
            sourceMap: env !== 'production'
        })
    ],
    stats: {
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }
};
