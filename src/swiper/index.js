/**
 *****************************************
 * Created by lifx
 * Created on 2017-11-08 16:33:57
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import { uuid, assign } from '../lib';
import { EventEmitter } from '../lib/event';
import { transform } from '../lib/element';
import { updater, animate, easing } from '../lib/animater';
import Toucher from '../lib/toucher';


/**
 *****************************************
 * 缓存组件
 *****************************************
 */
const
    attrName = 'data-swiper',
    boxStyle = 'position: absolute; left: 0; right: 0; top: 0; bottom: 0;',
    model = {};


/**
 *****************************************
 * 定义组件
 *****************************************
 */
export default class Swiper extends EventEmitter {

    /* 初始化组件 */
    constructor({ store } = {}) {
        super();

        // 定义属性
        this.$$id = uuid();
        this.$$x = null;
        this.$$curr = store.get('view') || 0;
        this.$$views = [];
        this.$$size = { width: 0, height: 0 };
        this.$$toucher = new Toucher();
        this.$$updater = updater();
        this.$$container = document.createElement('div');
        this.$$animater = null;
        this.$$isStop = false;

        // 定义容器样式
        this.$$container.style.cssText = boxStyle;

        // 监听手势开始
        this.$$toucher.on('touchStart', () => {

            // 恢复标识
            this.$$isStop = false;

            // 结束动画
            this.$$animater && this.$$animater.stop();

            // 执行触控结束
            this.emit('app:touchStart', { touches: [] }, this.$$curr);
        });

        // 监听手势滚动事件
        this.$$toucher.on('moving', (e, [touch]) => {
            let isStop = false;

            // 执行滚动回调
            this.emit('app:moving', {
                touches: [touch],
                stopPropagation: () => isStop = true
            }, this.$$curr);

            // 更新位置
            if (isStop) {
                this.$$isStop = true;
            } else if (touch.dx) {
                this.$$updater(() => this.translateTo(this.$$x + 100 * touch.dx / this.$$size.width));
            }
        });

        // 监听移动结束事件
        this.$$toucher.on('moveEnd', (e, touches) => {
            this.emit('app:moveEnd', { touches }, this.$$curr);
        });

        // 监听手势缩放
        this.$$toucher.on('scaling', (e, touches) => {
            this.emit('app:scaling', { touches }, this.$$curr);
        });

        // 监听点击事件
        this.$$toucher.on('tap', (e, [touch]) => {
            if (touch) {
                let { sx, sy } = touch,
                    data = { sx, sy };

                this.emit('app:tap', data, this.$$curr);
                this.emit('tap', e, [data]);
            }
        });

        // 监听手势滚动结束
        this.$$toucher.on('touchEnd', (e, [touch]) => {

            // 停止移动
            if (touch) {
                let speed = Math.abs(touch.dx / touch.dt),
                    distanse = !this.$$isStop && speed > .3 ? (touch.dx > 1 ? 50 : - 50) : 0,
                    x = this.$$x + distanse,
                    curr = Math.max(0, Math.min(Math.round( - x / 100), this.$$views.length - 1)),
                    ease = easing('ease-out');


                // 获取动画属性
                x = this.$$x;
                distanse = - curr * 100 - this.$$x;

                // 执行动画
                this.$$animater && this.$$animater.stop();
                this.$$animater = distanse && animate(300, progress => {

                    // 更新位置
                    this.translateTo(x + distanse * ease(progress));

                    // 完成动画
                    if (progress >= 1 && curr !== this.$$curr) {
                        store.set({ view: curr });
                        this.$$curr = curr;
                        this.emit('change', this.$$curr);
                    }
                });
            }

            // 执行触控结束
            this.emit('app:touchEnd', { touches: [] }, this.$$curr);
        });
    }

    /* 挂载组件 */
    mount(target) {

        // 缓存组件
        model[this.$$id] = this;

        // 挂载手势
        this.$$toucher.mountTo(this.$$container);

        // 获取当前位置
        this.$$curr = Math.max(0, Math.min(this.$$views.length - 1, this.$$curr));
        this.translateTo(- this.$$curr * 100);
        this.emit('change', this.$$curr);

        // 挂载元素
        target.setAttribute(attrName, this.$$id);
        target.appendChild(this.$$container);

        // 获取窗口尺寸
        this.$$size = {
            width: this.$$container.clientWidth,
            height: this.$$container.clientHeight
        };

        // 执行挂载事件
        this.emit('app:mount', this.$$size);

        // 返回对象
        return this;
    }

    /* 销毁组件 */
    unmount(target) {

        // 清除组件
        delete model[this.$$id];

        // 卸载手势
        this.$$toucher.unmountTo(this.$$container);

        // 移除元素
        target.setAttribute(attrName, '');
        target.removeChild(this.$$container);

        // 销毁属性
        this.off();
        this.$$id = null;
        this.$$frame = null;
        this.$$container = null;
        this.$$events = null;
    }

    /* 加载视图 */
    append(view) {

        // 判断是否可以挂载
        if (view && view.mount) {
            let el = document.createElement('div'),
                idx = this.$$views.length;


            // 设置视图样式
            el.style.cssText = boxStyle;
            assign(el.style, { ...transform({ x: idx * 100 + '%' }), overflow: 'hidden' });

            // 添加事件监听
            'emit' in view && this.on('$$emit', (name, argv = {}, index = 'all') => {
                if (index === 'all' || index === idx) {
                    view.emit(name, argv);
                }
            });

            // 挂载视图内容
            view.mount(el);

            // 挂载视图
            this.$$container.appendChild(el);
            this.$$views.push(el);
        }

        return this;
    }

    /* 移动到指定位置 */
    translateTo(x = 0) {
        if (x !== this.$$x) {
            this.$$x = x;
            assign(this.$$container.style, transform({ x: x + '%' }));
        }
    }
}


/**
 *****************************************
 * 卸载组件
 *****************************************
 */
export const unmount = target => {
    let id = target.getAttribute(attrName) || '',
        swiper = id && model[id];

    // 移除组件
    swiper && swiper.unmount(target);

    // 返回元素
    return target;
};

