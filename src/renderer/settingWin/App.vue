<template lang="pug">
.app
  .app-item
    dt-input(v-model="shortcutCapture", title="截图")
  .app-item
    dt-switch(v-model="autoupdate", title="自动更新")
  .app-item
    .app-item-error {{ error }}
  .app-item
    .app-item-button
      dt-button 取消
      dt-button(type="primary") 确定
</template>

<script>
import { webFrame, ipcRenderer } from 'electron'

export default {
  name: 'App',
  data () {
    return {
      error: '',
      setting: {}
    }
  },
  computed: {
    shortcutCapture: {
      get () {
        return this.setting.keymap
          ? this.setting.keymap['shortcut-capture']
          : ''
      },
      set (val) {
        const keymap = this.setting.keymap || {}
        this.setting = {
          ...this.setting,
          keymap: {
            ...keymap,
            'shortcut-capture': keymap['shortcut-capture']
          }
        }
      }
    },
    autoupdate: {
      get () {
        return !!this.setting.autoupdate
      },
      set (val) {
        this.setting = {
         ...this.setting,
         autoupdate: val
        }
      }
    }
  },
  mounted () {
    ipcRenderer.on('dom-ready', (e, setting) => {
      this.setting = { ...setting }
      this.setZoomLevel()
    })
  },
  methods: {
    setZoomLevel () {
      // 设置缩放限制
      webFrame.setZoomFactor(100)
      webFrame.setZoomLevel(0)
      webFrame.setVisualZoomLevelLimits(1, 1)
    }
  }
}
</script>

<style lang="stylus">
@import "normalize.css"

$font-family = "PingFang-SC-Medium", "Source Han Sans", "Segoe UI", "Lucida Grande", Helvetica, Arial, "Microsoft YaHei", FreeSans, Arimo, "Droid Sans", "wenquanyi micro hei", "Hiragino Sans GB", "Hiragino Sans GB W3", sans-serif
*,
*:before,
*:after
  box-sizing border-box

html,
body
  font-family $font-family
  color #333

.app
  padding 15px
  &-item
    margin 10px auto
    text-align center
    &-error
      line-height 15px
      font-size 14px
      text-align left
      color #f00
      margin 15px auto
    &-button
      margin 30px auto 15px auto
      .dt-button
        margin 0 15px
        padding 8px 20px
</style>
