const {
  ipcRenderer,
  desktopCapturer,
  screen
} = require('electron')
const _ = require('lodash')

ipcRenderer.on('shortcut-capture', () => {
  const displays = screen.getAllDisplays()
    .map(item => ({
      width: item.size.width,
      height: item.size.height,
      x: item.bounds.x,
      y: item.bounds.y,
      scaleFactor: item.scaleFactor
    }))

  // 用最大的屏幕去截屏，保证图片高清
  const max = _.maxBy(displays, item => item.width * item.height)
  desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: {
      width: max.width,
      height: max.height
    }
  }, (error, sources) => {
    if (!error) {
      sources = sources.map((item, i) => {
        const display = displays[i]
        return {
          display,
          thumbnail: item.thumbnail.resize({
            width: display.width,
            height: display.height,
            quality: 'best'
          }).toDataURL()
        }
      })
    }
    ipcRenderer.send('shortcut-capture', sources)
  })
})
