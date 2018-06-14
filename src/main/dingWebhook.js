import https from 'https'
import url from 'url'

/**
 * 发送webhook消息
 */
export default () => (webhook, msg) => {
  var _url = url.parse(webhook)
  var data = {
    'msgtype': 'text',
    'text': {
      'content': msg
    },
    'at': {
      'atMobiles': ['1825718XXXX'],
      'isAtAll': false
    }
  }

  data = JSON.stringify(data)
  var options = {
    protocol: _url.protocol,
    hostname: _url.hostname,
    port: _url.port,
    path: _url.path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  console.log(options)
  console.log(data)
  var req = https.request(options, function (res) {
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
  req.write(data + '\n')
  req.end()
}
