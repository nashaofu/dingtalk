import { ipcRenderer } from 'electron'

const $windowMinimize: any  = document.querySelector('#window-minimize')
const $windowMaximization: any  = document.querySelector('#window-maximization')
const $windowClose: any  = document.querySelector('#window-close')

$windowMinimize.addEventListener('click', () => {
  ipcRenderer.send('minimize')
})

$windowMaximization.addEventListener('click', () => {
  ipcRenderer.send('maximization')
})

$windowClose.addEventListener('click', () => {
  ipcRenderer.send('close')
})
