/**
 *****************************************
 * Created by lifx
 * Created on 2017-10-22 11:06:52
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import React, { Component } from 'react';


/**
 *****************************************
 * 定义画布组件
 *****************************************
 */
export default class AppCanvas extends Component {

    /* 初始化对象 */
    constructor(props, ...args) {
        super(props, ...args);
    }

    /* 渲染组件 */
    render() {
        return (
            <div>
                The react-dom package provides DOM-specific methods that can be used at the top level of your app and as an escape hatch to get outside of the React model if you need to. Most of your components should not need to use this module.
            </div>
        );
    }
}
