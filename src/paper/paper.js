(function webpackUniversalModuleDefinition(root, factory) {
    root["mPaper"] = factory();
    root["createPaper"] = function () {
        return factory();
    };
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/    // The module cache
/******/    var installedModules = {};

/******/    // The require function
/******/    function __webpack_require__(moduleId) {

/******/        // Check if module is in cache
/******/        if(installedModules[moduleId])
/******/            return installedModules[moduleId].exports;

/******/        // Create a new module (and put it into the cache)
/******/        var module = installedModules[moduleId] = {
/******/            exports: {},
/******/            id: moduleId,
/******/            loaded: false
/******/        };

/******/        // Execute the module function
/******/        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/        // Flag the module as loaded
/******/        module.loaded = true;

/******/        // Return the exports of the module
/******/        return module.exports;
/******/    }


/******/    // expose the modules object (__webpack_modules__)
/******/    __webpack_require__.m = modules;

/******/    // expose the module cache
/******/    __webpack_require__.c = installedModules;

/******/    // __webpack_public_path__
/******/    __webpack_require__.p = "";

/******/    // Load entry module and return exports
/******/    return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

    'use strict';

    var Paper = __webpack_require__(1);

    var isMarking = false,
        markData = null,
        markList = [],
        onBeforeMark = void 0,
        onMarkListChange = void 0;

    module.exports = {
        paper: null,
        init: function init(options) {
            var huxing = this,
                param = {
                    url: options.src,
                    areas: options.data.areas,
                    pointSize: options.pointRadius,
                    useLocalState: options.useLocalState
                },
                paper = void 0;

            if (options.mark) {
                param.points = options.markPoints;
            } else {
                param.points = options.data.points;
            }

            huxing.paper = paper = new Paper(options.wrapper, param);
            huxing.paper.on('click', function (e) {

                var target = e.target,
                    data = target.data || {},
                    p = void 0;

                if (!data || !data.tag) {
                    return false;
                }

                p = paper.getClientPoint(e.clientX, e.clientY);

                data.e = e;
                data.x = p.x;
                data.y = p.y;

                paper.saveState();

                if (isMarking) {
                    var markPoint = { x: p.x, y: p.y },
                        res;

                    if (!onBeforeMark) {
                        return huxing.mark(markPoint);
                    }

                    res = onBeforeMark(data);

                    if (res === false) {
                        return false;
                    }

                    if (typeof res !== 'object') {
                        return huxing.mark(markPoint);
                    }

                    if (res.then) {
                        return res.then(function (res) {
                            if (res === false) {
                                return false;
                            }

                            if (typeof res !== 'object') {
                                return huxing.mark(markPoint);
                            }

                            res.x = p.x;
                            res.y = p.y;
                            huxing.mark(res);
                        });
                    }

                    res.x = p.x;
                    res.y = p.y;
                    huxing.mark(res);

                } else if (options.clickCallback) {
                    return options.clickCallback.call(paper, data);
                }
            });

            if (options.mark) {
                onBeforeMark = options.beforeMark;
                onMarkListChange = options.markCallback;
                this.startMark(options.markData, options.markPoints);
            }


            this.readyHandler.forEach(function (fn) {
                huxing.ready(fn);
            });

            return this;
        },
        readyHandler: [],
        ready: function ready(handler) {

            if (this.paper) {
                this.paper.node ? handler(this.paper) : this.paper.on('ready', handler);
            } else {
                this.readyHandler.push(handler);
            }

            return this;
        },
        setPoints: function setPoints(points) {
            isMarking && (markList = points);
            return points instanceof Array ? this.ready(function (paper) {
                paper.clearPoints().point(points);
            }) : this;
        },
        startMark: function startMark(data, points) {

            isMarking = true;
            markData = data || {};
            markList = points || [];

            return this.ready(function (paper) {
                paper.addMarkLayer();
            });
        },
        mark: function mark(options) {

            for (var key in markData) {
                if (markData.hasOwnProperty(key)) {
                    options[key] = markData[key];
                }
            }

            markList.push(options);
            this.paper.point(options);
            onMarkListChange && onMarkListChange(markList);
            return this;
        },
        undoMark: function undoMark(canUndoLast) {

            // 判断是否存在点
            if (!markList.length) {
                return false;
            }

            // 最后的点无法撤消
            if (canUndoLast || markList.length > 1) {
                markList.pop();
                this.paper.popPoint();
            }

            onMarkListChange && onMarkListChange(markList);
            return canUndoLast ? markList.length : markList.length > 1;
        },
        finishMark: function finishMark() {
            isMarking = false;
            return this;
        },
        getMarkPoints: function getMarkPoints(onlyPoint) {
            return onlyPoint !== false ? markList.map(function (v) {
                return { x: v.x, y: v.y };
            }) : markList;
        },
        saveState: function saveState() {
            this.paper.saveState();
            return this;
        },
        refreshHeight: function refreshHeight(height) {
            if (this.paper) {
                this.paper.refreshHeight(height);
            }

            return this;
        },
        reset: function reset() {

            if (this.paper) {
                var wrapper = this.paper.wrapper,
                    node = this.paper.node;

                node && wrapper.removeChild(this.paper.node);
                this.paper = null;
            }

            return this;
        },
        destroy: function () {
            isMarking = null;
            markData = null;
            markList = null;
            onBeforeMark = null;
            onMarkListChange = null;
            return this.reset();
        }
    };

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

    'use strict';

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

    var utils = __webpack_require__(2),
        render = __webpack_require__(3),
        EventEmitter = __webpack_require__(7),
        xlink = 'http://www.w3.org/1999/xlink',
        stateStampKey = 'Paper:StateStampKey',
        stateStampVal = 'Paper:StateStampVal';

    var stateTimeStamp = null;

    /*
     *************************
     * 抛出【Paper】接口
     *************************
     */

    module.exports = Paper;

    /*
     *************************
     * 定义【Paper】类
     *************************
     */

    function Paper(id, options) {

        // 设置画布属性
        this.view = {};
        this.state = {};
        this.canvas = {};
        this.pending = true;
        this.pointSize = options.pointSize || 8;
        this.wrapper = typeof id === 'string' ? document.getElementById(id) : id ? id : null;

        // 获取画布大小
        if (this.wrapper) {
            this.width = this.wrapper.clientWidth;
            this.height = this.wrapper.clientHeight;
        }

        this.events = new EventEmitter();
        return render(this, options);
    }

    /*
     *************************
     * 定义【Paper】原型
     *************************
     */

    Paper.prototype = {
        constructor: Paper,
        scale: function scale(x, y, _scale) {
            var state = this.state;

            if (y === undefined) {
                _scale = x;
                x = state.x;
                y = state.y;
            }

            _scale *= state.scale;
            return this.setState({ x: x, y: y, scale: _scale });
        },
        translate: function translate(x, y) {
            var state = this.state;

            state.x -= x;
            state.y -= y;
            return this.refresh();
        },
        refresh: function refresh() {
            this.refreshView();
            this.refreshCanvas();

            return this;
        },
        refreshSize: function refreshSize(scale) {
            var self = this,
                view = this.view,
                state = this.state;

            // 更新缩放比
            state.scale = scale = scale || state.scale;

            // 更新视图属性
            view.scale = self.ratio / scale;
            view.width = self.width * view.scale;
            view.height = self.height * view.scale;

            return this;
        },
        refreshView: function refreshView() {
            var view = this.view,
                state = this.state,
                canvas = this.canvas,
                maxX = canvas.width - view.width,
                maxY = canvas.height - view.height,
                w = view.width / 2,
                h = view.height / 2,
                x = state.x - w,
                y = state.y - h;

            x = x > maxX ? maxX : x;
            y = y > maxY ? maxY : y;

            view.x = x < 0 ? 0 : x;
            view.y = y < 0 ? 0 : y;
            state.x = view.x + w;
            state.y = view.y + h;

            return this.saveState();
        },
        refreshCanvas: function refreshCanvas() {
            var _this = this;

            if (this.node) {
                (function () {
                    var self = _this,
                        view = _this.view,
                        rect = view.stringify(),
                        scale = _this.state.scale;

                    // 获取问题点的缩放比例
                    scale = view.scale * Math.pow(scale, 1 / 3);

                    // 更新视图元素
                    self.node.setAttribute('viewBox', rect);
                    self.areaGroup.setAttribute('stroke-width', view.scale);
                    self.point(function (p) {
                        p.setAttribute('r', self.pointSize * scale);
                    });
                })();
            }

            return this;
        },
        refreshHeight: function refreshHeight(height) {
            height = height || this.wrapper.clientHeight;

            if (height === this.height) {
                return this;
            }

            this.height = height;
            this.refreshSize();
            return this.refresh();
        },
        setState: function setState(options) {

            var self = this,
                state = self.state,
                scale = options.scale || state.scale;

            scale = scale > self.ratio ? self.ratio : scale < 1 ? 1 : scale;

            // 更新缩放比例
            if (scale !== state.scale) {
                self.refreshSize(scale);
            }

            // 更新中心点
            state.x = options.x || state.x;
            state.y = options.y || state.y;

            return this.refresh();
        },
        saveState: function saveState() {
            if (this.url) {
                var self = this;

                if (stateTimeStamp) {
                    clearTimeout(stateTimeStamp);
                }

                stateTimeStamp = setTimeout(function () {
                    localStorage.setItem(stateStampKey, self.url);
                    localStorage.setItem(stateStampVal, JSON.stringify(self.state));
                }, 1000);
            }

            return this;
        },
        restoreState: function restoreState(useLocalState) {
            if (useLocalState !== false && this.url === localStorage.getItem(stateStampKey)) {
                this.state = JSON.parse(localStorage.getItem(stateStampVal));
                this.refreshSize();
                this.refreshView();
            } else {
                var view = this.view,
                    x = view.width / 2,
                    y = view.height / 2;

                this.state = { x: x, y: y, scale: 1 };
            }

            return this;
        },
        append: function append(el, parent) {
            parent = parent || this.node;
            parent && parent.appendChild(el);
            return this;
        },
        createElement: function createElement(el, attr) {
            if (typeof el === 'string') {
                el = document.createElementNS('http://www.w3.org/2000/svg', el);
                el.style.webkitTapHighlightColor = 'rgba(0,0,0,0)';
            }

            utils.each(attr, function (key, val) {
                if (key === 'style') {
                    utils.each(val, function (name, style) {
                        el.style[name] = style;
                    });
                } else {
                    var name = key.split(':');

                    if (name[0] === 'xlink') {
                        el.setAttributeNS(xlink, name[1], val);
                    } else if (!angular.isNumber(val) || !isNaN(val)) {
                        el.setAttribute(key, val);
                    }
                }
            });

            return el;
        },
        point: function point(_point) {
            var _this2 = this;

            if (utils.isFunction(_point)) {
                this.pointList.forEach(_point);
            } else if (utils.isArray(_point)) {
                (function () {
                    var self = _this2;

                    _point.forEach(function (v) {
                        self.point(v);
                    });
                })();
            } else if ('x' in _point) {
                var scale = this.canvas.scale,
                    rate = 0.5 * (this.state.scale - 1) / (this.ratio - 1),
                    el = this.createElement('circle', {
                    cx: _point.x * scale,
                    cy: _point.y * scale,
                    r: this.pointSize * this.view.scale * (1 + rate),
                    fill: _point.color || '#ff4545'
                });

                el.data = {
                    id: _point.id,
                    tag: 'point',
                    is_local: _point.is_local,
                    position_id: _point.position_id,
                    status: _point.status,
                    top_item_id: _point.top_item_id
                };

                this.pointList.push(el);
                this.pointGroup.appendChild(el);
            }

            return this;
        },
        clearPoints: function clearPoints() {
            var self = this,
                group = self.pointGroup;

            if (self.pointList) {
                self.pointList.forEach(function (el) {
                    group.removeChild(el);
                });
            }
            self.pointList = [];
            return self;
        },
        popPoint: function popPoint() {
            var el = this.pointList.pop();

            el && this.pointGroup.removeChild(el);
            return this;
        },
        area: function area(_area) {
            var _this3 = this;

            if (utils.isFunction(_area)) {
                this.areaList.forEach(_area);
            } else if (utils.isArray(_area)) {
                (function () {
                    var self = _this3;

                    _area.forEach(function (v) {
                        self.area(v);
                    });
                })();
            } else {

                if (_area.d) {
                    return this.path(_area.id, _area.d);
                } else if (!_area.coordinate && 'x' in _area) {

                    // 转换老的【x, y, width, height】坐标数据
                    var x = parseFloat(_area.x),
                        y = parseFloat(_area.y),
                        mx = x + parseFloat(_area.w),
                        my = y + parseFloat(_area.h);

                    _area.coordinate = [[x, y], [mx, y], [mx, my], [x, my]];
                }

                _area.coordinate && this.path(_area.id, _area.coordinate);
            }

            return this;
        },
        path: function path(id, points) {
            var scale = this.canvas.scale,
                d = void 0,
                el = void 0;

            if (typeof points === 'string') {
                d = points;
            } else {
                points = points.map(function (v) {
                    var x = parseFloat(v[0]) * scale,
                        y = parseFloat(v[1]) * scale;

                    return x + ',' + y;
                });

                d = 'M' + points[0] + 'L';
                d += points.slice(1).join() + 'Z';
            }

            el = this.createElement('path', { d: d });
            el.data = { id: id, d: d, tag: 'area' };

            this.areaList.push(el);
            this.areaGroup.appendChild(el);
            return el;
        },
        addMarkLayer: function addMarkLayer(areas) {
            areas = areas || this.areaList;

            if (!areas || !areas.length) {
                return this;
            }

            var canvas = this.canvas,
                w = canvas.width,
                h = canvas.height,
                d = ['M0,0V', h, 'H', w, 'V0Z'].join('');

            areas.forEach(function (v) {
                d += v.getAttribute('d');
            });

            this.removeMarkLayer();
            this.markNode = this.append(this.createElement('path', {
                d: d,
                'fill-opacity': 0.3,
                'fill-rule': 'evenodd'
            }));

            return this;
        },
        removeMarkLayer: function removeMarkLayer() {
            if (this.markNode) {
                this.node.removeChild(this.markNode);
            }

            return this;
        },
        getClientPoint: function getClientPoint(x, y) {
            var view = this.view,
                scale = this.canvas.scale,
                rect = this.wrapper.getBoundingClientRect();

            x = ((x - rect.left) * view.scale + view.x) / scale;
            y = ((y - rect.top) * view.scale + view.y) / scale;

            return { x: x, y: y };
        },
        on: function on(name, handler) {
            var events = this.events;

            if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object' && name) {

                // 批量添加事件
                utils.each(name, function (key, val) {
                    events.on(key, val);
                });
            } else {
                events.on(name, handler);
            }

            return this;
        }
    };

/***/ },
/* 2 */
/***/ function(module, exports) {

    'use strict';

    /*
     *************************
     * 抛出【utils】接口
     *************************
     */

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

    module.exports = {
        isString: function isString(object) {
            return typeof object === 'string';
        },
        isFunction: function isFunction(object) {
            return typeof object === 'function';
        },
        isArray: function isArray(object) {
            return object instanceof Array;
        },
        each: function each(object, handler) {
            if (object instanceof Array) {
                var len = object.length,
                    i = 0;

                for (; i < len; i++) {
                    if (handler(i, object[i]) === false) {
                        return false;
                    }
                }
            } else if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object') {
                for (var key in object) {
                    if (object.hasOwnProperty(key) && handler(key, object[key]) === false) {
                        return false;
                    }
                }
            }

            return true;
        }
    };

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

    'use strict';

    var modify = __webpack_require__(4),
        bindTouch = __webpack_require__(6);

    /*
     *************************
     * 抛出接口
     *************************
     */

    module.exports = function (paper, options) {
        var view = paper.view,
            canvas = paper.canvas,
            url = options.url;

        // 加载图片
        url && paper.width && paper.height && loadImage(url, function (err, img) {
            if (err) {
                return paper.events.emit('error', paper, err);
            }

            // 获取图片属性
            var w = img.width,
                h = img.height,
                r = w / paper.width,
                max = r > 4 ? r : 4;

            // 获取视图属性
            view.x = view.y = 0;
            view.width = paper.width * max;
            view.height = paper.height * max;
            view.scale = paper.ratio = max;
            view.stringify = function () {
                var rect = [this.x, this.y, this.width, this.height];
                return rect.join(' ');
            };

            // 获取画布属性
            canvas.scale = max / r;
            canvas.width = view.width;
            canvas.height = view.width * h / w;

            // 获取当前状态
            paper.url = url;
            paper.restoreState(options.useLocalState);

            // 创建【SVG】节点
            paper.node = paper.createElement('svg', {
                'version': '1.1',
                'xmlns': 'http://www.w3.org/2000/svg',
                'xmlns:xlink': 'http://www.w3.org/1999/xlink',
                'xmlns:ev': 'http://www.w3.org/2001/xml-events',
                'x': '0',
                'y': '0',
                'width': '100%',
                'height': '100%',
                'viewBox': view.stringify(),
                'preserveAspectRatio': 'xMidYMin meet',
                'xml:space': 'preserve',
                'style': {
                    'display': 'block',
                    'position': 'relative',
                    'left': '-0.5px',
                    'overflow': 'hidden',
                    '-webkit-transform': 'translate3d(0, 0, 0)',
                    '-moz-transform': 'translate3d(0, 0, 0)',
                    '-ms-transform': 'translate3d(0, 0, 0)',
                    'transform': 'translate3d(0, 0, 0)'
                }
            });

            // 创建背景图片
            paper.backgroud = paper.createElement('image', {
                'x': 0,
                'y': 0,
                'width': canvas.width,
                'height': canvas.height,
                'xlink:href': url
            });
            paper.backgroud.data = { url: url, tag: 'image' };
            paper.append(paper.backgroud);

            // 添加区域组
            paper.areaList = [];
            paper.areaGroup = paper.createElement('g', {
                'fill': 'white',
                'fill-opacity': '0',
                'stroke': 'red',
                'stroke-width': view.scale
            });
            paper.append(paper.areaGroup);
            options.areas && paper.area(options.areas);

            // 添加点组
            paper.pointList = [];
            paper.pointGroup = paper.createElement('g', {
                'stroke': 'white',
                'stroke-width': '3px',
                'stroke-opacity': '0'
            });
            paper.append(paper.pointGroup);
            options.points && paper.point(options.points);

            paper.on(modify).url = url;
            paper.wrapper.appendChild(paper.node);
            paper.events.emit('ready', paper, paper);
        });

        return bindTouch(paper);
    };

    /*
     *************************
     * 定义工具方法
     *************************
     */

    // 加载图片
    function loadImage(url, callback) {
        var img = new Image();

        img.onload = function () {
            callback(null, img);
        };

        img.onerror = function () {
            callback('加载图片失败，请稍后再试。');
        };

        img.src = url;
    }

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

    'use strict';

    /*
     *************************
     * 定义需要依赖模块
     *************************
     */

    var animate = __webpack_require__(5);

    var isAnimating = false;

    /*
     *************************
     * 抛出编辑接口
     *************************
     */

    module.exports = {
        move: function move(m) {

            // 动画时不能拖动
            if (isAnimating) {
                return false;
            }

            var p = m[0],
                scale = this.view.scale,
                x = (p.x - p.px) * scale,
                y = (p.y - p.py) * scale;

            this.translate(x, y);
        },
        scale: function scale(m) {

            // 动画时不能拖动
            if (isAnimating) {
                return false;
            }

            var p1 = m[0],
                p2 = m[1],
                state = this.state,
                view = this.view,
                r = state.scale * distance(p1, p2) / distance({ x: p1.px, y: p1.py }, { x: p2.px, y: p2.py }),
                d = {
                x: view.scale * (p1.x + p2.x - p1.px - p2.px) / 2,
                y: view.scale * (p1.y + p2.y - p1.py - p2.py) / 2
            },
                max = this.ratio * 1.4;

            // 更新状态
            state.x -= d.x;
            state.y -= d.y;
            state.scale = r < 0.9 ? 0.9 : r > max ? max : r;

            // 缩放视图
            this.refreshSize();

            // 更新视图位置
            view.x = state.x - view.width / 2;
            view.y = state.y - view.height / 2;

            this.refreshCanvas();
        },
        scaleend: function scaleend() {
            var paper = this;

            paper.pending = false;
            setTimeout(function () {
                paper.pending = true;
            }, 1000);

            isAnimating = true;
            scaleEndAnimate(paper);
        }
    };

    /*
     *************************
     * 定义工具方法
     *************************
     */

    // 计算两点间距离
    function distance(p1, p2) {
        var dx = p2.x - p1.x,
            dy = p2.y - p1.y;

        return Math.sqrt(dx * dx + dy * dy);
    }

    // 执行缩放后的动画
    function scaleEndAnimate(paper) {
        var view = paper.view,
            state = paper.state,
            scale = state.scale,
            ratio = paper.ratio,
            x = view.x,
            y = view.y,
            w = view.width,
            h = view.height,
            dx = void 0,
            dy = void 0,
            dw = void 0,
            dh = void 0;

        state.scale = scale = scale < 1 ? 1 : scale > ratio ? ratio : scale;

        paper.refreshSize();
        paper.refreshView();

        dx = view.x - x;
        dy = view.y - y;
        dw = view.width - w;
        dh = view.height - h;

        dw || dy || dx ? animate(300, function (i, v) {
            view.x = x + v * dx;
            view.y = y + v * dy;
            view.width = w + v * dw;
            view.height = h + v * dh;

            paper.refreshCanvas();

            if (i === 1) {
                isAnimating = false;
            }
        }) : isAnimating = false;
    }

/***/ },
/* 5 */
/***/ function(module, exports) {

    'use strict';

    /*
     *************************
     * 请求动画方法
     *************************
     */

    var request = window.requestAnimationFrame || window.windowebkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        return setTimeout(callback, 13);
    };

    /*
     *************************
     * 抛出动画接口
     *************************
     */

    module.exports = function () {

        var duration = 500,
            easing = 'ease-in-out',
            handler = null,
            len = arguments.length;

        switch (len) {
            case 0:
                return;
            case 1:
                handler = arguments.length <= 0 ? undefined : arguments[0];
                break;
            case 2:
                duration = parseInt(arguments.length <= 0 ? undefined : arguments[0]);
                handler = arguments.length <= 1 ? undefined : arguments[1];
                break;
            default:
                duration = parseInt(arguments.length <= 0 ? undefined : arguments[0]);
                easing = arguments.length <= 1 ? undefined : arguments[1];
                handler = arguments.length <= 2 ? undefined : arguments[2];
                break;
        }

        if (typeof handler !== 'function') {
            return false;
        }

        return duration === 0 ? loop : animate(duration, easing, handler);
    };

    /*
     *************************
     * 动画工具方法
     *************************
     */

    // 执行无限循环动画
    function loop(handler) {
        var begin = +new Date();

        request(function frame() {
            var lost = new Date() - begin,
                next = handler(lost);

            next !== false && request(frame);
        });

        return true;
    }

    // 执行限时动画
    function animate(duration, easing, handler) {
        easing = createEasing(easing);

        var begin = +new Date();

        request(function frame() {
            var lost = new Date() - begin,
                prog = lost / duration,
                next = void 0;

            prog = prog > 1 ? 1 : prog;
            next = handler(prog, easing(prog));
            prog < 1 && next !== false && request(frame);
        });

        return true;
    }

    // 缓动方法
    function createEasing(easing) {
        switch (easing) {
            case 'linear':
                return function (x) {
                    return x;
                };
            case 'ease-in-out':
                return function (x) {
                    return x - Math.sin(2 * Math.PI * x) / (2 * Math.PI);
                };
            case 'ease-in':
                return function (x) {
                    return Math.pow(x, 3);
                };
            case 'ease-out':
                return function (x) {
                    return Math.pow(x - 1, 3) + 1;
                };
            case 'back-in':
                return function (x) {
                    var s = 1.70158;return x * x * ((s + 1) * x - s);
                };
            case 'back-out':
                return function (x) {
                    x -= 1;var s = 1.70158;return x * x * ((s + 1) * x + s) + 1;
                };
            case 'elastic':
                return function (x) {
                    return x < 0.4 ? Math.pow(2.5 * x, 3) : Math.sin(5 * x * Math.PI) * Math.cos(0.5 * x * Math.PI) / 3 + 1;
                };
            case 'bounce':
                return function (x) {
                    var s = 7.5625,
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
                return function (x) {
                    return x;
                };
        }
    }

/***/ },
/* 6 */
/***/ function(module, exports) {

    'use strict';

    /*
     *************************
     * 抛出【touch】接口
     *************************
     */

    module.exports = function (paper) {
        var wrapper = paper.wrapper,
            touch;

        if (!wrapper.getAttribute('data-paper')) {

            wrapper.setAttribute('data-paper', 'true');
            touch = bindPaperTouchEvents(paper);

            wrapper.addEventListener('touchstart', touch.start);
            wrapper.addEventListener('touchmove', touch.move);
            wrapper.addEventListener('touchend', touch.end);
            wrapper.addEventListener('touchcancel', touch.end);
            wrapper.addEventListener('click', touch.click);
        }

        return paper;
    };

    /*
     *************************
     * 定义【touch】事件
     *************************
     */

    function bindPaperTouchEvents(paper) {
        var wrapper = paper.wrapper,
            events = paper.events,
            state = 'pending',
            data = [],
            rect;

        return {
            click: function click(e) {
                paper.pending && events.emit('click', paper, e);
                return false;
            },
            start: function start(e) {
                var touches = e.touches,
                    len = touches.length,
                    i = 0;

                data = [];
                rect = wrapper.getBoundingClientRect();

                for (; i < len; i++) {
                    data.push({
                        sx: touches[i].clientX - rect.left,
                        sy: touches[i].clientY - rect.top
                    });
                }

                if (len === 1) {

                    // 取消缩放
                    if (state === 'scale') {
                        events.emit('scaleend', paper, [data, e]);
                    }

                    // 开始移动
                    state = 'move';
                    events.emit('movestart', paper, [data, e]);
                } else if (len > 1) {

                    // 取消移动
                    if (state === 'move') {
                        events.emit('moveend', paper, [data, e]);
                    }

                    // 开始缩放
                    state = 'scale';
                    events.emit('scalestart', paper, [data, e]);
                }

                e.preventDefault();
                return false;
            },
            move: function move(e) {
                var touches = e.touches,
                    len = touches.length,
                    i = 0;

                for (; i < len; i++) {
                    if(data[i]) {
                        data[i].px = data[i].x || data[i].sx;
                        data[i].py = data[i].y || data[i].sy;
                        data[i].x = touches[i].clientX - rect.left;
                        data[i].y = touches[i].clientY - rect.top;
                    }
                }

                if (state) {
                    events.emit(state, paper, [data, e]);
                }

                e.preventDefault();
                return this;
            },
            end: function end(e) {
                var touches = e.touches,
                    len = touches.length,
                    i = 0;

                // 取消缩放
                if (state === 'scale') {
                    events.emit('scaleend', paper, [data, e]);
                }

                if (len === 1) {

                    // 开始移动
                    state = 'move';
                    events.emit('movestart', paper, [data, e]);
                } else if (len === 0) {

                    // 结束移动
                    if (state === 'move') {
                        events.emit('moveend', paper, [data, e]);
                    }
                }

                data = [];

                for (; i < len; i++) {
                    data.push({
                        x: touches[i].clientX - rect.left,
                        y: touches[i].clientY - rect.top
                    });
                }

                e.preventDefault();
                return false;
            }
        };
    }

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

    'use strict';

    var utils = __webpack_require__(2);

    /*
     *************************
     * 抛出【EventEmitter】接口
     *************************
     */

    module.exports = EventEmitter;

    /*
     *************************
     * 定义【EventEmitter】类
     *************************
     */

    function EventEmitter() {
        this.events = {};
    }

    /*
     *************************
     * 定义【EventEmitter】方法
     *************************
     */

    EventEmitter.prototype = {
        constructor: EventEmitter,
        on: function on(name, handler) {
            if (utils.isString(name) && utils.isFunction(handler)) {
                name in this.events ? this.events[name].push(handler) : this.events[name] = [handler];
            }

            return this;
        },
        off: function off(name, handler) {
            if (name === undefined) {
                this.events = {};
                return this;
            }

            if (utils.isString(name)) {
                if (handler === undefined) {
                    this.events[name] = [];
                    return this;
                }

                if (utils.isFunction(handler)) {
                    var list = this.events[name],
                        len = list.length;

                    while (len--) {
                        if (list[len] === handler) {
                            list.splice(len, 1);
                        }
                    }
                }
            }

            return this;
        },
        emit: function emit(name, target, args) {
            var list = this.events[name] || [],
                len = list.length,
                i = 0;

            if (!utils.isArray(args)) {
                args = [args];
            }

            for (; i < len; i++) {
                list[i].apply(target || this, args);
            }

            return this;
        }
    };

/***/ }
/******/ ])
});
;
