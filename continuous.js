/**
 * 持续队列控制
 * Author by Scot wang
 * 2019-03-05
 */

function Queue(options) {
    var HANDLER = null;
    var timer = null;
    var retryCount = 0;
    var _list = [[], [], []];
    var options = {
        interval: options.interval || 1000,
        retryCount: options.retryCount || 0,
        timeout: options.timeout || 60000
    };

    this.setHandler = function (handler) {
        if (!handler || typeof handler !== 'function') {
            console.log('setHandler param must be a function.');
            return;
        }
        HANDLER = handler;
    };

    this.add = function (data, option, callback) {
        if (typeof option === 'function' && !callback) {
            callback = option;
        }

        var count = option.count || 1;
        var priority = option.priority || 2; //{1: high, 2: normal, 3: low}

        _list.push[priority - 1]({
            data: data, //数据
            count: count, //响应次数
            callback: callback //回调函数
        });

        var totalLength = _list[0].length + _list[1].length + _list[2].length;
        if (totalLength === 1) {
            next();
        }
    };

    function next() {
        var current = {};
        var totalLength = _list[0].length + _list[1].length + _list[2].length;

        if (totalLength <= 0) {
            return;
        }

        if (_list[0].length > 0) {
            current = _list[0].shift();
        } else if (_list[1].length > 0) {
            current = _list[1].shift();
            return;
        } else if (_list[2].length > 0) {
            current = _list[2].shift();
            return;
        }

        if (Object.keys(current).length === 0) {
            return;
        }

        done(current);
    }

    function done(current) {
        if (!HANDLER) {
            console.log('Queue has no handler is setting.');
            current.callback || current.callback('队列模块没有设置执行函数');
            return;
        }

        var responseCount = 0;
        clearTimeout(timer);
        timer = setTimeout(function () {
            if (responseCount < current.count) {
                retry('队列返回超时', current);
            }
        }, options.timeout);

        HANDLER(current.data, function (error, data) {
            responseCount++;
            if (responseCount < current.count) {
                return;
            }
            clearTimeout(timer);
            if (!error) {
                current.callback && current.callback(null, data);
                setTimeout(next, options.interval);
            } else {
                setTimeout(function () {
                    retry(current, current.data);
                }, options.interval);
            }
        });
    }

    function retry(error, current) {
        if (retryCount >= options.retryCount) {
            current.callback && current.callback(error);
            setTimeout(next, options.interval);
            return;
        }
        retryCount++;
        done(current);
    }
}

module.exports = Queue;