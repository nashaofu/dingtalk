import open from './open'
import download from './download'
import openEmail from './openEmail'
import { webFrame } from 'electron'
import winOperation from './winOperation'
import notifyMessage from './notifyMessage'
import './css.less'
import logout from './logout'

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
    this.injectJs()
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
    /**
     * 登录被弹出监听
     */
    this.logout()
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

  // 登录被弹出劫持
  logout () {
    logout(this)
  }

  // window.open重写
  open () {
    open(this)
  }
}

/* eslint-disable no-new */
new MainWinInjector()
