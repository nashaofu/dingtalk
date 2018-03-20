'use strict'
const path = require('path')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const ElectronDevWebpackPlugin = require('electron-dev-webpack-plugin')

module.exports = merge(baseWebpackConfig, {
  entry: {
    main: path.resolve(config.srcMainDir, 'index.dev.js')
  },
  // cheap-module-eval-source-map is faster for development
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../env.dev')
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new ElectronDevWebpackPlugin(),
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: ['Your application main process is running here']
      }
    })
  ]
})
