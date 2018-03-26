import path from 'path'
import contextMenu from './contextMenu'
import { app, BrowserWindow, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'

export default dingtalk => () => {
  if (dingtalk.$aboutWin) {
    dingtalk.$aboutWin.show()
    dingtalk.$aboutWin.focus()
    return dingtalk.$aboutWin
  }
  const $win = new BrowserWindow({
    title: '关于',
    width: 320,
    height: 400,
    useContentSize: true,
    resizable: false,
    menu: false,
    parent: dingtalk.$mainWin,
    modal: true,
    show: false,
    icon: path.join(app.getAppPath(), './icon/32x32.png')
  })
  // 右键上下文菜单
  $win.webContents.on('context-menu', (e, params) => {
    e.preventDefault()
    contextMenu($win, params)
  })

  $win.on('ready-to-show', () => {
    $win.show()
    $win.focus()
  })

  // 窗口关闭后手动让$window为null
  $win.on('closed', () => {
    dingtalk.$aboutWin = null
  })

  $win.webContents.on('dom-ready', () => {
    $win.webContents.send('dom-ready')
  })

  ipcMain.on('ABOUTWIN:checkForUpdates', () => {
    autoUpdater.checkForUpdates()
  })

  // 加载URL地址
  const URL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/aboutWin.html'
    : `file://${path.join(app.getAppPath(), './dist/renderer/aboutWin.html')}`

  $win.loadURL(URL)
  return $win
}
