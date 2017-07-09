const fs = require('fs')
const path = require('path')
const axiso = require('axios')
const chalk = require('chalk')
const { version } = require('../package')

const token = process.env.token
// dist文件夹
const dir = path.join(__dirname, '../dist')

axiso.defaults.headers.common['Authorization'] = `token ${token}`

axiso({
  baseURL: 'https://api.github.com/',
  method: 'post',
  url: '/repos/nashaofu/dingtalk/releases',
  data: {
    tag_name: `v${version}`,
    target_commitish: 'master',
    name: `v${version}`,
    body: `发布${version}版本`,
    draft: false,
    prerelease: false
  },
  headers: {
    Authorization: `token ${token}`
  }
}).then(res => {
  console.log(chalk.yellow(`发布${version}版本成功，正在上传文件\n`))

  // 发布release的ID
  const id = res.data.id
  // 读取文件夹下的文件
  const files = fs.readdirSync(dir)
    .filter(file => {
      return fs.statSync(path.join(dir, file)).isFile()
    })

  // 上传文件到发布的版本中去
  uploadAssets(id, files)
}, rej => {
  console.log(chalk.red(`发布${version}版本失败\n`))
  throw rej
})

function uploadAssets (id, files) {
  // 循环上传文件上传文件
  const stack = files.map(file => {
    console.log(chalk.cyan(`正在上传文件${file}...\n`))
    const raw = fs.readFileSync(path.join(dir, file))
    return axiso({
      baseURL: 'https://uploads.github.com/',
      url: `/repos/nashaofu/dingtalk/releases/${id}/assets`,
      method: 'post',
      params: {
        name: file,
        label: file
      },
      data: raw,
      headers: {
        'Content-type': 'application/x-debian-package'
      }
    }).then(res => {
      console.log(chalk.yellow(`上传文件${file}成功\n`))
    }, rej => {
      console.log(chalk.red(`上传文件${file}失败\n`))
      throw rej
    })
  })
  Promise.all(stack).then(() => {
    console.log(chalk.blue('所有文件上传完成，版本发布全部结束'))
  })
}
