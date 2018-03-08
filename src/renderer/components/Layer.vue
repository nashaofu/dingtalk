<template lang="pug">
.layer(@mousedown.left="mousedown")
</template>

<script>
export default {
  name: 'Layer',
  data () {
    return {
      is: false,
      rect: { x1: 0, y1: 0, x2: 0, y2: 0 }
    }
  },
  mounted () {
    window.addEventListener('mousemove', e => this.mousemove(e))
    window.addEventListener('mouseup', e => this.mouseup(e))
  },
  methods: {
    mousedown (e) {
      this.is = true
      this.rect = {
        x1: e.clientX,
        y1: e.clientY,
        x2: e.clientX,
        y2: e.clientY
      }
      this.draw()
    },
    mousemove (e) {
      if (this.is) {
        this.rect.x2 = e.clientX
        this.rect.y2 = e.clientY
        this.draw()
      }
    },
    mouseup (e) {
      if (this.is) {
        this.rect.x2 = e.clientX
        this.rect.y2 = e.clientY
        this.draw()
      }
      this.is = false
    },
    draw () {
      if (Math.abs(this.rect.x2 - this.rect.x1) >= 7 && Math.abs(this.rect.y2 - this.rect.y1) >= 7) {
        this.$emit('draw', this.rect)
      }
    }
  }
}
</script>

<style lang="stylus">
.layer
  position absolute
  top 0
  right 0
  bottom 0
  left 0
  background-color rgba(0, 0, 0, 0.3)
  z-index 70
</style>
