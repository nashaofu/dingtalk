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
        const $grouptxt = document.querySelector('#content-pannel > div > div > div > div > span > span.ng-binding')
        let needsendmessageLayOut = {
          'group': $grouptxt.innerHTML,
          'msg': needsendmessage
        }
        console.log(needsendmessageLayOut.group + '发送@:' + needsendmessage)
        ipcRenderer.send('MAINWIN:send-at-msg', needsendmessageLayOut)
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
