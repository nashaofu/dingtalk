const main = require('./main/webpack.dev.conf')
const preload = require('./preload/webpack.dev.conf')
const renderer = require('./renderer/webpack.dev.conf')

module.exports = [main, preload, renderer]
