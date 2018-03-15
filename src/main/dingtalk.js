import {
  app,
  Menu,
  BrowserWindow
} from 'electron'
import {
  initSetting,
  readSetting,
  writeSetting
} from './setting'
import ShortcutCapture from 'shortcut-capture'
import mainWin from './mainWin'
import tray from './tray'
import emailWin from './emailWin'
import errorWin from './errorWin'

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
  // 截图对象
  $shortcutCapture = null
  // 网络情况，默认为null，必须等到页面报告状态
  online = null
  // 默认配置
  setting = {
    keymap: {
      'shortcut-capture': 'Control+Alt+a'
    }
  }

  constructor () {
    this.init()
  }

  async init () {
    this.setting = await this.initSetting()
    this.ready(() => {
      if (this.makeSingleInstance()) {
        return
      }
      // 移除窗口菜单
      Menu.setApplicationMenu(null)
      this.initShortcutCapture()
      this.initMainWin()
      this.initTray()
    })
  }

  /**
   * 初始化设置选项
   */
  async initSetting () {
    return await initSetting(this)()
  }

  /**
   * 从文件中读取设置信息
   */
  async readSetting () {
    return await readSetting(this)()
  }

  /**
   * 写入设置到文件
   */
  async writeSetting () {
    return await writeSetting(this)()
  }

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
    })
  }

  quit () {
    this.$tray.destroy()
    BrowserWindow.getAllWindows()
      .forEach(item => item.destroy())
    app.quit()
  }

  makeSingleInstance () {
    // 同时只能运行一个人实例
    const isSecondInstance = app.makeSingleInstance(() => this.showMainWin())
    if (isSecondInstance) {
      app.quit()
    }
    return isSecondInstance
  }

  initShortcutCapture () {
    this.$shortcutCapture = new ShortcutCapture({
      hotkey: this.setting.keymap['shortcut-capture']
    })
  }

  shortcutCapture () {
    if (this.shortcutCapture) {
      this.$shortcutCapture.shortcutCapture()
    }
  }

  initMainWin () {
    this.$mainWin = mainWin(this)()
  }

  showMainWin () {
    if (this.$mainWin) {
      if (this.online) {
        this.$mainWin.show()
        this.$mainWin.focus()
      } else {
        this.showErrorWin()
      }
    }
  }

  initTray () {
    this.$tray = tray(this)()
  }

  openEmailWin (url) {
    this.$emailWin = emailWin(this)(url)
  }

  showErrorWin () {
    this.$errorWin = errorWin(this)()
  }

  hideErrorWin () {
    if (this.$errorWin) {
      this.errorWin.close()
    }
  }
}
