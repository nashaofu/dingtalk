import { app } from 'electron'
import debug from 'electron-debug'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import './index'

app.on('ready', () => {
  installExtension(VUEJS_DEVTOOLS).catch(err => {
    console.log('Unable to install `vue-devtools`: \n', err)
  })
  debug({ showDevTools: 'undocked' })
})
