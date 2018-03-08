const path = require('path')

const baseDir = path.resolve(__dirname, '../')
const srcDir = path.resolve(baseDir, './src')
const distDir = path.resolve(baseDir, './dist')

module.exports = {
  baseDir,
  srcDir,
  srcMainDir: path.resolve(srcDir, './main'),
  srcRendererDir: path.resolve(srcDir, './renderer'),
  distDir: path.resolve(baseDir, './dist'),
  distMianFile: path.resolve(distDir, './main.js'),
  distRendererDir: path.resolve(distDir, './renderer'),
  dev: {
    host: 'localhost',
    port: 8080,
    proxyTable: {}
  },
  prod: {
    sourcemap: true
  }
}
