const path = require('path')

const baseDir = path.resolve(__dirname, '../')
const srcDir = path.resolve(baseDir, './src')
const distDir = path.resolve(baseDir, './dist')

module.exports = {
  baseDir,
  srcDir,
  srcMainDir: path.resolve(srcDir, './main'),
  srcMainWinDir: path.resolve(srcDir, './mainWin'),
  srcRendererDir: path.resolve(srcDir, './renderer'),
  distDir: path.resolve(baseDir, './dist'),
  distMainFile: path.resolve(distDir, './main.js'),
  distMainWinDir: path.resolve(distDir, './mainWin'),
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
