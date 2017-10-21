/**
 *****************************************
 * Created by lifx
 * Created on 2017-10-21 11:06:09
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import React from 'react';
import ReactDOM from 'react-dom';
import Paper from './paper';


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
export const render = (el, data) => {

    // 获取元素
    if (typeof el === 'string') {
        el = document.getElementById(el);
    }

    // 判断节点类型
    if (!el || el.nodeType !== 1) {
        throw new Error('获取节点失败，无法加载画布');
    }

    // 渲染元素
    ReactDOM.render(<Paper { ...data } />, el);
};


/**
 *****************************************
 * 卸载组件
 *****************************************
 */
export const unmount = el => ReactDOM.unmountComponentAtNode(
    typeof el === 'string' ? document.getElementById(el) : el
);
