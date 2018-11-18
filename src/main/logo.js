import path from 'path'
import { app, screen } from 'electron'

export default path.join(app.getAppPath(), './resources/logo.png')

/**
 * 没有消息时的托盘图标
 */
export function getNoMessageTrayIcon () {
  if (process.platform === 'darwin') {
    return path.join(app.getAppPath(), './resources/tray/16x16.png')
  } else if (process.platform === 'win32') {
    return path.join(app.getAppPath(), './resources/tray/64x64.png')
  } else if (screen.getPrimaryDisplay().scaleFactor > 1) {
    return path.join(app.getAppPath(), './resources/tray/64x64.png')
  } else {
    return path.join(app.getAppPath(), './resources/tray/20x20.png')
  }
}

/**
 * 有消息时的托盘图标
 */
export function getMessageTrayIcon () {
  if (process.platform === 'darwin') {
    return path.join(app.getAppPath(), './resources/tray/n-16x16.png')
  } else if (process.platform === 'win32') {
    return path.join(app.getAppPath(), './resources/tray/n-64x64.png')
  } else if (screen.getPrimaryDisplay().scaleFactor > 1) {
    return path.join(app.getAppPath(), './resources/tray/n-64x64.png')
  } else {
    return path.join(app.getAppPath(), './resources/tray/n-20x20.png')
  }
}
