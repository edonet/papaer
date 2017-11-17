/**
 *****************************************
 * Created by lifx
 * Created on 2017-11-17 09:04:54
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { point, offset, scale } from './utils';


/**
 *****************************************
 * 定义触控生成函数
 *****************************************
 */
const
    toucher = {
        scale,
        tap: (t1, t2) => [{ ...t2[0], ...point(t1[0]) }],
        one: (t1, t2) => [
            { ...t2[0], ...offset(point(t1[0]), t2[0]) }
        ],
        two: (t1, t2) => [
            { ...t2[0], ...offset(point(t1[0]), t2[0]) },
            { ...t2[1], ...offset(point(t1[1]), t2[1]) }
        ]
    };


/**
 *****************************************
 * 定义触控组件
 *****************************************
 */
export default class AppToucher extends Component {

    /* 初始化组件 */
    constructor(props, ...args) {
        super(props, ...args);

        // 定义属性
        this.$$status = 'pending';
        this.$$touches = [];
        this.$$updater = null;
        this.$$tapable = true;

        // 设置更新器
        this.componentWillReceiveProps(props);

        // 定义手势监听
        this.$$events = {
            onTouchStart: this.handleTouchStart.bind(this),
            onTouchMove: this.handleTouchMove.bind(this),
            onTouchEnd: this.handleTouchEnd.bind(this),
            onTouchCancel: this.handleTouchEnd.bind(this)
        };
    }

    /* 监听属性更新 */
    componentWillReceiveProps(props) {

        // 设置缩放更新器
        if (props.onScale) {
            return this.$$updater = this.scaleUpdater;
        }

        // 设置移动更新器
        if (props.onMove) {
            return this.$$updater = this.moveUpdater;
        }

        // 设置默认更新器
        this.$$updater = (event, touches) => (
            this.$$touches = toucher.tap(touches, this.$$touches)
        );
    }

    /* 判断是否更新 */
    shouldComponentUpdate(props) {
        return (
            props.className !== this.props.className ||
            props.style !== this.props.style ||
            props.children !== this.props.children
        );
    }

    /* 渲染组件 */
    render() {
        return (
            <div
                ref={ this.props.onMount }
                className={ this.props.className }
                style={ this.props.style }
                { ...this.$$events }>
                { this.props.children }
            </div>
        );
    }

    /* 缩放更新器 */
    scaleUpdater(event, touches) {

        // 处理缩放
        if (touches.length > 1) {

            // 更新触控点
            this.$$touches = toucher.two(touches, this.$$touches);

            // 执行回调
            return this.props.onScale({
                event,
                touches: this.$$touches,
                scaler: toucher.scale(...this.$$touches)
            });
        }

        // 处理移动
        if (this.props.onMove) {

            // 执行移动更新器
            return this.moveUpdater(event, touches);
        }

        // 更新触控点
        this.$$touches = toucher.tap(touches);
    }

    /* 移动更新器 */
    moveUpdater(event, touches) {

        // 更新触控点
        this.$$touches = toucher.one(touches, this.$$touches);

        // 执行回调
        this.props.onMove({
            event, touches: this.$$touches
        });
    }

    /* 监听手势开始 */
    handleTouchStart(e) {

        // 更新状态
        this.$$status = 'start';

        // 更新控件点位
        this.$$touches = [].map.call(e.touches || [], touch => {
            let point = {};

            // 设置位置
            point.sx = point.x = touch.pageX;
            point.sy = point.y = touch.pageY;
            point.st = point.t = + new Date();

            return point;
        });

        // 触发触控手势
        this.emit('onTouchStart', e);

        // 触发缩放手势
        if (this.$$touches.length > 1) {
            return this.emit('onScaleStart', e);
        }

        // 触发移动手势
        this.emit('onMoveStart', e);
    }

    /* 监听手势移动 */
    handleTouchMove(e) {

        // 初始化手势
        if (this.$$status === 'pending') {
            return this.handleTouchStart(e);
        }

        // 更新状态
        this.$$status = 'touching';

        // 更新手势触控
        this.$$updater(e, e.touches);

        // 触控中
        this.emit('onTouchMove', e);
    }

    /* 监听手势结束 */
    handleTouchEnd(e) {

        // 过滤多次执行
        if (this.$$status === 'pending') {
            return false;
        }

        // 更新状态
        this.$$status = 'pending';

        // 触控结束
        this.emit('onTouchEnd', e);

        // 移动手势
        if (this.$$touches.length === 1) {

            if (this.props.onTap) {
                let { st, sx, sy, x, y } = this.$$touches[0],
                    tap = (
                        this.$$tapable && new Date() - st < 1000 &&
                        Math.abs(x - sx) < 10 && Math.abs(y - sy) < 10
                    );

                // 执行点击事件
                if (tap) {
                    this.props.onTap({ event: e, touches: this.$$touches });
                }
            }

            // 结束移动手势
            this.$$tapable = true;
            return this.emit('onMoveEnd', e);
        }

        // 结束缩放手势
        this.$$tapable = false;
        this.emit('onScaleEnd', e);
    }

    /* 触发回调事件 */
    emit(name, event) {
        this.props[name] && this.props[name]({ event, touches: this.$$touches });
    }
}


/**
 *****************************************
 * 校验属性类型
 *****************************************
 */
AppToucher.propTypes = {
    onTap: PropTypes.func,
    onMoveStart: PropTypes.func,
    onMove: PropTypes.func,
    onMoveEnd: PropTypes.func,
    onScaleStart: PropTypes.func,
    onScale: PropTypes.func,
    onScaleEnd: PropTypes.func,
    onTouchStart: PropTypes.func,
    onTouchMove: PropTypes.func,
    onTouchEnd: PropTypes.func
};
