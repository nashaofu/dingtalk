import { app, Menu, ipcMain, BrowserWindow } from 'electron'
import { initSetting, readSetting, writeSetting } from './setting'
import Notify from './notify'
import mainWin from './mainWin'
import emailWin from './emailWin'
import aboutWin from './aboutWin'
import shortcut from './shortcut'
import settingWin from './settingWin'
import DingtalkTray from './dingtalkTray'
import Screenshots from 'electron-screenshots'

export default class DingTalk {
  // app对象是否ready
  _ready = null
  // 托盘图标
  $tray = null
  // 主窗口
  $mainWin = null
  // 邮箱窗口
  $emailWin = null
  // 设置窗口
  $settingWin = null
  // 关于窗口
  $aboutWin = null
  // 截图对象
  $screenshots = null
  // 默认配置
  setting = {
    autoupdate: true,
    enableCapture: true,
    enableFlicker: true,
    keymap: {
      'screenshots-capture': ['Control', 'Alt', 'A']
    }
  }

  constructor () {
    if (!app.requestSingleInstanceLock()) return app.quit()
    this.init().then(() => {
      app.setAppUserModelId('com.electron.dingtalk')
      // 移除窗口菜单
      Menu.setApplicationMenu(null)
      this.initMainWin()
      this.initTray()
      this.initScreenshots()
      this.initNotify()
      this.bindShortcut()
    })
  }

  /**
   * 初始化
   * @return {Promise} setting
   */
  async init () {
    this.setting = await initSetting(this)()
    // 重复打开应用就显示窗口
    app.on('second-instance', (event, commandLine, workingDirectory) => this.showMainWin())
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
    return app.whenReady()
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
  initScreenshots () {
    this.$screenshots = new Screenshots()
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
   * 退出应用
   */
  quit () {
    const windows = BrowserWindow.getAllWindows()
    windows.forEach(item => item.destroy())
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
      if (this.$mainWin.isMinimized()) this.$mainWin.restore()
      this.$mainWin.show()
      this.$mainWin.focus()
    }
  }

  /**
   * 截图
   */
  screenshotsCapture () {
    if (this.$screenshots) {
      this.$screenshots.startCapture()
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
      this.$settingWin.close()
    }
  }

  resetTrayMenu () {
    if (this.$tray && !this.$tray.isDestroyed()) {
      this.$tray.setMenu()
    }
  }

  /**
   * 显示关于窗口
   */
  showAboutWin () {
    this.$aboutWin = aboutWin(this)()
  }
}
