/**
 *****************************************
 * Created by lifx
 * Created on 2017-10-19 14:30:43
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 定义事件触发器
 *****************************************
 */
export default class Event {

    /* 初始化 */
    constructor() {
        this.events = {};
    }

    /* 添加事件 */
    on(name, handler) {

        // 过滤事件类型
        if (typeof name !== 'string') {

            // 处理对象
            if (typeof name === 'object') {
                Object.keys(name).forEach(key => this.on(key, name[key]));
            }

            return this;
        }

        // 过滤事件函数
        if (typeof handler !== 'function') {
            return this;
        }

        // 添加事件
        name in this.events ? this.events[name].push(handler) : (this.events[name] = [handler]);
        return this;
    }

    /* 移除事件 */
    off(name, handler) {

        // 全部移除
        if (name === undefined) {
            this.events = {};
            return this;
        }

        // 过滤事件类型
        if (typeof name !== 'string') {
            return this;
        }

        // 清除指定事件队列
        if (handler === undefined) {
            delete this.events[name];
            return this;
        }

        // 移除指定事件
        if (typeof handler === 'function' && name in this.events) {
            this.events[name] = this.events[name].filter(fun => fun !== handler);
        }

        return this;
    }

    /* 触发事件 */
    emit(name, ...args) {

        // 过滤事件类型
        if (typeof name !== 'string') {
            return this;
        }

        // 执行队列
        if (name in this.events && this.events[name].length) {
            this.events[name].forEach(fun => fun(...args));
        }

        // 执行派发事件
        if ('$$emit' in this.events && this.events.$$emit.length) {
            this.events.$$emit.forEach(fun => fun(name, ...args));
        }

        return this;
    }
}
