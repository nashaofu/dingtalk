const {
  screen,
  remote,
  webFrame,
  ipcRenderer,
  desktopCapturer
} = require('electron')
const { maxBy } = require('lodash')

class ShortcutCapture {
  constructor () {
    this.$window = remote.getCurrentWindow()
    this.$canvas = document.querySelector('#canvas')
    this.$toolbar = document.querySelector('#toolbar')
    this.ctx = this.$canvas.getContext('2d')

    this.setZoomLevel()
    this.onShortcutCapture()
    this.onScreen()
    this.initView()
  }

  get displays () {
    return screen.getAllDisplays()
      .map(({ id, bounds, scaleFactor }) => ({
        id,
        width: bounds.width,
        height: bounds.height,
        x: bounds.x,
        y: bounds.y,
        scaleFactor
      }))
  }

  get bounds () {
    return this.displays
      .reduce((size, { width, height, x, y }) => {
        if (size.width < x + width) {
          size.width = x + width
        }
        if (size.height < y + height) {
          size.height = y + height
        }
        return size
      }, {
        width: 0,
        height: 0,
        x: 0,
        y: 0
      })
  }

  setZoomLevel () {
    // 设置缩放限制
    webFrame.setZoomFactor(100)
    webFrame.setZoomLevel(0)
    webFrame.setVisualZoomLevelLimits(1, 1)
  }

  onShortcutCapture () {
    ipcRenderer.on('shortcut-capture', () => {
      const displays = this.displays
      const maxDisplay = maxBy(displays, display => display.width * display.height * display.scaleFactor)

      desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: {
          width: maxDisplay.width,
          height: maxDisplay.height
        }
      }, (error, sources) => {
        if (!error) {
          sources = sources.map(({ thumbnail }, index) => {
            const display = displays[index]
            // 以第一个屏幕为基准缩放
            const scale = display.scaleFactor / displays[0].scaleFactor
            const width = display.width * scale
            const height = display.height * scale
            return {
              x: display.x,
              y: display.y,
              width,
              height,
              thumbnail: thumbnail.toPNG()
            }
          })
          this.$window.show()
          this.$window.focus()
          this.$window.setBounds(this.bounds)
          this.draw(sources)
        }
      })
    })
  }

  onScreen () {
    screen.on('display-added', () => this.$window.setBounds(this.bounds))
    screen.on('display-removed', () => this.$window.setBounds(this.bounds))
    screen.on('display-metrics-changed', () => this.$window.setBounds(this.bounds))
  }

  initView () {
    this.$canvas.width = 0
    this.$canvas.height = 0
    this.onDrawImage()
  }

  draw (sources) {
    const $bg = document.querySelector('#bg')
    $bg.innerHTML = ''
    sources.forEach(({ x, y, width, height, thumbnail }) => {
      const $img = document.createElement('img')
      // $img.addEventListener('load', () => {
      //   this.onDrawImage()
      // })
      const style = {
        position: 'absolute',
        top: `${y}px`,
        left: `${x}px`,
        width: `${width}px`,
        height: `${height}px`
      }
      $img.setAttribute('style', Object.keys(style).map(key => `${key}:${style[key]}`).join(';'))
      $bg.appendChild($img)

      const blob = new Blob([thumbnail], { type: 'image/png' })
      $img.src = URL.createObjectURL(blob)
    })
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
      this.$toolbar.style[key] = ''
    })

    Object.keys(style).forEach(key => {
      this.$canvas.style[key] = style[key]
    })
    const toolbarWidth = this.$toolbar.offsetWidth
    const toolbarHeight = this.$toolbar.offsetHeight
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    // 清空绘图区域
    this.ctx.clearRect(0, 0, windowWidth, windowHeight)

    if (width <= 2 || height <= 2) {
      this.$canvas.width = 0
      this.$canvas.height = 0
      this.$canvas.style.visibility = 'hidden'
      this.$toolbar.style.visibility = 'hidden'
      return
    } else {
      this.$canvas.width = width
      this.$canvas.height = height
      this.$canvas.style.visibility = 'visible'
      if (!isShowToobar) {
        this.$toolbar.style.visibility = 'hidden'
      } else {
        this.$toolbar.style.visibility = 'visible'
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
    this.$toolbar.style.left = left + 'px'
    if (top + toolbarHeight > windowHeight) {
      top = y - toolbarHeight
    }
    if (top < 0) {
      top = 0
    }
    this.$toolbar.style.top = top + 'px'
    const $bg = document.querySelector('#bg')
    this.ctx.drawImage($bg.querySelectorAll('img')[0], x, y, width, height, 0, 0, width, height)
  }

  cancel () {
    window.addEventListener('keydown', e => {
      if (e.keyCode === 27) {
        this.drawImage({ x: 0, y: 0 }, { x: 0, y: 0 })
        this.$window.hide()
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
      ipcRenderer.send('shortcut-capture', dataURL)
      this.drawImage({ x: 0, y: 0 }, { x: 0, y: 0 })
      this.$window.hide()
    })
  }
}
new ShortcutCapture()
