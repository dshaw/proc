/*!
 * proc
 * Copyright(c) 2012 Daniel D. Shaw <dshaw@dshaw.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var platform = require('os').platform()

/**
 * Exports.
 */

var files = []

exports.files = files
exports.version = require('./package.json').version

/**
 * Procfs support
 */

switch (platform) {
  case 'linux':
    //files.push('stat')
    break
  case 'solaris': default:
    files.push('usage')
    break
}

files.forEach(function (file) {
  if (~['files','version'].indexOf(file)) {
    return console.error("%s is a reserved property.", file)
  }
  if (exports[file]) {
    console.warn("%s already defined, overwriting.", file)
  }

  exports[file] = require('./lib/'+file)
})

if (file.length === 0) {
  throw new Error('proc not supported on ' + platform)
}