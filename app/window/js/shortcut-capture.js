const { ipcRenderer, webFrame } = require('electron')

class Injector {
  constructor () {
    this.initialize()
  }

  initialize () {
    // 只要loading结束
    // 不论页面加载是否成功都会执行
    ipcRenderer.on('did-finish-load', () => {
      this.injectJs()
    })
  }

  injectJs () {
    this.setZoomLevel()
    this.shortcutCapture()
    this.cancel()
  }

  setZoomLevel () {
    // 设置缩放限制
    webFrame.setZoomFactor(100)
    webFrame.setZoomLevel(0)
    webFrame.setVisualZoomLevelLimits(1, 1)
  }

  shortcutCapture () {
    this.$canvas = document.querySelector('#canvas')
    this.ctx = this.$canvas.getContext('2d')
    this.$canvas.width = 0
    this.$canvas.height = 0
    this.capture = document.querySelector('#capture')
    this.capture.addEventListener('load', () => {
      this.onDrawImage()
    })

    this.capture.src = window.params.source.thumbnail
  }

  onDrawImage () {
    const start = {
      x: 0,
      y: 0
    }
    const end = {
      x: 0,
      y: 0
    }
    let isDraw = false
    window.addEventListener('mousedown', e => {
      // 鼠标左键
      if (e.button === 0) {
        isDraw = true
        start.x = end.x = e.clientX
        start.y = end.y = e.clientY
      }
    })
    window.addEventListener('mousemove', e => {
      if (!isDraw) {
        return
      }
      end.x = e.clientX
      end.y = e.clientY
      this.drawImage(start, end)
    })
    window.addEventListener('mouseup', e => {
      if (!isDraw) {
        return
      }
      end.x = e.clientX
      end.y = e.clientY
      isDraw = false
      this.drawImage(start, end)
    })
  }

  drawImage (start, end) {
    const width = Math.abs(end.x - start.x)
    const height = Math.abs(end.y - start.y)
    this.$canvas.width = width
    this.$canvas.height = height
    let style = {}
    if (end.y > start.y) {
      style.top = start.y + 'px'
    } else {
      style.bottom = window.innerHeight - start.y + 'px'
    }
    if (end.x > start.x) {
      style.left = start.x + 'px'
    } else {
      style.right = window.innerWidth - start.x + 'px'
    }
    style = Object.keys(style).map(key => `${key}:${style[key]}`).join(';')
    this.$canvas.setAttribute('style', style)
    this.ctx.clearRect(0, 0, width, height)
    this.ctx.drawImage(this.capture, start.x < end.x ? start.x : end.x, start.y < end.y ? start.y : end.y, width, height, 0, 0, width, height)
  }

  cancel () {
    window.addEventListener('keydown', e => {
      if (e.keyCode === 27) {
        ipcRenderer.send('cancel-shortcut-capture')
      }
    })
  }
}

new Injector()
