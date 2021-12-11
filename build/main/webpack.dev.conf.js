const { merge } = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const ElectronDevWebpackPlugin = require('electron-dev-webpack-plugin')

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  watch: true,
  devtool: false,
  plugins: [new ElectronDevWebpackPlugin()]
})
