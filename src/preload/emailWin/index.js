const { ipcRenderer, webFrame } = require('electron')

class EmailWinInjector {
  constructor () {
    this.href = null
    this.cookie = null
    this.localStorage = null
    this.sessionStorage = null
    this.init()
  }

  // 初始化
  init () {
    ipcRenderer.on('dom-ready', (e, storage) => {
      const url = Object
        .keys(storage.localStorage)
        .find(key => /^\d+_mailUrl/.test(key))
      this.href = decodeURIComponent(storage.localStorage[url])
      this.cookie = storage.cookie
      this.localStorage = storage.localStorage
      this.sessionStorage = storage.sessionStorage
      this.injectJs()
    })
  }

  // 注入JS
  injectJs () {
    this.setZoomLevel()
    this.setStorage()
  }

  setZoomLevel () {
    // 设置缩放限制
    webFrame.setZoomFactor(100)
    webFrame.setZoomLevel(0)
    webFrame.setVisualZoomLevelLimits(1, 1)
  }

  /**
   * 本来以为在本地写入localStorage等信息
   * 就可以正常使用钉邮了
   * 结果我想是我想多了
   * 代码先留着吧
   */
  setStorage () {
    document.cookie = this.cookie
    Object
      .keys(this.localStorage)
      .forEach(key => localStorage.setItem(key, this.localStorage[key]))
    Object
      .keys(this.sessionStorage)
      .forEach(key => sessionStorage.setItem(key, this.sessionStorage[key]))
  }
}

new EmailWinInjector()
