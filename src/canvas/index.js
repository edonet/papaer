/**
 *****************************************
 * Created by lifx
 * Created on 2017-11-08 18:55:35
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import { uuid, imageLoader, assign } from '../lib';
import { EventEmitter } from '../lib/event';
import { createElement } from '../lib/element';
import { updater, animate, easing, momentum } from '../lib/animater';
import scaler from './scaler';


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
export default class Canvas extends EventEmitter {

    /* 初始化画布 */
    constructor({ id = uuid(), url, data, store }) {
        super();

        // 定义属性
        this.$$snap = false;
        this.$$scaler = null;
        this.$$updater = updater();
        this.$$animater = null;
        this.$$ease = easing('ease-out');
        this.$$container = document.createElement('div');

        // 设置状态
        this.view = { width: 0, height: 0 };
        this.size = { width: 0, height: 0, scale: 1 };
        this.state = { x: 0, y: 0, scale: 1, ...store.get(id) };
        this.canvas = { cx: 0, cy: 0 };

        // 监听更新状态
        this.on('update', state => {
            this.state = { ...this.state, ...state };
            store.set({ [id]: this.state });
        });

        // 初始化图形
        this.on('app:mount', ({ width = 0, height = 0 }) => {

            // 更新视图
            this.view = { width, height, ratio: height / width };

            // 加载图片
            url && width && height && imageLoader((err, image) => {

                // 加载图片失败
                if (err) {
                    return console.error(err);
                }

                // 更新画布尺寸
                this.size.width = image.width;
                this.size.height = image.height;
                this.size.ratio = this.size.height / this.size.width;

                // 更新缩放状态
                this.size.scale = Math.min(width / this.size.width, height / this.size.height);
                this.size.maxScale = Math.max(1 / this.size.scale, 3);

                // 更新容器样式
                assign(this.$$container.style, {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `url(${image.src}) no-repeat`
                });

                // 生成更新器
                this.$$scaler = scaler(this.view, this.size);

                // 更新图形内容
                this.$$canvas = createElement(data);
                this.reset(this.update());

                // 挂载图形内容
                this.$$container.appendChild(this.$$canvas);
            })(url);
        });

        // 监听手势开始
        this.on('app:touchStart', () => {
            this.$$animater && this.$$animater.stop();
        });

        // 监听缩放事件
        this.on('app:scaling', ({ touches }) => {
            if (this.$$scaler) {
                 let [p1, p2] = touches,
                    { x, y } = this.state,
                    r1 = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)),
                    r2 = Math.sqrt(Math.pow(p1.ox - p2.ox, 2) + Math.pow(p1.oy - p2.oy, 2)),
                    c1 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 },
                    c2 = { x: (p1.ox + p2.ox) / 2, y: (p1.oy + p2.oy) / 2 },
                    scale = r1 / r2;


                // 更新属性
                this.state = {
                    x: (x - c2.x) * scale + c1.x,
                    y: (y - c2.y) * scale + c1.y,
                    scale: scale * this.state.scale
                };

                // 更新画布
                this.canvas = { cx: c1.x, cy: c1.y };
                this.$$updater(() => this.update());
            }
        });

        // 监听移动事件
        this.on('app:moving', e => {
            if (this.$$scaler) {
                let [touch] = e.touches,
                    { width } = this.canvas,
                    x = touch.dx + this.state.x;

                // 阻止父级移动
                if (!this.$$snap && x < 0 && x > this.view.width - width) {
                    e.stopPropagation();
                } else {
                    this.$$snap = true;
                    x = this.state.x;
                }

                // 更新状态
                this.state.x = x;
                this.state.y = this.state.y + touch.dy;

                // 更新画布
                this.$$updater(() => this.update());
            }
        });

        // 监听移动结束事件
        this.on('app:moveEnd', ({ touches: [touch]}) => {
            if (touch && touch.dx && touch.dy) {
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
                            this.state.x > 0 ||
                            this.state.y > 0 ||
                            this.state.x < this.view.width - this.canvas.width ||
                            this.state.y < this.view.height - this.canvas.height
                        );


                    // 结束动画
                    if (stop) {
                        return this.reset() || false;
                    }

                    // 更新属性
                    this.state.x += dx;
                    this.state.y += dy;

                    // 更新画布
                    this.update();
                });
            }
        });

        // 监听点击事件
        this.on('app:tap', data => {
            console.log(data.sx);
            let rect = this.$$container.getBoundingClientRect(),
                { x, y, scale } = this.state;

            // 获取位置
            scale *= this.size.scale;
            data.sx = (data.sx - rect.left - x) / scale;
            data.sy = (data.sy - rect.top - y) / scale;
        });

        // 监听触控结束
        this.on('app:touchEnd', () => {
            this.reset();
            this.$$snap = false;
        });
    }

    /* 挂载画布 */
    mount(target) {
        target.appendChild(this.$$container);
    }

    /* 更新视图 */
    update(state = this.state) {

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
            this.canvas = { ...this.canvas, ...canvas };
            this.$$canvas.setAttribute('viewBox', viewBox);

            // 更新状态
            this.emit('update', state);

            // 更新样式
            assign(this.$$canvas.style, { fontSize });
            assign(this.$$container.style, { backgroundSize, backgroundPosition });
        }
    }

    /* 重置视图 */
    reset() {
        let { x, y, scale } = this.state,
            { cx, cy } = this.canvas,
            newScale = Math.max(1, Math.min(scale, this.size.maxScale)),
            width = newScale * this.size.scale * this.size.width,
            height = width * this.size.ratio,
            ns = newScale / scale,
            ds = newScale - scale,
            dx, dy;


        // 获取【x】差值
        if (width < this.view.width) {
            dx = (this.view.width - width) / 2 - x;
        } else {
            dx = Math.min(0, Math.max(this.view.width - width, (x - cx) * ns + cx)) - x;
        }

        // 获取【y】差值
        dy = Math.min(0, Math.max(this.view.height - height, (y - cy) * ns + cy)) - y;

        // 执行动画
        if (dx || dy || ds) {
            this.$$animater && this.$$animater.stop();
            this.$$animater = animate(300, progress => {
                progress = this.$$ease(progress);
                this.update({
                    x: x + dx * progress,
                    y: y + dy * progress,
                    scale: scale + ds * progress
                });
            });
        }
    }
}
