import path from 'path'
import root from '~/root'
import contextMenu from './contextMenu'
import { BrowserWindow, shell } from 'electron'

export default dingtalk => () => {
  if (dingtalk.$mainWin) {
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
    icon: path.join(root, './icon/32x32.png'),
    resizable: true,
    webPreferences: {
      // preload: path.join(root, './views/js/main.js')
    }
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
  $win.on('close', (e) => {
    e.preventDefault()
    $win.hide()
  })

  /**
   * 每次窗口显示都会检查是否离线
   */
  $win.on('show', () => {
    if (!dingtalk.online) {
      // $win.hide()
      // return dingtalk.showErrWin()
    }
  })

  // 右键菜单
  $win.webContents.on('context-menu', (e, params) => {
    e.preventDefault()
    contextMenu($win, params)
  })

  // 浏览器中打开链接
  $win.webContents.on('new-window', (e, url) => {
    e.preventDefault()
    if (url !== 'about:blank') {
      shell.openExternal(url)
    }
  })

  // 加载URL地址
  $win.loadURL('https://im.dingtalk.com/')
  return $win
}
