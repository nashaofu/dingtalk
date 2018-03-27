import { app } from 'electron'

export default dingtalk => $win => {
  $win.webContents.session.on('will-download', (event, item, webContents) => {
    const file = {
      id: `${new Date().getTime()}${Math.round(Math.random() * 10000)}`,
      name: item.getFilename(),
      size: item.getTotalBytes(),
      receivedbytes: item.getReceivedBytes(),
      state: null
    }
    webContents.send('DOWNLOAD:start', file)

    // 监听下载过程，计算并设置进度条进度
    item.on('updated', (event, state) => {
      file.receivedbytes = item.getReceivedBytes()
      file.state = state
      webContents.send('DOWNLOAD:downloading', file)
      if ($win && !$win.isDestroyed()) {
        $win.setProgressBar(file.receivedbytes / file.size)
      }
    })

    // 监听下载结束事件
    item.on('done', (e, state) => {
      file.state = state
      webContents.send('DOWNLOAD:end', file)
      app.dock.bounce('informational')

      // 如果窗口还在的话，去掉进度条
      if ($win && !$win.isDestroyed()) {
        $win.setProgressBar(-1)
      }
    })
  })
}
