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
        props = { curr },
        onTapHanlder = onTap && (({ event, touches: [touch] }) => {
            if (touch && 'x' in touch) {
                let target = event.target || {},
                    name = target.tagName,
                    id = '',
                    type = '';

                // 过滤蒙层
                if (target.getAttribute('fill-rule') === 'evenodd') {
                    return;
                }

                // 获取数据类型
                if (name === 'circle') {
                    type = 'point';
                    id = target.getAttribute('id');
                } else if (name === 'path' || name === 'rect') {
                    type = 'area';
                    id = target.getAttribute('id');
                }

                // 执行点击回调
                onTap({ id, type, ...touch });
            }
        });


    // 设置当前视图
    if (typeof props.curr !== 'number') {
        props.curr = store.get('view');
    }

    // 设置切换回调
    props.onChange = view => {
        store.set({ view });
        onChange && onChange(view);
    };

    // 渲染组件
    return element(el).map(target => renderComponent((
        <AppSwiper { ...props }>
            {
                views.map((view, idx) => {
                    let key = view.id || idx,
                        props = {
                            ...view,
                            mark,
                            scale: store.get(key),
                            onTap: onTapHanlder,
                            onScale: state => store.set({ [key]: state })
                        };

                    return <AppCanvas key={ key } { ...props } />;
                })
            }
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
