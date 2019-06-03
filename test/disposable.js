const Controlq = require('../index');
const LIST = [1, 3, 5, 7, 9];//需要批量执行的队列

const cq = new Controlq('disposable', {interval: 2000, retryCount: 1, successConditions: 100});//实例

//成功后触发
cq.on('success', function (data) {
    console.log('批量执行成功: ', data);
});

//失败后触发
cq.on('failed', function (data) {
    console.log('批量执行失败: ', data);
});

//开始执行触发
cq.on('begin', function (data) {
    console.log('开始执行：', data);
});

//执行结束触发
cq.on('end', function (error, data) {
    console.log(data, '执行结果：', error || 'success');
});

//队列开始执行
cq.done(LIST, function (id, callback) {
    console.log(new Date());
    console.log('正在执行队列元素:', id);
    callback();
});

// setTimeout(function () {
//     console.log('暂停队列15秒', new Date());
//     cq.pause();
//     setTimeout(function () {
//         console.log('继续执行队列', new Date());
//         cq.resume();
//     }, 15000)
// }, 5000);

setTimeout(function () {
    var result = cq.cancel();
    console.log('取消正在执行的队列', result);
}, 5000);


