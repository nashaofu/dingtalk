import { ipcRenderer } from 'electron'

let notify
function msg (body) {
  notify = new Notification('钉钉', {
    body: body,
    icon: 'https://g.alicdn.com/dingding/web/0.1.8/img/logo.png'
  })
  notify.addEventListener('click', () => {
    ipcRenderer.send('MAINWIN:window-show')
  })
}

export default message => {
  if (notify) notify.close()
  if (Notification.permission === 'granted') {
    msg(message)
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission(permission => {
      // 如果用户同意，就可以向他们发送通知
      if (permission === 'granted') {
        msg(message)
      }
    })
  }
}
