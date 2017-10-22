/**
 *****************************************
 * Created by lifx
 * Created on 2017-10-20 15:28:56
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 定义移动手势
 *****************************************
 */
export default class Move {

    /* 初始化手势 */
    constructor(updater) {
        this.disabled = false;
        this.status = 'pending';
        this.updater = updater;
        this.touch = {};
    }

    /* 手势开始 */
    onTouchStart(e) {

        // 开始手势
        this.status === 'pending' && this.invoke(e, data => {
            this.status = 'touching';
            this.touch.sx = data.pageX;
            this.touch.sy = data.pageY;
            this.touch.st = + new Date();
            this.emit('moveReady');
        });
    }

    /* 手势移动中 */
    onTouchMove(e) {

        // 开始手势
        if (this.status === 'pending') {
            return this.onTouchStart(e);
        }

        // 移动手势
        this.status === 'touching' && this.invoke(e, data => {
            let { x, y, t } = this.touch;

            // 获取属性
            this.touch.x = data.pageX;
            this.touch.y = data.pageY;
            this.touch.t = + new Date();

            // 开始移动
            if (!this.touch.direction) {
                this.touch.dx = this.touch.x - this.touch.sx;
                this.touch.dy = this.touch.y - this.touch.sy;
                this.touch.dt = this.touch.t - this.touch.st;
                this.touch.direction = Math.abs(this.touch.dx) > Math.abs(this.touch.dy) ? 'x' : 'y';
                return this.emit('moveStart');
            }

            // 移动中
            this.touch.dx = x ? this.touch.x - x : 0;
            this.touch.dy = y ? this.touch.y - y : 0;
            this.touch.dt = t ? this.touch.t - t : 0;
            this.emit('moving');
        });
    }

    /* 手势结束 */
    onTouchEnd(e) {

        // 结束手势
        this.status === 'touching' && this.invoke(e, () => {
            if (!this.touch.t) {
                this.touch.t = + new Date();
                this.touch.dt = this.touch.t - this.touch.st;
            }
            this.emit('moveEnd');
        });

        // 恢复数据
        this.touch = {};
        this.status = 'pending';
    }

    /* 装备就绪 */
    invoke(e, handler) {
        this.disabled || handler(e.touches[0]);
    }

    /* 更新回调 */
    emit(name) {
        this.updater && this.updater(name, this.touch);
    }
}
