js-size
=====================

Get the size of some JS.

[![NPM](https://nodei.co/npm/js-size.png)](https://nodei.co/npm/js-size/)
[![Build Status](https://travis-ci.org/lukekarrys/js-size.png?branch=master)](https://travis-ci.org/lukekarrys/js-size)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Greenkeeper badge](https://badges.greenkeeper.io/lukekarrys/js-size.svg)](https://greenkeeper.io/)

All sizes are shown gzipped using the [`gzip-size` module](https://www.npmjs.com/package/gzip-size). The gzipped size better represents what gets sent over-the-wire in a production application. It also provides a better baselines when comparing the original to the minified size.


## Install

```sh
npm install --save js-size
```


## Usage

```js
const jssize = require('js-size')
require('./something-that-bundles-your-js').then((jsStr) => {
  console.log(jssize(js))
  // {
  //   original: '170.96 kB',
  //   minified: '77.19 kB',
  //   difference: '93.77 kB',
  //   percent: '45.15%'
  // }

  console.log(jssize.table(js))
  // ┌─────────────────┬───────────┐
  // │ Original (gzip) │ 170.96 kB │
  // ├─────────────────┼───────────┤
  // │ Minified (gzip) │ 77.19 kB  │
  // ├─────────────────┼───────────┤
  // │ Difference      │ 93.77 kB  │
  // ├─────────────────┼───────────┤
  // │ Percent         │ 45.15%    │
  // └─────────────────┴───────────┘
})
```


## API

### jssize(input, options)

#### input

*Required*  
Type: `string`, `buffer`

Returns the `original` and `minified` sizes and the `difference` and `percent` minified.

### jssize.table(input, options)

#### input

*Required*  
Type: `string`, `buffer`

Returns all the same table but formatted as a cli table.

### options (default, {})

#### `es` (default, false)

Whether to use [`uglify-es`](https://www.npmjs.com/package/uglify-es) or not.

#### Uglify options

All other keys are passed directly to [`uglify`](https://github.com/mishoo/UglifyJS2). See the [API Reference](https://github.com/mishoo/UglifyJS2#api-reference) for available options.



## CLI

```sh
$ npm install --global js-size
```

```sh
$ js-size

  Get the size of some JS.

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
```


## License

MIT © [Luke Karrys](http://lukekarrys.com)
