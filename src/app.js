/**
 *****************************************
 * Created by lifx
 * Created on 2017-10-20 09:58:39
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import { render } from './index';
import data from './data.json';
export * from './index';


/**
 *****************************************
 * 定义数据模型
 *****************************************
 */
const
    el = document.getElementById('app'),
    options = {
        ...data,
        curr: 2,
        onTap: (e) => console.log(e),
        onChange: view => console.log(view),
        views: [...data.views, ...data.views, {
            id: 10,
            path: '1.jpeg',
            positionList: [
                {
                    id: 'f318b02b-c062-ee9f-8b54-fe986aa611d2',
                    coordinate: [
                        [0, 0], [50, 200], [100, 300], [30, 600]
                    ]
                }
            ]
        }]
    };


/**
 *****************************************
 * 启动插件
 *****************************************
 */
render(el, options);


/**
 *****************************************
 * 启动热更新
 *****************************************
 */
if (module.hot) {
    module.hot.accept('./index', () => {
        require('./index').render(el, options);
    });
}
