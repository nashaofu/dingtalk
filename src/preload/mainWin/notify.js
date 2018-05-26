import { ipcRenderer } from 'electron'

let notify
export default message => {
  if (notify instanceof Notification) {
    notify.close()
    notify = null
  }
  if (Notification.permission === 'granted') {
    notify = new Notification('钉钉', {
      body: message,
      icon: 'https://g.alicdn.com/dingding/web/0.1.8/img/logo.png',
      tag: 'dingtalk'
    })
    notify.addEventListener('click', () => ipcRenderer.send('MAINWIN:window-show'))
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission(permission => {
      // 如果用户同意，就可以向他们发送通知
      if (permission === 'granted') {
        notify = new Notification('钉钉', {
          body: message,
          icon: 'https://g.alicdn.com/dingding/web/0.1.8/img/logo.png',
          tag: 'dingtalk'
        })
        notify.addEventListener('click', () => ipcRenderer.send('MAINWIN:window-show'))
      }
    })
  }
}
