const fs = require('fs')
const axios = require('axios')
const chalk = require('chalk')
const http = require('http')
const https = require('https')
const registryUrl = require('registry-url')
const registryAuthToken = require('registry-auth-token')

const httpAgent = new http.Agent({
  keepAlive: true,
  maxSockets: 50
})
const httpsAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 50
})

/**
 * 把一个长的并发一步任务转换为
 * 一个切片形式的串行任务
 * @param {Array} tasks 任务数据
 * @return {Promise<Array>} Promise对象按切片执行结果
 */
function parallelToSerial (tasks) {
  const reslut = []
  async function next () {
    // 如果数据执行完之后就直接返回
    if (!tasks.length) return reslut
    // 执行处理逻辑
    reslut.push(await tasks.shift()())
    // 循环下一个切片
    await next()
    return reslut
  }
  return next()
}

/**
 * 拉取最新的包
 * @param {*} pkg
 * @param {*} pkgInfo
 */
async function getPackageVersion (pkg, pkgInfo) {
  console.log(`get ${pkg} ...`)
  const scope = pkg.split('/')[0]
  const registry = registryUrl(scope)
  const authInfo = registryAuthToken(registry, { recursive: true })
  const headers = {
    accept: 'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*'
  }

  if (authInfo) {
    headers.authorization = `${authInfo.type} ${authInfo.token}`
  }

  const time = Date.now()
  try {
    const { data } = await axios.get(`${encodeURIComponent(pkg).replace(/^%40/, '@')}/latest`, {
      baseURL: registry,
      headers,
      httpAgent,
      httpsAgent
    })
    console.log(
      chalk.bgGreen.black(' DONE '),
      JSON.stringify(
        {
          ...pkgInfo,
          id: pkg,
          status: 200,
          time: Date.now() - time
        },
        null,
        2
      )
    )
    return data.version
  } catch (e) {
    const status = ((e || {}).response || {}).status
    console.log(
      chalk.bgRed.black(' ERROR '),
      JSON.stringify(
        {
          ...pkgInfo,
          id: pkg,
          status: status || e.response,
          time: Date.now() - time
        },
        null,
        2
      )
    )
  }
}

/**
 * 比较版本
 * @param {*} pkg
 * @param {*} type
 */
function diffVersion (pkg, type) {
  return Object.keys(pkg[type]).map(key => async () => {
    // 排除内部依赖
    const version = await getPackageVersion(key, {
      name: pkg.name,
      type,
      version: pkg[type][key]
    })
    pkg[type][key] = version ? `^${version}` : pkg[type][key]
  })
}

const pkg = require('./package.json')
const dependencies = diffVersion(pkg, 'dependencies')
const devDependencies = diffVersion(pkg, 'devDependencies')

parallelToSerial(dependencies)
  .then(() => parallelToSerial(devDependencies))
  .then(() => {
    fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2))
  })
