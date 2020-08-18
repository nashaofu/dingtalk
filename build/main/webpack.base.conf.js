'use strict'
const path = require('path')
const config = require('../config')
const { dependencies, devDependencies } = require('../../package.json')

function resolve (dir) {
  return path.join(config.baseDir, dir)
}

module.exports = {
  context: config.baseDir,
  entry: {
    main: path.resolve(config.srcMainDir, 'index.dev.js')
  },
  output: {
    path: config.distDir,
    filename: '[name].js'
  },
  target: 'electron-main',
  resolve: {
    alias: {
      '@': resolve('src/main')
    }
  },
  externals: {
    ...Object.keys({ ...dependencies, ...devDependencies }).reduce((deps, key) => {
      deps[key] = `commonjs2 ${key}`
      return deps
    }, {})
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
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  },
  node: {
    __dirname: true,
    __filename: true
  }
}
