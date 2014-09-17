var gzip = require('gzip-size');
var pb = require('pretty-bytes');
var uglify = require('uglifyjs');
var Table = require('cli-table');


function round(value, exp) {
    value = value.toString().split('e');
    value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}

function s(str) {
    return gzip.sync(str);
}

function min(str) {
    return s(uglify.minify(str, {fromString: true}).code);
}

function dataToTable(arr) {
    var returnObj = [];
    Object.keys(arr).forEach(function (key) {
        var obj = {};
        obj[key.slice(0, 1).toUpperCase() + key.slice(1)] = arr[key];
        returnObj.push(obj);
    });
    return returnObj;
}

module.exports = function (asTable, data) {
    data = data.toString();

    var oSize = s(data);
    var mSize = min(data);

    var output = {
        original: pb(oSize),
        minified: pb(mSize),
        difference: pb(oSize - mSize),
        percent: round((mSize / oSize) * 100, -2) + '%'
    };

    if (asTable) {
        var table = new Table();
        table.push.apply(table, dataToTable(output));
        return table.toString();
    } else {
        return output;
    }
};