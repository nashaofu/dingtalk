const path = require('path')
const config = require('../config')
const { merge } = require('webpack-merge')
const styleLoader = require('../style-loader')
const { htmlWebpackPlugins } = require('./views')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const HOST = process.env.HOST || config.dev.host
const PORT = process.env.PORT || config.dev.port

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  module: {
    rules: styleLoader({ sourceMap: true })
  },
  devtool: 'eval-cheap-module-source-map',

  // these devServer options should be customized in /config/index.js
  devServer: {
    client: {
      logging: 'warn',
      overlay: true,
      progress: true
    },
    historyApiFallback: true,
    hot: true,
    compress: true,
    host: HOST,
    port: PORT
  },
  plugins: [
    // https://github.com/ampedandwired/html-webpack-plugin
    ...htmlWebpackPlugins(view => {
      return new HtmlWebpackPlugin({
        title: view.title,
        filename: `${view.key}.html`,
        template: path.join(config.srcRendererDir, 'index.html'),
        inject: true,
        chunks: [view.key]
      })
    })
  ]
})
