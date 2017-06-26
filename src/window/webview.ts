import { shell } from 'electron'
import * as fs from 'fs'
import * as path from 'path'

const $webview: any  = document.querySelector('#webview')

$webview.addEventListener('dom-ready', () => {
  $webview.openDevTools()
  const filename: string = path.join(__dirname, '../window/css/webview.css')
  fs.readFile(filename, (err: Error, css: Buffer): void => {
    console.log(err, css)
    if (!err) {
      return $webview.insertCSS(css.toString())
    }
  })
})

// 支持点击打开链接
$webview.addEventListener('new-window', (e: any) => {
  shell.openExternal(e.url)
})
