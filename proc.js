/*!
 * proc
 * Copyright(c) 2012 Daniel D. Shaw <dshaw@dshaw.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var fs = require('fs')
  , platform = require('os').platform()
  , tools = require('./lib/proc-tools')

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
    files.push('pids','pidsSync','stat')
    break
  case 'solaris':
    files.push('pids','pidsSync','usage')
    break
}

files.forEach(function (file) {
  if (~['files','version'].indexOf(file)) {
    return console.error("%s is a reserved property.", file)
  }
  if (exports[file]) {
    console.warn("%s already defined, overwriting.", file)
  }

  if (~['pids','pidsSync'].indexOf(file)) {
    exports[file] = tools[file]
  } else {
    exports[file] = require('./lib/'+file)
  }

})

if (files.length === 0) {
  throw new Error('proc not supported on ' + platform)
}