/**
 *****************************************
 * Created by lifx
 * Created on 2017-10-19 15:27:39
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 定义全局属性
 *****************************************
 */
const
    xlink = 'http://www.w3.org/1999/xlink';


/**
 *****************************************
 * 定义工具方法
 *****************************************
 */
export const keys = Object.keys;
export const assign = Object.assign;
export const uuid = ((couter) => () => couter ++)(0);


/**
 *****************************************
 * 创建元素
 *****************************************
 */
export function createElement(el = 'div', props = null, ...children) {

    // 获取元素
    if (el === 'div') {
        el = document.createElement(el);
    } else if (typeof el === 'string') {
        el = document.createElementNS('http://www.w3.org/2000/svg', el);
        el.style.webkitTapHighlightColor = 'rgba(0,0,0,0)';
    }

    // 添加属性
    props && keys(props).forEach(key => {

        // 合并样式
        if (key === 'style') {
            return assign(el.style, props.style);
        }

        let name = key.split(':'),
            value = props[key];

        if (name[0] === 'xlink') {
            el.setAttributeNS(xlink, name[1], value);
        } else if (value || value === 0) {
            el.setAttribute(key, value);
        }
    });

    // 添加子节点
    children.forEach(item => el.appendChild(item));

    // 返回元素
    return el;
}


/**
 *****************************************
 * 创建样式
 *****************************************
 */
export function createStyle(el = 'div', style = null, ...children) {

    // 获取元素
    if (el === 'div') {
        el = document.createElement(el);
    } else if (typeof el === 'string') {
        el = document.createElementNS('http://www.w3.org/2000/svg', el);
        el.style.webkitTapHighlightColor = 'rgba(0,0,0,0)';
    }

    // 添加样式
    style && assign(el.style, style);

    // 添加子节点
    children.forEach(item => el.appendChild(item));

    // 返回元素
    return el;
}


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
 * 申请一下帧
 *****************************************
 */
export const rAF = (
    window.requestAnimationFrame ||
    window.windowebkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    (callback => setTimeout(callback, 1000 / 60))
);


/**
 *****************************************
 * 创建帧更新器
 *****************************************
 */
export const viewUpdater = updater => handler => {
    updater || rAF(() => updater = (updater && updater(), null));
    updater = handler;
};


/**
 *****************************************
 * 偏移属性
 *****************************************
 */
export const absolute = (top = 0, right = top, bottom = top, left = right) => ({
    position: 'absolute', top, right, bottom, left
});


/**
 *****************************************
 * 变换属性
 *****************************************
 */
export const transform = (style => value => ({ [style]: value }))(prefixStyle('transform'));


/**
 *****************************************
 * 过滤属性
 *****************************************
 */
export const transition = (style => value => ({ [style]: value }))(prefixStyle('transition'));


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
 * 动画
 *****************************************
 */
export const animate = (duration, handler) => {
    let cancel = false,
        start = + new Date(),
        callback = () => {
            if (cancel) {
                return false;
            }

            let progress = Math.min(1, (new Date() - start) / duration);

            if (handler(progress) !== false) {
                progress < 1 && rAF(callback);
            }
        };


    // 执行动画帧
    duration > 0 && rAF(callback);

    // 返回取消函数
    return { stop: () => cancel = true };
};


/**
 *****************************************
 * 缓动函数
 *****************************************
 */
export const ease = name => {
    switch (name) {
        case 'linear':
            return function (x) {
                return x;
            };
        case 'ease-in-out':
            return function (x) {
                return x - Math.sin(2 * Math.PI * x) / (2 * Math.PI);
            };
        case 'ease-in':
            return function (x) {
                return Math.pow(x, 3);
            };
        case 'ease-out':
            return function (x) {
                return Math.pow(x - 1, 3) + 1;
            };
        case 'back-in':
            return function (x) {
                var s = 1.70158;return x * x * ((s + 1) * x - s);
            };
        case 'back-out':
            return function (x) {
                x -= 1;var s = 1.70158;return x * x * ((s + 1) * x + s) + 1;
            };
        case 'elastic':
            return function (x) {
                return x < 0.4 ? Math.pow(2.5 * x, 3) : Math.sin(5 * x * Math.PI) * Math.cos(0.5 * x * Math.PI) / 3 + 1;
            };
        case 'bounce':
            return function (x) {
                var s = 7.5625,
                    p = 2.75;

                if (x < 1 / p) {
                    return s * x * x;
                } else if (x < 2 / p) {
                    x -= 1.5 / p;
                    return s * x * x + 0.75;
                } else if (x < 2.5 / p) {
                    x -= 2.25 / p;
                    return s * x * x + 0.9375;
                } else {
                    x -= 2.625 / p;
                    return s * x * x + 0.984375;
                }
            };
        default:
            return function (x) {
                return x;
            };
    }
};



/**
 *****************************************
 * 遍历对象
 *****************************************
 */
export const map = (argv, handler) => {

    let arr = [],
        type = typeof argv;


    // 处理数字类型
    if (type === 'number' && argv > 0) {
        for(let i = 0; i < argv; i ++) {
            arr.push(handler(i, i));
        }
        return arr;
    }

    // 处理字符串
    if (type === 'string') {
        return [].map.call(argv, handler);
    }

    // 处理对象
    if (type === 'object') {

        // 处理对象接口
        if ('map' in argv) {
            return argv.map(handler);
        }

        // 处理无接口对象
        return keys(argv).map(key => handler(argv[key], key));
    }

    // 返回空数组
    return arr;
};
