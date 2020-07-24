'use strict'
const config = require('../config')
const { merge } = require('webpack-merge')
const styleLoader = require('../style-loader')
const baseWebpackConfig = require('./webpack.base.conf')

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  module: {
    rules: styleLoader({ sourceMap: config.prod.sourcemap })
  },
  devtool: config.prod.sourcemap ? '#source-map' : false
})
