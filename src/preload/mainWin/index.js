import open from './open'
import download from './download'
import openEmail from './openEmail'
import rememberMe from './rememberMe'
import winOperation from './winOperation'
import notifyMessage from './notifyMessage'
import { ipcRenderer, webFrame } from 'electron'

import './css.styl'

class MainWinInjector {
  constructor () {
    // timer循环数据
    this.callback = []
    this.timer = setInterval(() => {
      this.callback.forEach(item => item())
    }, 1000)
    this.init()
  }

  // 初始化
  init () {
    ipcRenderer.on('dom-ready', () => {
      ipcRenderer.send('online', navigator.onLine)
      if (!navigator.onLine) {
        return
      }
      this.injectJs()
    })
  }

  // 注入JS
  injectJs () {
    this.setZoomLevel()
    /**
     * 插入窗口操作按钮
     * 关闭/最大化/最小化
     */
    this.winOperation()
    /**
     * 检测是否需要插入记住我选项
     */
    this.rememberMe()

    /**
     * 劫持window.open
     */

    this.open()

    /**
     * 检测是否有未读消息
     * 发送未读消息条数到主进程
     */
    this.notifyMessage()

    /**
     * 打开邮箱界面
     */
    this.openEmail()
    /**
     * 文件下载监听
     */
    this.download()
  }

  // 设置缩放等级
  setZoomLevel () {
    // 设置缩放限制
    webFrame.setZoomFactor(100)
    webFrame.setZoomLevel(0)
    webFrame.setVisualZoomLevelLimits(1, 1)
  }

  setTimer (callback) {
    this.callback.push(callback)
  }

  // 插入窗口操作按钮
  winOperation () {
    winOperation(this)
  }

  // 插入记住我选项
  rememberMe () {
    rememberMe(this)
  }

  // 消息通知发送到主进程
  notifyMessage () {
    notifyMessage(this)
  }

  // 打开邮箱
  openEmail () {
    openEmail(this)
  }

  // 文件下载劫持
  download () {
    download(this)
  }

  // window.open重写
  open () {
    open(this)
  }
}

new MainWinInjector()
