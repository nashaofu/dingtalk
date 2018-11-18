import logo from './logo'
import Events from 'events'
import { Notification } from 'electron'

export default class Notify extends Events {
  $notify = null
  /**
   * 显示提示
   * @param {String} body
   */
  show (body) {
    this.close()
    this.$notify = new Notification({
      title: '钉钉',
      body,
      icon: logo
    })
    this.$notify.on('click', () => {
      this.close()
      this.emit('click')
    })
    this.$notify.show()
  }

  /**
   * 关闭提示
   */
  close () {
    if (this.$notify) {
      this.$notify.close()
      this.$notify = null
    }
  }
}
