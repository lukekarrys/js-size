js-size
=====================

[![NPM](https://nodei.co/npm/js-size.png)](https://nodei.co/npm/js-size/)
[![Build Status](https://travis-ci.org/lukekarrys/js-size.png?branch=master)](https://travis-ci.org/lukekarrys/js-size)

Get the size of some JS.


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
        original: '165.18 kB',
        minified: '73.57 kB',
        difference: '91.61 kB',
        percent: '44.54%'
    }
    */

    console.log(jssize.table(js));
    /*
    ┌────────────┬───────────┐
    │ Original   │ 165.18 kB │
    ├────────────┼───────────┤
    │ Minified   │ 73.57 kB  │
    ├────────────┼───────────┤
    │ Difference │ 91.61 kB  │
    ├────────────┼───────────┤
    │ Percent    │ 44.54%    │
    └────────────┴───────────┘
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
