var proc = require('..');

console.dir(proc);

setInterval(function () {
    proc.usage(function (err, data) {
        console.log('ts', Date.now());
        console.log('err', err);
        console.log('usage', data);
    });
}, 2500);

