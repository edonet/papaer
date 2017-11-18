/**
 *****************************************
 * Created by lifx
 * Created on 2017-11-16 10:08:14
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import React, { Component, createElement } from 'react';
import { assign, imageLoader } from '../lib';
import { updater, animate, easing } from '../lib/animater';
import AppToucher from '../app-toucher';
import format from './format';
import scaler from './scaler';


/**
 *****************************************
 * 定义属性
 *****************************************
 */
const
    boxStyle = {
        position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, overflow: 'hidden'
    },
    svgStyle = {
        'x': '0',
        'y': '0',
        'width': '100%',
        'height': '100%',
        'preserveAspectRatio': 'xMidYMin slice',
        'style': {
            'display': 'block',
            'position': 'relative',
            'left': '-0.5px',
            'overflow': 'hidden'
        }
    };


/**
 *****************************************
 * 定义组件
 *****************************************
 */
export default class AppCanvas extends Component {

    /* 初始化组件 */
    constructor(props, ...args) {
        super(props, ...args);

        // 定义属性
        this.$$target = null;
        this.$$canvas = null;
        this.$$scaler = null;
        this.$$animater = null;
        this.$$updater = updater();
        this.$$ease = easing('ease-out');
        this.$$size = { width: 0, height: 0 };
        this.$$view = { width: 0, height: 0 };
        this.$$paper = { width: 0, height: 0, cx: 0, cy: 0 };
        this.$$state = { x: 0, y: 0, scale: 1, ...props.scale };
        this.$$snap = false;

        // 定义事件监听器
        this.$$events = {
            onMount: el => this.$$target = el,
            onTap: this.handleTap.bind(this),
            onTouchStart: this.handleTouchStart.bind(this),
            onTouchEnd: this.handleTouchEnd.bind(this),
            onMove: this.handleMove.bind(this),
            onMoveEnd: this.handleMoveEnd.bind(this),
            onScale: this.handleScale.bind(this)
        };

        // 定义图片加载器
        this.$$loader = imageLoader((err, image) => {

            // 加载图片失败
            if (err) {
                return console.error(err);
            }

            // 更新视图大小
            this.$$view.width = this.$$target.clientWidth;
            this.$$view.height = this.$$target.clientHeight;
            this.$$view.ratio = this.$$view.height / this.$$view.height;

            // 更新画布尺寸
            this.$$size.width = image.width;
            this.$$size.height = image.height;
            this.$$size.ratio = this.$$size.height / this.$$size.width;

            // 更新缩放状态
            this.$$size.scale = Math.min(
                this.$$view.width / this.$$size.width,
                this.$$view.height / this.$$size.height
            );
            this.$$size.maxScale = Math.max(1 / this.$$size.scale, 3);

            // 生成更新器
            this.$$scaler = scaler(this.$$view, this.$$size);

            // 更新户型图
            this.$$target.style.background = `url(${image.src}) no-repeat`;
            this.reset(1, this.update());

            // 更新状态
            this.setState({ url: image.src });
        });

        // 定义状态
        this.state = { url: '' };

        // 加载图片
        this.$$loader(this.props.path);
    }

    /* 接收属性 */
    componentWillReceiveProps(props) {
        props.path !== this.props.path && this.$$loader(props.path);
    }

    /* 渲染组件 */
    render() {

        return (
            <AppToucher style={ boxStyle } { ...this.$$events }>
                <svg ref={el => this.$$canvas = el} { ...svgStyle }>
                    { this.state.url && this.renderCanvas() }
                </svg>
            </AppToucher>
        );
    }

    /* 渲染图形 */



    /* 渲染画布 */
    renderCanvas() {
        let { mark, positionList, problemList } = this.props,
            data = {
                mark, positionList, problemList, size: this.$$size, url: this.state.url
            };

        // 加载对象
        return format(data).map(
            ({ name, props }) => createElement(name, props)
        );
    }

    /* 更新视图 */
    update(state = this.$$state) {

        if (state.x === null) {
            debugger;
        }

        // 判断是否已经加载
        if (this.$$canvas && this.$$scaler) {
            let {
                    backgroundPosition,
                    backgroundSize,
                    viewBox,
                    fontSize,
                    canvas
                } = this.$$scaler(state);


            // 更新图形
            this.$$paper = { ...this.$$paper, ...canvas };
            this.$$canvas.setAttribute('viewBox', viewBox);

            // 更新状态
            if (state !== this.$$state) {
                this.$$state = { ...this.$$state, ...state };
            }

            // 执行回调
            this.props.onScale && this.props.onScale(this.$$state);

            // 更新样式
            assign(this.$$canvas.style, { fontSize });
            assign(this.$$target.style, { backgroundSize, backgroundPosition });
        }
    }

    /* 重置视图 */
    reset(duration = 300) {
        let { x, y, scale } = this.$$state,
            { cx, cy } = this.$$paper,
            newScale = Math.max(1, Math.min(scale, this.$$size.maxScale)),
            width = newScale * this.$$size.scale * this.$$size.width,
            height = width * this.$$size.ratio,
            ns = newScale / scale,
            ds = newScale - scale,
            dx, dy;


        // 获取【x】差值
        if (width < this.$$view.width) {
            dx = (this.$$view.width - width) / 2 - x;
        } else {
            dx = Math.min(0, Math.max(this.$$view.width - width, (x - cx) * ns + cx)) - x;
        }

        // 获取【y】差值
        dy = Math.min(0, Math.max(this.$$view.height - height, (y - cy) * ns + cy)) - y;

        // 执行动画
        if (dx || dy || ds) {
            this.$$animater && this.$$animater.stop();
            this.$$animater = animate(duration, progress => {
                progress = this.$$ease(progress);
                this.update({
                    x: x + dx * progress,
                    y: y + dy * progress,
                    scale: scale + ds * progress
                });
            });
        }
    }

    /* 监听点击事件 */
    handleTap({ event, touches: [touch] }) {
        if (this.props.onTap && touch) {
            let rect = this.$$target.getBoundingClientRect(),
                { x, y, scale } = this.$$state;

            // 获取位置
            scale *= this.$$size.scale;
            x = (touch.x - rect.left - x) / scale;
            y = (touch.y - rect.top - y) / scale;

            // 执行回调
            this.props.onTap({ event, touches: [{ x, y }] });
        }
    }

    /* 处理手势开始 */
    handleTouchStart() {
        this.$$animater && this.$$animater.stop();
    }

    /* 处理移动 */
    handleMove({ event, touches: [touch] }) {
        if (this.$$scaler) {
            let { width } = this.$$paper,
                x = touch.dx + this.$$state.x;

            // 阻止父级移动
            if (!this.$$snap && x < 0 && x > this.$$view.width - width) {
                event.stopPropagation();
            } else {
                this.$$snap = true;
                x = this.$$state.x;
            }

            // 更新状态
            this.$$state.x = x;
            this.$$state.y = this.$$state.y + touch.dy;

            // 更新画布
            this.$$updater(() => this.update());
        }
    }

    /* 处理移动结束 */
    handleMoveEnd({ touches: [touch] }) {
        if (touch && (touch.dx || touch.dy)) {
            let { dx, dy } = touch,
                k = .95;


            // 启动动画
            this.$$animater && this.$$animater.stop();
            this.$$animater = animate(1000, progress => {

                // 减速
                dx *= k;
                dy *= k;

                // 定义结束条件
                let stop = (
                        progress >= 1 ||
                        (Math.abs(dx) < 1 && Math.abs(dy) < 1) ||
                        this.$$state.x > 0 ||
                        this.$$state.y > 0 ||
                        this.$$state.x < this.$$view.width - this.$$paper.width ||
                        this.$$state.y < this.$$view.height - this.$$paper.height
                    );


                // 结束动画
                if (stop) {
                    return this.reset() || false;
                }

                // 更新属性
                this.$$state.x += dx;
                this.$$state.y += dy;

                // 更新画布
                this.update();
            });
        }
    }

    /* 处理缩放 */
    handleScale({ event, scaler }) {

        // 处理缩放
        if (this.$$scaler) {
            let { x, y, scale, cx, cy } = scaler(this.$$state);

            // 更新属性
            this.$$state = { x, y, scale };

            // 更新画布
            this.$$paper = { ...this.$$paper, cx, cy };
            this.$$updater(() => this.update());
        }

        // 阻止冒泡
        event.stopPropagation();
    }

    /* 处理手势结束 */
    handleTouchEnd() {
        this.reset();
        this.$$snap = false;
    }
}
