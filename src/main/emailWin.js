import fs from 'fs'
import path from 'path'
import contextMenu from './contextMenu'
import { app, BrowserWindow } from 'electron'

export default dingtalk => url => {
  if (dingtalk.$emailWin) {
    dingtalk.$emailWin.show()
    dingtalk.$emailWin.focus()
    return dingtalk.$emailWin
  }
  const $win = new BrowserWindow({
    title: '钉邮',
    width: 980,
    height: 640,
    minWidth: 720,
    minHeight: 450,
    useContentSize: true,
    resizable: true,
    menu: false,
    icon: path.join(app.getAppPath(), './icon/32x32.png')
  })
  // 右键菜单
  $win.webContents.on('context-menu', (e, params) => {
    e.preventDefault()
    contextMenu($win, params)
  })
  $win.webContents.on('dom-ready', () => {
    const filename = path.join(app.getAppPath(), './dist/preload/emailWin.js')
    // 读取js文件并执行
    fs.access(filename, fs.constants.R_OK, err => {
      if (err) return
      fs.readFile(filename, (error, data) => {
        if (error) return
        $win.webContents.executeJavaScript(data.toString(), () => {
          $win.webContents.send('dom-ready', url)
        })
      })
    })
  })

  // 窗口关闭后手动让$window为null
  $win.on('closed', () => {
    dingtalk.$emailWin = null
  })
  // 加载URL地址
  $win.loadURL(url)
  return $win
}
