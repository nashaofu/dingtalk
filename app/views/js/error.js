const { ipcRenderer, webFrame, remote } = require('electron')
class Injector {
  constructor () {
    this.initialize()
  }

  // 初始化
  initialize () {
    window.addEventListener('load', () => {
      this.injectJs()
    })
  }

  // 注入JS
  injectJs () {
    this.setZoomLevel()
    this.online()
    this.retry()
    this.close()
  }

  setZoomLevel () {
    // 设置缩放限制
    webFrame.setZoomFactor(100)
    webFrame.setZoomLevel(0)
    webFrame.setVisualZoomLevelLimits(1, 1)
  }

  online () {
    window.addEventListener('online', () => {
      ipcRenderer.send('online')
    })
    if (navigator.onLine) {
      return ipcRenderer.send('online')
    } else {
      return ipcRenderer.send('offline')
    }
  }

  retry () {
    const $retry = document.querySelector('.error-container-retry')
    $retry.addEventListener('click', () => {
      ipcRenderer.send('retry')
    })
  }

  close () {
    const $close = document.querySelector('.error-container-close')
    $close.addEventListener('click', () => {
      remote.getCurrentWindow().destroy()
    })
  }
}

new Injector()
