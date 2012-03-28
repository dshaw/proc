var usage = require('../');

console.dir(usage);

for (var i=0; i < 10; i++) {
  console.log('ts', Date.now(), 'i', i);
  console.log('usage', usage.usage());
  console.log('msnd', usage.msnd());
  console.log('mrcv', usage.mrcv());
  console.log('ioch', usage.ioch());
}