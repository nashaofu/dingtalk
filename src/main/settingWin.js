import path from 'path'
import logo from './logo'
import contextMenu from './contextMenu'
import { autoUpdater } from 'electron-updater'
import { app, BrowserWindow, ipcMain } from 'electron'

export default dingtalk => () => {
  if (dingtalk.$settingWin) {
    dingtalk.$settingWin.show()
    dingtalk.$settingWin.focus()
    return dingtalk.$settingWin
  }
  const $win = new BrowserWindow({
    title: '设置',
    width: 320,
    height: 260,
    useContentSize: true,
    resizable: false,
    menu: false,
    parent: dingtalk.$mainWin,
    modal: process.platform !== 'darwin',
    show: false,
    icon: logo
  })

  $win.on('ready-to-show', () => {
    $win.show()
    $win.focus()
  })

  // 窗口关闭后手动让$window为null
  $win.on('closed', () => {
    dingtalk.$settingWin = null
  })

  $win.webContents.on('dom-ready', () => {
    $win.webContents.send('dom-ready', dingtalk.setting)
  })

  // 右键上下文菜单
  $win.webContents.on('context-menu', (e, params) => {
    e.preventDefault()
    contextMenu($win, params)
  })

  ipcMain.on('SETTINGWIN:setting', async (e, setting) => {
    dingtalk.setting = setting
    await dingtalk.writeSetting()
    dingtalk.bindShortcut()
    if (dingtalk.setting.autoupdate) {
      autoUpdater.checkForUpdates()
    }
    dingtalk.hideSettingWin()
  })

  // 加载URL地址
  const URL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/settingWin.html'
    : `file://${path.join(app.getAppPath(), './dist/renderer/settingWin.html')}`

  $win.loadURL(URL)
  return $win
}
