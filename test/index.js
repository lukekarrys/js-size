const test = require('tape')
const fs = require('fs')
const path = require('path')
const execa = require('execa')
const jssize = require('..')

const fixture = './node_modules/jquery/dist/jquery.slim.js'

const testP = (name, cb) => test(name, (t) => cb(t)
  .then(() => t.end())
  .catch((err) => (t.notOk(err), t.end())) // eslint-disable-line no-sequences
)

const parseTable = (output) => output
  .split('\n')
  .filter((s) => /\w/.test(s))
  .map((s) => s.split('│').map((s) => s.trim()).filter(Boolean))

test('programmatic api', (t) => {
  const code = fs.readFileSync(path.resolve(__dirname, '..', fixture))

  const size = jssize(code)
  const table = jssize.table(code)

  Object.keys(size).forEach((key) => {
    const value = size[key]
    const num = parseFloat(value)

    t.equal(typeof num, 'number')
    t.equal(isNaN(num), false)
    t.ok(num > 0)
    t.ok(table.indexOf(value) > -1)
    t.ok((key === 'percent' ? /%$/ : /\skB$/).test(value))
  })

  t.end()
})

testP('works with a file', (t) => execa('./lib/cli.js', [fixture]).then((output) => {
  const stdout = output.stdout
  const data = parseTable(stdout)

  t.ok(stdout.indexOf(' Original (gzip) ') > -1)
  t.ok(stdout.indexOf(' Minified (gzip) ') > -1)
  t.ok(stdout.indexOf(' Difference ') > -1)
  t.ok(stdout.indexOf(' Percent ') > -1)

  t.equal(data[0][0], 'Original (gzip)')
  t.equal(data[1][0], 'Minified (gzip)')
  t.equal(data[2][0], 'Difference')
  t.equal(data[3][0], 'Percent')

  t.ok(data[0][1].match(/\d+\.?\d? kB/))
  t.ok(data[1][1].match(/\d+\.?\d? kB/))
  t.ok(data[2][1].match(/\d+\.?\d? kB/))
  t.ok(data[3][1].match(/\d+\.?\d?%/))
}))

testP('works with stdin', (t) => execa('./lib/cli.js', [], { input: fs.createReadStream(fixture) }).then((output) => {
  const stdout = output.stdout
  const data = parseTable(stdout)

  t.ok(stdout.indexOf(' Original (gzip) ') > -1)
  t.ok(stdout.indexOf(' Minified (gzip) ') > -1)
  t.ok(stdout.indexOf(' Difference ') > -1)
  t.ok(stdout.indexOf(' Percent ') > -1)

  t.equal(data[0][0], 'Original (gzip)')
  t.equal(data[1][0], 'Minified (gzip)')
  t.equal(data[2][0], 'Difference')
  t.equal(data[3][0], 'Percent')

  t.ok(data[0][1].match(/\d+\.?\d? kB/))
  t.ok(data[1][1].match(/\d+\.?\d? kB/))
  t.ok(data[2][1].match(/\d+\.?\d? kB/))
  t.ok(data[3][1].match(/\d+\.?\d?%/))
}))
