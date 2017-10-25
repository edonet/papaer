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
        onTap: (e) => console.log(e),
        onChange: view => console.log(view),
        views: [
            {
                id: 1,
                mark: true,
                path: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1508406925923&di=efefef81aacec810dcb978ecaf372c4c&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimage%2Fc0%253Dshijue1%252C0%252C0%252C294%252C40%2Fsign%3D178dcd40db09b3deffb2ec2ba4d606f4%2F9d82d158ccbf6c81c1c946c0b63eb13533fa401f.jpg',
                positionList: [
                    {
                        id: '1',
                        coordinate: { x: 10, y: 10, width: 100, height: 50 }
                    },
                    {
                        id: '2',
                        coordinate: [[10, 80], [10, 360], [110, 160], [20, 120]]
                    }
                ],
                problemList: [
                    {
                        id: 1,
                        color: '#23f',
                        coordinate: { x: 100, y: 100 }
                    }
                ]
            },
            {
                id: 2,
                path: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1508406925923&di=6836fd8e5b0e3e387f79535ac4afb357&imgtype=0&src=http%3A%2F%2Fimgstore.cdn.sogou.com%2Fapp%2Fa%2F100540002%2F451690.png',
                positionList: [
                    {
                        id: '1',
                        coordinate: { x: 10, y: 10, width: 100, height: 50 }
                    },
                    {
                        id: '2',
                        coordinate: [[10, 80], [10, 360], [110, 160], [20, 120]]
                    }
                ],
                problemList: [
                    {
                        id: 1,
                        color: '#23f',
                        coordinate: { x: 100, y: 100 }
                    }
                ]
            },
            {
                id: 3,
                path: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1508406925922&di=fe1753f8e4d631646c3963f20fb7627b&imgtype=0&src=http%3A%2F%2Fimg2.niutuku.com%2Fdesk%2F1208%2F2009%2Fntk-2009-18712.jpg' },
            {
                id: 4,
                path: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1508406925921&di=a8a3340f3d2c5e52d22e41f013e57c16&imgtype=0&src=http%3A%2F%2Fimg2.niutuku.com%2Fdesk%2F1208%2F1450%2Fntk-1450-9891.jpg' },
            {
                id: 5,
                path: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1508406925920&di=6fdada04a59ec7785b978f0fc3e7c1ae&imgtype=0&src=http%3A%2F%2Fimg2.niutuku.com%2Fdesk%2F1208%2F1445%2Fntk-1445-9697.jpg' }
        ]
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
