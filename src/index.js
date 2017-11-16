/**
 *****************************************
 * Created by lifx
 * Created on 2017-11-16 09:09:32
 *****************************************
 */
'use strict';



/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import React from 'react';
import { render as renderComponent, unmountComponentAtNode } from 'react-dom';
import element from './lib/element';
import localStore from './lib/localStore';
import event from './lib/event';
import AppSwiper from './app-swiper';
import AppCanvas from './app-canvas';


/**
 *****************************************
 * 渲染组件
 *****************************************
 */
export const render = (el, { id, curr, mark, views = [], onTap, onChange } = {}) => {
    let store = localStore(id),
        props = {
            id, curr, store, event, onChange
        };


    // 渲染组件
    return element(el).map(target => renderComponent((
        <AppSwiper { ...props }>
            { views.map(view => <AppCanvas key={ view.id } { ...view } store={ store } event={ event } mark={ mark } />) }
        </AppSwiper>
    ), target));
};


/**
 *****************************************
 * 卸载组件
 *****************************************
 */
export const unmount = (
    id => element(id).map(unmountComponentAtNode)
);
