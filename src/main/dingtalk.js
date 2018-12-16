import { app, Menu, ipcMain, BrowserWindow } from 'electron'
import { initSetting, readSetting, writeSetting } from './setting'
import online from './online'
import Notify from './notify'
import mainWin from './mainWin'
import emailWin from './emailWin'
import errorWin from './errorWin'
import aboutWin from './aboutWin'
import shortcut from './shortcut'
import autoUpdate from './autoUpdate'
import settingWin from './settingWin'
import DingtalkTray from './dingtalkTray'
import ShortcutCapture from 'shortcut-capture'

export default class DingTalk {
  // app对象是否ready
  _ready = null
  // 托盘图标
  $tray = null
  // 主窗口
  $mainWin = null
  // 邮箱窗口
  $emailWin = null
  // 错误窗口
  $errorWin = null
  // 设置窗口
  $settingWin = null
  // 关于窗口
  $aboutWin = null
  // 截图对象
  $shortcutCapture = null
  // 网络情况，默认为null，必须等到页面报告状态
  online = null
  // 默认配置
  setting = {
    autoupdate: true,
    keymap: {
      'shortcut-capture': ['Control', 'Alt', 'A']
    }
  }

  constructor () {
    if (!this.requestSingleInstanceLock()) {
      this.init().then(() => {
        // 移除窗口菜单
        Menu.setApplicationMenu(null)
        this.initMainWin()
        this.initTray()
        this.initShortcutCapture()
        this.initNotify()
        this.autoUpdate()
        this.bindShortcut()
      })
    }
  }

  /**
   * 初始化
   * @return {Promise} setting
   */
  async init () {
    online(this)()
    this.setting = await initSetting(this)()
    return this.whenReady()
  }

  /**
   * 使应用程序成为单个实例应用程序
   * 而不是允许应用程序的多个实例运行
   * 这将确保只有一个应用程序的实例正在运行
   * 其余的实例全部会被终止并退出
   */
  requestSingleInstanceLock () {
    // 同时只能运行一个人实例
    const isSecond = app.makeSingleInstance(() => this.showMainWin())
    if (isSecond) app.quit()
    return isSecond
  }

  /**
   * 初始化主窗口
   */
  initMainWin () {
    this.$mainWin = mainWin(this)()
  }

  /**
   * 初始化托盘图标
   */
  initTray () {
    this.$tray = new DingtalkTray({ dingtalk: this })
  }

  /**
   * 初始化截图
   */
  initShortcutCapture () {
    this.$shortcutCapture = new ShortcutCapture()
  }

  /**
   * 初始化消息提示
   */
  initNotify () {
    this.$notify = new Notify()
    ipcMain.on('notify', (e, body) => this.$notify.show(body))
    this.$notify.on('click', () => this.showMainWin())
  }

  /**
   * 从文件中读取设置信息
   * @return {Promise} setting
   */
  readSetting () {
    return readSetting(this)()
  }

  /**
   * 写入设置到文件
   * @return {Promise} setting
   */
  writeSetting () {
    return writeSetting(this)()
  }

  /**
   * app是否ready
   * @return {Promise} setting
   */
  whenReady () {
    if (this._ready) return this._ready
    this._ready = new Promise((resolve, reject) => {
      if (app.isReady()) return resolve()
      app.once('ready', () => resolve())
      // 所有窗口关闭之后退出应用
      app.once('window-all-closed', () => {
        if (process.platform !== 'darwin') {
          if (this.$tray && !this.$tray.isDestroyed()) {
            this.$tray.destroy()
            this.$tray = null
          }
          app.quit()
        }
      })
    })
    return this._ready
  }

  /**
   * 退出应用
   */
  quit () {
    this.$shortcutCapture.destroy()
    const windows = BrowserWindow.getAllWindows()
    windows.forEach(item => !item.isDestroyed() && item.destroy())
    if (process.platform !== 'darwin') {
      if (this.$tray && !this.$tray.isDestroyed()) {
        this.$tray.destroy()
        this.$tray = null
      }
      app.quit()
    }
  }

  /**
   * 绑定快捷键
   */
  bindShortcut () {
    shortcut(this)()
  }

  /**
   * 显示主窗口
   */
  showMainWin () {
    if (this.$mainWin) {
      if (this.online) {
        if (this.$mainWin.isMinimized()) this.$mainWin.restore()
        this.$mainWin.show()
        this.$mainWin.focus()
      } else if (this.online === false) {
        /**
         * this.online === null不显示
         * 因为可能此时还没有初始化online
         * 即$mainWin还没有触发dom-ready
         */
        this.showErrorWin()
      }
    }
  }

  /**
   * 截图
   */
  shortcutCapture () {
    if (this.shortcutCapture) {
      this.$shortcutCapture.shortcutCapture()
    }
  }

  /**
   * 显示邮箱窗口
   * @param {Object} storage
   */
  showEmailWin (storage) {
    this.$emailWin = emailWin(this)(storage)
  }

  /**
   * 显示错误窗口
   */
  showErrorWin () {
    this.$errorWin = errorWin(this)()
  }

  /**
   * 隐藏错误窗口
   */
  hideErrorWin () {
    if (this.$errorWin) {
      this.$errorWin.destroy()
    }
  }

  /**
   * 显示设置窗口
   */
  showSettingWin () {
    this.$settingWin = settingWin(this)()
  }

  /**
   * 关闭设置窗口
   */
  hideSettingWin () {
    if (this.$settingWin) {
      this.$settingWin.destroy()
    }
  }

  /**
   * 显示关于窗口
   */
  showAboutWin () {
    this.$aboutWin = aboutWin(this)()
  }

  /**
   * 检查更新
   */
  autoUpdate () {
    autoUpdate(this)()
  }
}
