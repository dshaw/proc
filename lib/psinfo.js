/*!
 * psinfo
 * MIT Licensed
 * reference: http://src.illumos.org/source/xref/illumos-gate/usr/src/uts/common/sys/procfs.h#275
 *
 */

var fs = require('fs');

function readTimespec(buf, offset) {
  return buf.readInt32LE(offset) + (buf.readInt32LE(offset + 4) / 1000000000);
}

module.exports = function(pid, callback) {
  if (typeof pid === 'function') {
    callback = pid;
    pid = 'self';
  }

  fs.readFile('/proc/'+pid+'/psinfo', function (err, buf) {
    if (err) return callback(err);

    var data = {}, offset = 0;
    data.flag = buf.readInt32LE(offset); offset+=4;            /* process flags (DEPRECATED; do not use) */
    data.nlwp = buf.readInt32LE(offset); offset+=4;            /* number of active lwps in the process */
    data.pid = buf.readInt32LE(offset); offset+=4;             /* unique process id */
    data.ppid = buf.readInt32LE(offset); offset+=4;            /* process id of parent */
    data.pgid = buf.readInt32LE(offset); offset+=4;            /* pid of process group leader */
    data.sid = buf.readInt32LE(offset); offset+=4;             /* session id */
    data.uid = buf.readInt32LE(offset); offset+=4;             /* real user id */
    data.euid = buf.readInt32LE(offset); offset+=4;            /* effective user id */
    data.gid = buf.readInt32LE(offset); offset+=4;             /* real group id */
    data.egid = buf.readInt32LE(offset); offset+=4;            /* effective group id */
    data.addr = buf.readUInt32LE(offset); offset+=4;           /* address of process */
    data.size = buf.readInt32LE(offset); offset+=4;            /* size of process image in Kbytes */
    data.rssize = buf.readInt32LE(offset); offset+=4;          /* resident set size in Kbytes */
    offset += 4;                                               /* pad1 */
    data.ttydev = buf.readInt32LE(offset); offset+=4;          /* controlling tty device (or PRNODEV) */
                                          /* The following percent numbers are 16-bit binary */
                                          /* fractions [0 .. 1] with the binary point to the */
                                          /* right of the high-order bit (1.0 == 0x8000) */
    data.pctcpu = buf.readUInt16LE(offset); offset+=2;         /* % of recent cpu time used by all lwps */
    data.pctmem = buf.readUInt16LE(offset); offset+=2;         /* % of system memory used by process */
    data.start = readTimespec(buf, offset); offset+=8;         /* process start time, from the epoch */
    data.time = readTimespec(buf, offset); offset+=8;          /* usr+sys cpu time for this process */
    data.ctime = readTimespec(buf, offset); offset+=8;         /* usr+sys cpu time for reaped children */
    data.fname = buf.toString('ascii', offset, offset+=16)     /* name of execed file */
      .split('\u0000')[0];
    data.psargs = buf.toString('ascii', offset, offset+=80)    /* initial characters of arg list */
      .split('\u0000')[0];
    data.wstat = buf.readInt32LE(offset); offset+=4;           /* if zombie, the wait() status */
    data.argc = buf.readInt32LE(offset); offset+=4;            /* initial argument count */
    data.argv = buf.readUInt32LE(offset); offset+=4;           /* address of initial argument vector */
    data.envp = buf.readUInt32LE(offset); offset+=4;           /* address of initial environment vector */
    data.dmodel = buf.toString('ascii', offset, offset+=1);    /* data model of the process */
    offset += 3;                                               /* pad2 */
    data.taskid = buf.readInt32LE(offset); offset+=4;          /* task id */
    data.projid = buf.readInt32LE(offset); offset+=4;          /* project id */
    data.nzomb = buf.readInt32LE(offset); offset+=4;           /* number of zombie lwps in the process */
    data.poolid = buf.readInt32LE(offset); offset+=4;          /* pool id */
    data.zoneid = buf.readInt32LE(offset); offset+=4;          /* zone id */
    data.contract = buf.readInt32LE(offset); offset+=4;        /* process contract */
    offset += 1;                                               /* filler */

    callback(null, data);
  });
};
