var proc = require('../');

console.dir(proc);

setInterval(function () {
    console.log('ts', Date.now());
    console.log('usage', proc.usage());
}, 2500);
