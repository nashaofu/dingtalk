const { globalShortcut } = require('electron')

// 保证函数只执行一次
let isRuned = false
module.exports = mainWindow => {
  if (isRuned) {
    return
  }
  isRuned = true
  globalShortcut.register('ctrl+alt+a', function () {
    mainWindow.webContents.send('shortcut-capture', 1)
  })
}
