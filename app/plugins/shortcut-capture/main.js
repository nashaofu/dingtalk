const {
  globalShortcut,
  ipcMain,
  clipboard,
  nativeImage
} = require('electron')

const initWindow = require('./initWindow')

let $window = null
let shortcutKey = null

module.exports = ({
  key
}) => {
  if (globalShortcut.isRegistered(key)) {

  }
  // 取消原有快捷键
  if (shortcutKey) {
    globalShortcut.unregister(shortcutKey)
  }
  $window = initWindow()

  // 注册全局快捷键
  globalShortcut.register(key, () => {
    // $window.setAlwaysOnTop(true)
    $window.webContents.send('shortcut-capture')
  })

  shortcutKey = key

  ipcMain.on('shortcut-capture', (e, dataURL) => {
    clipboard.writeImage(nativeImage.createFromDataURL(dataURL))
  })
  return $window
}
