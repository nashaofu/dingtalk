'use strict'
const path = require('path')
const utils = require('../utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const portfinder = require('portfinder')
const { htmlWebpackPlugins } = require('./views')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: true, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: 'cheap-module-eval-source-map',

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    hot: true,
    contentBase: false,
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    overlay: { warnings: false, errors: true },
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: true
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../env.dev')
    }),
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
    })
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application renderer process is running here: http://${devWebpackConfig.devServer.host}:${port}`]
        }
      }))

      resolve(devWebpackConfig)
    }
  })
})
