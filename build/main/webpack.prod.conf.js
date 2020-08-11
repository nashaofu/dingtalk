'use strict'
const path = require('path')
const config = require('../config')
const { merge } = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  entry: {
    main: path.resolve(config.srcMainDir, 'index.js')
  },
  devtool: config.prod.sourcemap ? '#source-map' : false
})
