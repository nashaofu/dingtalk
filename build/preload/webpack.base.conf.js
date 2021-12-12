const path = require('path')
const config = require('../config')
const ESLintWebpackPlugin = require('eslint-webpack-plugin')

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
    filename: '[name].js'
  },
  target: 'electron-renderer',
  resolve: {
    alias: {
      '@': resolve('src/preload')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/images/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/medias/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  node: {
    __dirname: true,
    __filename: true
  },
  plugins: [new ESLintWebpackPlugin()]
}
