# controlq

[TOC]



## Features

- NodeJS队列管理模块
- 支持多中业务场景



## Install

```
npm install controlq
```



## Node Support

NodeJs V0.12.17以上版本



## new Controlq(type, options)

```
const Controlq = require('controlq');
const options = {interval: 0, retryCount: 0, successConditions: 100};
var cq = new Controlq('disposable', options);
```



### type

- disposable: 按批次执行一个队列，可以实时监听每个元素的运行状态和结果，队列执行完成即可得到整体结果
- continuous：一个可持续追加的队列实例，可以实时监听每个元素的运行状态和结果，没有队列整体运行结果。可以配置队列中每个元素的优先级和运行一次期望得到几次响应次数

### options

- interval: 队列每个元素运行所间隔的毫秒数,默认为0
- retryCount: 队列每个元素执行失败后需要重试的次数，默认为0，不重试
- successConditions：仅在disposable类下生效，队列运行完成后，判定本批次队列运行结果成功的百分比数，默认100，必须每个都成功才判定成功。



## disposable

### 事件

#### begin

```
cq.on('begin', function (data) {
    console.log(data);
})
```



- data: 当前准备执行的队列元素

#### end

```
cq.on('end', function (error, data) {
    console.log(error, data);
})
```



- error: 执行结果的错误消息，可参考nodejs传参语法，error为null或者undefined即代表成功，否则代表结果失败
- data：当前执行结束的队列元素

#### success

```
cq.on('success', function (data) {
    console.log(data);
})
```



- data: 数组，代表执行成功的队列元素集合

#### failed

```
cq.on('failed', function (data) {
    console.log(data);
})
```



- data: 数组，代表执行失败的队列元素集合

### 方法

#### done(list, controller)

- list: 数组，需要批量执行的队列集合
- controller: 函数方法，队列运行所执行的回调方法。会把队列中每一个元素传递到方法中进行执行



```
//队列开始执行
var LIST = [1, 2, 3, 5, 7, 9];
cq.done(LIST, function (data, callback) {
	//此方法体为用户业务层代码
	//data为队列逐个遍历的元素 1 || 2 || 3 || 5 || 7 || 9
    console.log('正在执行', data);
    callback('控制失败');//成功则不传参数
});
```



## continuous

### 事件

### 方法

