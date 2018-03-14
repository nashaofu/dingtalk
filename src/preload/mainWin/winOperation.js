import { ipcRenderer } from 'electron'

export default () => {
  const $ul = document.createElement('ul')
  $ul.setAttribute('class', 'dingtalk-window-operations')

  // 按钮className，同时也是事件名称
  const li = ['window-close', 'window-maximization', 'window-minimize']
  li.forEach(item => {
    // 创建按钮
    const $li = document.createElement('li')
    $li.setAttribute('class', `operation-button ${item}`)
    $ul.appendChild($li)

    // 点击按钮通知主进程
    $li.addEventListener('click', () => ipcRenderer.send(`MAINWIN:${item}`))
  })
  // 把生成的按钮添加到DOM
  const $layoutContainer = document.querySelector('#layout-container')
  if ($layoutContainer) {
    document.body.insertBefore($ul, $layoutContainer.nextSibling)
  } else {
    document.body.appendChild($ul)
  }
}
