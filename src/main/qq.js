import http from 'http'

/**
 * 发送qqbot 消息
 */
export default (dingtalk) => (host, port, nick, msgbody) => {
  var path = '/send/buddy/' + encodeURIComponent(nick) + '/' + encodeURIComponent(msgbody)
  // path.replace(/([\u4e00-\u9fa5])/g, (str) => encodeURIComponent(str) )
  var options = {
    hostname: host,
    port: port,
    path: path,
    method: 'GET'
  }

  var notifyError = function (body) {
    dingtalk.$notify.show(body)
  }

  console.log(options)
  var req = http.request(options, function (res) {
    console.log('STATUS: ' + res.statusCode)
    console.log('HEADERS: ' + JSON.stringify(res.headers))
    res.setEncoding('utf8')
    res.on('data', function (chunk) {
      console.log('BODY: ' + chunk)
      if (chunk.indexOf('发消息失败') >= 0) {
        notifyError(`消息:${msgbody} 发送失败!`)
      } else if (chunk.indexOf('不存在') >= 0) {
        notifyError(`qq好友:${nick} 不存在!`)
      }
    })
  })
  req.on('error', function (e) {
    console.log('problem with request: ' + e.message)
  })

  req.end()
}
