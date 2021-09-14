import { ipcRenderer } from 'electron'

export default () => {
  document.addEventListener('click', e => {
    const $modal = document.querySelector('.modal-content')
    if (!$modal) return
    if ($modal.innerHTML.indexOf('您的账号在其他设备登录') === -1) return
    const $foot = $modal.querySelector('div.foot')
    if (!$foot.contains(e.target)) return

    e.stopPropagation()
    e.preventDefault()
    ipcRenderer.send('MAINWIN:reload')
  })
}
