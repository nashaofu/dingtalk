import './index'
import { app } from 'electron'
import debug from 'electron-debug'

app.on('ready', () => {
  const installExtension = require('electron-devtools-installer')
  installExtension.default(installExtension.VUEJS_DEVTOOLS).catch(err => {
    console.log('Unable to install `vue-devtools`: \n', err)
  })
  debug({ showDevTools: 'undocked' })
})
