var jssize = require('../index');
var browserify = require('browserify');
var b = browserify();
b.add('./lib/js-size.js');
b.bundle(function (err, js) {
    console.log(jssize(js));
    console.log(jssize.table(js));
});