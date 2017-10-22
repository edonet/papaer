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
import AppCanvas from './app-canvas';


/**
 *****************************************
 * 定义画布组件
 *****************************************
 */
export default function App({ views = [] }) {
    return (
        <AppSwiper >
            { views.map((view, idx) => <AppCanvas key={ idx } { ...view } />) }
        </AppSwiper>
    );
}
