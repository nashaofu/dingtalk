const webpack = require('webpack')
const main = require('./main/webpack.dev.conf')
const preload = require('./preload/webpack.dev.conf')
const WebpackDevServer = require('webpack-dev-server')
const renderer = require('./renderer/webpack.dev.conf')

webpack(main, (err, stats) => {
  if (err) throw err
})

webpack(preload, (err, stats) => {
  if (err) throw err
})

const port = renderer.devServer.port

Object.keys(renderer.entry).forEach(key => {
  if (!Array.isArray(renderer.entry[key])) renderer.entry[key] = [renderer.entry[key]]
  renderer.entry[key].unshift('webpack/hot/dev-server')
  renderer.entry[key].unshift(`webpack-dev-server/client?http://localhost:${port}/`)
})

const server = new WebpackDevServer(webpack(renderer), renderer.devServer)
server.listen(port)
