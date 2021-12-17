import { BrowserWindow, globalShortcut } from 'electron'
import localShortcut from 'electron-localshortcut'

function toggleDevTools (win = BrowserWindow.getFocusedWindow()) {
  if (!win) {
    return
  }

  const { webContents } = win
  if (webContents.isDevToolsOpened()) {
    webContents.closeDevTools()
  } else {
    webContents.openDevTools()
  }
}

export default dingtalk => () => {
  const actions = {
    'screenshots-capture': () => dingtalk.screenshotsCapture()
  }
  const keymap = dingtalk.setting.keymap

  if (!dingtalk.setting.enableCapture) delete actions['screenshots-capture']

  // 注销所有的快捷键
  globalShortcut.unregisterAll()
  Object.keys(actions).forEach(key => {
    if (keymap[key] && keymap[key].length) {
      globalShortcut.register(keymap[key].join('+'), actions[key])
    }
  })

  localShortcut.register(process.platform === 'darwin' ? 'Command+Alt+I' : 'Control+Shift+I', toggleDevTools)
  localShortcut.register('F12', toggleDevTools)
}
