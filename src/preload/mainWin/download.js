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
      files[index] = {
        ...files[index],
        state: file.state,
        status: {
          begin: true,
          done: false,
          error: false,
          finishSize: file.receivedbytes,
          progress: file.receivedbytes / file.size * 100
        }
      }
    }
  })
  ipcRenderer.on('MAINWIN:end', (e, file) => {
    const index = findIndex(files, { clientId: file.id })
    if (index !== -1) {
      files[index] = {
        ...files[index],
        state: file.state,
        status: {
          begin: true,
          done: file.state === 'completed',
          error: file.state === 'interrupted',
          finishSize: file.receivedbytes,
          progress: file.receivedbytes / file.size * 100
        }
      }
    }

    /***
     * 提示信息要修改
     */
    notifier.notify({
      title: '钉钉',
      message: `${file.name}${status[file.state]}`,
      icon: path.join(remote.app.getAppPath(), './icon/32x32.png')
    })
  })

  // 下载列表状态更新
  injector.setTimer(() => {
    const uploadList = angular.element('#header>upload-list')
    if (!uploadList.length) {
      return
    }
    uploadList.scope().$apply(() => {
      const data = uploadList.data()
      const $uploadListController = data.$uploadListController

      const progressing = files.reduce((a, b) => {
        if (b.state === 'progressing') a += 1
        const index = findIndex($uploadListController.fileTaskList, { clientId: b.clientId })
        const file = {
          ...b,
          id: b.id,
          showMessage: true,
          checkIsShowProgress: () => b.status.receivedbytes,
          progress: b.status.progress,
          EventsName: {
            FILE_STATUS_UPDATE: 'file_status_update'
          },
          addListener: (e, t) => { },
          addListeners: (e, t) => { },
          addOnceListener: (e, t) => { },
          canSaveToLocal: () => { },
          constructor: () => { },
          defineEvent: () => { },
          defineEvents: () => { },
          emit: (e) => { },
          emitEvent: (e, t) => { },
          flattenListeners: (e) => { },
          getListeners: (e) => { },
          getListenersAsObject: (e) => { },
          getPayload: () => { },
          initStatus: (e) => { },
          initialize: (e) => { },
          isTaskFinish: (e) => { },
          manipulateListeners: (e) => { },
          off: () => { },
          on: () => { },
          onDownloadError: (e) => { },
          onDownloadSuccess: (e) => { },
          onProgress: (e) => { return b.status.progress },
          onUploadError: (e) => { },
          onUploadStopAll: (e) => { },
          onUploadSuccess: (e) => { },
          once: () => { },
          removeAllListeners: () => { },
          removeEvent: (e) => { },
          removeListener: (e, t) => { },
          removeListeners: (e, t) => { },
          setCreateTime: () => { },
          setIconClass: () => { },
          setIsFinish: (e) => { },
          setOnceReturnValue: (e) => { },
          trigger: () => { },
          _getEvents: () => { },
          _getOnceReturnValue: () => { },

          delay: (e, t) => { },
          isFunction: (e) => { },
          wait: () => { }
        }
        if (index === -1) {
          $uploadListController.fileTaskList.push(file)
        } else {
          $uploadListController.fileTaskList[index] = file
        }
        return a
      }, 0)
      if (progressing) {
        $uploadListController.uploadListCount = progressing
      }
    })
  })
}
