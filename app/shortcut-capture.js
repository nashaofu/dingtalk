const {
  globalShortcut,
  ipcMain,
  BrowserWindow,
  clipboard,
  nativeImage
} = require('electron')

// 保证函数只执行一次
let isRuned = false
const $windows = []
let isClose = false
module.exports = mainWindow => {
  if (isRuned) {
    return
  }
  isRuned = true

  // 注册全局快捷键
  globalShortcut.register('ctrl+alt+a', function () {
    mainWindow.webContents.send('shortcut-capture')
  })

  // 抓取截图之后显示窗口
  ipcMain.on('shortcut-capture', (e, sources) => {
    closeWindow()
    sources.forEach(source => {
      createWindow(source)
    })
  })
  // 有一个窗口关闭就关闭所有的窗口
  ipcMain.on('cancel-shortcut-capture', closeWindow)
  ipcMain.on('set-shortcut-capture', (e, dataURL) => {
    clipboard.writeImage(nativeImage.createFromDataURL(dataURL))
    closeWindow()
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
    closable: true,
    minimizable: false,
    maximizable: false
  })
  // 只能通过cancel-shortcut-capture的方式关闭窗口
  $win.on('close', e => {
    if (!isClose) {
      e.preventDefault()
    }
  })
  // 页面初始化完成之后再显示窗口
  // 并检测是否有版本更新
  $win.once('ready-to-show', () => {
    $win.show()
    $win.focus()
  })

  $win.webContents.on('dom-ready', () => {
    $win.webContents.executeJavaScript(`window.source = ${JSON.stringify(source)}`)
    $win.webContents.send('dom-ready')
    $win.focus()
  })
  $win.loadURL(`file://${__dirname}/window/shortcut-capture.html`)
  $windows.push($win)
}

function closeWindow () {
  isClose = true
  while ($windows.length) {
    const $winItem = $windows.pop()
    $winItem.close()
  }
  isClose = false
}
