import fs from 'fs'
import path from 'path'

import {
  ipcRenderer,
  webFrame
} from 'electron'
import Store from 'electron-store'
import './css.styl'

const store = new Store()

class Injector {
  constructor () {
    this.initialize()
  }

  // 初始化
  initialize () {
    // 只要loading结束
    // 不论页面加载是否成功都会执行
    window.addEventListener('load', () => {
      if (navigator.onLine) {
        ipcRenderer.send('online')
      } else {
        return ipcRenderer.send('offline')
      }
      this.injectCss()
      this.injectJs()
    })
  }

  // 注入CSS
  injectCss () {
    const filename = path.join(__dirname, '../css/css.css')
    fs.readFile(filename, (err, css) => {
      if (!err) {
        const style = document.createElement('style')
        const styleContent = document.createTextNode(css.toString())
        style.appendChild(styleContent)
        document.head.appendChild(style)
      }
    })
  }

  // 注入JS
  injectJs () {
    this.setZoomLevel()
    /**
     * 插入窗口操作按钮
     * 关闭/最大化/最小化
     */
    this.createWindowOperation()
    /**
     * 检测是否需要插入记住我选项
     */
    this.onLoadFinished()
    this.onLoginTabChange()

    /**
     * 检测是否有未读消息
     * 发送未读消息条数到主进程
     */
    this.setBadgeCount()

    /**
     * 打开邮箱界面
     */
    this.openEmail()
    /**
     * 文件下载监听
     */
    this.onDownload()
  }

  // 设置缩放等级
  setZoomLevel () {
    // 设置缩放限制
    webFrame.setZoomFactor(100)
    webFrame.setZoomLevel(0)
    webFrame.setVisualZoomLevelLimits(1, 1)
  }

  // 插入窗口操作按钮
  createWindowOperation () {
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
    if ($layoutContainer) {
      document.body.insertBefore($ul, $layoutContainer.nextSibling)
    } else {
      document.body.appendChild($ul)
    }
  }

  // 页面渲染完成事件
  onLoadFinished () {
    this.createRememberMe()
  }

  // 登录页面面板切换
  onLoginTabChange () {
    const $tabItems = document.querySelectorAll('.login-tab .tab-item')
    $tabItems.forEach((item) => {
      item.addEventListener('click', () => {
        if (item.getAttribute('ui-sref') === '.passwordLogin') {
          setTimeout((cb) => {
            cb()
          }, 100, this.createRememberMe)
        }
      })
    })
  }

  // 插入记住我选项
  createRememberMe () {
    const $checkboxContainer = document.createElement('div')
    $checkboxContainer.innerHTML = '<input name="rememberMe" type="checkbox">记住我'
    const $submitBtn = document.querySelector('button[type="submit"]')
    const $checkbox = $checkboxContainer.querySelector('input[name="rememberMe"]')
    if ($submitBtn) {
      $submitBtn.style.marginTop = 0
      if (!document.querySelector('input[name="rememberMe"]')) {
        $submitBtn.before($checkboxContainer)
      }
    }
    const $pwdInput = document.querySelector('input.password')
    const pwdOnInput = function () {
      $pwdInput.oninput = function () {
        store.set('pwd', $pwdInput.value)
      }
    }
    let pwd = store.get('pwd')
    if (pwd) {
      $checkbox.checked = true
      let $scope = angular.element($pwdInput).scope()
      $scope.$apply(() => {
        $scope.passwordLogin.password = $pwdInput.value = pwd
        $scope.passwordLogin.submitable = true
        $submitBtn.disabled = false
      })
      pwdOnInput()
    }
    $checkbox.addEventListener('click', () => {
      if ($checkbox.checked) {
        pwdOnInput()
      } else {
        store.delete('pwd')
      }
    })
  }

  // 消息通知发送到主进程
  setBadgeCount () {
    let oldCount = 0
    let notify = null
    setInterval(() => {
      let count = 0
      const $mainMenus = document.querySelector('#menu-pannel>.main-menus')
      if ($mainMenus) {
        const $menuItems = $mainMenus.querySelectorAll('li.menu-item')
        $menuItems.forEach($item => {
          const $unread = $item.querySelector('all-conv-unread-count em.ng-binding')
          if ($unread) {
            const badge = parseInt($unread.innerText)
            count += isNaN(badge) ? 0 : badge
          }
        })
      }
      if (oldCount !== count) {
        // 当有新消息来时才发送提示信息
        if (count !== 0 && oldCount < count) {
          // 关闭上一条消息提示
          if (notify && typeof notify.close === 'function') {
            notify.close()
          }
          notify = new Notification('钉钉', {
            body: `您有${count}条消息未查收`,
            tag: 'notify'
          })

          // linux上不支持点击事件
          notify.addEventListener('click', () => {
            ipcRenderer.send('window-show')
          })
        }
        oldCount = count
        ipcRenderer.send('set-badge', count)
      }
    }, 2000)
  }

  // 打开邮箱
  openEmail () {
    document.addEventListener('click', e => {
      const $email = document.querySelector('#menu-pannel > ul.extra-options.ng-scope > div > org-email > li')
      if (!$email) {
        return
      }
      if ($email.contains(e.target)) {
        // 停止事件冒泡和默认事件
        e.stopPropagation()
        e.preventDefault()
        const reg = /^\d+_mailUrl/
        const storage = localStorage
        for (let key in storage) {
          if (reg.test(key)) {
            ipcRenderer.send('open-email', storage[key])
            break
          }
        }
      }
    })
  }

  onDownload () {
    const files = []
    const status = {
      completed: '下载完成',
      cancelled: '取消下载',
      interrupted: '下载失败',
      progressing: '正在下载'
    }
    const findIndex = (collection, condition) => {
      for (let i = 0, len = collection.length; i < len; i++) {
        const item = collection[i]
        if (typeof condition === 'function') {
          if (condition(item)) {
            return i
          }
        } else {
          if (condition === item.id) {
            return i
          }
        }
      }
      return -1
    }

    // 四舍五入并保留小数位数
    const toDecimal = (num, length = 0) => {
      const len = Math.pow(10, length)
      const dec = Math.round(num * len) / len
      return dec === num ? dec : dec.toFixed(length)
    }

    ipcRenderer.on('start-download', (e, file) => {
      files.push(file)
    })
    ipcRenderer.on('downloading', (e, file) => {
      const index = findIndex(files, file.id)
      if (index !== -1) {
        files[index] = file
      }
    })
    ipcRenderer.on('end-download', (e, file) => {
      const index = findIndex(files, file.id)
      if (index !== -1) {
        files[index] = file
      }
      new Notification('钉钉', {
        body: `${file.name}${status[file.state]}`,
        tag: 'download-notify'
      })
    })

    // 下载列表状态更新
    setInterval(() => {
      const $progress = document.querySelector('#header > upload-list > div > div.progress.upload-task-progress')
      if ($progress) {
        const index = findIndex(files, file => file.state === 'progressing')
        if (index !== -1) {
          $progress.classList.remove('ng-hide')
        } else {
          $progress.classList.add('ng-hide')
        }
        const $fileItems = document.querySelector('#header > upload-list > div > div.upload-list-wrap.ng-scope > div.file-items')
        if ($fileItems && files.length) {
          const $empty = document.querySelector('#header > upload-list > div > div.upload-list-wrap.ng-scope > div.file-items-empty-text.ng-binding.ng-scope')
          if ($empty) {
            $empty.classList.add('ng-hide')
          }
          files.forEach(item => {
            let $container = $fileItems.querySelector(`[data-id="${item.id}"]`)
            if (!$container) {
              $container = document.createElement('div')
              $container.setAttribute('class', 'ng-scope')
              $container.setAttribute('data-id', item.id)
              $fileItems.appendChild($container)
            }
            let unit = 'KB'
            let size = item.size / 1024
            let receivedbytes = item.receivedbytes / 1024
            if (size > 1024) {
              unit = 'MB'
              size /= 1024
              receivedbytes /= 1024
            }
            size = toDecimal(size, 1)
            receivedbytes = toDecimal(receivedbytes, 1)
            const progress = item.state === 'completed' ? `${size}${unit}` : `${receivedbytes}${unit} / ${size}${unit}`
            $container.innerHTML = `
              <div class="upload-file-item ng-scope ng-isolate-scope" info="fileTask">
                <b class="file-upload-ico-wrap ico_file_unknown"></b>
                <div style="position:relative;" class="ng-scope">
                  <div class="upload-file-item-text-top ellipsis ng-binding">${item.name}</div>
                  <div class="upload-file-item-text-bottom upload-file-status ng-binding">${status[item.state]}</div>
                  <div class="progress ng-isolate-scope" style="display: ${item.state === 'completed' ? 'none' : 'block'};">
                    <div class="progress-thumb" style="width: ${item.receivedbytes / item.size * 100}%;"></div>
                  </div>
                  <div class="upload-file-item-text-bottom upload-file-size ng-binding">${progress}</div>
                </div>
              </div>
            `
          })
        }
      }
    }, 1000)
  }
}

new Injector()
