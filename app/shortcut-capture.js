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
    mainWindow.webContents.send('shortcut-capture')
  })
  ipcMain.on('shortcut-capture', (e, sources) => {
    while ($windows.length) {
      const $winItem = $windows.pop()
      $winItem.destroy()
    }
    sources.forEach(source => {
      createWindow(source)
    })
  })
  // 有一个窗口关闭就关闭所有的窗口
  ipcMain.on('cancel-shortcut-capture', () => {
    while ($windows.length) {
      const $winItem = $windows.pop()
      $winItem.destroy()
    }
  })
}

function createWindow (source) {
  const { display } = source
  const $win = new BrowserWindow({
    title: '截图',
    width: display.size.width,
    height: display.size.height,
    x: display.bounds.x,
    y: display.bounds.y,
    frame: false,
    show: false,
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

  // 只能通过cancel-shortcut-capture的方式关闭窗口
  $win.on('close', e => e.preventDefault())
  // 页面初始化完成之后再显示窗口
  // 并检测是否有版本更新
  $win.once('ready-to-show', () => {
    // 重新调整窗口位置和大小
    $win.setBounds({
      width: display.size.width,
      height: display.size.height,
      x: display.bounds.x,
      y: display.bounds.y
    })
    $win.show()
    $win.focus()
  })

  $win.webContents.on('did-finish-load', () => {
    $win.focus()
    $win.webContents.executeJavaScript(`window.source = ${JSON.stringify(source)}`)
    $win.webContents.send('did-finish-load')
  })

  $win.loadURL(path.resolve(__dirname, './window/shortcut-capture.html'))
}
