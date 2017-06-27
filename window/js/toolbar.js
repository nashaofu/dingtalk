(() => {
  const $toolbar = document.createElement('div')
  $toolbar.setAttribute('class', 'toolbar')

  $toolbar.innerHTML = `<div class="toolbar-right">
                          <a id="window-minimize" href="javascript:void(0)">
                            <i class="dt-font dt-icon-minimize"></i>
                          </a>
                          <a id="window-maximization" href="javascript:void(0)">
                            <i class="dt-font dt-icon-maximization"></i>
                          </a>
                          <a id="window-close" href="javascript:void(0)">
                            <i class="dt-font dt-icon-close"></i>
                          </a>
                        </div>
                        `
  document.body.appendChild($toolbar)

  const $windowMinimize = document.querySelector('#window-minimize')
  const $windowMaximization = document.querySelector('#window-maximization')
  const $windowClose = document.querySelector('#window-close')
  console.log(window.$webview)
  $windowMinimize.addEventListener('click', () => {
    // window.$webview.send('minimize')
  })

  $windowMaximization.addEventListener('click', () => {
    // window.$webview.send('maximization')
  })

  $windowClose.addEventListener('click', () => {
    // window.$webview.send('close')
  })
})()
