/**
 *****************************************
 * Created by lifx
 * Created on 2017-10-22 11:10:07
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import React from 'react';
import AppSwiper from './app-swiper';
import AppPaper from './app-paper';
import localStore from './lib/localStore';


/**
 *****************************************
 * 定义画布组件
 *****************************************
 */
export default function App({ id, views = [], onTap, onChange, mark }) {
    let onTapCallback = (touches, e) => {
            if (onTap) {
                let el = e.target,
                    name = e.target.tagName,
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
                onTap({ id, type, x: touches[0].x, y: touches[0].y });
            }
        },
        store = localStore(id);

    return (
        <AppSwiper onChange={ onChange } store={ store } >
            {
                views.map((view, idx) => (
                    <AppPaper key={ idx } onTap={ onTapCallback } mark={ mark } store={ store } { ...view } />
                ))
            }
        </AppSwiper>
    );
}
