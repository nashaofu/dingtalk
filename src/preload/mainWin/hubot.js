import { ipcRenderer } from 'electron'

export default () => {
  let needsendmessage = ''
  document.addEventListener('keyup', e => {
    const $msgbox = document.querySelector('#content-pannel > div > div > div > div > div > textarea.textarea.input-msg-box.ng-isolate-scope')
    // console.log($msgbox)
    if (!$msgbox) {
      return
    }
    // 非msgbox的ｕp事件
    if (e.srcElement !== $msgbox) {
      return
    }
    //
    if (e.code === 'Enter') {
      if (needsendmessage !== '') {
        // send and clean
        // \u0001\u0003@爱爱 \u0002
        if (needsendmessage.indexOf('\u0001\u0003@') === 0) {
          console.log('发送@:' + needsendmessage)
          // ipcRenderer.send('notify', `发送@${needsendmessage}`)
          ipcRenderer.send('MAINWIN:send-at-msg', needsendmessage)
        }
        needsendmessage = ''
      }
    } else {
      console.log($msgbox.value)
      var str = $msgbox.value.replace(/(^[\s\t\xa0\u3000]+)|([\u3000\xa0\s\t]+$)/g, '')
      if (str !== '') {
        needsendmessage = str
      }
      // console.log("无输入")
    }
  })
}
