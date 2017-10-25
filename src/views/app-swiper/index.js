/**
 *****************************************
 * Created by lifx
 * Created on 2017-10-24 19:21:32
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import React, { Component, Children } from 'react';
import { absolute } from '../lib/style';
import Swiper from './swiper';


/**
 *****************************************
 * 定义属性
 *****************************************
 */
const
    viewStyle = absolute();


/**
 *****************************************
 * 定义切换组件
 *****************************************
 */
export default class AppSwiper extends Component {

    constructor(props, ...args) {
        super(props, ...args);

        // 定义属性
        this.swiper = new Swiper();
    }

    /* 渲染组件 */
    render() {
        let { style, className, children } = this.props,
            props = {
                className,
                style: { ...viewStyle, ...style },
                ref: this.swiper.updater,
                ...this.swiper.listener
            };

        // 返回元素
        return (
            <div { ...props } >
                 { Children.map(children, view => <div style={ viewStyle }>{ view }</div>) }
            </div>
        );
    }

    /* 更新组件 */
    componentDidUpdate() {
        this.swiper.refresh();
    }
}
