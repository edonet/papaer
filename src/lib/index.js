/**
 *****************************************
 * Created by lifx
 * Created on 2017-11-08 15:32:41
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 定义工具函数
 *****************************************
 */
export const keys = Object.keys;
export const assign = Object.assign;
export const uuid = (id => () => id ++)( + new Date());


/**
 *****************************************
 * 加载图片
 *****************************************
 */
export const imageLoader = callback => url => {
    var img = new Image();

    img.onload = () => callback(null, img);
    img.onerror = () => callback(new Error('加载图片失败，请稍后再试。'));
    img.src = url;
};
