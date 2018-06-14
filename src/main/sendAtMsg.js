import qq from './qq'

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

  /**
   * 通过@qqproxy 标记代理qq转发
   * @param {*} conf
   * @param {*} msglayout
   */
  function sendqqbyproxy (conf, msglayout) {
    // msglayout.msg.match(/\u0001\u0003@.*\u0002/)[0]
    /* eslint no-control-regex: "off" */
    /* eslint no-useless-escape: "off" */

    var atnick = msglayout.msg.match(new RegExp(conf.match.msg))[0]
    var nick = atnick.slice(conf.match.proxynick.length, -1)
    var msgbody = msglayout.msg.slice(atnick.length)

    qq(dingtalk)(conf.action.qqbot.host, conf.action.qqbot.port, nick, msgbody)
  }

  /**
   * 通过@ 发送qq消息给某人
   * @param {*} conf
   * @param {*} msglayout
   */
  function sendqq (conf, msglayout) {
    // msglayout.msg.match(/\u0001\u0003@.*\u0002/)[0]
    /* eslint no-control-regex: "off" */

    var atnick = msglayout.msg.match(new RegExp(conf.match.msg))[0]
    var nick = atnick.slice(3, -2)
    var msgbody = msglayout.msg.slice(atnick.length)

    qq(dingtalk)(conf.action.qqbot.host, conf.action.qqbot.port, nick, msgbody)
  }

  /**
  * 发送消息到irc
  * @param {object} conf
  * @param {object} msglayout
  */
  function sendtoirc (conf, msglayout) {
    var atnick = msglayout.msg.match(new RegExp(conf.match.msg))[0]
    var msgbody = msglayout.msg.slice(atnick.length)

    dingtalk.$ircManager.send({
      'irc_server': conf.action.irc.server,
      'irc_channel': conf.action.irc.channel,
      'irc_messageEncryption': conf.action.irc.aes,
      'msg': msgbody
    })
  }

  var functions = {
    'sendqqbyproxy': sendqqbyproxy,
    'sendqq': sendqq,
    'sendtoirc': sendtoirc
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
  action(dingtalk.setting.at, msglayout)
}
