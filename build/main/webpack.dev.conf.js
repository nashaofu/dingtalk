'use strict'
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const ElectronDevWebpackPlugin = require('electron-dev-webpack-plugin')

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  watch: true,
  devtool: false,
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new ElectronDevWebpackPlugin(),
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: ['Your application main process is running here']
      }
    })
  ]
})
