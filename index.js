const Continuous = require('./lib/continuous');
const Disposable = require('./lib/disposable');

function Queue(type, options) {
    const list = {
        continuous: Continuous,
        disposable: Disposable
    };

    if (typeof type !== 'string' || !list[type]) {
        console.log('The param class name is error.');
        return;
    }

    if (!options || typeof options !== 'object') {
        options = {};
    }

    return new list[type](options);
}

module.exports = Queue;