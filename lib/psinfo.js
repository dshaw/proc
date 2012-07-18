/*!
 * psinfo
 * MIT Licensed
 * reference: http://src.illumos.org/source/xref/illumos-gate/usr/src/uts/common/sys/procfs.h#275
 */

var parseProc = require('./lib').parseProc,
    timespec_keys = [ 'ctime', 'time', 'start' ],
    keys = ['flag', 'nlwp', 'pid', 'ppid', 'pgid', 'sid', 'uid', 'euid', 'gid',
    'egid', 'addr', 'size', 'rssize', 'pad', 'ttydev', 'pctcpu', 'pctmem', 'start',
    'time', 'ctime', 'fname', 'psargs', 'wstat', 'argc', 'argv', 'envp',
    'dmodel', 'pad', 'taskid', 'projid', 'nzomb', 'poolid', 'zoneid', 'contract', 'filler'];

module.exports = function(pid, callback) {
  parseProc('psinfo', 'iiiiiiiiiiIiiiiSSa8a8a8Z16Z80iiIIaa3iiiiii', keys, timespec_keys, pid, callback);
};
