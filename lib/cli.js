#!/usr/bin/env node

'use strict'

const jssize = require('./index')
const fs = require('fs')
const path = require('path')
const meow = require('meow')
const concat = require('concat-stream')
const json = (p) => !p ? {} : JSON.parse(fs.readFileSync(path.resolve(process.cwd(), p)))

const cli = meow(`
  Usage
    js-size <file>
    cat <file.js> | js-size

  Options
    --config, -c Path to json config file to use for uglify options
    --es, -e Use uglify-es

  Example
    js-size index.js --es
    ┌─────────────────┬────────┐
    │ Original (gzip) │ 588 kB │
    ├─────────────────┼────────┤
    │ Minified (gzip) │ 446 kB │
    ├─────────────────┼────────┤
    │ Difference      │ 142 kB │
    ├─────────────────┼────────┤
    │ Percent         │ 75.85% │
    └─────────────────┴────────┘
`, {
  alias: { c: 'config', e: 'es' }
})

const flags = cli.flags
const input = cli.input[0]
const options = Object.assign({ es: flags.es }, json(flags.config))

if (!input && process.stdin.isTTY) cli.showHelp()

const source = input ? fs.createReadStream(input) : process.stdin
source.pipe(concat((data) => console.log(jssize.table(data, options))))
