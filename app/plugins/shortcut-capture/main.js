const {
  app,
  globalShortcut,
  ipcMain,
  BrowserWindow,
  clipboard,
  nativeImage,
  screen
} = require('electron')
const path = require('path')

module.exports = dingtalk => {
  const setting = dingtalk.setting || {}
  const key = setting.keymap['shortcut-capture']

  // 清空所有快捷键
  globalShortcut.unregisterAll()
  // 注册全局快捷键
  globalShortcut.register(key, () => {
    $windows.forEach($win => {
      $win.show()
      $win.focus()
      $win.setAlwaysOnTop(true)
      $win.setFullScreen(true)
    })
  })

  const $windows = screen.getAllDisplays()
    .map(({ id, size, bounds, scaleFactor }) => {
      const $win = new BrowserWindow({
        title: '截图',
        width: size.width,
        height: size.height,
        x: bounds.x,
        y: bounds.y,
        useContentSize: true,
        frame: false,
        show: false,
        menu: false,
        transparent: true,
        resizable: false,
        alwaysOnTop: true,
        fullscreen: true,
        skipTaskbar: true,
        closable: true,
        minimizable: false,
        maximizable: false,
        webPreferences: {
          preload: path.join(__dirname, './renderer.js')
        }
      })

      // 显示指定的显示器的截图
      $win.display = id
      // 只能通过shortcut-capture-cancel的方式关闭窗口
      $win.on('close', e => {
        e.preventDefault()
      })
      $win.loadURL(`file://${__dirname}/index.html`)
      return $win
    })

  // 有一个窗口关闭就关闭所有的窗口
  ipcMain.on('shortcut-capture-cancel', () => {
    $windows.forEach($win => $win.hide())
  })
  ipcMain.on('shortcut-capture-save', (e, dataURL) => {
    $windows.forEach($win => $win.hide())
    clipboard.writeImage(nativeImage.createFromDataURL(dataURL))
  })
}

function createWindow (source, setting) {
  $win.webContents.on('dom-ready', () => {
    $win.webContents.send('dom-ready', { source, setting })
    $win.focus()
  })
}

