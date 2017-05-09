const gzip = require('gzip-size')
const pb = require('pretty-bytes')
const uglify = require('uglify-js')
const Table = require('cli-table')

const round = (value, exp) => {
  value = value.toString().split('e')
  value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)))
  value = value.toString().split('e')
  return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp))
}

const s = (str) => gzip.sync(str)
const min = (str) => s(uglify.minify(str).code)

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

const getData = (data) => {
  data = data.toString()

  const oSize = s(data)
  const mSize = min(data)

  const output = {
    original: pb(oSize),
    minified: pb(mSize),
    difference: pb(oSize - mSize),
    percent: round((mSize / oSize) * 100, -2) + '%'
  }

  return output
}

module.exports = getData

module.exports.table = (data) => {
  const table = new Table()
  table.push.apply(table, dataToTable(getData(data)))
  return table.toString()
}
