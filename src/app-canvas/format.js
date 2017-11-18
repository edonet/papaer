/**
 *****************************************
 * Created by lifx
 * Created on 2017-11-08 20:25:23
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import { uuid } from '../lib';


/**
 *****************************************
 * 抛出格式化数据接口
 *****************************************
 */
export default ({ id: key = uuid(), mark, positionList, problemList, size, url }) => {
    let children = [],
        areaStyle = {
            fill: 'white',
            fillOpacity: 0,
            stroke: 'red',
            strokeWidth: '0.1em'
        },
        pointStyle = {
            r: '0.8em',
            strokeWidth: '1em',
            strokeOpacity: 0
        };


    // 添加图片
    children.push({
        name: 'image',
        props: { key: key + ':image', xlinkHref: url, width: size.width, height: size.height }
    });

    // 启用蒙层
    if (mark) {
        let d = `M0, 0v${ size.height }h${ size.width }v${- size.height }Z` + positionList.map(({ coordinate }) => {

                // 校验坐标是否为对象
                if (!coordinate || typeof coordinate !== 'object') {
                    return '';
                }

                // 添加多边形
                if (Array.isArray(coordinate)) {
                    return 'M' + coordinate.map(p => p.join(', ')).join('L') + 'Z';
                } else if ('x' in coordinate) {
                    let { x, y, width, height } = coordinate;
                    return `M${x}, ${y}h${width}v${height}h${- width}Z`;
                }

                return '';
            }).join('');

        // 添加蒙层
        children.push({
            name: 'path',
            props: { d, key: key + ':mark', fill: 'black', fillOpacity: .3, fillRule: 'evenodd', stroke: 'none' }
        });
    }


    // 添加部位区域
    positionList && positionList.forEach(({ id, coordinate }) => {

        // 校验坐标是否为对象
        if (!coordinate || typeof coordinate !== 'object') {
            return '';
        }

        // 添加多边形
        if (Array.isArray(coordinate)) {
            return children.push({
                name: 'path',
                props: {
                    id, key: `${key}(${children.length}:${id}`, ...areaStyle,
                    d: 'M' + coordinate.map(p => p.join(', ')).join('L') + 'Z'
                }
            });
        } else if ('x' in coordinate) {
            return children.push({
                name: 'rect',
                props: {
                    id, key: `${key}(${children.length}:${id}`, ...areaStyle, ...coordinate
                }
            });
        }
    });

    // 添加问题点
    problemList && problemList.forEach(({ id, color = 'red', coordinate: { x, y } }) => children.push({
        name: 'circle',
        props: {
            id, key: `${key}(${children.length}:${id}`, fill: color, ...pointStyle, cx: x, cy: y
        }
    }));

    // 返回元素
    return children;
};
