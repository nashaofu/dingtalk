import http from 'http'
// import qs from 'querystring'

/**
 * 发送消息给hubot
 * 消息格式为:
 * {
 *  "group":""
 *  "msg":"\u0001\u0003@{who} \u0003{body}"
 * }
 */
export default dingtalk => msglayout => {
  // 这是需要提交的数据
  // var data = {a: 123, time: new Date().getTime()};
  // var content = qs.stringify(data)
  console.log(msglayout)

  var $config = [{
    'match': {
      'group': '^hubot$',
      'msg': '\u0001\u0003@qqproxy \u0002@[^\s]+( |　)'
    },
    'action': {
      'do': 'sendqqbyproxy',
      'qqbot': {
        'host': '127.0.0.1',
        'port': 8188
      }
    }
  }, {
    'match': {
      'group': '^hubot$',
      'msg': '\u0001\u0003@.*\u0002'
    },
    'action': {
      'do': 'sendqq',
      'qqbot': {
        'host': '127.0.0.1',
        'port': 8188
      }
    }
  }]

  /**
   * 通过@qqproxy 标记代理qq转发
   * @param {*} conf
   * @param {*} msglayout
   */
  function sendqqbyproxy (conf, msglayout) {
    // msglayout.msg.match(/\u0001\u0003@.*\u0002/)[0]
    /* eslint no-control-regex: "off" */
    /* eslint no-useless-escape: "off" */

    var atnick = msglayout.msg.match(new RegExp('\u0001\u0003@qqproxy \u0002@[^\s]+[ |　]'))[0]
    var nick = atnick.slice('\u0001\u0003@qqproxy \u0002@'.length, -1)
    var msgbody = msglayout.msg.slice(atnick.length)

    var path = '/send/buddy/' + encodeURIComponent(nick) + '/' + encodeURIComponent(msgbody)
    // path.replace(/([\u4e00-\u9fa5])/g, (str) => encodeURIComponent(str) )
    var options = {
      hostname: conf.action.qqbot.host,
      port: conf.action.qqbot.port,
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

  /**
   * 通过@ 发送qq消息给某人
   * @param {*} conf
   * @param {*} msglayout
   */
  function sendqq (conf, msglayout) {
    // msglayout.msg.match(/\u0001\u0003@.*\u0002/)[0]
    /* eslint no-control-regex: "off" */

    var atnick = msglayout.msg.match(new RegExp('\u0001\u0003@.*\u0002'))[0]
    var nick = atnick.slice(3, -2)
    var msgbody = msglayout.msg.slice(atnick.length)

    var path = '/send/buddy/' + encodeURIComponent(nick) + '/' + encodeURIComponent(msgbody)
    // path.replace(/([\u4e00-\u9fa5])/g, (str) => encodeURIComponent(str) )
    var options = {
      hostname: conf.action.qqbot.host,
      port: conf.action.qqbot.port,
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

  var functions = {
    'sendqqbyproxy': sendqqbyproxy,
    'sendqq': sendqq
  }

  function action (config, msglayout) {
    var conf = config.find((conf, index, arr) => {
      return msglayout.group.match(new RegExp(conf.match.group)) && msglayout.msg.match(new RegExp(conf.match.msg))
    })
    console.log(conf)

    if (conf !== undefined) {
      var fn = functions[conf.action.do]
      fn(conf, msglayout)
    }
  }
  action($config, msglayout)
}
