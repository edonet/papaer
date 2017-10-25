/**
 *****************************************
 * Created by lifx
 * Created on 2017-10-24 17:32:24
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 定义工具方法
 *****************************************
 */
export const keys = Object.keys;
export const assign = Object.assign;
export const now = () => + new Date();
export const uuid = ((couter) => () => couter ++)(now());
export const compose = (...args) => args.reduce((func, curr) => argv => curr(func(argv)));
export const map = handler => model => 'map' in model && model.map(handler);
