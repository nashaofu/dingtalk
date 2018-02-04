const fs = require('fs')
const _ = require('lodash')
const path = require('path')
const axios = require('axios')
const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  Tray,
  shell,
  dialog
} = require('electron')

const download = require('./plugins/download')
const shortcutCapture = require('./plugins/shortcut-capture')

exports = module.exports = class DingTalk {
  // 构造函数
  constructor () {
    // 应用窗体
    this.$mainWindow = null
    this.$window = null
    this.online = true
    this.$errorWindow = null
    this.$settingWindow = null

    // 任务栏图标
    this.$tray = null
    this.setting = {
      keymap: {
        'shortcut-capture': 'Control+Alt+a'
      }
    }
    // 判断是否通过任务栏图标点击关闭命令来关闭的程序
    // 禁止通过除了关闭命令之外的方式(键盘按钮)来关闭应用
    // 当通过其他方式来关闭应用时只会隐藏应用窗口
    this.isClose = false

    // 初始化应用
    this.initialize()
  }

  // 初始化
  initialize () {
    this.getSetting()
    // 主进程事件
    this.onReady()
    this.onActivate()

    // ===============================
    // 渲染进程事件
    // ===============================
    // 工具栏按钮事件
    this.onMinimize()
    this.onMaximization()
    this.onClose()

    // 消息通知
    this.onSetBadgeCount()
    // 点击消息通知后打开窗口
    this.onShow()
    // 点击邮箱之后打开新窗口
    this.onOpneEmail()
    // 设置保存事件
    this.onSetting()
    this.onOnline()
    this.onRetry()
    this.onOffline()
  }

  getSetting () {
    const settingPath = path.join(app.getPath('userData'), 'setting.json')
    if (!fs.existsSync(settingPath)) {
      fs.writeFileSync(settingPath, JSON.stringify(this.setting, null, 2))
    }
    try {
      this.setting = _.merge(this.setting, JSON.parse(fs.readFileSync(settingPath)))
    } catch (e) {
      console.error(e)
    }
  }

  // 应用准备完毕时执行
  onReady () {
    app.on('ready', () => {
      // 移除菜单项
      Menu.setApplicationMenu(null)
      // 同时只能运行一个人实例
      const shouldQuit = app.makeSingleInstance(() => {
        if (this.$window) {
          this.$window.show()
          this.$window.focus()
        }
        return true
      })
      if (shouldQuit) {
        app.quit()
        return
      }
      // 屏幕截图支持
      this.$mainWindow = shortcutCapture(this)
      // 创建窗体
      this.createWindow()
      // 创建任务栏图标
      this.createTray()
    })
  }

  // 应用被重新启动时时间处理
  onActivate () {
    app.on('activate', () => {
      this.createWindow()
      this.createTray()
    })
  }

  // 最小化(页面点击)
  onMinimize () {
    ipcMain.on('window-minimize', () => {
      if (this.$window) {
        this.$window.minimize()
      }
    })
  }

  // 最大化(页面点击)
  onMaximization () {
    ipcMain.on('window-maximization', () => {
      if (this.$window.isMaximized()) {
        if (this.$window) {
          this.$window.unmaximize()
        }
      } else {
        if (this.$window) {
          this.$window.maximize()
        }
      }
    })
  }

  // 关闭(页面点击)
  onClose () {
    // 渲染进程通信监听
    ipcMain.on('window-close', () => {
      if (this.$window) {
        this.$window.hide()
      }
    })
  }

  // 设置应用在badge上的值(linux、macos)
  onSetBadgeCount () {
    // 渲染进程通信监听
    ipcMain.on('set-badge', (e, count) => {
      if (app) {
        app.setBadgeCount(count)
      }
    })
  }

  // 显示窗体
  onShow () {
    // 渲染进程消息通知点击后打开窗体
    ipcMain.on('window-show', () => {
      if (this.$window) {
        // 显示窗口并激活
        this.$window.show()
        this.$window.focus()
      }
    })
  }

  // 渲染进程通知打开邮件新窗体
  onOpneEmail () {
    let $emailWindow = null
    // 渲染进程消息通知点击后打开窗体
    ipcMain.on('open-email', (e, url) => {
      if ($emailWindow) {
        $emailWindow.show()
        $emailWindow.focus()
        return
      }
      $emailWindow = new BrowserWindow({
        title: '钉邮',
        width: 980,
        height: 640,
        minWidth: 720,
        minHeight: 450,
        useContentSize: true,
        resizable: true,
        menu: false,
        icon: path.join(__dirname, '../icon/32x32.png'),
        webPreferences: {
          preload: path.join(__dirname, './views/js/email.js')
        }
      })
      // 加载URL地址
      $emailWindow.loadURL(url)
      // 右键上下文菜单
      $emailWindow.webContents.on('context-menu', (e, params) => {
        e.preventDefault()
        this.buildContextMenu(params, $emailWindow)
      })
      // 窗口关闭后手动让$window为null
      $emailWindow.on('closed', () => {
        $emailWindow = null
      })
    })
  }

  onSetting () {
    ipcMain.on('setting', (e, setting) => {
      this.setting = _.merge(this.setting, setting)
      const settingPath = path.join(app.getPath('userData'), 'setting.json')
      fs.writeFileSync(settingPath, JSON.stringify(this.setting, null, 2))
      this.$mainWindow = shortcutCapture(this)
    })
  }

  onOnline () {
    ipcMain.on('online', () => {
      this.online = true
      if (!this.$window) {
        return
      }
      this.$window.reload()
      this.$window.show()
      this.$window.focus()
      if (!this.$errorWindow) {
        return
      }
      this.$errorWindow.destroy()
    })
  }

  onRetry () {
    ipcMain.on('retry', () => {
      if (!this.$errorWindow) {
        return
      }
      this.$errorWindow.show()
      this.$errorWindow.focus()
      this.$errorWindow.reload()
    })
  }

  onOffline () {
    ipcMain.on('offline', () => {
      this.online = false
      this.showErrorWindow()
    })
  }

  quit () {
    this.isClose = true
    this.$tray.destroy()
    this.$tray = null
    if (this.$window) {
      this.$window.close()
      this.$window = null
    }
    BrowserWindow.getAllWindows()
      .forEach(item => {
        item.destroy()
      })
    app.quit()
  }

  // 创建窗体
  createWindow () {
    if (this.$window) {
      return
    }
    // 创建浏览器窗口
    this.$window = new BrowserWindow({
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
      icon: path.join(__dirname, '../icon/32x32.png'),
      resizable: true,
      webPreferences: {
        preload: path.join(__dirname, './views/js/main.js')
      }
    })

    // 页面初始化完成之后再显示窗口
    // 并检测是否有版本更新
    this.$window.once('ready-to-show', () => {
      this.$window.show()
      this.$window.focus()
      this.uploader()

      // 文件下载监听
      download(this)
    })

    // 窗体关闭事件处理
    // 如果不是通过任务栏关闭
    // 则只会隐藏窗口
    this.$window.on('close', (e) => {
      if (!this.isClose) {
        e.preventDefault()
        if (this.$window) {
          this.$window.hide()
        }
      }
    })

    this.$window.on('show', () => {
      if (!this.online) {
        this.$window.hide()
        this.showErrorWindow()
      }
    })

    // 窗口关闭后手动让$window为null
    this.$window.on('closed', () => {
      this.$window = null
    })

    // 创建上下文菜单
    this.createContextMenu()
    // 浏览器中打开链接
    this.openURLEvent()

    // 加载URL地址
    this.$window.loadURL('https://im.dingtalk.com/')
  }

  // 创建任务栏图标
  createTray () {
    if (this.$tray) {
      return
    }
    // 生成托盘图标及其菜单项实例
    this.$tray = new Tray(path.join(__dirname, '../icon/24x24.png'))
    const trayMenu = this.createTrayMenu()
    // 设置鼠标悬浮时的标题
    this.$tray.setToolTip('钉钉')
    // 绑定菜单
    this.$tray.setContextMenu(trayMenu)
    // 由于双击时显示窗体在linux上无效
    // 所以改为单击显示窗体
    this.$tray.on('click', () => {
      if (this.$window) {
        this.$window.show()
      }
    })
    this.$tray.on('double-click', () => {
      if (!this.online) {
        return this.showErrorWindow()
      }
      if (this.$window) {
        this.$window.show()
      }
    })
  }

  // 创建任务栏图标菜单列表
  createTrayMenu () {
    return Menu.buildFromTemplate([
      {
        label: '显示窗口',
        click: () => {
          if (!this.online) {
            return this.showErrorWindow()
          }
          if (this.$window) {
            this.$window.show()
          }
        }
      },
      {
        label: '屏幕截图',
        click: () => {
          if (this.$window) {
            this.$mainWindow.webContents.send('shortcut-capture')
          }
        }
      },
      {
        label: '设置',
        click: () => this.showSetting()
      },
      {
        label: '退出',
        click: () => this.quit()
      }
    ])
  }

  showErrorWindow () {
    if (this.$errorWindow) {
      this.$errorWindow.show()
      this.$errorWindow.focus()
      return
    }
    this.$errorWindow = new BrowserWindow({
      title: '网络错误',
      width: 600,
      height: 320,
      useContentSize: true,
      resizable: false,
      center: true,
      frame: false,
      menu: false,
      transparent: true,
      show: false,
      closable: false,
      skipTaskbar: true,
      icon: path.join(__dirname, '../icon/32x32.png')
    })

    this.$errorWindow.on('ready-to-show', () => {
      this.$window.hide()
      this.$errorWindow.show()
      this.$errorWindow.focus()
    })
    this.$errorWindow.on('closed', () => {
      this.$errorWindow = null
    })
    // 加载URL地址
    this.$errorWindow.loadURL(`file://${__dirname}/views/error.html`)
  }

  showSetting () {
    if (this.$settingWindow) {
      this.$settingWindow.show()
      this.$settingWindow.focus()
      return
    }
    this.$settingWindow = new BrowserWindow({
      title: '设置',
      width: 320,
      height: 180,
      useContentSize: true,
      resizable: false,
      menu: false,
      parent: this.$window,
      modal: true,
      icon: path.join(__dirname, '../icon/32x32.png')
    })
    // 右键上下文菜单
    this.$settingWindow.webContents.on('context-menu', (e, params) => {
      e.preventDefault()
      this.buildContextMenu(params, this.$settingWindow)
    })

    // 窗口关闭后手动让$window为null
    this.$settingWindow.on('closed', () => {
      this.$settingWindow = null
    })
    this.$settingWindow.webContents.on('dom-ready', () => {
      this.$settingWindow.webContents.send('dom-ready', this.setting)
    })
    // 加载URL地址
    this.$settingWindow.loadURL(`file://${__dirname}/views/setting.html`)
  }

  // 打开新链接窗口
  openURLEvent () {
    if (!this.$window || !this.$window.webContents) {
      return
    }
    this.$window.webContents.on('new-window', (e, url) => {
      e.preventDefault()
      if (url !== 'about:blank') {
        shell.openExternal(url)
      }
    })
  }

  // 创建上下文菜单
  createContextMenu () {
    if (!this.$window || !this.$window.webContents) {
      return
    }
    this.$window.webContents.on('context-menu', (e, params) => {
      e.preventDefault()
      this.buildContextMenu(params, this.$window)
    })
  }

  buildContextMenu (params, $win) {
    // 菜单执行命令
    const menuCmd = {
      copy: {
        id: 1,
        label: '复制'
      },
      cut: {
        id: 2,
        label: '剪切'
      },
      paste: {
        id: 3,
        label: '粘贴'
      },
      selectall: {
        id: 4,
        label: '全选'
      }
    }

    const { selectionText, isEditable, editFlags } = params

    // 生成菜单模板
    const template = Object.keys(menuCmd)
      .map(cmd => {
        const { id, label } = menuCmd[cmd]
        let enabled = false
        let visible = false
        const { canCopy, canCut, canPaste, canSelectAll } = editFlags
        switch (cmd) {
          case 'copy':
            // 有文字选中就显示
            visible = !!selectionText
            enabled = canCopy
            break
          case 'cut':
            // 可以编辑就显示项目
            visible = !!isEditable
            // 有文字选中才可用
            enabled = visible && !!selectionText && canCut
            break
          case 'paste':
            // 可以编辑就显示项目
            visible = !!isEditable
            enabled = visible && canPaste
            break
          case 'selectall':
            // 可以编辑就显示项目
            visible = !!isEditable
            enabled = visible && canSelectAll
            break
          default:
            break
        }
        return {
          id,
          label,
          role: cmd,
          enabled,
          visible
        }
      })
      .filter(item => item.visible)
      .sort((a, b) => a.id > b.id)

    // 用模板生成菜单
    if (template.length) {
      const menu = Menu.buildFromTemplate(template)
      menu.popup($win)
    }
  }

  // 应用更新检查
  uploader () {
    axios.get('https://api.github.com/repos/nashaofu/dingtalk/releases/latest')
      .then(({ data }) => {
        // 检查版本号
        // 如果本地版本小于远程版本则更新
        if (data.tag_name.slice(1) > app.getVersion()) {
          dialog.showMessageBox(this.$window, {
            type: 'question',
            title: '版本更新',
            message: '检测到有新版本，是否立即更新？',
            detail: `版本号：${data.tag_name}`,
            buttons: ['确定', '取消'],
            cancelId: 1
          }, index => {
            if (index === 0 && data.assets[0]) {
              shell.openExternal(data.assets[0].browser_download_url)
            }
          })
        }
      })
  }
}
