/*!
 * proc
 * Copyright(c) 2012 Daniel D. Shaw <dshaw@dshaw.com>
 * MIT Licensed
 */

/**
 * Exports.
 */

exports.readTimespec = readTimespec
exports.pids = pids
exports.pidsSync = pidsSync

/**
 * Read timespec struct
 *
 * @param buffer
 * @param offset
 * @return {Number}
 */
function readTimespec(buffer, offset) {
  return buffer.readInt32LE(offset) + (buffer.readInt32LE(offset + 4) / 1000000000);
}

/**
 * pids
 *
 * @param callback
 */

function pids (callback) {
  fs.readdir('/proc/', callback)
}

/**
 * Sync version of pids
 */

function pidsSync () {
  return fs.readdirSync('/proc/')
}

