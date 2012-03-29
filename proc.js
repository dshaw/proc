/*!
 * proc
 * Copyright(c) 2012 Daniel D. Shaw <dshaw@dshaw.com>
 * MIT Licensed
 */

/**
 * Exports.
 */

function read_ts(buf, offset) {
    return buf.readInt32LE(offset) + (buf.readInt32LE(offset + 4) / 1000000000);
}

exports.usage = function usage(callback) {
    var fs = require("fs"), file, obj = {};

    file = fs.readFile("/proc/self/usage", function (err, buf) {
        if (err) {
            return callback(err);
        }

        obj.lwpid = buf.readUInt32LE(0);                // lwp id.  0: process or defunct
        obj.count = buf.readUInt32LE(4);                // number of contributing lwps
        obj.tstamp = read_ts(buf, 8) / obj.count;       // current time stamp
        obj.create = read_ts(buf, 16) / obj.count;      // process/lwp creation time stamp
        obj.term = read_ts(buf, 24) / obj.count;        // process/lwp termination time stamp
        obj.rtime = read_ts(buf, 32) / obj.count;       // total lwp real (elapsed) time
        obj.utime = read_ts(buf, 40) / obj.count;       // user level cpu time
        obj.stime = read_ts(buf, 48)  / obj.count;      // system call cpu time
        obj.ttime = read_ts(buf, 56) / obj.count;       // other system trap cpu time
        obj.tftime = read_ts(buf, 64) / obj.count;      // text page fault sleep time
        obj.dftime = read_ts(buf, 72) / obj.count;      // data page fault sleep time
        obj.kftime = read_ts(buf, 80) / obj.count;      // kernel page fault sleep time
        obj.ltime = read_ts(buf, 88) / obj.count;       // user lock wait sleep time
        obj.slptime = read_ts(buf, 96) / obj.count;     // all other sleep time
        obj.wtime = read_ts(buf, 104) / obj.count;      // wait-cpu (latency) time
        obj.stoptime = read_ts(buf, 112) / obj.count;   // stopped time
                                                        // filler for future expansion
        obj.minf = buf.readUInt32LE(168);               // minor page faults
        obj.majf = buf.readUInt32LE(172);               // major page faults
        obj.nswap = buf.readUInt32LE(176);              // swaps
        obj.inblk = buf.readUInt32LE(180);              // input blocks
        obj.outblk = buf.readUInt32LE(184);             // output blocks
        obj.msnd = buf.readUInt32LE(188);               // messages sent
        obj.mrcv = buf.readUInt32LE(192);               // messages received
        obj.sigs = buf.readUInt32LE(196);               // signals received
        obj.vctx = buf.readUInt32LE(200);               // voluntary context switches
        obj.ictx = buf.readUInt32LE(204);               // involuntary context switches
        obj.sysc = buf.readUInt32LE(208);               // system calls
        obj.ioch = buf.readUInt32LE(212);               // chars read and written
                                                        // filler for future expansion

        callback(null, obj);
    });
};
