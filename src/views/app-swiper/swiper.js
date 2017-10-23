/**
 *****************************************
 * Created by lifx
 * Created on 2017-10-21 12:34:23
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import { assign, translate, viewUpdater, animate, ease } from '../lib/utils';


/**
 *****************************************
 * 定义滚动控件
 *****************************************
 */
export default class Swiper {

    /* 初始化对象 */
    constructor(options) {

        // 初始化数据模型
        this.$$model = {
            target: null, overlap: 0, max: 0,
            updater: (el, data) => el && assign(el.style, translate(data + '%'))
        };

        // 初始化视图更新器
        this.$$updater = viewUpdater();

        // 刷新配置
        this.updateView(options);
    }

    /* 初始化控件 */
    updateView(options) {

        // 合并模型
        assign(this.$$model, options);

        // 获取默认视图
        if (this.$$model.target && !this.$$model.views) {
            this.$$model.views = this.$$model.target.childNodes || [];
        }

        // 获取滚动的最大值
        this.$$model.max = this.$$model.views ? ((this.$$model.views.length || 1) - 1) * 100 : 0;

        // 刷新视图
        this.$$model.target && this.refresh();
    }

    /* 更新视图 */
    refresh(position) {
        let { target, max, value } = this.$$model;

        if (target) {

            // 判断是否超出边界
            position = Math.max(0, Math.min(max, position || value || 0));

            // 判断是否需要更新
            if (position !== value) {
                this.$$updater(this.refreshView.bind(this, position));
            }
        }
    }

    /* 更新元素 */
    refreshView(value) {
        let { target, views, updater, overlap } = this.$$model;

        // 更新容器位置
        updater(target, - (this.$$model.value = value));

        // 更新视图位置
        if (views && views.length) {
            let curr = parseInt(value / 100),
                offset = curr * 100 + overlap * (value % 100) / 100;

            // 遍历视图
            [].forEach.call(views, (el, idx) => {

                // 小于当前视图
                if (idx < curr) {
                    return updater(el, offset + (idx - curr) * 100);
                }

                // 其它视图
                updater(el, idx === curr ? offset : idx * 100);
            });
        }
    }

    /* 滚动到指定位置 */
    scrollTo(position) {
        this.refresh(position);
    }

    /* 滚动指定距离 */
    scrollBy(distance) {
        this.refresh(this.$$model.value + distance);
    }

    /* 动画切换到指定位置 */
    animateTo(position = 0, duration = 300, easeType = 'ease-in-out') {
        let { target, value, max } = this.$$model,
            easeFun = ease(easeType),
            distance = 0;

        if (target) {

            // 获取距离
            position = Math.max(0, Math.min(max, position));
            distance = position - value;

            // 启动动画
            return distance && animate(duration, progress => {
                this.refreshView(value + distance * easeFun(progress));
            });
        }
    }

    /* 获取位置 */
    getPosition() {
        return this.$$model.value;
    }

    /* 销毁控件 */
    destroy() {
        this.value = null;
        this.views = null;
    }
}
