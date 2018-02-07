const { BrowserWindow } = require('electron')

module.exports = () => {
  const $window = new BrowserWindow({
    title: '截图',
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    useContentSize: true,
    frame: false,
    show: false,
    menu: false,
    transparent: true,
    resizable: false,
    // alwaysOnTop: true,
    skipTaskbar: true,
    closable: true,
    minimizable: false,
    maximizable: false
  })

  $window.webContents.openDevTools()
  $window.on('close', e => {
    e.preventDefault()
    $window.hide()
  })
  $window.loadURL(`file://${__dirname}/view/index.html`)
  return $window
}
