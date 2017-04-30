js-size
=====================

[![Greenkeeper badge](https://badges.greenkeeper.io/lukekarrys/js-size.svg)](https://greenkeeper.io/)

[![NPM](https://nodei.co/npm/js-size.png)](https://nodei.co/npm/js-size/)
[![Build Status](https://travis-ci.org/lukekarrys/js-size.png?branch=master)](https://travis-ci.org/lukekarrys/js-size)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Get the size of some JS.

All sizes are shown gzipped using the [`gzip-size` module](https://www.npmjs.com/package/gzip-size). The gzipped size better represents what gets sent over-the-wire in a production application. It also provides a better baselines when comparing the original to the minified size.


## Install

```sh
npm install --save js-size
```


## Usage

```js
var jssize = require('js-size');
var b = browserify();
b.add('./lib/js-size.js');
b.bundle(function (err, js) {
    console.log(jssize(js));
    /*
    {
        original: '170.96 kB',
        minified: '77.19 kB',
        difference: '93.77 kB',
        percent: '45.15%'
    }
    */

    console.log(jssize.table(js));
    /*
    ┌─────────────────┬───────────┐
    │ Original (gzip) │ 170.96 kB │
    ├─────────────────┼───────────┤
    │ Minified (gzip) │ 77.19 kB  │
    ├─────────────────┼───────────┤
    │ Difference      │ 93.77 kB  │
    ├─────────────────┼───────────┤
    │ Percent         │ 45.15%    │
    └─────────────────┴───────────┘
    */
});
```


## API

### jssize(input)

#### input

*Required*  
Type: `string`, `buffer`

Returns the `original` and `minified` sizes and the `difference` and `percent` minified.

### jssize.table(input)

#### input

*Required*  
Type: `string`, `buffer`

Returns all the same table but formatted as a cli table.


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

  Example
    js-size index.js
    10.34 kB
```


## License

MIT © [Luke Karrys](http://lukekarrys.com)
