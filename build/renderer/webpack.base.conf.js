const path = require('path')
const config = require('../config')
const { entries } = require('./views')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const ESLintWebpackPlugin = require('eslint-webpack-plugin')

function resolve (dir) {
  return path.join(config.baseDir, dir)
}

module.exports = {
  context: config.baseDir,
  entry: entries(view => path.resolve(config.srcRendererDir, view.key)),
  output: {
    path: config.distRendererDir,
    filename: '[name].js'
  },
  target: 'electron-renderer',
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': resolve('src/renderer'),
      '#': resolve('')
    }
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-plain-loader'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
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
        generator: {
          filename: 'static/medias/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        generator: {
          filename: 'static/fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins: [
    new ESLintWebpackPlugin({
      extensions: ['js', 'vue']
    }),
    new VueLoaderPlugin()
  ],
  node: {
    __dirname: true,
    __filename: true
  }
}
