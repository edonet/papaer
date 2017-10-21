/**
 *****************************************
 * Created by lifx
 * Created on 2017-10-19 11:09:35
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 抛出配置
 *****************************************
 */
module.exports = {
    hot: true,
    port: 10098,
    https: false,
    disableHostCheck: true,
    publicPath: '/',
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-id, Content-Length, X-Requested-With',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    },
    watchContentBase: true,
    watchOptions: {
        ignored: /node_modules/
    },
    proxy: {},
    compress: true,
    inline: true
};
