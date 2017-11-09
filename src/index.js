/**
 *****************************************
 * Created by lifx
 * Created on 2017-11-08 14:24:35
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import element from './lib/element';
import localStore from './lib/localStore';
import Swiper, { unmount as unmountSwiper } from './swiper';
import Canvas from './canvas';
import format from './format';


/**
 *****************************************
 * 渲染组件
 *****************************************
 */
export const render = (el, { id, views = [], onTap, onChange } = {}) => {
    let store = localStore(id),
        swiper = new Swiper({ store });


    // 添加切换事件
    swiper.on('change', onChange);

    // 添加点击事件
    swiper.on('tap', (e = {}, [touch]) => {
        if (touch && touch.sx) {
            let target = e.target || {},
                name = target.tagName,
                id = '',
                type = '';

            // 过滤蒙层
            if (el.getAttribute('fill-rule') === 'evenodd') {
                return;
            }

            // 获取数据类型
            if (name === 'circle') {
                type = 'point';
                id = el.getAttribute('id');
            } else if (name === 'path' || name === 'rect') {
                type = 'area';
                id = el.getAttribute('id');
            }

            // 执行点击回调
            onTap && onTap({ id, type, x: touch.sx, y: touch.sy });
        }
    });


    // 添加视图
    views.forEach(view => swiper.append(
        new Canvas({ id: view.id, url: view.path, store, data: format(view) })
    ));

    // 加载组件
    element(el).map(el => swiper.mount(unmountSwiper(el)));
};


/**
 *****************************************
 * 卸载组件
 *****************************************
 */
export const unmount = (
    id => element(id).map(unmountSwiper)
);

