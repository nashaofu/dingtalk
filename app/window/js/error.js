window.addEventListener('load', () => {
  window.addEventListener('online', () => {
    window.location.href = 'https://im.dingtalk.com/'
  })
  document.querySelector('.error-container-retry').addEventListener('click', () => {
    window.location.href = 'https://im.dingtalk.com/'
  })
})
