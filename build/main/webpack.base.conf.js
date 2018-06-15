'use strict'
const path = require('path')
const config = require('../config')

function resolve (dir) {
  return path.join(config.baseDir, dir)
}

module.exports = {
  context: config.baseDir,
  entry: {
    main: config.srcMainDir
  },
  output: {
    path: config.distDir,
    libraryTarget: 'commonjs2',
    filename: '[name].js'
  },
  target: 'electron-main',
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': resolve('src/main')
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
        include: [resolve('src/main')],
        options: {
          formatter: require('eslint-friendly-formatter'),
          emitWarning: true
        }
      },
      {
        test: /iconv\.js$/,
        loader: 'webpack-replace-loader',
        enforce: 'pre',
        options: {
          arr: [
            {search: 'Debug', replace: 'Release', attr: 'g'}
          ]
        }
      },
      {
        test: /node-icu-charset-detector\.js$/,
        loader: 'webpack-replace-loader',
        enforce: 'pre',
        options: {
          arr: [
            {search: 'node-icu-charset-detector', replace: 'node-icu-charset-detector.node', attr: 'g'}
          ]
        }
      },
      {
        test: /\.node$/,
        use: 'node-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src/main')]
      }
    ]
  },
  node: {
    __dirname: true,
    __filename: true
  }
}
