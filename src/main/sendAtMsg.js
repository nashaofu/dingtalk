import http from 'http'
// import qs from 'querystring'

/**
 * 发送消息给hubot
 * 消息格式为:\u0001\u0003@{who} \u0003{body}
 */
export default dingtalk => msg => {
  // 这是需要提交的数据
  // var data = {a: 123, time: new Date().getTime()};
  // var content = qs.stringify(data);

  console.log(msg)
  // msg.match(/\u0001\u0003@.*\u0002/)[0]
  /* eslint no-control-regex: "off" */

  var atnick = msg.match(new RegExp('\u0001\u0003@.*\u0002'))[0]
  var nick = atnick.slice(3, -2)
  var msgbody = msg.slice(atnick.length)

  var path = '/send/buddy/' + encodeURIComponent(nick) + '/' + encodeURIComponent(msgbody)
  // path.replace(/([\u4e00-\u9fa5])/g, (str) => encodeURIComponent(str) )
  var options = {
    hostname: '127.0.0.1',
    port: 8188,
    path: path,
    method: 'GET'
  }
  console.log(options)
  var req = http.request(options, function (res) {
    console.log('STATUS: ' + res.statusCode)
    console.log('HEADERS: ' + JSON.stringify(res.headers))
    res.setEncoding('utf8')
    res.on('data', function (chunk) {
      console.log('BODY: ' + chunk)
    })
  })
  req.on('error', function (e) {
    console.log('problem with request: ' + e.message)
  })

  req.end()
}
