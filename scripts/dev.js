/**
 *****************************************
 * Created by lifx
 * Created on 2017-10-02 11:19:36
 *****************************************
 */
'use strict';


/*
 ****************************************
 * 设置环境变量
 ****************************************
 */
process.env.NODE_ENV = 'development';
process.env.BABEL_ENV = 'development';



/*
 ****************************************
 * 加载依赖
 ****************************************
 */
const
    webpack = require('webpack'),
    WebpackDevServer = require('webpack-dev-server'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    config = require('../webpack.config'),
    devServer = require('./server'),
    ip = require('./ip');


/*
 ****************************************
 * 定义启动函数
 ****************************************
 */
async function start() {

    let { https, host, port } = devServer,
        devUrl;


    // 获取服务器地址
    devUrl = `http${ https ? 's' : '' }://${ host || ip() }:${ port }`;
    config.output.publicPath = devUrl + '/';

    // 配置打包入口
    config.entry.paper = [
        'react-hot-loader/patch',
        'webpack-dev-server/client?' + devUrl,
        'webpack/hot/only-dev-server',
        './app.js'
    ];

    // 配置服务器输出信息
    devServer.stats = config.stats;

    // 添加热更新插件
    config.plugins = [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './index.html',
            minify: {
                html5: true,
                removeComments: true,
                collapseWhitespace: true
            }
        })
    ];


    // 启动开发服务器
    await new Promise((resolve, reject) => {

        let { publicPath, contentBase } = devServer,
            server = new WebpackDevServer(webpack(config), devServer);


        // 启动服务器监听
        server.listen(port, host, err => {

            // 输出错误信息
            if (err) {
                return reject(err);
            }

            // 打印服务器信息
            console.log(
                '-'.repeat(80),
                `\nProject is running at ${ devUrl }/`,
                `\nWebpack output is served from ${ publicPath }`,
                `\nContent for webpack is served from ${ contentBase }`,
                `\n${ '-'.repeat(80)}`
            );
        });
    });
}


/*
 ****************************************
 * 启动项目
 ****************************************
 */
start().catch(err => console.error(err));
