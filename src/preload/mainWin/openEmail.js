import { ipcRenderer } from 'electron'

export default () => {
  document.addEventListener('click', e => {
    const $email = document.querySelector('#menu-pannel > ul.extra-options.ng-scope > div > org-email > li')

    if (!$email) return
    if (!$email.contains(e.target)) return

    const key = Object.keys(localStorage).find(key => /^\d+_mailUrl/.test(key))
    if (!key) return
    const url = localStorage.getItem(key)
    if (!url) return
    // 停止事件冒泡和默认事件
    e.stopPropagation()
    e.preventDefault()
    ipcRenderer.send('MAINWIN:open-email', url)
  })
}
