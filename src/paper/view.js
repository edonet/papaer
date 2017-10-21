/**
 *****************************************
 * Created by lifx
 * Created on 2017-10-21 12:00:54
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
 * 定义视图组件
 *****************************************
 */
export default class View extends Component {

    /* 渲染视图 */
    render() {
        let { style, children } = this.props,
            props = {
                style: {
                    ...style,
                    background: '#' + Math.random().toString(16).slice(2, 8)
                },
                ref: el => this.target = el
            };

        // 渲染元素
        return (
            <div { ...props }>{ children }
                <br />
                The react-dom package provides DOM-specific methods that can be used at the top level of your app and as an escape hatch to get outside of the React model if you need to. Most of your components should not need to use this module.
            </div>
        );
    }
}
