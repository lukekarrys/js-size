const gzip = require('gzip-size')
const pb = require('pretty-bytes')
const uglify = require('uglify-js')
const uglifyES = require('uglify-es')
const Table = require('cli-table')

const omit = (obj, keys) => Object.keys(obj).reduce((acc, key) => {
  if (keys.indexOf(key) === -1) acc[key] = obj[key]
  return acc
}, {})

const round = (value, exp) => {
  value = value.toString().split('e')
  value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)))
  value = value.toString().split('e')
  return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp))
}

const s = (str) => gzip.sync(str)

const minify = (str, options, useES) => {
  if (useES) return uglifyES.minify(str, options)

  // Reattempt with uglify-es if there is a syntax error
  const result = uglify.minify(str, options)
  if (result.error && result.error.stack.indexOf('SyntaxError: ') === 0) {
    const esResult = uglifyES.minify(str, options)
    // If es has an error too, then return the original error
    return esResult.error ? result : esResult
  }

  return result
}

const minSize = (str, options) => {
  options || (options = {})
  const minified = minify(str, omit(options, ['es']), options.es)

  if (minified.error) {
    throw new Error(`Error minifying code:\n${minified.error.message}`)
  }

  return s(minified.code)
}

const dataToTable = (arr) => {
  var returnObj = []
  Object.keys(arr).forEach(function (key) {
    var obj = {}
    var displayKey = key.slice(0, 1).toUpperCase() + key.slice(1)

    if (displayKey === 'Original' || displayKey === 'Minified') {
      displayKey += ' (gzip)'
    }

    obj[displayKey] = arr[key]
    returnObj.push(obj)
  })
  return returnObj
}

const getData = (data, options) => {
  data = data.toString()

  const oSize = s(data)
  const mSize = minSize(data, options)

  const output = {
    original: pb(oSize),
    minified: pb(mSize),
    difference: pb(oSize - mSize),
    percent: round((mSize / oSize) * 100, -2) + '%'
  }

  return output
}

module.exports = getData

module.exports.table = (data, options) => {
  const table = new Table()
  table.push.apply(table, dataToTable(getData(data, options)))
  return table.toString()
}
