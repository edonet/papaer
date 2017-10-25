/**
 *****************************************
 * Created by lifx
 * Created on 2017-10-24 14:40:59
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import React, { Component } from 'react';
import { absolute } from '../lib/utils';
import Scaler from './scaler';
import Toucher from './toucher';


/**
 *****************************************
 * 定义缩放组件
 *****************************************
 */
export default class AppScaler extends Component {

    /* 初始化缩放组件 */
    constructor(props, ...args) {
        super(props, ...args);

        // 初始化属性
        this.scaler = new Scaler();
        this.toucher = new Toucher();

        // 添加手势事件
        this.toucher.on('moving', this.onMoveViewHandler.bind(this));
        this.toucher.on('scaling', this.onScaleViewHandler.bind(this));
        this.toucher.on('touchEnd', this.onTouchEndHandler.bind(this));
        this.toucher.on('tap', this.onTapHandler.bind(this));

        // 添加更新回调
        this.scaler.on('update', matrix => {
            this.props.onScale && this.props.onScale(matrix.scale);
        });
    }

    /* 渲染组件 */
    render() {
        let { width, height } = this.props,
            props = {
                ...this.toucher.createListener(),
                ref: el => this.scaler.update(el, { width, height }),
                style: {
                    width,
                    height,
                    display: 'none',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    WebkitTransformOrigin: '0 0',
                    transformOrigin: '0 0'
                }
            };

        // 添加元素
        return (
            <div style={ absolute() }>
                <div { ...props }>{ this.props.children }</div>
            </div>
        );
    }

    /* 移动视图 */
    onMoveViewHandler([touch], event) {

        // 判断是否超出边界
        if (this.stopPropagation === null) {
            this.stopPropagation = this.scaler.overflow(touch.dx);
        }

        // 移动视图
        if (this.stopPropagation === false) {
            touch && this.scaler.translateBy(touch.dx, touch.dy);
            return event.stopPropagation();
        }
    }

    /* 移动视图结束 */
    onTouchEndHandler() {
        let center = { cx: 0, cy: 0 },
            touches = this.toucher.touches;

        // 获取变换中心点
        if (touches.length > 1) {
            let [p1, p2] = touches;

            center = {
                cx: (p1.x + p2.x) / 2,
                cy: (p1.y + p2.y) / 2
            };
        }

        // 更新视图
        this.stopPropagation = null;
        this.scaler.reset(center);
    }

    /* 缩放视图 */
    onScaleViewHandler(touches, event) {
        let touch = this.toucher.getScale();

        // 判断是否能缩放
        if (touch && touch.scale) {
            this.scaler.translateBy(touch.dx, touch.dy, touch.scale);
            event.stopPropagation();
        }
    }

    /* 点击回调 */
    onTapHandler(touches, event) {
        if (this.props.onTap && touches.length) {
            let { sx, sy } = touches[0];
            this.props.onTap([this.scaler.coordinate(sx, sy)], event);
        }
    }
}
