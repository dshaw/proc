/*!
 * proc
 * Copyright(c) 2012 Daniel D. Shaw <dshaw@dshaw.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var fs = require('fs')
  , tools = require('./proc-tools')

/**
 * Exports.
 */

module.exports = usage

/**
 * Usage - `man proc` /prusage
 *
 * @param pid
 * @param callback
 * @os solaris
 */

function usage (pid, callback) {
  if (typeof pid === 'function') {
    callback = pid;
    pid = 'self';
  }
  
  fs.readFile('/proc/'+pid+'/usage', function (err, buf) {
    if (err) return callback(err);

    var data = {};
    data.lwpid = buf.readUInt32LE(0);                    // lwp id.  0: process or defunct
    data.count = buf.readUInt32LE(4);                    // number of contributing lwps
    data.tstamp = tools.readTimespec(buf, 8);                  // current time stamp
    data.create = tools.readTimespec(buf, 16) / data.count;    // process/lwp creation time stamp
    data.term = tools.readTimespec(buf, 24) / data.count;      // process/lwp termination time stamp
    data.rtime = tools.readTimespec(buf, 32) / data.count;     // total lwp real (elapsed) time
    data.utime = tools.readTimespec(buf, 40);                  // user level cpu time
    data.stime = tools.readTimespec(buf, 48);                  // system call cpu time
    data.ttime = tools.readTimespec(buf, 56);                  // other system trap cpu time
    data.tftime = tools.readTimespec(buf, 64);                 // text page fault sleep time
    data.dftime = tools.readTimespec(buf, 72);                 // data page fault sleep time
    data.kftime = tools.readTimespec(buf, 80);                 // kernel page fault sleep time
    data.ltime = tools.readTimespec(buf, 88);                  // user lock wait sleep time
    data.slptime = tools.readTimespec(buf, 96);                // all other sleep time
    data.wtime = tools.readTimespec(buf, 104);                 // wait-cpu (latency) time
    data.stoptime = tools.readTimespec(buf, 112);              // stopped time
                                                         // filler for future expansion
    data.minf = buf.readUInt32LE(168);                   // minor page faults
    data.majf = buf.readUInt32LE(172);                   // major page faults
    data.nswap = buf.readUInt32LE(176);                  // swaps
    data.inblk = buf.readUInt32LE(180);                  // input blocks
    data.outblk = buf.readUInt32LE(184);                 // output blocks
    data.msnd = buf.readUInt32LE(188);                   // messages sent
    data.mrcv = buf.readUInt32LE(192);                   // messages received
    data.sigs = buf.readUInt32LE(196);                   // signals received
    data.vctx = buf.readUInt32LE(200);                   // voluntary context switches
    data.ictx = buf.readUInt32LE(204);                   // involuntary context switches
    data.sysc = buf.readUInt32LE(208);                   // system calls
    data.ioch = buf.readUInt32LE(212);                   // chars read and written
                                                         // filler for future expansion
    callback(null, data);
  });
};
