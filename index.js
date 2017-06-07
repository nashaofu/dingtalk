const path = require('path')
const url = require('url')
const { app, BrowserWindow, Menu, Tray, ipcMain } = require('electron')

class App {
  constructor() {
    this.app = app
    this.ipcMain = ipcMain

    // 应用中的对象
    this.$window = null
    this.$tray = null

    this.url = null

    // 判断是否通过任务栏图标点击关闭命令来关闭的程序
    // 禁止通过除了关闭命令之外的方式(键盘按钮)来关闭应用
    // 当通过其他方式来关闭应用时只会隐藏应用窗口
    this.isClose = false
    // 窗口是否最大化了
    this.maximize = false

    this.initialize()
  }
  initialize() {
    // 应用准备完毕
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
      this.createWindow()
      this.createTray()
    })

    // 应用被重新启动
    this.app.on('activate', () => {
      this.createWindow()
      this.createTray()
    })

    // 当应用的所有窗口关闭时
    this.app.on('window-all-closed', () => {
      if (this.$tray) {
        this.$tray.destroy()
        this.$tray = null
      }
      if (this.$window) {
        this.$window.destroy()
        this.$window = null
      }
      if (process.platform !== 'darwin') {
        this.app.quit()
      }
    })

    // 渲染进程通信监听
    this.ipcMain.on('minimize', () => {
      this.$window.minimize()
    })
    // 渲染进程通信监听
    this.ipcMain.on('maximization', () => {
      if (this.maximize) {
        this.$window.unmaximize()
        this.maximize = false
      } else {
        this.$window.maximize()
        this.maximize = true
      }
    })
    // 渲染进程通信监听
    this.ipcMain.on('close', () => {
      this.$window.hide()
    })
  }
  createWindow() {
    if (this.window) {
      return
    }
    // 创建浏览器窗口。
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

    this.$window.on('close', e => {
      if (!this.isClose) {
        e.preventDefault()
        this.$window.hide()
      }
    })

    // 窗口关闭后
    this.$window.on('closed', () => {
      this.$window = null
    })

    // this.$window.webContents.openDevTools()
    if (!this.url) {
      this.url = url.format({
        pathname: path.join(__dirname, './window/index.html'),
        protocol: 'file:',
        slashes: true
      })
    }
    // 地址
    this.$window.loadURL(this.url)
  }
  createTray() {
    if (this.$tray) {
      return
    }
    // 托盘图标及其菜单项
    this.$tray = new Tray(path.join(__dirname, './icon/48x48.png'))
    const menu = Menu.buildFromTemplate([{
      label: '显示窗口',
      click: e => {
        this.$window.show()
      }
    }, {
      label: '退出',
      click: e => {
        this.isClose = true
        this.$tray.destroy()
        this.$window.close()
      }
    }])
    this.$tray.setToolTip('钉钉')
    this.$tray.setContextMenu(menu)
    this.$tray.on('double-click', () => {
      this.$window.show()
    })
  }
}

new App()
