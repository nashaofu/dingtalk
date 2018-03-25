'use strict'
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = merge(baseWebpackConfig, {
  output: {
    path: config.distDir,
    filename: '[name].js',
    library: 'ShortcutCapture',
    libraryExport: 'default',
    libraryTarget: 'commonjs2'
  },
  devtool: config.prod.sourcemap ? '#source-map' : false,
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
