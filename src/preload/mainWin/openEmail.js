import { ipcRenderer } from 'electron'

export default () => {
  // 清除掉不必要的数据，避免不必要的干扰，邮箱打开
  const storage = localStorage
  for (let key in storage) {
    if (/^\d+_mailUrl/.test(key)) {
      localStorage.removeItem(key)
      break
    }
  }
  document.addEventListener('click', e => {
    const $email = document.querySelector('#menu-pannel > ul.extra-options.ng-scope > div > org-email > li')
    if (!$email) {
      return
    }
    if ($email.contains(e.target)) {
      // 停止事件冒泡和默认事件
      e.stopPropagation()
      e.preventDefault()
      ipcRenderer.send('MAINWIN:open-email', {
        localStorage,
        sessionStorage,
        cookie: document.cookie
      })
    }
  })
}
