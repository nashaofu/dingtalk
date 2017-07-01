(() => {
  const { ipcRenderer } = require('electron')
  const send = ipcRenderer.send
  window.windowOperations = {
    minimize() {
      send('minimize')
    },
    maximization() {
      send('maximization')
    },
    close() {
      send('close')
    }
  }
  const li = [
    '<li class="operation-button window-close" onclick="windowOperations.close()"></li>',
    '<li class="operation-button window-maximization" onclick="windowOperations.maximization()"></li>',
    '<li class="operation-button window-minimize" onclick="windowOperations.minimize()"></li>'
  ]
  const $ul = document.createElement('ul')
  $ul.setAttribute('class', 'dingtalk-window-operations')
  $ul.innerHTML = li.join('')
  const $layoutContainer = document.querySelector('#layout-container')
  document.body.insertBefore($ul, $layoutContainer.nextSibling)
})()
