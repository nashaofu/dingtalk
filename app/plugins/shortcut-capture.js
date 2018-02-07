const {
  app,
  globalShortcut,
  ipcMain,
  BrowserWindow,
  clipboard,
  nativeImage
} = require('electron')
const path = require('path')

let mainWindow = null
const $windows = []
let isClose = false
module.exports = dingtalk => {
  const setting = dingtalk.setting || {}
  const key = setting.keymap['shortcut-capture']

  if (mainWindow) {
    mainWindow.close()
    mainWindow.destroy()
    mainWindow = null
  }

  mainWindow = new BrowserWindow({
    title: '后台进程',
    width: 0,
    height: 0,
    useContentSize: true,
    frame: false,
    show: false,
    menu: false,
    transparent: false,
    closable: false,
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, './shortcut-capture-renderer.js')
    }
  })
  mainWindow.loadURL('about:blank')

  // 清空所有快捷键
  globalShortcut.unregisterAll()
  // 注册全局快捷键
  globalShortcut.register(key, () => {
    mainWindow.webContents.send('shortcut-capture')
  })

  // 抓取截图之后显示窗口
  ipcMain.on('shortcut-capture', (e, sources) => {
    closeWindow()
    sources.forEach(source => {
      createWindow(source, dingtalk.setting)
    })
  })
  // 有一个窗口关闭就关闭所有的窗口
  ipcMain.on('cancel-shortcut-capture', closeWindow)
  ipcMain.on('set-shortcut-capture', (e, dataURL) => {
    clipboard.writeImage(nativeImage.createFromDataURL(dataURL))
    closeWindow()
  })
  return mainWindow
}

function createWindow (source, setting) {
  const { display } = source
  const $win = new BrowserWindow({
    title: '截图',
    width: display.width,
    height: display.height,
    x: display.x,
    y: display.y,
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
    maximizable: false
  })
  setFullScreen($win, display)
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
    // 重新调整窗口位置和大小
    setFullScreen($win, display)
  })

  $win.webContents.on('dom-ready', () => {
    $win.webContents.send('dom-ready', { source, setting })
    $win.focus()
  })
  const filename = path.join(app.getAppPath(), './app/views/shortcut-capture.html')
  $win.loadURL(filename)
  $windows.push($win)
}

function setFullScreen ($win, display) {
  $win.setBounds({
    width: display.width,
    height: display.height,
    x: display.x,
    y: display.y
  })
  $win.setAlwaysOnTop(true)
  $win.setFullScreen(true)
}

function closeWindow () {
  isClose = true
  while ($windows.length) {
    const $winItem = $windows.pop()
    $winItem.close()
  }
  isClose = false
}
