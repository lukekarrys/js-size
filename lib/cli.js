#!/usr/bin/env node

const jssize = require('./index')
const fs = require('fs')
const concat = require('concat-stream')
const pkg = require('../package.json')
const argv = process.argv.slice(2)
const input = argv[0]

const help = `
  ${pkg.description}

  Usage
    js-size <file>
    cat <file.js> | js-size

  Example
    js-size index.js
    ┌─────────────────┬────────┐
    │ Original (gzip) │ 588 B  │
    ├─────────────────┼────────┤
    │ Minified (gzip) │ 446 B  │
    ├─────────────────┼────────┤
    │ Difference      │ 142 B  │
    ├─────────────────┼────────┤
    │ Percent         │ 75.85% │
    └─────────────────┴────────┘
`

// eslint-disable-next-line no-sequences
const exit = (message, code) => (console[code ? 'error' : 'log'](message), process.exit(code || 0))

if (argv.indexOf('--help') > -1) exit(help)
if (argv.indexOf('--version') > -1) exit(pkg.version)
if (!input && process.stdin.isTTY) exit(help)

const source = input ? fs.createReadStream(input) : process.stdin
source.pipe(concat((data) => console.log(jssize.table(data))))
