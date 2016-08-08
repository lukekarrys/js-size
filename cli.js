#!/usr/bin/env node

var jssize = require('./lib/js-size')
var fs = require('fs')
var concat = require('concat-stream')
var pkg = require('./package.json')
var argv = process.argv.slice(2)
var input = argv[0]

function help () {
  console.log([
    '',
    '  ' + pkg.description,
    '',
    '  Usage',
    '    js-size <file>',
    '    cat <file.js> | js-size',
    '',
    '  Example',
    '    js-size index.js',
    '    10.34 kB'
  ].join('\n'))
}

function report (data) {
  console.log(jssize(true, data))
}

if (argv.indexOf('--help') !== -1) {
  help()
  process.exit(0)
}

if (argv.indexOf('--version') !== -1) {
  console.log(pkg.version)
  process.exit(0)
}

if (process.stdin.isTTY) {
  if (!input) {
    help()
    process.exit(0)
  }
  fs.createReadStream(input).pipe(concat(report))
} else {
  process.stdin.pipe(concat(report))
}
