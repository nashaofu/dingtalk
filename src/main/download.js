import { app } from 'electron'

export default dingtalk => $win => {
  $win.webContents.session.on('will-download', (event, item, webContents) => {
    const file = {
      id: `${new Date().getTime()}${Math.round(Math.random() * 10000)}`,
      name: item.getFilename(),
      size: item.getTotalBytes(),
      receivedbytes: item.getReceivedBytes(),
      state: item.getState()
    }
    if (!$win.isDestroyed()) {
      webContents.send('DOWNLOAD:start', file)
    }

    // 监听下载过程，计算并设置进度条进度
    item.on('updated', (e, state) => {
      file.state = state
      file.receivedbytes = item.getReceivedBytes()
      if (!$win.isDestroyed()) {
        webContents.send('DOWNLOAD:downloading', file)
        $win.setProgressBar(file.receivedbytes / file.size)
      }
    })

    // 监听下载结束事件
    item.on('done', (e, state) => {
      file.state = state
      file.receivedbytes = item.getReceivedBytes()
      if (!$win.isDestroyed()) {
        webContents.send('DOWNLOAD:end', file)
        $win.setProgressBar(-1)
      }
      if (app.dock) {
        app.dock.bounce('informational')
      }
    })
  })
}
