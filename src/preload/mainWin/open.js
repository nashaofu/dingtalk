/**
 * 劫持window.open
 */
export default injector => {
  const op = window.open
  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  document.body.append(iframe)

  function download (url) {
    if (url.indexOf('https://space.dingtalk.com/auth/download') === 0) {
      iframe.src = url
      return true
    } else if (url.indexOf('https://space.dingtalk.com/attachment') === 0) {
      iframe.src = url
      return true
    }
  }

  document.addEventListener('click', e => {
    for (let i = 0, length = e.path.length; i < length; i++) {
      const node = e.path[i]
      if (node.nodeName === 'A' && node.href) {
        if (download(node.href)) {
          e.preventDefault()
          return
        }
      }
    }
  })

  window.open = function (url, ...args) {
    download(url)
    return op.call(window, url, ...args)
  }
}
