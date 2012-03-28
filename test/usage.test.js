var net = require('net')
  , usage = require('..');

var msnd = usage.msnd()
  , ioch = usage.ioch();

console.dir(usage);

var client;

for (var i=0; i < 3; i++) {
  client = net.connect(80, 'google.com', function() { //'connect' listener
    console.log('client connected');
    client.write('world!\r\n');
  });
  client.on('data', function(data) {
    //console.log(data.toString(), 'msnd', msnd, 'ioch', ioch);
    console.log('msnd', msnd, 'ioch', ioch);
    client.end();
  });
  client.on('end', function() {
    console.log('client disconnected');
    console.log('msnd', msnd, 'ioch', ioch);
  });
}