/**
 *****************************************
 * Created by lifx
 * Created on 2017-10-26 15:17:53
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 定义工具方法
 *****************************************
 */
function getLocalStore(key) {
    let val = localStorage.getItem(key);

    if (val) {
        try {
            return JSON.parse(val);
        } catch (e) {
            return {};
        }
    }

    return {};
}


/**
 *****************************************
 * 定义本地状态控件
 *****************************************
 */
export default function localStore(id) {
    let key = id ? 'app-paper:' + id : null,
        model = key ? getLocalStore(key) : {},
        timeStamp = null,
        updater = state => {
            if (key) {
                model = { ...model, ...state };
                timeStamp && clearTimeout(timeStamp);
                timeStamp = setTimeout(() => {
                    timeStamp = null;
                    localStorage.setItem(key, JSON.stringify(model));
                }, 500);
            }
        };

    return {
        get: key => key ? model[key] : model,
        set: updater
    };
}
