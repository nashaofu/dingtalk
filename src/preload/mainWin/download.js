import FileTask from './fileTask'
import cloneDeep from 'lodash/cloneDeep'
import findIndex from 'lodash/findIndex'
import { ipcRenderer } from 'electron'

export default injector => {
  const files = []

  const addFile = file => {
    const percent = file.finishSize / file.fileSize
    files.push({
      clientId: file.clientId,
      name: file.name,
      fileSize: file.fileSize,
      state: file.state,
      url: file.url,
      percent: percent,
      isDownload: true,
      isCompress: false,
      isFinish: false,
      isFile: true,
      isDownloadCancel: file.state === 'cancelled',
      status: {
        begin: true,
        done: file.state === 'completed',
        error: file.state === 'interrupted',
        finishSize: file.finishSize,
        progress: Math.floor(percent * 100)
      }
    })
  }

  const updateFile = (index, file) => {
    const percent = file.finishSize / file.fileSize
    files[index] = {
      ...files[index],
      state: file.state,
      percent: percent,
      isDownloadCancel: file.state === 'cancelled',
      status: {
        begin: true,
        done: file.state === 'completed',
        error: file.state === 'interrupted',
        finishSize: file.finishSize,
        progress: Math.floor(percent * 100)
      }
    }
  }

  ipcRenderer.on('MAINWIN:download-start', (e, file) => {
    addFile(file)
    updateList()
  })

  ipcRenderer.on('MAINWIN:download-updated', (e, file) => {
    const index = findIndex(files, { clientId: file.clientId })
    if (index !== -1) {
      updateFile(index, file)
    } else {
      addFile(file)
    }
    updateList()
  })

  ipcRenderer.on('MAINWIN:download-done', (e, file) => {
    const index = findIndex(files, { clientId: file.clientId })
    if (index !== -1) {
      updateFile(index, file)
    } else {
      addFile(file)
    }
    updateList()
    const status = {
      completed: '下载完成',
      interrupted: '下载失败'
    }
    if (status[file.state]) {
      ipcRenderer.send('notify', `${file.name}${status[file.state]}`)
    }
  })

  const updateList = () => {
    const uploadList = angular.element('#header>upload-list')
    if (!uploadList.length) {
      return
    }
    uploadList.scope().$apply(() => {
      const data = uploadList.data()
      const $uploadListController = data.$uploadListController
      const fileTaskList = $uploadListController.fileTaskList
      files.forEach(file => {
        const index = findIndex(fileTaskList, { clientId: file.clientId })
        if (index === -1) {
          fileTaskList.unshift(new FileTask(cloneDeep(file)))
        } else {
          if (file.state === 'progressing') {
            fileTaskList[index].onProgress(cloneDeep(file))
          } else if (file.state === 'completed') {
            fileTaskList[index].onProgress(cloneDeep(file))
            fileTaskList[index].onDownloadSuccess(cloneDeep(file))
          } else if (file.state === 'interrupted') {
            fileTaskList[index].onProgress(cloneDeep(file))
            fileTaskList[index].onDownloadError(cloneDeep(file))
          } else if (file.state === 'cancelled') {
            files.splice(index, 1)
            fileTaskList.splice(index, 1)
          }
        }
      })
      $uploadListController.uploadListCount = fileTaskList.filter(({ isFinish }) => !isFinish).length
    })
  }
  injector.setTimer(() => updateList())
}
