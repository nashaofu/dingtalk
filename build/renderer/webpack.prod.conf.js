'use strict'
const path = require('path')
const utils = require('../utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const { htmlWebpackPlugins } = require('./views')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.prod.sourcemap,
      extract: true,
      usePostCSS: true
    })
  },
  devtool: config.prod.sourcemap ? '#source-map' : false,
  output: {
    path: config.distRendererDir,
    filename: 'js/[name].js'
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
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: 'css/[name].css',
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`,
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      allChunks: true
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.prod.sourcemap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    ...htmlWebpackPlugins(view => {
      return new HtmlWebpackPlugin({
        title: view.title,
        filename: `${view.key}.html`,
        template: path.join(config.srcRendererDir, 'index.html'),
        inject: true,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
          // more options:
          // https://github.com/kangax/html-minifier#options-quick-reference
        },
        chunks: [view.key]
      })
    })
  ]
})
