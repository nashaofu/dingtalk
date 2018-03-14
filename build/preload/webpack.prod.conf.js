'use strict'
const utils = require('../utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.prod.sourcemap, usePostCSS: true })
  },
  devtool: config.prod.sourcemap ? '#source-map' : false,
  output: {
    path: config.distPreloadDir,
    filename: '[name].js'
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': require('../env.prod')
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      sourceMap: config.prod.sourcemap,
      parallel: true
    })
  ]
})
