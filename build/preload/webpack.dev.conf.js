const { merge } = require('webpack-merge')
const styleLoader = require('../style-loader')
const baseWebpackConfig = require('./webpack.base.conf')

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  watch: true,
  module: {
    rules: styleLoader({ sourceMap: true })
  },
  devtool: false
})
