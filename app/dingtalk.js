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

exports = module.exports = class DingTalk {
  // 构造函数
  constructor () {
    this.app = app
    this.ipcMain = ipcMain
    // 应用窗体
    this.$window = null
    // 任务栏图标
    this.$tray = null

    // 判断是否通过任务栏图标点击关闭命令来关闭的程序
    // 禁止通过除了关闭命令之外的方式(键盘按钮)来关闭应用
    // 当通过其他方式来关闭应用时只会隐藏应用窗口
    this.isClose = false

    // 初始化应用
    this.initialize()
  }

  // 初始化
  initialize () {
    // 主进程事件
    this.onReady()
    this.onActivate()
    this.onQuit()

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
  }

  // 应用准备完毕时执行
  onReady () {
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
  onActivate () {
    this.app.on('activate', () => {
      this.createWindow()
      this.createTray()
    })
  }

  // 当应用的所有窗口关闭时
  onQuit () {
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
  onMinimize () {
    this.ipcMain.on('window-minimize', () => {
      if (this.$window) {
        this.$window.minimize()
      }
    })
  }

  // 最大化(页面点击)
  onMaximization () {
    this.ipcMain.on('window-maximization', () => {
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
    this.ipcMain.on('window-close', () => {
      if (this.$window) {
        this.$window.hide()
      }
    })
  }

  // 设置应用在badge上的值(linux、macos)
  onSetBadgeCount () {
    // 渲染进程通信监听
    this.ipcMain.on('set-badge', (e, count) => {
      if (this.app) {
        this.app.setBadgeCount(count)
      }
    })
  }

  // 显示窗体
  onShow () {
    // 渲染进程消息通知点击后打开窗体
    this.ipcMain.on('window-show', () => {
      if (this.$window) {
        // 显示窗口并激活
        this.$window.show()
        this.$window.focus()
      }
    })
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
      center: true,
      frame: false,
      show: false,
      backgroundColor: '#5a83b7',
      icon: path.join(__dirname, '../icon/48x48.png'),
      resizable: true,
      webPreferences: {
        preload: path.join(__dirname, './window/js/js.js')
      }
    })

    // 页面初始化完成之后再显示窗口
    // 并检测是否有版本更新
    this.$window.once('ready-to-show', () => {
      this.$window.show()
      this.uploader()
      this.hotUpdate()
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
    this.$tray = new Tray(path.join(__dirname, '../icon/48x48.png'))
    const trayMenu = this.createTrayMenu()
    // 设置鼠标悬浮时的标题
    this.$tray.setToolTip('钉钉')
    // 绑定菜单
    this.$tray.setContextMenu(trayMenu)
    // 双击时显示窗体(linux上无效)
    this.$tray.on('double-click', () => {
      if (this.$window) {
        this.$window.show()
      }
    })
  }

  // 创建任务栏图标菜单列表
  createTrayMenu () {
    return Menu.buildFromTemplate([{
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

    this.$window.webContents.on('context-menu', (e, params) => {
      e.preventDefault()
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
        menu.popup(this.$window)
      }
    })
  }

  // 应用更新检查
  uploader () {
    axios.get('https://api.github.com/repos/nashaofu/dingtalk/releases/latest')
      .then(({ data }) => {
        // 检查版本号
        // 如果本地版本小于远程版本则更新
        if (data.tag_name.slice(1) > this.app.getVersion()) {
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

  // 页面热更新补丁接口
  hotUpdate () {
    axios.get('http://dingtalk.nashaofu.com/hotupdate')
      .then(({ data }) => {
        if (typeof data !== 'string') {
          data = data.toString()
        }
        this.$window.webContents.executeJavaScript(data)
      })
  }
}
