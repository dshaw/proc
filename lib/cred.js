/**
 * Parse /proc/<pid>/cred
 */
var parseProc = require('./lib').parseProc,
    keys = [ 'euid', 'ruid', 'suid', 'egid', 'rgid', 'sgid', 'ngroups',
    'groups' ];

module.exports = function(pid, callback) {
  parseProc('cred', 'iiiiiiii', keys, [], pid, callback);
};
