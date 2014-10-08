var exec = require('child_process').exec;
var Lab = require('lab');
var lab = exports.lab = Lab.script();



lab.experiment('CLI', function () {
    lab.test('Pipe', function (done) {
        var cmd = './node_modules/.bin/browserify lib/js-size.js | ./index.js';
        var output = [
            'Original',
            'Minifed',
            'Difference',
            'Percent',
            '165.2 kB',
            '73.63 kB',
            '91.58 kB',
            '44.57%'
        ];

        exec(cmd, {cwd: process.cwd()}, function (error, stdout, stderr) {
            Lab.expect(stderr, 'stderr').to.equal('');
            Lab.expect(error, 'error').to.equal(null);
            output.forEach(function (o) {
                Lab.expect(stdout.indexOf(o), 'stdout').to.not.equal('-1');
            });
            done();
        });
    });
});
