/**
 *****************************************
 * Created by lifx
 * Created on 2017-10-24 11:51:49
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
 * 定义图形组件
 *****************************************
 */
export default class AppFigure extends Component {

    /* 初始化组件 */
    constructor(props, ...args) {
        super(props, ...args);

        // 定义渲染器
        this.$$render = React.createElement;
    }

    /* 渲染组件 */
    render() {
        let { graph = [], ...props } = this.props,
            children = graph.map(
                ({ type, ...props }, key) => type && this.$$render(type, { key, ...props })
            );

        return (
            <svg { ...props }>{ children }</svg>
        );
    }
}
