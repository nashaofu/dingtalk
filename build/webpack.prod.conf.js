const main = require('./main/webpack.prod.conf')
const preload = require('./preload/webpack.prod.conf')
const renderer = require('./renderer/webpack.prod.conf')

module.exports = [main, preload, renderer]
