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

export default class DingTalk {
  // 托盘图标
  $tray = null
  // 主窗口
  $mainWin = null
  // 错误窗口
  $errWin = null
  // 设置窗口
  $setWin = null
  // 截图对象
  $shortcutCapture = null
  // 网络情况
  online = false
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
    const isSecondInstance = app.makeSingleInstance(() => {
      if (this.$mainWin) {
        this.$mainWin.show()
        this.$mainWin.focus()
      }
    })
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
      this.$mainWin.show()
    }
  }

  initTray () {
    this.$tray = tray(this)()
  }
}
