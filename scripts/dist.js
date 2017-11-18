/**
 *****************************************
 * Created by lifx
 * Created on 2017-10-02 18:03:24
 *****************************************
 */
'use strict';


/*
 ****************************************
 * 设置环境变量
 ****************************************
 */
process.env.NODE_ENV = 'production';
process.env.BABEL_ENV = 'production';


/*
 ****************************************
 * 加载依赖
 ****************************************
 */
const
    cp = require('child_process'),
    path = require('path'),
    webpack = require('webpack'),
    config = require('../webpack.config'),
    appendFile = require('./appendFile'),
    dir = argv => path.resolve(__dirname, argv);


/*
 ****************************************
 * 定义启动函数
 ****************************************
 */
async function start() {

    // 打印输出信息
    console.log('-'.repeat(80));
    console.log(`remove dir "${config.output.path}"`);
    console.log('-'.repeat(80));

    // 移除目标路径
    cp.exec(`rm -rf ${config.output.path}/*`);


    // 启动【App】打包
    await new Promise((resolve, reject) => {
        webpack(config, (err, compiler) => {

            // 返回错误信息
            if (err) {
                return reject(err);
            }

            // 打印编译信息
            process.stdout.write(compiler.toString(config.stats) + '\n\n');

            // 返回编译结果
            resolve(compiler);

            // 合并文件
            appendFile(
                dir('../dist/paper.min.js'),
                dir('../public/polyfill.js'),
                dir('../public/react.min.js'),
                dir('../public/react-dom.min.js'),
                dir('../dist/paper.js')
            );
        });
    });

    return true;
}


/*
 ****************************************
 * 启动项目
 ****************************************
 */
start().catch(err => console.error(err));

