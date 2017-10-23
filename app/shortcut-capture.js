const path = require('path')
const {
  globalShortcut,
  ipcMain,
  BrowserWindow
} = require('electron')

// 保证函数只执行一次
let isRuned = false
const $windows = []
let captureId = null
module.exports = mainWindow => {
  if (isRuned) {
    return
  }
  isRuned = true
  globalShortcut.register('ctrl+alt+a', function () {
    mainWindow.webContents.send('shortcut-capture', 1)
  })
  ipcMain.on('shortcut-capture', (e, params) => {
    const { id, display } = params
    if (captureId && captureId !== id) {
      while ($windows.length) {
        const $winItem = $windows.pop()
        $winItem.destroy()
      }
      captureId = null
    }
    const $win = new BrowserWindow({
      title: '截图',
      width: display.size.width,
      height: display.size.height,
      x: display.bounds.x,
      y: display.bounds.y,
      frame: false,
      show: true,
      transparent: true,
      resizable: false,
      alwaysOnTop: true,
      fullscreen: true,
      skipTaskbar: true,
      closable: false,
      minimizable: false,
      maximizable: false
    })

    $windows.push($win)
    // 有一个窗口关闭就关闭所有的窗口
    ipcMain.on('cancel-shortcut-capture', () => {
      while ($windows.length) {
        const $winItem = $windows.pop()
        $winItem.destroy()
      }
    })
    // 只能通过cancel-shortcut-capture的方式关闭窗口
    $win.on('close', e => {
      e.preventDefault()
    })
    $win.loadURL(path.resolve(__dirname, './window/shortcut-capture.html'))
    $win.webContents.openDevTools()
    $win.webContents.on('did-finish-load', () => {
      $win.focus()
      $win.webContents.executeJavaScript(`window.params = ${JSON.stringify(params)}`)
      $win.webContents.send('did-finish-load')
    })
  })
}
