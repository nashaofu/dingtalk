const path = require('path')

const baseDir = path.resolve(__dirname, '../')
const srcDir = path.resolve(baseDir, './src')
const distDir = path.resolve(baseDir, './dist')

module.exports = {
  baseDir,
  srcDir,
  srcMainDir: path.resolve(srcDir, './main'),
  srcPreloadDir: path.resolve(srcDir, './preload'),
  srcRendererDir: path.resolve(srcDir, './renderer'),
  distDir: path.resolve(baseDir, './dist'),
  distMainFile: path.resolve(distDir, './main.js'),
  distPreloadDir: path.resolve(distDir, './preload'),
  distRendererDir: path.resolve(distDir, './renderer'),
  dev: {
    host: 'localhost',
    port: 8080,
    proxyTable: {}
  },
  prod: {
    sourcemap: false
  }
}
