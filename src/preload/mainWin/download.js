import { ipcRenderer } from 'electron'
import findIndex from 'lodash/findIndex'

// 四舍五入并保留小数位数
const toDecimal = (num, length = 0) => {
  const len = Math.pow(10, length)
  const dec = Math.round(num * len) / len
  return dec === num ? dec : dec.toFixed(length)
}

export default injector => {
  const files = []
  const status = {
    completed: '下载完成',
    cancelled: '取消下载',
    interrupted: '下载失败',
    progressing: '正在下载'
  }

  ipcRenderer.on('start-download', (e, file) => {
    files.push(file)
  })
  ipcRenderer.on('downloading', (e, file) => {
    const index = findIndex(files, file.id)
    if (index !== -1) {
      files[index] = file
    }
  })
  ipcRenderer.on('end-download', (e, file) => {
    const index = findIndex(files, file.id)
    if (index !== -1) {
      files[index] = file
    }
    new Notification('钉钉', {
      body: `${file.name}${status[file.state]}`,
      tag: 'download-notify'
    })
  })

  // 下载列表状态更新
  injector.setTimer(() => {
    const $progress = document.querySelector('#header>upload-list .progress.upload-task-progress')
    if ($progress) {
      const index = findIndex(files, file => file.state === 'progressing')
      if (index !== -1) {
        $progress.classList.remove('ng-hide')
      } else {
        $progress.classList.add('ng-hide')
      }
      const $fileItems = document.querySelector('#header>upload-list .file-items')
      if ($fileItems && files.length) {
        const $empty = document.querySelector('#header>upload-list .upload-list-wrap.ng-scope>.file-items-empty-text.ng-binding.ng-scope')
        if ($empty) {
          $empty.classList.add('ng-hide')
        }
        files.forEach(item => {
          let $container = $fileItems.querySelector(`[data-id="${item.id}"]`)
          if (!$container) {
            $container = document.createElement('div')
            $container.setAttribute('class', 'ng-scope')
            $container.setAttribute('data-id', item.id)
            $fileItems.appendChild($container)
          }
          let unit = 'KB'
          let size = item.size / 1024
          let receivedbytes = item.receivedbytes / 1024
          if (size > 1024) {
            unit = 'MB'
            size /= 1024
            receivedbytes /= 1024
          }
          size = toDecimal(size, 1)
          receivedbytes = toDecimal(receivedbytes, 1)
          const progress = item.state === 'completed' ? `${size}${unit}` : `${receivedbytes}${unit} / ${size}${unit}`
          $container.innerHTML = `
            <div class="upload-file-item ng-scope ng-isolate-scope" info="fileTask">
              <b class="file-upload-ico-wrap ico_file_unknown"></b>
              <div style="position:relative;" class="ng-scope">
                <div class="upload-file-item-text-top ellipsis ng-binding">${item.name}</div>
                <div class="upload-file-item-text-bottom upload-file-status ng-binding">${status[item.state]}</div>
                <div class="progress ng-isolate-scope" style="display: ${item.state === 'completed' ? 'none' : 'block'};">
                  <div class="progress-thumb" style="width: ${item.receivedbytes / item.size * 100}%;"></div>
                </div>
                <div class="upload-file-item-text-bottom upload-file-size ng-binding">${progress}</div>
              </div>
            </div>
          `
        })
      }
    }
  })
}
