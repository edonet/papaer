/**
 *****************************************
 * Created by lifx
 * Created on 2017-10-23 11:42:45
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import { viewUpdater, assign, transform, hasPerspective, animate, ease } from '../lib/utils';
import Event from '../lib/event';


/**
 *****************************************
 * 定义缩放控件
 *****************************************
 */
export default class Scaler extends Event {

    // 初始化控件
    constructor(matrix) {
        super();

        // 初始化属性
        this.target = null;
        this.view = {};
        this.size = {};
        this.matrix = { x: 0, y: 0, scale: 1, ...matrix };
        this.animater = null;
        this.$$updater = viewUpdater();

        // 绑定回调函数
        this.updateView = this.updateView.bind(this);
    }

    /* 更新元素 */
    update(target, { width, height }) {

        // 更新元素
        this.target = target;

        // 更新属性
        if (target && target.nodeType === 1) {
            let view = target.parentNode || {};

            // 更新尺寸
            this.size.width = width || target.clientWidth;
            this.size.height = height || target.clientHeight;
            this.view.width = view.clientWidth || this.size.width;
            this.view.height = view.clientHeight || this.size.height;

            // 更新缩放边界
            this.matrix.minScale = this.view.width / this.size.width;
            this.matrix.maxScale = Math.max(this.size.width / this.view.width, 3);
        }

        // 更新视图
        this.$$updater(this.updateView);
    }

    /* 更新元素样式 */
    updateView({ x, y, scale } = this.matrix) {
        if (this.target) {

            // 更新样式
            assign(this.target.style, {
                display: 'block',
                ...transform(
                    `translate(${x}px, ${y}px)${hasPerspective ? ' translateZ(0)' : ''} scale(${scale * this.matrix.minScale})`
                )
            });

            // 执行更新回调
            this.emit('update', this.matrix);
        }
    }

    /* 位置到指定位置 */
    translateTo(x, y, scale = this.matrix.scale) {
        if (x !== this.matrix.x || y !== this.matrix.y || scale !== this.matrix.scale) {
            this.matrix.x = x;
            this.matrix.y = y;
            this.matrix.scale = scale;
            this.$$updater(this.updateView);
        }
    }

    /* 位移指定距离 */
    translateBy(dx, dy, scale = 1) {
        this.translateTo(this.matrix.x * scale + dx, this.matrix.y * scale + dy, this.matrix.scale * scale);
    }

    /* 获取超出的边界 */
    overflow(dx) {
        let { x, scale } = this.matrix,
            minX = Math.min(0, this.view.width - scale * this.view.width),
            newX = x + dx;

        // 返回是否溢出
        return newX > 0 || newX < minX;
    }

    /* 超出边界恢复 */
    reset({ cx = 0, cy = 0 } = {}, duration = 250, easeType = 'ease-out') {
        let { x, y, scale, minScale, maxScale } = this.matrix,
            newScale = Math.max(1, Math.min(maxScale, scale)),
            width = newScale * this.view.width,
            height = newScale * minScale * this.size.height,
            dx = Math.min(0, Math.max(this.view.width - width, (x - cx) * newScale / scale + cx)) - x,
            dy = Math.min(0, Math.max(this.view.height - height, (y - cy) * newScale / scale + cy)) - y,
            ds = newScale - scale,
            easeFun = ease(easeType);


        // 判断是否需要恢复
        if (dx || dy || ds) {
            this.animater = animate(duration, progress => {
                progress = easeFun(progress);
                this.matrix.x = x + dx * progress;
                this.matrix.y = y + dy * progress;
                this.matrix.scale = scale + ds * progress;
                this.updateView();
            });
        }
    }

    /* 获取位置 */
    coordinate(x, y) {
        if (this.target) {
            let rect = this.target.parentNode.getBoundingClientRect(),
                matrix = this.matrix,
                scale = matrix.scale * matrix.minScale;

            // 获取位置
            x = (x - rect.left - matrix.x) / scale;
            y = (y - rect.top - matrix.y) / scale;
        }

        return { x, y };
    }

    /* 停止动画 */
    stopAnimation() {
        this.animater && this.animater.stop();
    }
}

