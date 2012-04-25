#!/usr/bin/env node
;(function () { // wrapper in case we're in module_context mode

  process.title = 'proc' // set process title

  var proc = require('../proc.js')
    , args = Array.prototype.splice.call(process.argv, 2)
    , cmd = args.shift()

  args.push(cb)

  if (proc[cmd]) {
    if (typeof proc[cmd] === 'function') {
      proc[cmd].apply(proc, args)
    } else {
      cb(null, proc[cmd])
    }
  } else {
    cb(null, help())
  }

})()

/**
 * help
 */

function help (cmd) {
  return [
      'usage:'
    , '   proc [command] [pid]'
    , ''
    , 'examples:'
    , '   proc usage 10008'
    , '   proc version'
  ].join('\n')
}

/**
 * Callback handler
 */

function cb (err, data) {
  if (err) console.error(err)
  if (data) console.log((typeof data === "string") ? data : JSON.stringify(data))
}
