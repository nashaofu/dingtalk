const { app, BrowserWindow, ipcMain, Menu, Tray } = require('electron')
const path = require('path')
const url = require('url')

exports = class DingTalk {
  // 构造函数
  constructor() {
    this.app = app
    this.ipcMain = ipcMain
    // 应用窗体
    this.$window = null
    // 任务栏图标
    this.$tray = null
    // 任务栏菜单
    this.$menu = null
    // 页面url
    this.url = null

    // 判断是否通过任务栏图标点击关闭命令来关闭的程序
    // 禁止通过除了关闭命令之外的方式(键盘按钮)来关闭应用
    // 当通过其他方式来关闭应用时只会隐藏应用窗口
    this.isClose = false

    // 窗口是否最大化了
    this.maximize = false
    // 初始化应用
    this.initialize()
  }
  initialize() {
    // 主进程事件
    this.onReady()
    this.onActivate()
    this.onQuit()

    // 渲染进程事件
    this.onMinimize()
    this.onMaximization()
    this.onClose()
  }

  // 应用准备完毕时执行
  onReady() {
    this.app.on('ready', () => {
      // 同时只能运行一个人实例
      const shouldQuit = this.app.makeSingleInstance(() => {
        if (this.$window) {
          this.$window.show()
          this.$window.focus()
        }
        return true
      })
      if (shouldQuit) {
        this.app.quit()
        return
      }
      // 创建窗体
      this.createWindow()
      // 创建任务栏图标
      this.createTray()
    })
  }

  // 应用被重新启动时时间处理
  onActivate() {
    this.app.on('activate', () => {
      this.createWindow()
      this.createTray()
    })
  }

  // 当应用的所有窗口关闭时
  onQuit() {
    this.app.on('window-all-closed', () => {
      // 销毁任务栏图标
      if (this.$tray) {
        this.$tray.destroy()
        this.$tray = null
      }
      // 销毁窗体
      if (this.$window) {
        this.$window.destroy()
        this.$window = null
      }
      // Mac应用特殊处理
      // 保证一定清理掉程序
      if (process.platform !== 'darwin') {
        this.app.quit()
      }
    })
  }

  // 最小化(页面点击)
  onMinimize() {
    this.ipcMain.on('minimize', () => {
      if (this.$window) {
        this.$window.minimize()
      }
    })
  }
  // 最大化(页面点击)
  onMaximization() {
    this.ipcMain.on('maximization', () => {
      if (this.maximize) {
        if (this.$window) {
          this.$window.unmaximize()
        }
        this.maximize = false
      } else {
        if (this.$window) {
          this.$window.maximize()
        }
        this.maximize = true
      }
    })
  }

  // 关闭(页面点击)
  onClose() {
    // 渲染进程通信监听
    this.ipcMain.on('close', () => {
      if (this.$window) {
        this.$window.hide()
      }
    })
  }

  // 穿件窗体
  createWindow() {
    if (this.$window) {
      return
    }
    // 创建浏览器窗口
    this.$window = new BrowserWindow({
      width: 960,
      height: 600,
      minWidth: 640,
      minHeight: 400,
      center: true,
      frame: false,
      backgroundColor: '#5a83b7',
      resizable: true
    })

    // 窗体关闭事件处理
    // 如果不是通过任务栏关闭
    // 则只会隐藏窗口
    this.$window.on('close', e => {
      if (!this.isClose) {
        e.preventDefault()
        if (this.$window) {
          this.$window.hide()
        }
      }
    })

    // 窗口关闭后手动让$window为null
    this.$window.on('closed', () => {
      this.$window = null
    })

    this.$window.webContents.openDevTools()

    // 得到初始化显示URL
    if (!this.url) {
      this.url = url.format({
        pathname: path.join(__dirname, './window/index.html'),
        protocol: 'file:',
        slashes: true
      })
    }
    // 加载URL地址
    this.$window.loadURL(this.url)
  }

  // 创建任务栏图标
  createTray() {
    if (this.$tray) {
      return
    }
    // 生成托盘图标及其菜单项实例
    this.$tray = new Tray(path.join(__dirname, './icon/48x48.png'))
    this.createMenu()
    // 设置鼠标悬浮时的标题
    this.$tray.setToolTip('钉钉')
    // 绑定菜单
    this.$tray.setContextMenu(this.$menu)
    // 双击时显示窗体(linux上无效)
    this.$tray.on('double-click', () => {
      if (this.$window) {
        this.$window.show()
      }
    })
  }
  createMenu() {
    if (this.$menu) {
      return
    }
    this.$menu = Menu.buildFromTemplate([{
      label: '显示窗口',
      click: () => {
        if (this.$window) {
          this.$window.show()
        }
      }
    }, {
      label: '退出',
      click: () => {
        // 关闭窗口
        this.isClose = true
        if (this.$tray) {
          this.$tray.destroy()
        }
        if (this.$window) {
          this.$window.close()
        }
      }
    }])
  }
}
