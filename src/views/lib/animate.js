/**
 *****************************************
 * Created by lifx
 * Created on 2017-10-24 18:48:06
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 申请一下帧
 *****************************************
 */
export const rAF = (
    window.requestAnimationFrame ||
    window.windowebkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    (callback => setTimeout(callback, 1000 / 60))
);


/**
 *****************************************
 * 创建帧更新器
 *****************************************
 */
export const animateUpdater = updater => handler => {
    updater || rAF(() => updater = (updater && updater(), null));
    updater = handler;
};


/**
 *****************************************
 * 动画
 *****************************************
 */
export const animate = (duration, handler) => {
    let cancel = false,
        start = + new Date(),
        callback = () => {
            if (cancel) {
                return false;
            }

            let lost = new Date() - start,
                progress = Math.min(1, lost / duration);

            if (handler(progress, lost) !== false) {
                progress < 1 && rAF(callback);
            }
        };


    // 执行动画帧
    duration > 0 && rAF(callback);

    // 返回取消函数
    return { stop: () => cancel = true };
};


/**
 *****************************************
 * 缓动函数
 *****************************************
 */
export const easing = type => {
    switch (type) {
        case 'linear':
            return x => x;
        case 'ease-in-out':
            return x => x - Math.sin(2 * Math.PI * x) / (2 * Math.PI);
        case 'ease-in':
            return x => Math.pow(x, 3);
        case 'ease-out':
            return x => Math.pow(x - 1, 3) + 1;
        case 'back-in':
            return x => (s => x * x * ((s + 1) * x - s))(1.70158);
        case 'back-out':
            return x => (s => (x -= 1, x * x * ((s + 1) * x + s) + 1))(1.70158);
        case 'elastic':
            return x => x < 0.4 ? Math.pow(2.5 * x, 3) : Math.sin(5 * x * Math.PI) * Math.cos(0.5 * x * Math.PI) / 3 + 1;
        case 'bounce':
            return x => {
                let s = 7.5625,
                    p = 2.75;

                if (x < 1 / p) {
                    return s * x * x;
                } else if (x < 2 / p) {
                    x -= 1.5 / p;
                    return s * x * x + 0.75;
                } else if (x < 2.5 / p) {
                    x -= 2.25 / p;
                    return s * x * x + 0.9375;
                } else {
                    x -= 2.625 / p;
                    return s * x * x + 0.984375;
                }
            };
        default:
            return x => x;
    }
};
