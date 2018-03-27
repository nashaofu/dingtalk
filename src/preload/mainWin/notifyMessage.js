import path from 'path'
import notifier from 'node-notifier'
import { ipcRenderer, remote } from 'electron'

export default injector => {
  let oldCount = 0
  notifier.on('click', () => {
    ipcRenderer.send('MAINWIN:window-show')
  })
  injector.setTimer(() => {
    let count = 0
    const $mainMenus = document.querySelector('#menu-pannel>.main-menus')
    if ($mainMenus) {
      const $menuItems = $mainMenus.querySelectorAll('li.menu-item')
      $menuItems.forEach($item => {
        const $unread = $item.querySelector('all-conv-unread-count em.ng-binding')
        if ($unread) {
          const badge = parseInt($unread.innerText)
          count += isNaN(badge) ? 0 : badge
        }
      })
    }
    if (oldCount !== count) {
      // 当有新消息来时才发送提示信息
      if (count !== 0 && oldCount < count) {
        notifier.notify({
          title: '钉钉',
          message: `您有${count}条消息未查收！`,
          icon: path.join(remote.app.getAppPath(), './icon/32x32.png')
        })
      }
      oldCount = count
      ipcRenderer.send('MAINWIN:badge', count)
    }
  })
}
