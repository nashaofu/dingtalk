const fs = require('fs')
const path = require('path')
const { ipcRenderer } = require('electron')

class Injector {
  constructor () {
    this.initialize()
  }

  // 初始化
  initialize () {
    window.addEventListener('load', () => {
      this.injectCss()
      this.injectJs()
    })
  }

  // 注入CSS
  injectCss () {
    let filename = path.join(__dirname, '../css/css.css')
    const style = document.createElement('style')
    fs.readFile(filename, (err, css) => {
      if (!err) {
        const styleContent = document.createTextNode(css.toString())
        style.appendChild(styleContent)
        document.head.appendChild(style)
      }
    })
  }

  // 注入JS
  injectJs () {
    /**
     * 插入窗口操作按钮
     * 关闭/最大化/最小化
     */
    const $ul = document.createElement('ul')
    $ul.setAttribute('class', 'dingtalk-window-operations')

    // 按钮className，同时也是事件名称
    const li = ['window-close', 'window-maximization', 'window-minimize']
    li.forEach(item => {
      // 创建按钮
      const $li = document.createElement('li')
      $li.setAttribute('class', `operation-button ${item}`)
      $ul.appendChild($li)

      // 点击按钮通知主进程
      $li.addEventListener('click', () => {
        ipcRenderer.send(item)
      })
    })
    // 把生成的按钮添加到DOM
    const $layoutContainer = document.querySelector('#layout-container')
    document.body.insertBefore($ul, $layoutContainer.nextSibling)
  }
}

new Injector()
