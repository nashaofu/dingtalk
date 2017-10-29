const {
  ipcRenderer,
  webFrame
} = require('electron')

class Injector {
  constructor () {
    this.initialize()
  }

  initialize () {
    // 只要loading结束
    // 不论页面加载是否成功都会执行
    ipcRenderer.on('dom-ready', () => {
      this.injectJs()
    })
  }

  injectJs () {
    this.setZoomLevel()
    this.shortcutCapture()
    this.cancel()
    this.cancelDraw()
    this.checkDraw()
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
    this.$capture = document.querySelector('#capture')
    this.$capture.addEventListener('load', () => {
      this.onDrawImage()
    })

    this.$capture.src = window.source.thumbnail
    this.$captureToolbar = document.querySelector('#capture-toolbar')
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
      this.drawImage(start, end, true)
    })
  }

  drawImage (start, end, isShowToobar) {
    const width = Math.abs(end.x - start.x)
    const height = Math.abs(end.y - start.y)
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
    ['left', 'right', 'top', 'bottom'].forEach(key => {
      this.$canvas.style[key] = ''
      this.$captureToolbar.style[key] = ''
    })

    Object.keys(style).forEach(key => {
      this.$canvas.style[key] = style[key]
    })
    const toolbarWidth = this.$captureToolbar.offsetWidth
    const toolbarHeight = this.$captureToolbar.offsetHeight
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    // 清空绘图区域
    this.ctx.clearRect(0, 0, windowWidth, windowHeight)

    if (width <= 2 || height <= 2) {
      this.$canvas.width = 0
      this.$canvas.height = 0
      this.$canvas.style.visibility = 'hidden'
      this.$captureToolbar.style.visibility = 'hidden'
      return
    } else {
      this.$canvas.width = width
      this.$canvas.height = height
      this.$canvas.style.visibility = 'visible'
      if (!isShowToobar) {
        this.$captureToolbar.style.visibility = 'hidden'
      } else {
        this.$captureToolbar.style.visibility = 'visible'
      }
    }
    const x = start.x < end.x ? start.x : end.x
    const y = start.y < end.y ? start.y : end.y
    let left = x + width - toolbarWidth
    let top = y + height + 7
    if (left < 0) {
      left = 0
    }
    if (left + toolbarWidth > windowWidth) {
      left = windowWidth - toolbarWidth
    }
    this.$captureToolbar.style.left = left + 'px'
    if (top + toolbarHeight > windowHeight) {
      top = y - toolbarHeight
    }
    if (top < 0) {
      top = 0
    }
    this.$captureToolbar.style.top = top + 'px'
    this.ctx.drawImage(this.$capture, x, y, width, height, 0, 0, width, height)
  }

  cancel () {
    window.addEventListener('keydown', e => {
      if (e.keyCode === 27) {
        this.drawImage({ x: 0, y: 0 }, { x: 0, y: 0 })
        ipcRenderer.send('cancel-shortcut-capture')
      }
    })
  }

  cancelDraw () {
    const $cancel = document.querySelector('#cancel')
    $cancel.addEventListener('mousedown', e => {
      e.stopPropagation()
    })
    $cancel.addEventListener('click', e => {
      e.stopPropagation()
      this.drawImage({ x: 0, y: 0 }, { x: 0, y: 0 })
    })
  }

  checkDraw () {
    const $check = document.querySelector('#check')
    $check.addEventListener('mousedown', e => {
      e.stopPropagation()
    })
    $check.addEventListener('click', e => {
      e.stopPropagation()
      const dataURL = this.ctx.canvas.toDataURL('image/png')
      ipcRenderer.send('set-shortcut-capture', dataURL)
      this.drawImage({ x: 0, y: 0 }, { x: 0, y: 0 })
    })
  }
}

new Injector()
