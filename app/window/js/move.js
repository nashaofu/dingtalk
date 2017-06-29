(() => {
  const { ipcRenderer } = require('electron')
  const clone = require('lodash/clone')
  const throttle = require('lodash/throttle')

  const move = {
    ox: 0, // 起始位置的坐标
    oy: 0,
    mx: 0, // 移动距离
    my: 0,
    disabled: false
  }

  window.addEventListener('mousedown', e => {
    const { offsetX, offsetY, target } = e
    if (offsetY <= 60) {
      if (target.id === 'header' || target.id === 'layout-container') {
        move.disabled = true
        move.ox = offsetX
        move.oy = offsetY
        move.mx = 0
        move.my = 0
        ipcRenderer.send('movestart', clone(move))
        document.body.classList.add('dingtalk-moveing')
      }
    }
  })

  window.addEventListener('mousemove', throttle(e => {
    const { offsetX, offsetY } = e
    if (move.disabled) {
      move.mx = offsetX - move.ox
      move.my = offsetY - move.oy
      ipcRenderer.send('moveing', clone(move))
    }
  }, 100, { leading: true }))

  window.addEventListener('mouseup', e => {
    const { offsetX, offsetY } = e
    if (move.disabled) {
      move.mx = offsetX - move.ox
      move.my = offsetY - move.oy
      ipcRenderer.send('moveend', clone(move))
      move.ox = 0
      move.oy = 0
      move.mx = 0
      move.my = 0
      move.disabled = false
      document.body.classList.remove('dingtalk-moveing')
    }
  })
})()
