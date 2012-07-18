/*!
 * parseProc
 * MIT Licensed
 */

var fs = require('fs'),
    destruct = require('destruct');

// Read time spec of a given buffer
function readTimespec(buf, offset) {
  return buf.readInt32LE(offset) + (buf.readInt32LE(offset + 4) / 1000000000);
}

/**
 * Generic proc parsing function
 *
 * @param file             file in proc to parse.  ex 'usage', 'psinfo', etc.
 * @param fmt              format for binary unpacking of the file
 * @param keys             keys to map to the resultant binary unpacking operation
 * @parama timespec_keys   keys to run the readTimespec function on
 * @param pid              pid of the process, defaults to 'self'
 * @param callback         callback with the results (err, res)
 */
module.exports.parseProc = function(file, fmt, keys, timespec_keys, pid, callback) {
  if (typeof pid === 'function') {
    callback = pid;
    pid = 'self';
  }

  fs.readFile('/proc/'+pid+'/'+file, function (err, buf) {
    if (err) return callback(err);

    // Unpack the values
    var unpacked = destruct.unpack(fmt, buf);

    // Merge the keys array with the unpacked values to make an associative array
    var ret = {};
    for (var i = 0; i < keys.length; i++) {
      ret[keys[i]] = unpacked[i];
    }

    // Delete padding
    delete ret['pad'];

    // Convert time specs
    timespec_keys.forEach(function(key) {
      ret[key] = readTimespec(ret[key], 0);
    });

    // Check for buffers that need to be toString'd
    keys.forEach(function(key) {
      ret[key] = (typeof ret[key] === 'object') ? ret[key].toString() : ret[key];
    });

    // Callback
    callback(null, ret);
  });
};
