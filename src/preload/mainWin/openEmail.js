import { ipcRenderer } from 'electron'

export default () => {
  document.addEventListener('click', e => {
    const $email = document.querySelector('#menu-pannel > ul.extra-options.ng-scope > div > org-email > li')
    if (!$email) {
      return
    }
    if ($email.contains(e.target)) {
      // 停止事件冒泡和默认事件
      e.stopPropagation()
      e.preventDefault()
      const storage = localStorage
      for (let key in storage) {
        if (/^\d+_mailUrl/.test(key)) {
          ipcRenderer.send('MAINWIN:open-email', storage[key])
          break
        }
      }
    }
  })
}
