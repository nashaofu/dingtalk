import { ipcMain } from 'electron'

export default dingtalk => () => {
  ipcMain.on('online', (e, online) => {
    if (online === false) {
      // 第一次启动窗口
      if (dingtalk.online === null) {
        dingtalk.showErrorWin()
      }
    } else {
      dingtalk.hideErrorWin()
    }
    dingtalk.online = online
  })
}
