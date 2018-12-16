const { ipcRenderer, webFrame } = require('electron')

class EmailWinInjector {
  constructor () {
    this.init()
  }

  // 初始化
  init () {
    ipcRenderer.on('dom-ready', () => {
      this.injectJs()
    })
  }

  // 注入JS
  injectJs () {
    this.setZoomLevel()
  }

  setZoomLevel () {
    // 设置缩放限制
    webFrame.setZoomFactor(100)
    webFrame.setZoomLevel(0)
    webFrame.setVisualZoomLevelLimits(1, 1)
  }
}

new EmailWinInjector()
