(() => {
  window.addEventListener('load', () => {
    const fs = require('fs')
    const { ipcRenderer } = require('electron')
    const $toolbar = document.createElement('div')
    $toolbar.setAttribute('class', 'toolbar')
    fs.readFile('./window/toolbar.html', (err, html) => {
      if (!err) {
        $toolbar.innerHTML = html
        // 插入到body下的第一个元素
        document.body.insertBefore($toolbar, document.body.firstChild)

        const $windowMinimize = document.querySelector('#window-minimize')
        const $windowMaximization = document.querySelector('#window-maximization')
        const $windowClose = document.querySelector('#window-close')

        $windowMinimize.addEventListener('click', () => {
          ipcRenderer.send('minimize')
        })

        $windowMaximization.addEventListener('click', () => {
          ipcRenderer.send('maximization')
        })

        $windowClose.addEventListener('click', () => {
          ipcRenderer.send('close')
        })
      }
    })
  })
})()
