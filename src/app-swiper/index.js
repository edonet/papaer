/**
 *****************************************
 * Created by lifx
 * Created on 2017-11-17 11:56:21
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import React, { Component, Children } from 'react';
import { assign } from '../lib';
import { transform } from '../lib/element';
import { updater, animate, easing } from '../lib/animater';
import AppToucher from '../app-toucher';


/**
 *****************************************
 * 定义组件样式
 *****************************************
 */
const
    swiperStyle = {
        position: 'absolute', top: 0, bottom: 0, left: 0, right: 0
    };


/**
 *****************************************
 * 定义切换组件
 *****************************************
 */
export default class AppSwiper extends Component {

    /* 初始化组件 */
    constructor(props, ...args) {
        super(props, ...args);

        // 定义刷新
        this.$$x = null;
        this.$$curr = null;
        this.$$view = null;
        this.$$updater = updater();
        this.$$animater = null;

        // 定义触控事件
        this.$$event = {
            onMount: el => this.$$target = el,
            onTouchStart: this.handleMoveStart.bind(this),
            onMove: this.handleMove.bind(this),
            onMoveEnd: this.handleMoveEnd.bind(this)
        };
    }

    /* 渲染组件 */
    render() {
        return (
            <AppToucher style={ swiperStyle } { ...this.$$event }>
                { this.renderView(this.props.children) }
            </AppToucher>
        );
    }

    /* 监听组件挂载完成 */
    componentDidMount() {
        this.componentDidUpdate();
    }

    /* 监听组件更新完成 */
    componentDidUpdate() {
        this.$$target && this.updateView(this.props);
    }

    /* 渲染切换视图 */
    renderView(views) {

        // 更新视图数据
        this.$$count = Children.count(views);

        // 生成视图
        return Children.map(views, (view, index) => {
            let key = (view.props && view.props.id) || index,
                translate = `translate(${ index * 100 }%, 0)`,
                style = {
                    ...swiperStyle,
                    overflow: 'hidden',
                    transform: translate,
                    WebkitTransform: translate
                };

            // 返回视图
            return (
                <div key={ key } style={ style }>{ view }</div>
            );
        });
    }

    /* 更新视图 */
    updateView({ curr = 0, children, onChange }) {

        // 更新视图尺寸
        this.$$view = {
            count: Children.count(children),
            width: this.$$target.clientWidth,
            height: this.$$target.clientHeight
        };

        // 更新当前视图
        curr = Math.max(0, Math.min(this.$$view.count - 1, curr || 0));

        // 更新位置
        if (curr !== this.$$curr) {
            this.$$updater(() => this.translateTo(- curr * 100));
            onChange && onChange(this.$$curr = curr);
        }
    }

    /* 移动到指定位置 */
    translateTo(x = 0) {
        if (x !== this.$$x && this.$$target) {
            this.$$x = x;
            assign(this.$$target.style, transform({ x: x + '%' }));
        }
    }

    /* 处理开始移动 */
    handleMoveStart() {

        // 结束动画
        this.$$animater && this.$$animater.stop();
    }

    /* 处理移动 */
    handleMove({ touches: [touch] }) {

        // 更新位置
        this.$$updater(() => this.translateTo(this.$$x + 100 * touch.dx / this.$$view.width));
    }

    /* 处理移动结束 */
    handleMoveEnd({ touches: [touch] }) {
        let speed = touch.dt ? Math.abs(touch.dx / touch.dt) : 0,
            distanse = speed > .3 ? (touch.dx > 1 ? 50 : - 50) : 0,
            x = this.$$x + distanse,
            curr = Math.max(0, Math.min(Math.round(- x / 100), this.$$view.count - 1)),
            ease = easing('ease-out');


        // 获取动画属性
        x = this.$$x;
        distanse = - curr * 100 - this.$$x;

        // 执行动画
        if (distanse) {
            this.$$animater && this.$$animater.stop();
            this.$$animater = animate(300, progress => {

                // 更新位置
                this.translateTo(x + distanse * ease(progress));

                // 完成动画
                if (progress >= 1 && curr !== this.$$curr) {
                    this.$$curr = curr;
                    this.props.onChange && this.props.onChange(curr);
                }
            });
        }
    }
}
