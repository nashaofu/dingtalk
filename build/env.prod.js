'use strict'
const pkg = require('../package.json')
module.exports = {
  NODE_ENV: '"production"',
  VERSION: `"${pkg.version}"`
}
