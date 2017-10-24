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
import { absolute, imageLoader } from '../lib/utils';
import Scaler from './scaler';
import Toucher from './toucher';


/**
 *****************************************
 * 定义属性
 *****************************************
 */
const
    canvasStyle = {
        ...absolute(), overflow: 'hidden'
    };


/**
 *****************************************
 * 定义画布组件
 *****************************************
 */
export default class AppCanvas extends Component {

    /* 初始化对象 */
    constructor(props, ...args) {
        super(props, ...args);

        // 定义状态
        this.src = null;
        this.canvas = null;
        this.state = { status: 'loading', scale: 1 };
        this.scaler = new Scaler();
        this.toucher = new Toucher();
        this.loader = imageLoader(this.updateView.bind(this));

        // 添加手势事件
        this.toucher.on('moving', this.onMoveViewHandler.bind(this));
        this.toucher.on('scaling', this.onScaleViewHandler.bind(this));
        this.toucher.on('touchEnd', this.onTouchEndHandler.bind(this));
    }

    /* 渲染组件 */
    render() {
        let { className, style, src = '' } = this.props,
            { status } = this.state,
            props = {
                className,
                style: { ...canvasStyle, style }
            };


        // 更新图片
        this.src !== src && this.loader(this.src = src);

        // 返回元素
        return (
            <div { ...props }>
                { src && status === 'loaded' ? this.renderCanvas() : null }
            </div>
        );
    }

    /* 渲染画布 */
    renderCanvas() {
        let props = {
                ...this.canvas,
                ...this.toucher.createListener(),
                ref: el => this.scaler.update(el, this.canvas),
                style: {
                    display: 'block',
                    position: 'absolute',
                    background: `url(${ this.src }) no-repeat center`,
                    WebkitTransformOrigin: '0 0',
                    transformOrigin: '0 0'
                }
            };

        return (
            <svg { ...props } />
        );
    }

    /* 渲染图形 */
    renderGraph() {
        let { positionList = [], problemList = [] } = this.props,
            graph = [];

        // 生成部位图形
        positionList.forEach(({ id, coordinate }) => graph.push({
            id,
            type: 'path',
            d: (
                Array.isArray(coordinate) ?
                'M' + coordinate.map(i => i.join(',')).join('L') + 'Z' :
                `M${coordinate.x}, ${coordinate.y}h${coordinate.width}v${coordinate.height}h${-coordinate.width}Z`
            )
        }));
    }

    /* 更新视图 */
    updateView(err, image) {

        // 加载出错
        if (err) {
            return this.setState({ status: 'error' });
        }

        // 获取图片属性
        this.canvas = {
            width: image.width,
            height: image.height
        };

        // 更新状态
        this.setState({ status: 'loaded' });
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
        this.stopPropagation = null;
        this.scaler.reset();
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
}
