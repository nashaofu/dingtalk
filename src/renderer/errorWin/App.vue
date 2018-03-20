<template lang="pug">
.app
  .app-lamp
    .app-lamp-1 E
    .app-lamp-2 R
    .app-lamp-3 R
    .app-lamp-4 O
    .app-lamp-5 R
  .app-desc 网络错误
  .app-buttons
    .app-buttons-retry(@click="retry") 重试
    .app-buttons-close(@click="close") 关闭
</template>

<script>
import { ipcRenderer, webFrame } from 'electron'

export default {
  name: 'App',
  created () {
    this.setZoomLevel()
    ipcRenderer.send('online', navigator.onLine)
    window.addEventListener('online', () => ipcRenderer.send('online', navigator.onLine))
  },
  methods: {
    setZoomLevel () {
      // 设置缩放限制
      webFrame.setZoomFactor(100)
      webFrame.setZoomLevel(0)
      webFrame.setVisualZoomLevelLimits(1, 1)
    },
    retry () {
      ipcRenderer.send('ERRORWIN:retry')
    },
    close () {
      ipcRenderer.send('ERRORWIN:close')
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
  height 100%
  font-family $font-family
  overflow hidden
  background-color transparent
  user-select none
  -webkit-app-region no-drag

.app
  height 100%
  text-align center
  display flex
  flex-direction column
  justify-content center
  align-items center
  &-lamp
    display flex
    flex 1
    align-items center
    font-family cursive, Arial, Helvetica, sans-serif
    font-size 120px
    font-weight bold
    white-space nowrap
    color #fff
    cursor default
    &-1,
    &-2,
    &-3,
    &-4,
    &-5
      flex 1
      transform translate3d(0,0,0)
      text-shadow 0 0 2px #686868, 0px 1px 1px #ddd, 0px 2px 1px #d6d6d6, 0px 3px 1px #ccc, 0px 4px 1px #c5c5c5, 0px 5px 1px #c1c1c1, 0px 6px 1px #bbb, 0px 7px 1px #777, 0px 8px 3px rgba(100, 100, 100, 0.4), 0px 9px 5px rgba(100, 100, 100, 0.1), 0px 10px 7px rgba(100, 100, 100, 0.15), 0px 11px 9px rgba(100, 100, 100, 0.2), 0px 12px 11px rgba(100, 100, 100, 0.25), 0px 13px 15px rgba(100, 100, 100, 0.3)
      transition all 0.1s linear

    &-1
      animation lamp 3s linear 0s infinite
    &-2
      animation lamp 3s linear 0.6s infinite
    &-3
      animation lamp 3s linear 1.2s infinite
    &-4
      animation lamp 3s linear 1.8s infinite
    &-5
      animation lamp 3s linear 2.4s infinite

  &-desc
    text-align center
    font-size 18px
    font-weight bold
    text-shadow 0 2px 2px #777
    letter-spacing 1px
    color #fff
    cursor default

  &-buttons
    display flex
    margin 10px auto
    &-retry,
    &-close
      flex 1
      background-color transparent
      border none
      font-family $font-family
      font-size 16px
      color #fff
      margin 20px 30px
      padding 10px 30px
      font-weight 600
      cursor pointer
      transform perspective(1px) translateZ(0)
      box-shadow 0 0 1px transparent
      transition-duration 0.3s
      transition-property all
      box-shadow 0 0 1px transparent
      position relative
      z-index 1
      &:before
        content ""
        width 90%
        height 10px
        pointer-events none
        position absolute
        top 100%
        left 5%
        z-index -1
        opacity 0
        background radial-gradient(ellipse at center, rgba(0, 0, 0, 0.6) 0%, transparent 80%)
        transition-duration 0.3s
        transition-property transform, opacity

      &:after
        content ""
        position absolute
        top 0
        right 0
        bottom 0
        left 0
        border-radius 0
        animation-duration 1s

      &:hover
        transform translate3d(0,-5px,0)
        &:before
          opacity 1
          transform translate3d(0,5px,0)
        &:after
          animation-name ripple-out
          border-radius 3px

@keyframes lamp
  0%
    text-shadow 0 0 2px #686868, 0px 1px 1px #ddd, 0px 2px 1px #d6d6d6, 0px 3px 1px #ccc, 0px 4px 1px #c5c5c5, 0px 5px 1px #c1c1c1, 0px 6px 1px #bbb, 0px 7px 1px #777, 0px 8px 3px rgba(100, 100, 100, 0.4), 0px 9px 5px rgba(100, 100, 100, 0.1), 0px 10px 7px rgba(100, 100, 100, 0.15), 0px 11px 9px rgba(100, 100, 100, 0.2), 0px 12px 11px rgba(100, 100, 100, 0.25), 0px 13px 15px rgba(100, 100, 100, 0.3)
  16%
    text-shadow 0 0 2px #686868, 0px 1px 1px #fff, 0px 2px 1px #fff, 0px 3px 1px #fff, 0px 4px 1px #fff, 0px 5px 1px #fff, 0px 6px 1px #fff, 0px 7px 1px #777, 0px 8px 3px #fff, 0px 9px 5px #fff, 0px 10px 7px #fff, 0px 11px 9px #fff, 0px 12px 11px #fff, 0px 13px 15px #fff
  32%
    text-shadow 0 0 2px #686868, 0px 1px 1px #ddd, 0px 2px 1px #d6d6d6, 0px 3px 1px #ccc, 0px 4px 1px #c5c5c5, 0px 5px 1px #c1c1c1, 0px 6px 1px #bbb, 0px 7px 1px #777, 0px 8px 3px rgba(100, 100, 100, 0.4), 0px 9px 5px rgba(100, 100, 100, 0.1), 0px 10px 7px rgba(100, 100, 100, 0.15), 0px 11px 9px rgba(100, 100, 100, 0.2), 0px 12px 11px rgba(100, 100, 100, 0.25), 0px 13px 15px rgba(100, 100, 100, 0.3)
  100%
    text-shadow 0 0 2px #686868, 0px 1px 1px #ddd, 0px 2px 1px #d6d6d6, 0px 3px 1px #ccc, 0px 4px 1px #c5c5c5, 0px 5px 1px #c1c1c1, 0px 6px 1px #bbb, 0px 7px 1px #777, 0px 8px 3px rgba(100, 100, 100, 0.4), 0px 9px 5px rgba(100, 100, 100, 0.1), 0px 10px 7px rgba(100, 100, 100, 0.15), 0px 11px 9px rgba(100, 100, 100, 0.2), 0px 12px 11px rgba(100, 100, 100, 0.25), 0px 13px 15px rgba(100, 100, 100, 0.3)

@keyframes ripple-out
  0%
    border 4px solid #fff
  100%
    top -12px
    right -12px
    bottom -12px
    left -12px
    opacity 0
    border-radius 40
    border 0 solid #fff
</style>
