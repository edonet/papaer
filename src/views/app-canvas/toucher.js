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
import Event from '../lib/event';


/**
 *****************************************
 * 定义手势处理
 *****************************************
 */
export default class Toucher extends Event {

    /* 初始化手势控件 */
    constructor() {
        super();

        // 生成监听器
        this.disabled = false;
        this.listener = name => event => this.disabled || this.emit(name, event);

        // 添加事件监听
        this.on('touchStart', e => this.onTouchStart(e, e.touches));
        this.on('touchMove', e => this.onTouchMove(e, e.touches));
        this.on('touchEnd', e => this.onTouchEnd(e, e.touches));
    }

    /* 触控开始事件 */
    onTouchStart(e, touches) {

        // 更新状态
        this.status = 'start';

        // 更新控件点位
        this.touches = [].map.call(touches, touch => {
            let point = {};

            // 设置位置
            point.sx = touch.pageX;
            point.sy = touch.pageY;
            point.st = + new Date();

            return point;
        });

        // 移动手势
        if (this.touches.length === 1) {
            return this.emit('moveStart', this.touches, e);
        }

        // 缩放手势
        this.emit('scaleStart', this.touches, e);
    }

    /* 触控中事件 */
    onTouchMove(e, touches) {

        // 初始化手势
        if (this.status === 'pending') {
            return this.onTouchStart(e, touches);
        }

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


        // 移动手势
        if (this.touches.length === 1) {
            return this.emit('moving', this.touches, e);
        }

        // 缩放手势
        this.emit('scaling', this.touches, e);
    }

    /* 触控结束事件 */
    onTouchEnd(e, touches) {

        // 更新状态
        this.status = 'pending';

        // 移动手势
        if (touches.length === 0) {
            let { st, direction } = this.touches[0],
                tap = !direction && new Date() - st < 500;

            // 移动手势
            return this.emit(tap ? 'tap' : 'moveEnd', this.touches, e);
        }

        // 缩放手势
        this.emit('scaleEnd', this.touches, e);
    }

    /* 获取缩放属性 */
    getScale() {

        // 支持缩放
        if (this.touches.length > 1) {
            let [p1, p2] = this.touches,
                r1 = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)),
                r2 = Math.sqrt(Math.pow(p1.ox - p2.ox, 2) + Math.pow(p1.oy - p2.oy, 2)),
                c1 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 },
                c2 = { x: (p1.ox + p2.ox) / 2, y: (p1.oy + p2.oy) / 2 },
                scale = r1 / r2;

            return {
                scale,
                dx: c1.x - scale * c2.x,
                dy: c1.y - scale * c2.y
            };
        }

        return null;
    }

    /* 创建生成器 */
    createListener() {
        return {
            onTouchStart: this.listener('touchStart'),
            onTouchMove: this.listener('touchMove'),
            onTouchEnd: this.listener('touchEnd'),
            onTouchCancel: this.listener('touchEnd')
        };
    }
}

