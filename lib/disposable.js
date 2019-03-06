const events = require('events');
const util = require('util');

/**
 * 一次性批量队列控制
 * Author by Scot wang
 * 2019-03-05
 * @param options {{interval: 间隔毫秒, retryCount: 重试次数, successConditions: 成功条件百分比}}
 * @constructor
 */

function Disposable(options) {
    const _this = this;
    var _list = [];
    var _controller = null;
    var _count = 0;
    var status = {
        successful: [],
        failed: []
    };

    options = {
        interval: options.interval || 1000,
        retryCount: options.retryCount || 3,
        successConditions: options.successConditions || 100
    };

    /**
     * 开始队列执行
     * @param list {array} - 需要执行的队列数组
     * @param controller {function} - 队列中每个元素执行的函数
     */
    this.done = function (list, controller) {
        if (typeof list !== 'object' || list.length <= 0) {
            return;
        }

        if (!controller || typeof controller !== 'function') {
            return;
        }

        _list = list;
        _controller = controller;
        next();
    };

    //下一条
    function next() {
        if (_list.length <= 0) {
            var successRate = status.successful.length / (status.successful.length + status.failed.length) * 100;
            if (successRate >= options.successConditions) {
                _this.emit('success', status.successful);
            } else {
                _this.emit('failed', status.failed);
            }
            _controller = null;
            return;
        }

        var current = _list.shift();
        _count = 0;
        loop(current);
    }

    //遍历
    function loop(current) {
        _this.emit('begin', current);
        _controller(current, function (error) {
            if (error) {
                setTimeout(function () {
                    retry(error, current);
                }, options.interval);
                return;
            }
            status.successful.push(current);
            _this.emit('end', error, current);
            setTimeout(next, options.interval);
        });
    }

    //重试
    function retry(error, current) {
        if (_count >= options.retryCount) {
            status.failed.push(current);
            _this.emit('end', error, current);
            setTimeout(next, options.interval);
            return;
        }
        _count++;
        loop(current);
    };
}

util.inherits(Disposable, events.EventEmitter);
module.exports = Disposable;
