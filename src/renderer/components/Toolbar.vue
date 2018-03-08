<template lang="pug">
.toolbar(:style="style")
  //- .toolbar-button(
  //-   title="涂鸦",
  //-   @click.stop="click('brush')"
  //- )
  //-   i.iconfont-brush
  //- .toolbar-button(
  //-   title="撤销",
  //-   @click.stop="click('revoke')"
  //- )
  //-   i.iconfont-revoke
  .toolbar-button(
    title="退出",
    @click.stop="click('cancel')"
  )
    i.iconfont-cancel
  .toolbar-button(
    title="完成",
    @click.stop="click('done')"
  )
    i.iconfont-done
</template>

<script>
export default {
  name: 'Toolbar',
  props: {
    rect: {
      type: Object,
      default: () => ({ x1: 0, y1: 0, x2: 0, y2: 0 })
    }
  },
  computed: {
    x () {
      return this.rect.x1 > this.rect.x2 ? this.rect.x1 : this.rect.x2
    },
    y () {
      return this.rect.y1 > this.rect.y2 ? this.rect.y1 : this.rect.y2
    },
    style () {
      const dx = Math.abs(this.rect.x2 - this.rect.x1)
      const dy = Math.abs(this.rect.y2 - this.rect.y1)
      return {
        left: `${this.x}px`,
        top: `${this.y}px`,
        visibility: dx && dy ? 'visible' : 'hidden'
      }
    }
  },
  methods: {
    click (cmd) {
      return this.$emit('click', cmd)
    }
  }
}
</script>

<style lang="stylus">
.toolbar
  width 60px
  height 30px
  background-color #fff
  display block
  position absolute
  transform translate3d(-100%, 10px, 0)
  border-radius 2px
  z-index 100
  overflow hidden
  &:before,
  &:after
    content ""
    display table
    float none
    clear both
  &-button
    width 30px
    height 30px
    line-height 30px
    float left
    font-size 20px
    text-align center
    background-color #fff
    border-top 1px solid #ccc
    border-right 1px solid #ccc
    border-bottom 1px solid #ccc
    border-left 1px solid #ccc
    cursor pointer
    &:first-child
      border-left none
      border-radius 2px 0 0 2px
    &:last-child
      border-right none
      border-radius 0 2px 2px 0
    &:hover
      background-color #eee
    &:active
      background-color #ccc
</style>
