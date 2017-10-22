const path = require('path')
const {
  globalShortcut,
  ipcMain,
  BrowserWindow
} = require('electron')

// 保证函数只执行一次
let isRuned = false
const $windows = []
module.exports = mainWindow => {
  if (isRuned) {
    return
  }
  isRuned = true
  globalShortcut.register('ctrl+alt+a', function () {
    mainWindow.webContents.send('shortcut-capture', 1)
  })
  ipcMain.on('shortcut-capture', (e, params) => {
    const { display } = params
    const $win = new BrowserWindow({
      title: '截图',
      width: display.size.width,
      height: display.size.height,
      x: display.bounds.x,
      y: display.bounds.y,
      // frame: false,
      show: true,
      backgroundColor: '#ffffff',
      resizable: true,
      // alwaysOnTop: true
      fullscreen: true
      // skipTaskbar: true
    })
    $windows.push($win)
    // 有一个窗口关闭就关闭所有的窗口
    ipcMain.on('cancel-shortcut-capture', () => {
      $windows.forEach((item, i) => {
        if (item) {
          item.close()
        }
        $windows.splice(i, 1)
      })
    })
    $win.loadURL(path.resolve(__dirname, './window/shortcut-capture.html'))
    $win.webContents.openDevTools()
    $win.webContents.on('did-finish-load', () => {
      $win.webContents.executeJavaScript(`window.params = ${JSON.stringify(params)}`)
      $win.webContents.send('did-finish-load')
    })
  })
}
