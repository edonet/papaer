/**
 *****************************************
 * Created by lifx
 * Created on 2017-10-23 14:00:49
 *****************************************
 */
'use strict';

/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import { EventEmitter } from './event';


/**
 *****************************************
 * 定义手势处理
 *****************************************
 */
export default class Toucher extends EventEmitter {

    /* 初始化手势控件 */
    constructor() {
        super();

        // 生成监听器
        this.disabled = false;
        this.listener = name => event => this.disabled || this.emit(name, event);

        // 生成事件回调
        this.handler = {
            touchStart: this.listener('event:touchStart'),
            touchMove: this.listener('event:touchMove'),
            touchEnd: this.listener('event:touchEnd')
        };

        // 添加事件监听
        this.on('event:touchStart', e => this.onTouchStart(e, e.touches));
        this.on('event:touchMove', e => this.onTouchMove(e, e.touches));
        this.on('event:touchEnd', e => this.onTouchEnd(e, e.touches));
    }

    /* 触控开始事件 */
    onTouchStart(e, touches) {

        // 阻止默认事件（修复【android】下【touchmove】只触发一次）
        // e.preventDefault();

        // 更新状态
        this.status = 'start';

        // 更新控件点位
        this.touches = [].map.call(touches, touch => {
            let point = {};

            // 设置位置
            point.sx = point.x = touch.pageX;
            point.sy = point.y = touch.pageY;
            point.st = point.t = + new Date();

            return point;
        });

        // 触控手势
        this.emit('touchStart', e, this.touches);

        // 移动手势
        if (this.touches.length === 1) {
            return this.emit('moveStart', e, this.touches);
        }

        // 缩放手势
        this.emit('scaleStart', e, this.touches);
    }

    /* 触控中事件 */
    onTouchMove(e, touches) {

        // 初始化手势
        if (this.status === 'pending') {
            return this.onTouchStart(e, touches);
        }

        // 阻止默认事件（修复【android】下【touchend】不触发）
        // e.preventDefault();

        // 更新状态
        this.status = 'touching';

        // 更新控件点位
        this.touches = [].map.call(touches, (touch, idx) => {
            let point = this.touches[idx] || {},
                { x, y, t } = point;

            // 获取属性
            point.x = touch.pageX;
            point.y = touch.pageY;
            point.t = + new Date();
            point.ox = x || point.x;
            point.oy = y || point.y;
            point.ot = t || point.t;

            // 获取移动偏移
            if (!point.direction) {
                point.dx = point.x - point.sx;
                point.dy = point.y - point.sy;
                point.dt = point.t - point.st;
                point.direction = Math.abs(point.dx) > Math.abs(point.dy) ? 'x' : 'y';
            } else {
                point.dx = point.x - point.ox;
                point.dy = point.y - point.oy;
                point.dt = point.t - point.ot;
            }

            return point;
        });

        // 触控中
        this.emit('touchMove', e, this.touches);

        // 移动手势
        if (this.touches.length === 1) {
            return this.emit('moving', e, this.touches);
        }

        // 缩放手势
        this.emit('scaling', e, this.touches);
    }

    /* 触控结束事件 */
    onTouchEnd(e) {

        // 过滤多次执行
        if (this.status === 'pending') {
            return false;
        }

        // 更新状态
        this.status = 'pending';

        // 触控结束
        this.emit('touchEnd', e, this.touches);

        // 移动手势
        if (this.touches.length === 1) {
            let { st, x, y, sx, sy } = this.touches[0],
                tap = !this.disableTap && new Date() - st < 1000 && Math.abs(x - sx) < 10 && Math.abs(y - sy) < 10;

            // 移动手势
            this.disableTap = false;
            return this.emit(tap ? 'tap' : 'moveEnd', e, this.touches);
        }

        // 缩放手势
        this.emit('scaleEnd', e, this.touches);
        this.disableTap = true;
    }

    /* 绑定到元素 */
    mountTo(target) {
        target.addEventListener('touchstart', this.handler.touchStart, false);
        target.addEventListener('touchmove', this.handler.touchMove, false);
        target.addEventListener('touchend', this.handler.touchEnd, false);
        target.addEventListener('touchcancel', this.handler.touchEnd, false);
    }

    /* 取消事件 */
    unmountTo(target) {
        target.removeEventListener('touchstart', this.handler.touchStart, false);
        target.removeEventListener('touchmove', this.handler.touchMove, false);
        target.removeEventListener('touchend', this.handler.touchEnd, false);
        target.removeEventListener('touchcancel', this.handler.touchEnd, false);
    }

    /* 生成绑定函数 */
    eventHandler() {
        return {
            onTouchStart: this.handler.touchStart,
            onTouchMove: this.handler.touchMove,
            onTouchEnd: this.handler.touchEnd,
            onTouchCancel: this.handler.touchEnd
        };
    }
}

