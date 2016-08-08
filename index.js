var jssize = require('./lib/js-size')

module.exports = jssize.bind(jssize, false)
module.exports.table = jssize.bind(jssize, true)
