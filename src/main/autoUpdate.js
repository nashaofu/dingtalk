import {
  app,
  dialog,
  shell
} from 'electron'
import axios from 'axios'
import { autoUpdater } from 'electron-updater'

export default dingtalk => () => {
  autoUpdater.on('update-downloaded', info => {
    dialog.showMessageBox(dingtalk.$mainWin, {
      type: 'question',
      title: '立即更新',
      message: `新版本${info.version}已经下载完成，是否立即更新？`,
      noLink: true,
      buttons: ['是', '否']
    }, index => {
      if (index === 0) {
        autoUpdater.quitAndInstall()
      }
    })
  })

  autoUpdater.on('error', e => {
    axios.get('https://api.github.com/repos/nashaofu/dingtalk/releases/latest')
      .then(({ data }) => {
        // 检查版本号
        // 如果本地版本小于远程版本则更新
        if (data.tag_name.slice(1) > app.getVersion()) {
          dialog.showMessageBox(dingtalk.$mainWin, {
            type: 'question',
            title: '版本更新',
            message: '已有新版本更新，是否立即前往下载最新安装包？',
            noLink: true,
            buttons: ['是', '否']
          }, index => {
            if (index === 0) {
              shell.openExternal('https://github.com/nashaofu/dingtalk/releases/latest')
            }
          })
        }
      })
  })

  if (dingtalk.setting.autoupdate) {
    autoUpdater.checkForUpdates()
  }
}
