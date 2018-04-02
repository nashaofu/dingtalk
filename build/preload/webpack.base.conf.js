'use strict'
const path = require('path')
const config = require('../config')

function resolve (dir) {
  return path.join(config.baseDir, dir)
}

module.exports = {
  context: config.baseDir,
  entry: {
    mainWin: path.resolve(config.srcPreloadDir, './mainWin/index.js'),
    emailWin: path.resolve(config.srcPreloadDir, './emailWin/index.js')
  },
  output: {
    path: config.distPreloadDir,
    libraryTarget: 'commonjs2',
    filename: '[name].js'
  },
  target: 'electron-renderer',
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': resolve('src/preload')
    }
  },
  externals: {
    'node-notifier': 'node-notifier'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src/preload')],
        options: {
          formatter: require('eslint-friendly-formatter'),
          emitWarning: true
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src/preload'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'img/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  node: {
    __dirname: true,
    __filename: true
  }
}
