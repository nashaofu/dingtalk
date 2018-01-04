const { ipcRenderer } = require('electron')
window.addEventListener('load', () => {
  window.addEventListener('online', () => {
    ipcRenderer.send('online')
  })
  const $button = document.querySelector('.error-container-retry')
  $button.addEventListener('click', () => {
    if (!$button.disabled) {
      $button.disabled = true
      ipcRenderer.send('online')
    }
  })
  if (navigator.onLine) {
    ipcRenderer.send('online')
  }
})
