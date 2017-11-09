/**
 *****************************************
 * Created by lifx
 * Created on 2017-10-24 14:20:04
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import React, { Component } from 'react';
import { imageLoader } from '../lib/utils';
import AppScaler from '../app-scaler';
import AppFigure from '../app-figure';


/**
 *****************************************
 * 定义画布组件
 *****************************************
 */
export default class AppPaper extends Component {

    /* 初始化画布组件 */
    constructor(props, ...args) {
        super(props, ...args);

        // 定义状态
        this.url = null;
        this.state = { status: 'loading', matrix: { scale: 3, minScale: .5 } };
        // this.updateScale = matrix => this.setState({ matrix });
        this.$$loader = imageLoader(this.loadImage.bind(this));
    }

    /* 渲染画布组件 */
    render() {

        // 加载图片
        if (this.props.path && this.props.path !== this.url) {
            return this.$$loader(this.url = this.props.path), null;
        }

        // 图片加载完成时才显示
        if (this.state.status === 'ready') {
            return this.renderFigure();
        }

        return null;
    }

    /* 渲染图形 */
    renderFigure() {
        let { id, positionList = [], problemList = [], mark = false } = this.props,
            { scale, minScale } = this.state.matrix,
            props = {
                id,
                style: {
                    background: `url(${ this.url }) no-repeat center`,
                    overflow: 'hidden'
                }
            },
            areaStyle = {
                fill: 'white', fillOpacity: 0, stroke: 'red',
                strokeWidth: Math.max(1, .8 / (scale * minScale))
            },
            pointScale = (1 - (Math.min(3, Math.max(1, scale)) - 1) * .3) / minScale,
            pointStyle = {
                r: 6 * pointScale, stroke: 'white',
                strokeWidth: 8 * pointScale, strokeOpacity: 0
            },
            graph = [];

            console.log(pointScale, scale, minScale);

        // 启用蒙层
        if (mark) {
            let { width, height } = this.size,
                d = `M0, 0v${height}h${width}v${- height}Z` + positionList.map(({ coordinate }) => {

                    // 校验坐标是否为对象
                    if (!coordinate || typeof coordinate !== 'object') {
                        return '';
                    }

                    // 添加多边形
                    if (Array.isArray(coordinate)) {
                        return 'M' + coordinate.map(p => p.join(', ')).join('L') + 'Z';
                    } else if ('x' in coordinate) {
                        let { x, y, width, height } = coordinate;
                        return `M${x}, ${y}h${width}v${height}h${- width}Z`;
                    }

                    return '';
                }).join('');

            // 添加蒙层
            graph.push({
                type: 'path', d, fill: 'black', fillOpacity: .3, fillRule: 'evenodd', stroke: 'none'
            });
        }


        // 添加部位区域
        positionList.forEach(({ id, coordinate }) => {

            // 校验坐标是否为对象
            if (!coordinate || typeof coordinate !== 'object') {
                return '';
            }

            // 添加多边形
            if (Array.isArray(coordinate)) {
                return graph.push({
                    id, type: 'path', ...areaStyle,
                    d: 'M' + coordinate.map(p => p.join(', ')).join('L') + 'Z'
                });
            } else if ('x' in coordinate) {
                return graph.push({
                    id, type: 'rect', ...areaStyle, ...coordinate
                });
            }
        });

        // 添加问题点
        problemList.forEach(({ id, color = 'red', coordinate: { x, y } }) => graph.push({
            id, type: 'circle', fill: color, ...pointStyle, cx: x, cy: y
        }));

        // 返回元素
        return (
            <AppScaler
                { ...this.size }
                onScale={ this.updateScale }
                id={ this.props.id }
                store={ this.props.store }
                onTap={ this.props.onTap }>
                <AppFigure { ...this.size } { ...props } graph={ graph } />
            </AppScaler>
        );
    }

    /* 加载画布 */
    loadImage(err, image) {

        // 加载出错
        if (err) {
            return this.setState({ status: 'error' });
        }

        // 获取图片属性
        this.size = {
            width: image.width,
            height: image.height
        };

        // 更新状态
        this.setState({ status: 'ready' });
    }
}
