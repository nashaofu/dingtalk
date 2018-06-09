import fs from 'fs'
import path from 'path'
import contextMenu from './contextMenu'
import { app, BrowserWindow } from 'electron'

export default dingtalk => storage => {
  if (dingtalk.$emailWin) {
    dingtalk.$emailWin.show()
    dingtalk.$emailWin.focus()
    return dingtalk.$emailWin
  }
  const url = Object
    .keys(storage.localStorage)
    .find(key => /^\d+_mailUrl/.test(key))
  if (!url) return

  const $win = new BrowserWindow({
    title: '钉邮',
    width: 980,
    height: 640,
    minWidth: 720,
    minHeight: 450,
    useContentSize: true,
    resizable: true,
    menu: false,
    show: false,
    icon: path.join(app.getAppPath(), './icon/32x32.png')
  })

  $win.on('ready-to-show', () => {
    $win.show()
    $win.focus()
  })

  // 窗口关闭后手动让$window为null
  $win.on('closed', () => {
    dingtalk.$emailWin = null
  })

  $win.webContents.on('dom-ready', () => {
    const filename = path.join(app.getAppPath(), './dist/preload/emailWin.js')
    // 读取js文件并执行
    fs.access(filename, fs.constants.R_OK, err => {
      if (err) return
      fs.readFile(filename, (error, data) => {
        if (error || $win.webContents.isDestroyed()) return
        $win.webContents.executeJavaScript(data.toString(), () => {
          if (!$win.webContents.isDestroyed()) $win.webContents.send('dom-ready', storage)
        })
      })
    })
  })

  // 右键菜单
  $win.webContents.on('context-menu', (e, params) => {
    e.preventDefault()
    contextMenu($win, params)
  })

  // 加载URL地址
  $win.loadURL(decodeURIComponent(storage.localStorage[url]))
  return $win
}
