const path = require('path')
const {
  globalShortcut,
  ipcMain,
  BrowserWindow
} = require('electron')

// 保证函数只执行一次
let isRuned = false
let $windows = []
module.exports = mainWindow => {
  if (isRuned) {
    return
  }
  isRuned = true
  globalShortcut.register('ctrl+alt+a', function () {
    mainWindow.webContents.send('shortcut-capture', 1)
  })
  ipcMain.on('shortcut-capture', (e, params) => {
    const { display, source } = params
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
    $win.on('close', () => {
      $windows.forEach(item => {
        if (item) {
          item.close()
        }
        item = null
      })
      $windows = []
    })
    $win.loadURL(path.resolve(__dirname, './window/shortcut-capture.html'))
    $win.webContents.openDevTools()
    // $win.webContents.executeJavaScript(`console.log(${params})`)
  })
}
