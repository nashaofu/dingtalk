const { webFrame, remote, ipcRenderer } = require('electron')
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
    this.initUI()
    this.shortcutCapture()
    this.save()
    this.cancel()
  }

  setZoomLevel () {
    // 设置缩放限制
    webFrame.setZoomFactor(100)
    webFrame.setZoomLevel(0)
    webFrame.setVisualZoomLevelLimits(1, 1)
  }

  initUI () {
    ipcRenderer.send('setting-ready')
    ipcRenderer.on('send-setting', (e, setting) => {
      this.setting = setting
      this.$shortcutCapture.value = this.setting.keymap['shortcut-capture']
    })
  }

  shortcutCapture () {
    this.$shortcutCapture = document.querySelector('#shortcut-capture')
    this.keys = []
    this.$shortcutCapture.addEventListener('keydown', e => {
      if (!e.ctrlKey) {
        this.keys = []
        return setValue()
      }
      if (this.keys[this.keys.length - 1] === e.key || e.key === 'Process') {
        this.$shortcutCapture.value = this.keys.join('+')
        const end = this.keys.join('+').length
        this.$shortcutCapture.setSelectionRange(end, end)
        return setValue()
      }
      if (this.keys.length >= 3) {
        this.keys.pop()
      }
      if (e.key === 'Control' && this.keys.length === 0) {
        this.keys.push(e.key)
        return setValue()
      }
      if (this.keys[0] !== 'Control') {
        this.keys = []
        return setValue()
      }
      if (this.keys[0] === 'Control' && this.keys.indexOf(e.key) === -1) {
        this.keys.push(e.key)
      }
      return setValue()
    })
    this.$shortcutCapture.addEventListener('input', () => setValue())
    const setValue = () => {
      const value = this.keys.join('+')
      setTimeout(() => {
        this.$shortcutCapture.value = value
        this.$shortcutCapture.setSelectionRange(value.length, value.length)
      })
    }
  }

  save () {
    this.$save = document.querySelector('#save')
    this.$error = document.querySelector('#error')
    this.$save.addEventListener('click', () => {
      if (this.keys.length < 2) {
        this.$error.innerHTML = '输入的快捷键不合法！请至少包含两个键！'
        setTimeout(() => {
          this.$error.innerHTML = ''
        }, 2000)
        return
      } else {
        this.$error.innerHTML = ''
      }
      const setting = {
        keymap: {
          'shortcut-capture': this.keys.join('+')
        }
      }
      ipcRenderer.send('setting', setting)
      remote.getCurrentWindow().close()
      remote.getCurrentWindow().destroy()
    })
  }
  cancel () {
    this.$cancel = document.querySelector('#cancel')
    this.$cancel.addEventListener('click', () => {
      remote.getCurrentWindow().close()
      remote.getCurrentWindow().destroy()
    })
  }
}

new Injector()
