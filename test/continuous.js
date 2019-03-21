const Controlq = require('../index');
const list = [
	{
		data: '112233',
		priority: 3,
		count: 2
	},
	{
		data: '445566',
		priority: 2,
		count: 1
	},
	{
		data: '778899',
		priority: 1,
		count: 1
	}
];

const cq = new Controlq('continuous', {interval: 3000, retryCount: 1, timeout: 5000});//实例

cq.done(function (data, callback) {
	console.log(new Date());
	console.log('正在执行：', data);
	callback(null, '000000');
})

for(var i=0; i<list.length; i++){
	cq.add(list[i].data, {priority: list[i].priority, count: list[i].count}, function (error, data) {
		console.log('执行结束', error || '成功', data || '');
	});
}
