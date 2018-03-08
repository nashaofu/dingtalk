import debug from 'electron-debug'
import { app } from 'electron'
import './index'

debug({ showDevTools: true })

app.on('ready', () => {
  const installExtension = require('electron-devtools-installer')
  installExtension.default(installExtension.VUEJS_DEVTOOLS)
    .catch(err => {
      console.log('Unable to install `vue-devtools`: \n', err)
    })
})
