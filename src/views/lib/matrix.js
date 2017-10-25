/**
 *****************************************
 * Created by lifx
 * Created on 2017-10-24 17:45:13
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import { compose } from './utils';
import { hasPerspective, transform } from './style';


/**
 *****************************************
 * 位置变换
 *****************************************
 */
export const translateTo = (x = 0, y = 0) => matrix => ({ ...matrix, x, y });
export const translateBy = (dx = 0, dy = 0) => ({ x, y, ...rest }) => ({ ...rest, x: x + dx, y: y + dy });


/**
 *****************************************
 * 缩放变换
 *****************************************
 */
export const scale = (d = 1) => ({ x, y, scale }) => ({ x: d * x, y: y * d, scale: scale * d });
export const scaleBy = (d = 1, cx = 0, cy = 0) => compose(translateBy(cx, cy), scale(d), translateBy(-cx, -cy));


/**
 *****************************************
 * 生成变换样式
 *****************************************
 */
export const stringify = ({ x, y, scale }) => (
    `translate(${x}px, ${y}px)${hasPerspective ? ' translateZ(0)' : ''} scale(${scale})`
);


/**
 *****************************************
 * 定义变换函数
 *****************************************
 */
export default class Matrix {

    /* 初始化数据模型 */
    constructor(model) {
        this.$$model = { x: 0, y: 0, scale: 1, ...model };
    }

    /* 函数操作函数 */
    map(handler) {
        return new Matrix(handler(this.$$model));
    }

    /* 生成样式字符串 */
    stringify() {
        return stringify(this.$$model);
    }

    /* 生成变换对象 */
    tranform() {
        return transform(this.stringify());
    }
}
