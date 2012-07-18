/*!
 * proc
 * Copyright(c) 2012 Daniel D. Shaw <dshaw@dshaw.com>
 * MIT Licensed
 */

var parseProc = require('./lib').parseProc,
    timespec_keys = [ 'tstamp', 'create', 'term', 'rtime', 'utime', 'stime',
    'ttime', 'tftime', 'dftime', 'kftime', 'ltime', 'slptime', 'wtime',
    'stoptime' ],
    keys = ['lwpid', 'count', 'tstamp', 'create', 'term', 'rtime', 'utime',
    'stime', 'ttime', 'tftime', 'dftime', 'kftime', 'ltime', 'slptime',
    'wtime', 'stoptime', 'pad', 'minf', 'majf', 'nswap', 'inblk',
    'outblk', 'msnd', 'mrcv', 'sigs', 'vctx', 'ictx', 'sysc', 'ioch',
    'pad'];

module.exports = function(pid, callback) {
  if (typeof pid === 'function') {
    callback = pid;
    pid = 'self';
  }
  parseProc('psinfo', 'iia8a8a8a8a8a8a8a8a8a8a8a8a8a8a48LLLLLLLLLLLLa40', keys, timespec_keys, pid, function(err, res) {
    if (err) return callback(err);

    // divide by #lwp
    res.create = res.create / res.count;
    res.term = res.term / res.count;
    res.rtime = res.rtime / res.count;

    callback(null, res);
  });
};
