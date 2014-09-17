#!/usr/bin/env node

var jssize = require('./lib/js-size');

// If this file is required then export our constructor
if (module.parent) {
    module.exports = jssize.bind(jssize, false);
    module.exports.table = jssize.bind(jssize, true);
    return;
}

var fs = require('fs');
var concat = require('concat-stream');
var pkg = require('./package.json');
var argv = process.argv.slice(2);
var input = argv[0];

function help() {
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
    ].join('\n'));
}

function report(data) {
    console.log(jssize(true, data));
}

if (argv.indexOf('--help') !== -1) {
    return help();
}

if (argv.indexOf('--version') !== -1) {
    return console.log(pkg.version);
}

if (process.stdin.isTTY) {
    if (!input) return help();
    fs.createReadStream(input).pipe(concat(report));
} else {
    process.stdin.pipe(concat(report));
}
