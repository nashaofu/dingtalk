const { ipcRenderer, webFrame } = require('electron')
class EmailWinInjector {
  href = null
  constructor () {
    this.init()
  }

  // 初始化
  init () {
    ipcRenderer.on('dom-ready', (e, url) => {
      this.href = url
      this.injectJs()
    })
  }

  // 注入JS
  injectJs () {
    this.setZoomLevel()
    // 代理重写console.error
    this.proxyConsoleError()
  }

  setZoomLevel () {
    // 设置缩放限制
    webFrame.setZoomFactor(100)
    webFrame.setZoomLevel(0)
    webFrame.setVisualZoomLevelLimits(1, 1)
  }

  proxyConsoleError () {
    const errorDiv = document.querySelector('#errorDiv')
    if (errorDiv) {
      errorDiv.innerHTML = '加载中...'
    }
    const consoleError = console.error
    // 劫持重写console.error
    console.error = err => {
      if (err === 'Not in DingTalk PC webview') {
        setTimeout(() => {
          const errorDiv = document.querySelector('#errorDiv')
          if (errorDiv) {
            errorDiv.innerHTML = '<h2>加载失败,正在重试</h2>'
            setTimeout(() => {
              // 页面没有加载出来时刷新页面
              if (window.location.href === this.href) {
                window.location.reload()
              } else {
                window.location.href = this.href
              }
            }, 1000)
          }
        })
      }
      consoleError(err)
    }
  }
}

new EmailWinInjector()
