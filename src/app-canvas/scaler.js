/**
 *****************************************
 * Created by lifx
 * Created on 2017-11-09 11:00:49
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 抛出更新器
 *****************************************
 */
export default (view, size) => ({x, y, scale}) => {
    let viewScale = scale * size.scale,
        viewWidth = view.width / viewScale,
        fontSize = 10 * (Math.min(3, Math.max(1, scale) - 1) * .4 + 1) * 1 / viewScale,
        width = size.width * viewScale,
        height = width * size.ratio;

    // 返回属性
    return {
        fontSize: `${ fontSize }px`,
        backgroundPosition: `${ (x || 0) }px ${ (y || 0) }px`,
        backgroundSize: `${ width }px ${ height }px`,
        viewBox: `${ - (x || 0) / viewScale } ${ - (y || 0) / viewScale } ${ viewWidth } ${ 2 * viewWidth * view.ratio }`,
        canvas: { width, height }
    };
};
