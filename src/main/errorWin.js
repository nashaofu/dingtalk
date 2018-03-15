import path from 'path'
import { app, BrowserWindow } from 'electron'

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
    icon: path.join(app.getAppPath(), './icon/32x32.png')
  })

  $win.on('ready-to-show', () => {
    $win.show()
    $win.focus()
  })
  $win.on('closed', () => {
    dingtalk.$errorWin = null
  })
  // 加载URL地址
  const URL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : `file://${path.join(app.getAppPath(), './renderer/errorWin.html')}`
  $win.loadURL(URL)
  return $win
}
