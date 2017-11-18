/**
 *****************************************
 * Created by lifx
 * Created on 2017-11-18 19:37:18
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import React, { Component } from 'react';
import { updater } from '../lib/animater';


/**
 *****************************************
 * 定义图片组件
 *****************************************
 */
export default class AppImage extends Component {

    /* 初始化组件 */
    constructor(props, ...args) {
        super(props, ...args);

        // 定义属性
        this.$$target = null;
        this.$$updater = updater();

        // 创建画布
        this.$$canvas = document.createElement('canvas');
        this.$$canvas.style.display = 'none';
        this.$$size = 1000;
        this.$$scale = 1;

        // 加载临时画布
        document.body.appendChild(this.$$canvas);
        this.drawImage(props.image);
    }

    /* 接收新的属性 */
    componentWillReceiveProps(props) {
        if (props.image !== this.props.image) {
            this.drawImage(props.image);
        }
    }

    /* 渲染组件 */
    render() {
        let { image, width, height } = this.props;

        return image ? (
            <canvas ref={ el => this.$$target = el } width={ width } height={ height } />
        ) : null;
    }

    /* 监听组件挂载完成 */
    componentDidMount() {
        this.componentDidUpdate();
    }

    /* 监听组件更新完成 */
    componentDidUpdate() {
        if (this.$$target && this.props.image) {
            this.$$updater(() => {
                let { viewBox, width, height, image, scale = 1 } = this.props,
                    ctx = this.$$target.getContext('2d');

                // 清除画布
                ctx.clearRect(0, 0, width, height);

                // 绘制图片
                if (viewBox) {
                    ctx.drawImage(
                        image,
                        ...viewBox.map(v => v * scale),
                        0, 0, width, Math.min(height, width * viewBox[3] / viewBox[2])
                    );
                } else {
                    ctx.drawImage(image, 0, 0);
                }
            });
        }
    }

    /* 绘制临时图片 */
    drawImage(image) {
        if (image) {
            let ctx = this.$$canvas.getContext('2d'),
                w = image.width,
                h = image.height,
                vw = Math.min(w, 1200),
                vh = vw * h / w;

            // 绘制图片
            this.$$canvas.width = ctx.width = vw;
            this.$$canvas.height = ctx.height = vh;
            ctx.drawImage(image, 0, 0, w, h, 0, 0, vw, vh);

            // 设置比率
            this.$$scale = vw / w;
        }
    }
}
