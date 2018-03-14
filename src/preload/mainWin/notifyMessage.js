import { ipcRenderer } from 'electron'
// import notifier from 'node-notifier'

export default injector => {
  let oldCount = 0
  let $notify = null
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
        // 关闭上一条消息提示
        if ($notify && typeof $notify.close === 'function') {
          $notify.close()
        }
        $notify = new Notification('钉钉', {
          body: `您有${count}条消息未查收`,
          tag: 'notify'
        })
        // // Object
        // notifier.notify({
        //   title: 'My notification',
        //   message: 'Hello, there!'
        // })
        console.log(count, oldCount, $notify)

        // linux上不支持点击事件
        $notify.addEventListener('click', () => {
          ipcRenderer.send('MAINWIN:window-show')
        })
      }
      oldCount = count
      ipcRenderer.send('MAINWIN:set-badge', count)
    }
  })
}
