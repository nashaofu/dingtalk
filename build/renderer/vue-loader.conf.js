'use strict'
const utils = require('../utils')

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: true,
    extract: process.env.NODE_ENV === 'production'
  }),
  cssSourceMap: true,
  cacheBusting: true,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
