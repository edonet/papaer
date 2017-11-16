/**
 *****************************************
 * Created by lifx
 * Created on 2017-10-25 11:52:07
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const
    fs = require('fs'),
    { promisify } = require('util'),
    readFile = promisify(fs.readFile),
    appendFile = promisify(fs.appendFile);


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = async (dist, ...args) => {
    for(let dir of args) {
        await appendFile(dist, await readFile(dir));
    }
}
