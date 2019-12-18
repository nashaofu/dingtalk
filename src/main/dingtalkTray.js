import { Tray, Menu } from 'electron'
import { getMessageTrayIcon, getNoMessageTrayIcon } from './logo'

export default class DingtalkTray {
  _dingtalk = null
  // 图标闪烁定时
  _flickerTimer = null

  // 托盘对象
  $tray = null
  // 图标文件
  messageTrayIcon = getMessageTrayIcon()
  noMessageTrayIcon = getNoMessageTrayIcon()

  constructor ({ dingtalk }) {
    this._dingtalk = dingtalk
    // 生成托盘图标及其菜单项实例
    this.$tray = new Tray(this.noMessageTrayIcon)
    // 设置鼠标悬浮时的标题
    this.$tray.setToolTip('钉钉')
    this.initEvent()
    this.setMenu()
  }

  /**
   * 初始化事件
   */
  initEvent () {
    this.$tray.on('click', () => this._dingtalk.showMainWin())
    this.$tray.on('double-click', () => this._dingtalk.showMainWin())
  }

  /**
   * 设置菜单
   */
  setMenu () {
    const menu = [
      {
        label: '显示窗口',
        click: () => this._dingtalk.showMainWin()
      },
      {
        label: '设置',
        click: () => this._dingtalk.showSettingWin()
      },
      {
        label: '关于',
        click: () => this._dingtalk.showAboutWin()
      },
      {
        label: '退出',
        click: () => this._dingtalk.quit()
      }
    ]

    if (this._dingtalk.setting.enableCapture) {
      menu.splice(1, 0, {
        label: '屏幕截图',
        click: () => this._dingtalk.screenshotsCapture()
      })
    }

    // 绑定菜单
    this.$tray.setContextMenu(Menu.buildFromTemplate(menu))
  }

  /**
   * 控制图标是否闪烁
   * @param {Boolean} is
   */
  flicker (is) {
    const { enableFlicker } = this._dingtalk.setting
    if (is) {
      let icon = this.messageTrayIcon
      if (enableFlicker) {
        // 防止连续调用多次，导致图标切换时间间隔不是1000ms
        if (this._flickerTimer !== null) return
        this._flickerTimer = setInterval(() => {
          this.$tray.setImage(icon)
          icon = icon === this.messageTrayIcon ? this.noMessageTrayIcon : this.messageTrayIcon
        }, 1000)
      } else {
        this.$tray.setImage(icon)
      }
    } else {
      clearInterval(this._flickerTimer)
      this._flickerTimer = null
      this.$tray.setImage(this.noMessageTrayIcon)
    }
  }

  /**
   * 判断托盘是否销毁
   */
  isDestroyed () {
    return this.$tray.isDestroyed()
  }

  /**
   * 销毁托盘图标
   */
  destroy () {
    return this.$tray.destroy()
  }
}
