<template lang="pug">
.app
  .app-item
    dt-keybinding(
      v-model="shortcutCapture",
      title="截图"
    )
  .app-item
    dt-switch(
      v-model="autoupdate",
      title="自动更新"
    )
  .app-item
    .app-item-button
      dt-button(@click="reset") 还原设置
      dt-button(
        type="primary"
        @click="save"
      ) 保存设置
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import { webFrame, ipcRenderer } from 'electron'

export default {
  name: 'App',
  data () {
    return {
      oldSetting: {},
      setting: {}
    }
  },
  computed: {
    shortcutCapture: {
      get () {
        return this.setting.keymap
          ? this.setting.keymap['shortcut-capture']
          : []
      },
      set (val) {
        const keymap = this.setting.keymap || {}
        this.setting = {
          ...this.setting,
          keymap: {
            ...keymap,
            'shortcut-capture': val
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
  created () {
    ipcRenderer.on('dom-ready', (e, setting) => {
      this.setting = cloneDeep(setting)
      this.oldSetting = cloneDeep(setting)
      this.setZoomLevel()
    })
  },
  methods: {
    setZoomLevel () {
      // 设置缩放限制
      webFrame.setZoomFactor(100)
      webFrame.setZoomLevel(0)
      webFrame.setVisualZoomLevelLimits(1, 1)
    },
    reset () {
      this.setting = cloneDeep(this.oldSetting)
    },
    save () {
      ipcRenderer.send('SETTINGWIN:setting', this.setting)
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
    &-button
      padding 40px 0 10px 0
      .dt-button
        margin 0 15px
        padding 8px 20px
</style>
