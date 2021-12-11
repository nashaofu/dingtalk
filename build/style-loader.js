const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// generate loader string to be used with extract text plugin
function generateLoaders ({ extract, ...options }) {
  return function (loader) {
    const cssLoader = {
      loader: 'css-loader',
      options
    }

    const postcssLoader = {
      loader: 'postcss-loader',
      options
    }

    const styleLoader = extract ? MiniCssExtractPlugin.loader : 'style-loader'

    const loaders = [styleLoader, cssLoader, postcssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options
      })
    }
    return loaders
  }
}

module.exports = function (options) {
  return [
    {
      test: /\.css$/,
      use: generateLoaders(options)()
    },
    {
      test: /\.less$/,
      use: generateLoaders(options)('less')
    },
    {
      test: /\.(sass|scss)$/,
      use: generateLoaders(options)('sass')
    },
    {
      test: /\.(stylus|styl)$/,
      use: generateLoaders(options)('stylus')
    }
  ]
}
