'use strict'
const path = require('path')
const webpack = require('webpack')
const config = require('../config')
const { merge } = require('webpack-merge')
const styleLoader = require('../style-loader')
const { htmlWebpackPlugins } = require('./views')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const HOST = process.env.HOST || config.dev.host
const PORT = process.env.PORT || config.dev.port

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  watch: true,
  module: {
    rules: styleLoader({ sourceMap: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: 'cheap-module-eval-source-map',

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: true,
    hot: true,
    contentBase: false,
    compress: true,
    host: HOST,
    port: PORT,
    overlay: true,
    progress: true,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: true
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    ...htmlWebpackPlugins(view => {
      return new HtmlWebpackPlugin({
        title: view.title,
        filename: `${view.key}.html`,
        template: path.join(config.srcRendererDir, 'index.html'),
        inject: true,
        chunks: [view.key]
      })
    }),
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [`Your application renderer process is running here: http://${HOST}:${PORT}`]
      }
    })
  ]
})
