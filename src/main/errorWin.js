import path from 'path'
import logo from './logo'
import { app, BrowserWindow, ipcMain } from 'electron'

export default dingtalk => () => {
  if (dingtalk.$errorWin) {
    dingtalk.$errorWin.show()
    dingtalk.$errorWin.focus()
    return dingtalk.$errorWin
  }

  const $win = new BrowserWindow({
    title: '网络错误',
    width: 600,
    height: 320,
    useContentSize: true,
    resizable: false,
    center: true,
    frame: false,
    menu: false,
    transparent: true,
    show: false,
    closable: false,
    skipTaskbar: true,
    icon: logo
  })

  $win.on('ready-to-show', () => {
    $win.show()
    $win.focus()
  })
  $win.on('closed', () => {
    dingtalk.$errorWin = null
  })

  ipcMain.on('ERRORWIN:retry', () => {
    dingtalk.hideErrorWin()
    if (dingtalk.$mainWin) {
      dingtalk.$mainWin.reload()
      dingtalk.showMainWin()
    }
  })

  ipcMain.on('ERRORWIN:close', () => {
    dingtalk.hideErrorWin()
  })

  // 加载URL地址
  const URL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/errorWin.html'
    : `file://${path.join(app.getAppPath(), './dist/renderer/errorWin.html')}`

  $win.loadURL(URL)
  return $win
}
