const fs = require('fs')
const path = require('path')
const { shell } = require('electron')

const $webview = document.querySelector('#webview')

$webview.addEventListener("dom-ready", () => {
  fs.readFile(path.join(__dirname, './css/webview.css'), function (err, css) {
    if (!err) {
      return $webview.insertCSS(css.toString())
    }
  });
})

// 支持点击打开链接
$webview.addEventListener('new-window', e => {
  shell.openExternal(e.url)
})