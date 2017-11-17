/**
 *****************************************
 * Created by lifx
 * Created on 2017-11-17 10:46:50
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 获取触控点
 *****************************************
 */
export const point = touch => ({
    x: touch.pageX,
    y: touch.pageY,
    t: + new Date()
});


/**
 *****************************************
 * 获取触控点偏移
 *****************************************
 */
export const offset = (p1, p2) => {
    let { x, y, t } = p2 || {},
        p = {
            ox: x || p1.x,
            oy: y || p1.y,
            ot: t || p1.t
        },
        direction = p1.direction;


    // 获取偏移值
    p.dx = p1.x - p.ox;
    p.dy = p1.y - p.oy;
    p.dt = p1.t - p.ot;

    // 获取方向
    if (!direction) {
        direction = Math.abs(p.dx) > Math.abs(p.dy) ? 'x' : 'y';
    }

    // 返回结果
    return { ...p1, ...p, direction };
};


/**
 *****************************************
 * 获取触控缩放
 *****************************************
 */
export const scale = (p1, p2) => ({ x = 0, y = 0, scale = 1 } = {}) => {
    let r1 = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)),
        r2 = Math.sqrt(Math.pow(p1.ox - p2.ox, 2) + Math.pow(p1.oy - p2.oy, 2)),
        c1 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 },
        c2 = { x: (p1.ox + p2.ox) / 2, y: (p1.oy + p2.oy) / 2 },
        s = r1 / r2;


    // 更新属性
    return {
        x: (x - c2.x) * s + c1.x,
        y: (y - c2.y) * s + c1.y,
        scale: scale * s,
        cx: c1.x,
        cy: c1.y
    };
};
