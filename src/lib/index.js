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


/**
 *****************************************
 * 缩放图片
 *****************************************
 */
let imageCache = {};
export const imageResizer = (width = 1024, height = 0) => image => {

    // 判断是否需要缩放
    if (image.width < width) {
        return image.src;
    }

    // 从缓存中获取
    if (image.src in imageCache) {
        return imageCache[image.src];
    }

    let canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        w = image.width,
        h = image.height,
        src;

    // 设置属性
    canvas.style.display = 'none';
    height = height || width * h / w;
    canvas.width = ctx.width = width;
    canvas.height = ctx.height = height;

    // 绘制图片
    document.body.appendChild(canvas);
    ctx.drawImage(image, 0, 0, w, h, 0, 0, width, height);

    // 生成图片地址
    src = canvas.toDataURL();
    document.body.removeChild(canvas);
    return src;
};
