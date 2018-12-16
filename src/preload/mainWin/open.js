/**
 * 劫持window.open
 */
export default injector => {
  const op = window.open
  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  document.body.append(iframe)

  window.open = function (url, ...args) {
    if (url.indexOf('https://space.dingtalk.com/auth/download') === 0) {
      iframe.src = url
    }
    return op.call(window, url, ...args)
  }
}
