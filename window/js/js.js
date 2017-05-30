const { ipcRenderer } = require('electron')

const $windowMinimize = document.querySelector('#window-minimize')
const $windowMaximization = document.querySelector('#window-maximization')
const $windowClose = document.querySelector('#window-close')

$windowMinimize.addEventListener('click', e => {
    ipcRenderer.send('minimize')
})

$windowMaximization.addEventListener('click', e => {
    ipcRenderer.send('maximization')
})

$windowClose.addEventListener('click', e => {
    ipcRenderer.send('close')
})