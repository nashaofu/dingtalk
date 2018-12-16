import fs from 'fs'
import path from 'path'
import logo from './logo'
import download from './download'
import contextMenu from './contextMenu'
import { app, BrowserWindow, shell, ipcMain } from 'electron'

/**
 * 打开外部链接
 * @param {String} url
 */
function openExternal (url) {
  if (url === 'about:blank') return
  if (url === 'https://im.dingtalk.com/') return
  if (url.indexOf('https://space.dingtalk.com/auth/download') === 0) return
  shell.openExternal(url)
}

export default dingtalk => () => {
  if (dingtalk.$mainWin) {
    dingtalk.showMainWin()
    return
  }
  // 创建浏览器窗口
  const $win = new BrowserWindow({
    title: '钉钉',
    width: 960,
    height: 600,
    minWidth: 720,
    minHeight: 450,
    useContentSize: true,
    center: true,
    frame: false,
    show: false,
    backgroundColor: '#5a83b7',
    icon: logo,
    resizable: true
  })

  /**
   * 优雅的显示窗口
   */
  $win.once('ready-to-show', () => {
    $win.show()
    $win.focus()
  })

  /**
   * 窗体关闭事件处理
   * 默认只会隐藏窗口
   */
  $win.on('close', e => {
    e.preventDefault()
    $win.hide()
  })

  $win.webContents.on('dom-ready', () => {
    // 页面初始化图标不跳动
    if (dingtalk.$tray) dingtalk.$tray.flicker(false)
    const filename = path.join(app.getAppPath(), './dist/preload/mainWin.js')
    // 读取js文件并执行
    fs.access(filename, fs.constants.R_OK, err => {
      if (err) return
      fs.readFile(filename, (error, data) => {
        if (error || $win.webContents.isDestroyed()) return
        $win.webContents.executeJavaScript(data.toString(), () => {
          if (!$win.webContents.isDestroyed()) $win.webContents.send('dom-ready')
        })
      })
    })
  })

  // 右键菜单
  $win.webContents.on('context-menu', (e, params) => {
    e.preventDefault()
    contextMenu($win, params)
  })

  // 浏览器中打开链接
  $win.webContents.on('new-window', (e, url) => {
    e.preventDefault()
    openExternal(url)
  })

  // 主窗口导航拦截
  $win.webContents.on('will-navigate', (e, url) => {
    e.preventDefault()
    openExternal(url)
  })

  ipcMain.on('MAINWIN:window-minimize', () => $win.minimize())

  ipcMain.on('MAINWIN:window-maximization', () => {
    if ($win.isMaximized()) {
      $win.unmaximize()
    } else {
      $win.maximize()
    }
  })

  ipcMain.on('MAINWIN:window-close', () => $win.hide())
  ipcMain.on('MAINWIN:open-email', (e, url) => dingtalk.showEmailWin(url))

  ipcMain.on('MAINWIN:window-show', () => {
    $win.show()
    $win.focus()
  })

  ipcMain.on('MAINWIN:badge', (e, count) => {
    app.setBadgeCount(count)
    if (dingtalk.$tray) dingtalk.$tray.flicker(!!count)
    if (app.dock) {
      app.dock.show()
      app.dock.bounce('critical')
    }
  })

  download($win)
  // 加载URL地址
  $win.loadURL('https://im.dingtalk.com/')
  return $win
}
