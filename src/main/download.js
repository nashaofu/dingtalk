import { app } from 'electron'

export default $win => {
  // 文件下载拦截
  const files = []
  $win.webContents.session.on('will-download', (event, item, webContents) => {
    const time = Date.now()
    const clientId = `${time}_${files.filter(({ clientId }) => clientId.indexOf(time) === 0).length}`
    files.push({ clientId, item })
    const file = {
      clientId,
      name: item.getFilename(),
      fileSize: item.getTotalBytes(),
      finishSize: item.getReceivedBytes(),
      url: item.getURL(),
      state: item.getState()
    }
    if (!$win.isDestroyed()) {
      webContents.send('MAINWIN:download-start', file)
    }

    // 监听下载过程，计算并设置进度条进度
    item.on('updated', (e, state) => {
      file.state = state
      file.finishSize = item.getReceivedBytes()
      if (!$win.isDestroyed()) {
        webContents.send('MAINWIN:download-updated', file)
        $win.setProgressBar(file.finishSize / file.fileSize)
      }
    })

    // 监听下载结束事件
    item.on('done', (e, state) => {
      file.state = state
      file.finishSize = item.getReceivedBytes()
      if (!$win.isDestroyed()) {
        webContents.send('MAINWIN:download-done', file)
        $win.setProgressBar(-1)
      }
      if (app.dock) {
        app.dock.bounce('informational')
      }
    })
  })
}
