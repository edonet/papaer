/**
 *****************************************
 * Created by lifx
 * Created on 2017-11-16 18:08:20
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载数据
 *****************************************
 */
import data from './data.json';


/**
 *****************************************
 * 抛出数据
 *****************************************
 */
export default {
    ...data,
    // curr: 2,
    mark: true,
    onTap: (e) => console.log(e),
    onChange: view => console.log(view),
    views: [
        ...data.views,
        {
            ...data.views[0],
            id: 9
        },
        {
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
        }
    ]
};
