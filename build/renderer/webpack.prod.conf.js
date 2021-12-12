const path = require('path')
const config = require('../config')
const { merge } = require('webpack-merge')
const styleLoader = require('../style-loader')
const { htmlWebpackPlugins } = require('./views')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  module: {
    rules: styleLoader({
      sourceMap: config.prod.sourcemap,
      extract: true
    })
  },
  devtool: config.prod.sourcemap ? '#source-map' : false,
  output: {
    path: config.distRendererDir,
    filename: 'static/js/[name].[chunkhash].js',
    chunkFilename: 'static/js/[id].[chunkhash].js'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash].css'
    }),
    ...htmlWebpackPlugins(view => {
      return new HtmlWebpackPlugin({
        title: view.title,
        filename: `${view.key}.html`,
        template: path.join(config.srcRendererDir, 'index.html'),
        inject: true,
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true
        },
        chunks: [view.key]
      })
    })
  ]
})
