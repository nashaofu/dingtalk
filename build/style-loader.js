const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// generate loader string to be used with extract text plugin
function generateLoaders (loader) {
  return function ({ extract, ...options }) {
    const cssLoader = {
      loader: 'css-loader',
      options
    }

    const postcssLoader = {
      loader: 'postcss-loader',
      options
    }

    const vueStyleLoader = {
      loader: 'vue-style-loader',
      options
    }
    const styleLoader = options.extract ? MiniCssExtractPlugin.loader : vueStyleLoader

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
      use: generateLoaders()(options)
    },
    {
      test: /\.less$/,
      use: generateLoaders('less')(options)
    },
    {
      test: /\.(sass|scss)$/,
      use: generateLoaders('sass')(options)
    },
    {
      test: /\.(stylus|styl)$/,
      use: generateLoaders('stylus')(options)
    }
  ]
}
