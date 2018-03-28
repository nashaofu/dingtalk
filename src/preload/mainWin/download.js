import path from 'path'
import notifier from 'node-notifier'
import findIndex from 'lodash/findIndex'
import { ipcRenderer, remote } from 'electron'

export default injector => {
  const files = []
  ipcRenderer.on('MAINWIN:start', (e, file) => {
    files.push({
      clientId: file.id,
      fileSize: file.size,
      isDownload: true,
      isFile: true,
      name: file.name,
      state: file.state,
      status: {
        begin: true,
        done: false,
        error: false,
        finishSize: file.receivedbytes,
        progress: 0
      },
      type: 1
    })
  })
  ipcRenderer.on('MAINWIN:downloading', (e, file) => {
    const index = findIndex(files, { clientId: file.id })
    if (index !== -1) {
      files[index].state = file.state
      files[index].status = {
        begin: true,
        done: false,
        error: false,
        finishSize: file.receivedbytes,
        progress: file.receivedbytes / file.size * 100
      }
    }
  })
  ipcRenderer.on('MAINWIN:end', (e, file) => {
    const index = findIndex(files, { clientId: file.id })
    if (index !== -1) {
      files[index].state = file.state
      files[index].status = {
        begin: true,
        done: file.state === 'completed',
        error: file.state === 'interrupted',
        finishSize: file.receivedbytes,
        progress: file.receivedbytes / file.size * 100
      }
    }
    notifier.notify({
      title: '钉钉',
      message: `${file.name}${status[file.state]}`,
      icon: path.join(remote.app.getAppPath(), './icon/32x32.png')
    })
  })

  // 下载列表状态更新
  injector.setTimer(() => {
    const uploadList = angular.element('#header>upload-list')
    if (!uploadList) {
      return
    }
    uploadList.scope().$apply(() => {
      const data = uploadList.data()
      const $uploadListController = data.$uploadListController

      const progressing = files.reduce((a, b) => {
        if (b.state === 'progressing') a += 1
        const index = findIndex($uploadListController.fileTaskList, { clientId: b.clientId })
        if (index === -1) {
          $uploadListController.fileTaskList.push(b)
        } else {
          $uploadListController.fileTaskList[index] = b
        }
        return a
      }, 0)
      if (progressing) {
        $uploadListController.uploadListCount = progressing
      }
    })
  })
}
