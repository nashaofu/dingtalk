import irc from 'irc'
import dingWebhook from './dingWebhook'
import { aesEncrypt, aesDecrypt } from './aesutil'
/**
 * 发送irc消息和接收irc消息
 */
export default class IrcManager {
  // init all irc server
  $ircs = []

  // setting 格式
  // [{'server':'irc.freenode.net','channel':'#mychannel','user':'nickname','webhook':'http://...'},{}]
  constructor (setting) {
    console.log('init IrcManager...')
    // constructor init irc client
    if (setting !== undefined && setting.length > 0) {
      setting.forEach((item, index, arr) => {
        console.log('connecting irc' + item.server + item.channel)
        var client = new irc.Client(item.server, 'dingding-proxy', {
          channels: [item.channel]
        })
        client.addListener('message', function (from, to, message) {
          // hubot -> irc -> this -> webhook[dingding]
          // 收到hubot的回复消息,转为webhook
          console.log(from + ' => ' + to + ': ' + message)
          // step1 看看消息是否加密
          if (message.length > 0 && message.indexOf('{"encrypt":true,"msg":"') === 0) {
            try {
              var obj = JSON.parse(message)
              if (typeof obj === 'object' && obj) {
                message = aesDecrypt(obj.msg, item.aes)
              }
            } catch (e) {
              console.log('error：' + message + '!!!' + e)
            }
          }

          if (from === item.user) {
            // 转发指定用户的消息
            dingWebhook()(item.webhook, message)
          } else {
            dingWebhook()(item.webhook, `<${from}> ` + message)
          }
        })
        this.$ircs.push({'setting': item, 'ircclient': client})
      })
    }
  }

  /**
   * 转发消息到->irc-> hubot
   * msg 格式
   * {
   * 'irc_server':'irc.freenode.net',
   * 'irc_channel': '#mychannel',
   * 'msg':{...}
   * }
   * @param {object} msg
   */
  send (msg) {
    var client = this.$ircs.find((item, index, arr) => {
      return item.setting.server === msg.irc_server && item.setting.channel === msg.irc_channel
    })

    if (client !== undefined) {
      console.log(msg + '转发到' + msg.irc_server + msg.irc_channel)
      if (msg.irc_messageEncryption.length > 0) {
        var encrypted = aesEncrypt(msg.msg, msg.irc_messageEncryption)
        var body = `{"encrypt":true,"msg":"${encrypted}"}`
        client.ircclient.say(msg.irc_channel, body)
      } else {
        client.ircclient.say(msg.irc_channel, msg.msg)
      }
    }
  }
}
