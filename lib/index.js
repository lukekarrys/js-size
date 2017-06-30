'use strict'

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

const clone = (obj) => JSON.parse(JSON.stringify(obj))
const errorEqual = (err1, err2) => JSON.stringify(err1) === JSON.stringify(err2)
const s = (str) => gzip.sync(str)

const minify = (str, options, useES) => {
  // Options gets changed by a call to minify to get them here for the fallback calls
  const originalOptions = () => clone(options)

  // Just use ES if requested
  if (useES) return uglifyES.minify(str, originalOptions())

  // Reattempt with uglify-es if there is a syntax error
  const result = uglify.minify(str, originalOptions())
  if (result.error && result.error.constructor.name === 'JS_Parse_Error') {
    const esResult = uglifyES.minify(str, originalOptions())

    if (esResult.error) {
      // If es has the same error, then return the original error
      return errorEqual(result.error, esResult.error)
        ? result
        : esResult
    }

    return esResult
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
  const returnObj = []
  Object.keys(arr).forEach((key) => {
    const obj = {}
    let displayKey = key.slice(0, 1).toUpperCase() + key.slice(1)

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
