const { session } = require('electron')

// 保证函数只执行一次
let isRuned = false
module.exports = mainWindow => {
  if (isRuned) {
    return
  }
  isRuned = true
  session.defaultSession.on('will-download', (event, item, webContents) => {
    const file = {
      id: `${new Date().getTime()}${Math.round(Math.random() * 10000)}`,
      name: item.getFilename(),
      size: item.getTotalBytes(),
      receivedbytes: item.getReceivedBytes(),
      state: null
    }
    webContents.send('start-download', file)
    // 监听下载过程，计算并设置进度条进度
    item.on('updated', (event, state) => {
      file.receivedbytes = item.getReceivedBytes()
      file.state = state
      webContents.send('downloading', file)
      mainWindow.setProgressBar(file.receivedbytes / file.size)
    })

    // 监听下载结束事件
    item.on('done', (e, state) => {
      file.state = state
      webContents.send('end-download', file)
      // 如果窗口还在的话，去掉进度条
      if (!mainWindow.isDestroyed()) {
        mainWindow.setProgressBar(-1)
      }
      // switch (state) {
      //   case 'completed':
      //     console.log('文件下载完成')
      //     break
      //   case 'cancelled':
      //     console.log('文件下载被取消')
      //     break
      //   case 'interrupted':
      //   default:
      //     dialog.showErrorBox('下载失败', `${item.getFilename() } 下载失败`)
      //     break
      // }
    })
  })
}
