import debug from 'electron-debug'
import { app } from 'electron'
import dingtalk from './index'

app.on('ready', () => {
  const installExtension = require('electron-devtools-installer')
  installExtension.default(installExtension.VUEJS_DEVTOOLS)
    .catch(err => {
      console.log('Unable to install `vue-devtools`: \n', err)
    })
  dingtalk.ready(() => {
    debug({ showDevTools: 'undocked' })
  })
})
