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
export * from './index';


/**
 *****************************************
 * 定义数据模型
 *****************************************
 */
const
    el = document.getElementById('app'),
    data = {
        views: [
            { url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1508406925923&di=efefef81aacec810dcb978ecaf372c4c&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimage%2Fc0%253Dshijue1%252C0%252C0%252C294%252C40%2Fsign%3D178dcd40db09b3deffb2ec2ba4d606f4%2F9d82d158ccbf6c81c1c946c0b63eb13533fa401f.jpg' },
            { url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1508406925923&di=6836fd8e5b0e3e387f79535ac4afb357&imgtype=0&src=http%3A%2F%2Fimgstore.cdn.sogou.com%2Fapp%2Fa%2F100540002%2F451690.png' },
            { url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1508406925922&di=fe1753f8e4d631646c3963f20fb7627b&imgtype=0&src=http%3A%2F%2Fimg2.niutuku.com%2Fdesk%2F1208%2F2009%2Fntk-2009-18712.jpg' },
            { url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1508406925921&di=a8a3340f3d2c5e52d22e41f013e57c16&imgtype=0&src=http%3A%2F%2Fimg2.niutuku.com%2Fdesk%2F1208%2F1450%2Fntk-1450-9891.jpg' },
            { url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1508406925920&di=6fdada04a59ec7785b978f0fc3e7c1ae&imgtype=0&src=http%3A%2F%2Fimg2.niutuku.com%2Fdesk%2F1208%2F1445%2Fntk-1445-9697.jpg' }
        ],
        overlap: 20
    };


/**
 *****************************************
 * 启动插件
 *****************************************
 */
render(el, data);


/**
 *****************************************
 * 启动热更新
 *****************************************
 */
if (module.hot) {
    module.hot.accept('./index', () => {
        require('./index').render(el, data);
    });
}
