/**
 *****************************************
 * Created by lifx
 * Created on 2017-10-21 11:13:37
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
import Event from '../lib/event';
import Scroller from '../lib/scroller';
import Move from '../touch/move';
import View from './view';


/**
 *****************************************
 * 定义属性
 *****************************************
 */
const
    viewStyle = absolute();


/**
 *****************************************
 * 抛出组件
 *****************************************
 */
export default class Paper extends Component {

    /* 初始化对象 */
    constructor(props, ...args) {
        super(props, ...args);

        // 初始化组件属性
        this.target = null;
        this.gesture =[];
        this.event = new Event();
        this.scroller = new Scroller();

        // 绑定事件回调
        this.handleMount = this.handleMount.bind(this);
        this.handleEvent = this.handleEvent.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);

        // 定义手势监听
        this.touchHandler = {
            onTouchStart: this.handleEvent('onTouchStart'),
            onTouchMove: this.handleEvent('onTouchMove'),
            onTouchEnd: this.handleEvent('onTouchEnd'),
            onTouchCancel: this.handleEvent('onTouchEnd')
        };

        // 加载滚动手势
        this.gesture.push(new Move(this.handleTouchMove));
    }

    /* 渲染组件 */
    render() {
        let { style, className, views = [] } = this.props, props;

        // 定义元素属性
        props = {
            className,
            style: { ...viewStyle, ...style },
            ref: this.handleMount,
            ...this.touchHandler
        };

        // 返回元素
        return (
            <div { ...props }>{ this.renderView(views) }</div>
        );
    }

    /* 更新组件 */
    componentDidUpdate() {
        this.scroller.updateView();
    }

    /* 渲染视图 */
    renderView(views) {
        return views.map((view, idx) => (
            <View key={ idx } style={ viewStyle }>{idx}</View>
        ));
    }

    /* 监听元素加载 */
    handleMount(el) {
        el ? this.initialize(el) : this.destroy();
    }

    /* 初始化组件 */
    initialize(el) {

        // 获取基础属性
        this.target = el;
        this.width = el.clientWidth;
        this.height = el.clientHeight;

        // 更新滚动视图
        this.scroller.updateView({
            target: el,
            views: el.childNodes,
            overlap: this.props.overlap || 0
        });
    }

    /* 监听事件函数 */
    handleEvent(name) {
        return event => this.gesture.forEach(item => name in item && item[name](event));
    }

    /* 监听滚动手势 */
    handleTouchMove(name, touch) {

        // 停止动画
        this.animater && this.animater.stop();

        // 判断是否滚动
        if (!this.width || touch.direction !== 'x') {
            return false;
        }

        // 滚动元素
        if (name === 'moving') {
            return this.scroller.scrollBy(- 100 * touch.dx / this.width);
        }

        // 滚动结束
        if (name === 'moveEnd') {
            let position = this.scroller.getPosition(),
                curr = Math.round(position / 100),
                over = (
                    touch.dx &&
                    Math.abs(touch.x - touch.sx) < .5 * this.width &&
                    Math.abs(touch.dx / touch.dt) > .3
                );


            // 判断是否跨视图
            if (over) {
                curr += touch.dx > 0 ? -1 : 1;
            }

            // 滚动到最近视图
            this.scroller.animateTo(curr * 100, 250, 'ease-out');
        }
    }

    /* 销毁组件 */
    destroy() {
        this.target = null;
        this.width = null;
        this.height = null;
        this.scroller.destroy();
    }
}
