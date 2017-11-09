/**
 *****************************************
 * Created by lifx
 * Created on 2017-11-08 14:48:29
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 定义元素容器
 *****************************************
 */
class Element {

    // 初始化对象
    constructor(el) {

        // 定义模型
        this.$$model = [];

        // 添加元素
        this.push(el);
    }

    // 执行方法
    map(handler) {
        return this.$$model.map(handler);
    }

    // 过滤
    filter(handler) {
        this.$$model = this.$$model.filter(handler);
        return this;
    }

    // 添加元素
    push(el) {

        // 获取元素
        if (typeof el === 'string') {
            el = document.getElementById(el);
        }

        // 添加对象
        el && el.nodeType === 1 && this.$$model.push(el);
    }

    // 获取子元素
    children(filter) {
        let el = new Element();

        // 获取子元素
        this.map(target => [].forEach.call(target.childNodes, node => {
            if (node.nodeType === 1 && (!filter || filter(node))) {
                el.push(node);
            }
        }));

        // 替换模型
        return el;
    }
}


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
export default el => new Element(el);


/**
 *****************************************
 * 创建元素
 *****************************************
 */
export function createElement({ name = 'div', props = null, children }) {
    let el = name;

    // 获取元素
    if (el === 'div') {
        el = document.createElement(el);
    } else if (typeof el === 'string') {
        el = document.createElementNS('http://www.w3.org/2000/svg', el);
        el.style.webkitTapHighlightColor = 'rgba(0,0,0,0)';
    }

    // 添加属性
    props && Object.keys(props).forEach(key => {

        // 合并样式
        if (key === 'style') {
            return Object.assign(el.style, props.style);
        }

        let name = key.split(':'),
            value = props[key];

        if (name[0] === 'xlink') {
            el.setAttributeNS('http://www.w3.org/1999/xlink', name[1], value);
        } else if (value || value === 0) {
            el.setAttribute(key, value);
        }
    });

    // 添加子节点
    children && children.forEach(data => el.appendChild(createElement(data)));

    // 返回元素
    return el;
}


/**
 *****************************************
 * 添加像素单位
 *****************************************
 */
export const px = val => (
    typeof val === 'string' ? val : val + 'px'
);


/**
 *****************************************
 * 浏览器前缀
 *****************************************
 */
export const vendor = (function () {
    let vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
        style = document.createElement('div').style;

    for (let str of vendors) {
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
 * 常用补全样式
 *****************************************
 */
const
    prefixTransform = prefixStyle('transform'),
    translateZ = hasPerspective ? ' translateZ(0)' : '';


/**
 *****************************************
 * 变换属性
 *****************************************
 */
export const transform = ({ x = 0, y = 0, scale = 1 }) => ({
    [prefixTransform]: `translate(${ px(x) }, ${ px(y) })${ translateZ } scale(${ scale })`
});

