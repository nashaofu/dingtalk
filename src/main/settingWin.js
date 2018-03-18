import path from 'path'
import merge from 'lodash/merge'
import contextMenu from './contextMenu'
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
    height: 280,
    useContentSize: true,
    resizable: false,
    menu: false,
    parent: dingtalk.$mainWin,
    modal: true,
    icon: path.join(app.getAppPath(), './icon/32x32.png')
  })
  // 右键上下文菜单
  $win.webContents.on('context-menu', (e, params) => {
    e.preventDefault()
    contextMenu($win, params)
  })

  // 窗口关闭后手动让$window为null
  $win.on('closed', () => {
    dingtalk.$settingWin = null
  })

  $win.webContents.on('dom-ready', () => {
    $win.webContents.send('dom-ready', dingtalk.setting)
  })

  ipcMain.on('SETTINGWIN:setting', async (e, setting) => {
    dingtalk.setting = merge({}, setting, dingtalk.setting)
    await dingtalk.writeSetting()
    dingtalk.$shortcutCapture.registerHotkey(dingtalk.setting.keymap['shortcut-capture'])
  })

  // 加载URL地址
  const URL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/settingWin.html'
    : `file://${path.join(app.getAppPath(), './dist/renderer/settingWin.html')}`

  $win.loadURL(URL)
  return $win
}
