import { app } from 'electron'
import DingTalk from './dingtalk'
import debug from 'electron-debug'

app.whenReady().then(() => {
  // 生产环境添加开发者工具
  debug({ isEnabled: true, showDevTools: false })
})

export default new DingTalk()
