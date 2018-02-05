const path = require('path')
const { build, Platform } = require('electron-builder')
const chalk = require('chalk')
const { author, description } = require('../package.json')

build({
  targets: Platform.LINUX.createTarget(),
  config: {
    appId: 'dingtalk',
    copyright: `Copyright © ${new Date().getFullYear} ${author.name}`,
    productName: '钉钉',
    asar: true,
    linux: {
      description,
      icon: path.join(__dirname, '../icon'),
      target: 'deb',
      category: 'InstantMessaging'
    }
  }
}).then(() => {
  console.log(chalk.cyan('Build complete.\n'))
}).catch(error => {
  throw error
})
