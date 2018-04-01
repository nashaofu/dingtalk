import { formatFileSize, transFileClassName } from './utils'
import Events from './Events'

export default class FileTask extends Events {
  EventsName = {
    FILE_STATUS_UPDATE: 'file_status_update'
  }
  constructor (file) {
    super()
    this.initialize(file)
  }
  initialize (file) {
    this.type = 2
    this.name = file.name
    this.clientId = file.clientId
    this.fileSize = file.fileSize
    this.isDownload = file.isDownload
    this.isFile = file.isFile
    this.url = file.url
    this.isFinish = file.isFinish
    this.setCreateTime()
    this.setIconClass()
    this.initStatus(file.status)
    this.id = this.clientId
    this.formatSize = formatFileSize(this.fileSize)
    this.onProgress = this.onProgress.bind(this)
    this.onUploadSuccess = this.onUploadSuccess.bind(this)
    this.onDownloadError = this.onDownloadError.bind(this)
    this.onUploadError = this.onUploadError.bind(this)
    this.onDownloadSuccess = this.onDownloadSuccess.bind(this)
    this.onUploadStopAll = this.onUploadStopAll.bind(this)
  }

  setIconClass () {
    this.iconClass = transFileClassName(this.name)
  }

  setCreateTime () {
    if (this.isDownload) {
      this.createTime = Date.now()
    } else {
      this.createTime = parseInt(this.clientId.split('_').shift())
    }
  }
  setIsFinish (isFinish) {
    this.isFinish = isFinish
  }

  initStatus (status) {
    this.status = status || {}
  }

  onProgress (file) {
    if (file && file.clientId === this.clientId) {
      if (file.isDownload) {
        this.fileSize = file.fileSize
        this.formatSize = formatFileSize(this.fileSize)
      }
      if (file.isCompress) {
        this.status.isCompress = true
      } else {
        if (file.percent !== undefined) {
          this.status.progress = Math.ceil(100 * file.percent)
          this.status.finishSize = formatFileSize(file.percent * this.fileSize)
          if (!file.isDownload) {
            this.status.error = false
          }
        }
      }
      this.status.begin = true
      this.emit(this.EventsName.FILE_STATUS_UPDATE)
    }
  }

  onUploadSuccess (file) {
    if (file && file.clientId === this.clientId) {
      this.status.done = true
      this.setIsFinish(true)
      this.emit(this.EventsName.FILE_STATUS_UPDATE)
    }
  }

  onDownloadError (file) {
    if (file && file.clientId === this.clientId) {
      this.status.done = true
      this.status.error = true
      this.status.errorMsg = file.msg || '下载失败'
      this.status.isDownloadCancel = file.isDownloadCancel
      this.setIsFinish(true)
      this.emit(this.EventsName.FILE_STATUS_UPDATE)
    }
  }

  onUploadError (file) {
    if (file && file.clientId === this.clientId) {
      if (file.reason === 'STOP_REJECT' || file.isFromIM) {
        this.status = {}
      } else {
        if (file.errorCode === '200012') {
          this.status.spaceFull = true
        }
        this.status.done = true
        this.status.error = true
        this.status.errorMsg = file.msg
      }
      this.setIsFinish(true)
      this.emit(this.EventsName.FILE_STATUS_UPDATE)
    }
  }

  onDownloadSuccess (file) {
    if (file && file.clientId === this.clientId) {
      this.status.done = true
      this.status.error = false
      this.setIsFinish(true)
      this.emit(this.EventsName.FILE_STATUS_UPDATE)
    }
  }

  onUploadStopAll (file) { }

  isTaskFinish () {
    return this.isFinish
  }

  getPayload () {
    return {
      type: this.type,
      name: this.name,
      clientId: this.clientId,
      fileSize: this.fileSize,
      isDownload: this.isDownload,
      isFile: this.isFile,
      url: this.url,
      isFinish: this.isFinish,
      status: this.status
    }
  }

  canSaveToLocal () {
    return this.status.done === true
  }
}
