/**
 *****************************************
 * Created by lifx
 * Created on 2017-10-24 17:31:40
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 浏览器前缀
 *****************************************
 */
export const vendor = (function () {
    let vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
        style = document.createElement('div').style;

    for(let str of vendors) {
        if (str + 'ransform' in style) {
            return str.slice(0, -1);
        }
    }

    return '';
})();


/**
 *****************************************
 * 补全样式
 *****************************************
 */
export const prefixStyle = style => (
    vendor ? vendor + style.charAt(0).toUpperCase() + style.substr(1) : style
);


/**
 *****************************************
 * 是否支持透视
 *****************************************
 */
export const hasPerspective = (
    prefixStyle('perspective') in document.createElement('div').style
);


/**
 *****************************************
 * 变换属性
 *****************************************
 */
export const transform = (style => value => ({ [style]: value }))(prefixStyle('transform'));


/**
 *****************************************
 * 位移属性
 *****************************************
 */
export const translate = (x, y, z) => transform(
    `translate(${x || 0}, ${y || 0})` + (hasPerspective ? ` translateZ(${z || 0})` : '')
);


/**
 *****************************************
 * 偏移属性
 *****************************************
 */
export const absolute = (top = 0, right = top, bottom = top, left = right) => ({
    position: 'absolute', top, right, bottom, left
});
