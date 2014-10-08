var Lab = require('lab');
var lab = exports.lab = Lab.script();
var jssize = require('../index');
var browserify = require('browserify');


lab.experiment('As module', function () {
    lab.test('Browserify', function (done) {
        var b = browserify();
        b.add('./lib/js-size.js');
        b.bundle(function (err, js) {
            var data = jssize(js);
            Lab.expect(data.original, 'original').to.equal('165.2 kB');
            Lab.expect(data.minified, 'minified').to.equal('73.63 kB');
            Lab.expect(data.difference, 'difference').to.equal('91.58 kB');
            Lab.expect(data.percent, 'percent').to.equal('44.57%');
            done();
        });
    });

    lab.test('As table', function (done) {
        var b = browserify();
        b.add('./lib/js-size.js');
        b.bundle(function (err, js) {
            var data = jssize.table(js);
            Lab.expect(data.indexOf('165.2 kB')).to.not.equal(-1);
            Lab.expect(data.indexOf('73.63 kB')).to.not.equal(-1);
            Lab.expect(data.indexOf('91.58 kB')).to.not.equal(-1);
            Lab.expect(data.indexOf('44.57%')).to.not.equal(-1);
            done();
        });
    });
});
