'use strict'
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const styleLoader = require('../style-loader')
const baseWebpackConfig = require('./webpack.base.conf')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  watch: true,
  module: {
    rules: styleLoader({ sourceMap: true })
  },
  devtool: false,
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: ['Your application preload process is running here']
      }
    })
  ]
})
