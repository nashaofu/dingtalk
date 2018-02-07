const {
  ipcRenderer,
  desktopCapturer,
  remote
} = require('electron')
const _ = require('lodash')

class ShortcutCapture {
  constructor () {
    this.initialize()
  }

  onShortcutCapture () {
    ipcRenderer.on('shortcut-capture', () => {
      const $win = remote.getCurrentWindow()
      desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: {
          width: screen.width,
          height: screen.height
        }
      }, (error, sources) => {
        if (!error) {
          sources.find(item =>)
        }
      })
    })
  }
}
