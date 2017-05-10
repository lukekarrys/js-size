const test = require('tape')
const fs = require('fs')
const path = require('path')
const execa = require('execa')
const jssize = require('..')

const fixture = './node_modules/jquery/dist/jquery.slim.js'
const esFixture = './lib/index.js'

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

test('works with uglify-es', (t) => {
  const code = fs.readFileSync(path.resolve(__dirname, '..', esFixture))

  const size = jssize(code, { es: true })
  const sizeNoMangle = jssize(code, { es: true, mangle: false })

  t.equal(size.original, sizeNoMangle.original)
  t.notEqual(size.minified, sizeNoMangle.minified)
  t.notEqual(size.difference, sizeNoMangle.difference)
  t.notEqual(size.percent, sizeNoMangle.percent)

  t.ok(parseFloat(size.original) === parseFloat(sizeNoMangle.original))
  t.ok(parseFloat(size.minified) < parseFloat(sizeNoMangle.minified))
  t.ok(parseFloat(size.difference) > parseFloat(sizeNoMangle.difference))
  t.ok(parseFloat(size.percent) < parseFloat(sizeNoMangle.percent))

  Object.keys(size).forEach((key) => {
    const value = size[key]
    const num = parseFloat(value)

    t.equal(typeof num, 'number')
    t.equal(isNaN(num), false)
    t.ok(num > 0)
    t.ok((key === 'percent' ? /%$/ : /\sB$/).test(value))
  })

  Object.keys(sizeNoMangle).forEach((key) => {
    const value = sizeNoMangle[key]
    const num = parseFloat(value)

    t.equal(typeof num, 'number')
    t.equal(isNaN(num), false)
    t.ok(num > 0)
    t.ok((key === 'percent' ? /%$/ : /\sB$/).test(value))
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

testP('works with stdin and es', (t) => Promise.all([
  execa('./lib/cli.js', ['--es'], { input: fs.createReadStream(esFixture) }),
  execa('./lib/cli.js', ['--es', '--config', './test/uglify.json'], { input: fs.createReadStream(esFixture) })
]).then((parts) => {
  const stdout = parts[0].stdout
  const data = parseTable(stdout)
  const stdoutES = parts[1].stdout
  const dataES = parseTable(stdoutES)

  t.ok(stdout.indexOf(' Original (gzip) ') > -1)
  t.ok(stdout.indexOf(' Minified (gzip) ') > -1)
  t.ok(stdout.indexOf(' Difference ') > -1)
  t.ok(stdout.indexOf(' Percent ') > -1)

  t.ok(stdoutES.indexOf(' Original (gzip) ') > -1)
  t.ok(stdoutES.indexOf(' Minified (gzip) ') > -1)
  t.ok(stdoutES.indexOf(' Difference ') > -1)
  t.ok(stdoutES.indexOf(' Percent ') > -1)

  t.equal(data[0][0], 'Original (gzip)')
  t.equal(data[1][0], 'Minified (gzip)')
  t.equal(data[2][0], 'Difference')
  t.equal(data[3][0], 'Percent')

  t.equal(dataES[0][0], 'Original (gzip)')
  t.equal(dataES[1][0], 'Minified (gzip)')
  t.equal(dataES[2][0], 'Difference')
  t.equal(dataES[3][0], 'Percent')

  t.ok(data[0][1].match(/\d+\.?\d? B/))
  t.ok(data[1][1].match(/\d+\.?\d? B/))
  t.ok(data[2][1].match(/\d+\.?\d? B/))
  t.ok(data[3][1].match(/\d+\.?\d?%/))

  t.ok(dataES[0][1].match(/\d+\.?\d? B/))
  t.ok(dataES[1][1].match(/\d+\.?\d? B/))
  t.ok(dataES[2][1].match(/\d+\.?\d? B/))
  t.ok(dataES[3][1].match(/\d+\.?\d?%/))

  t.ok(parseFloat(data[0][1]) === parseFloat(dataES[0][1]))
  t.ok(parseFloat(data[1][1]) < parseFloat(dataES[1][1]))
  t.ok(parseFloat(data[2][1]) > parseFloat(dataES[2][1]))
  t.ok(parseFloat(data[3][1]) < parseFloat(dataES[3][1]))
}))
