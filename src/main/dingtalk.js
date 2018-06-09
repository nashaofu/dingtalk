import {
  app,
  Menu,
  ipcMain,
  BrowserWindow
} from 'electron'
import {
  initSetting,
  readSetting,
  writeSetting
} from './setting'
import tray from './tray'
import online from './online'
import Notify from './notify'
import mainWin from './mainWin'
import emailWin from './emailWin'
import errorWin from './errorWin'
import aboutWin from './aboutWin'
import settingWin from './settingWin'
import autoUpdate from './autoUpdate'
import shortcut from './shortcut'
import ShortcutCapture from 'shortcut-capture'
import sendAtMsg from './sendAtMsg'

export default class DingTalk {
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
    this.init()
      .then(() => {
        this.ready(() => {
          // 同时只能运行一个人实例
          if (app.makeSingleInstance(() => this.showMainWin())) {
            return app.quit()
          }
          // 移除窗口菜单
          Menu.setApplicationMenu(null)
          this.initMainWin()
          this.initTray()
          this.initShortcutCapture()
          this.initNotify()
          this.autoUpdate()
          this.bindShortcut()
        })
      })
  }

  /**
   * 初始化
   * @return {Promise} setting
   */
  async init () {
    this.setting = await initSetting(this)()
    online(this)()
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
    this.$tray = tray(this)()
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
   * 应用初始化之后执行回掉函数
   * @param {Function} callback
   * @return {Promise}
   */
  ready (callback) {
    return new Promise((resolve, reject) => {
      const ready = () => {
        if (typeof callback === 'function') {
          callback()
        }
        resolve()
      }
      if (app.isReady()) return ready()
      app.once('ready', () => ready())
      app.once('window-all-closed', () => {
        if (!this.$tray.isDestroyed()) this.$tray.destroy()
      })
    })
  }

  /**
   * 退出应用
   */
  quit () {
    if (!this.$tray.isDestroyed()) this.$tray.destroy()
    BrowserWindow.getAllWindows()
      .forEach(item => {
        if (!item.isDestroyed()) item.destroy()
      })
    app.quit()
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

  /**
   * 发送消息给hubot
   * 消息格式为:\u0001\u0003@{who} \u0003{body}
   * @param {String} msg
   */
  sendAtMsg (msg) {
    sendAtMsg(this)(msg)
  }
}
