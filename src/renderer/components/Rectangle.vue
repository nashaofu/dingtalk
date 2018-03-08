<template lang="pug">
canvas.rectangle(
  :width="width",
  :height="height",
  :style="style",
  @mousedown.left="mousedown"
)
</template>

<script>
export default {
  name: 'Rectangle',
  props: {
    rect: {
      type: Object,
      default: () => ({ x1: 0, y1: 0, x2: 0, y2: 0 })
    },
    bounds: {
      type: Object,
      default: () => ({ x: 0, y: 0, width: 0, height: 0 })
    }
  },
  data () {
    return {
      is: false,
      point: { x: 0, y: 0 },
      oRect: { x1: 0, y1: 0, x2: 0, y2: 0 },
      ctx: null
    }
  },
  computed: {
    x () {
      const { x1, x2 } = this.rect
      return x1 < x2 ? x1 : x2
    },
    y () {
      const { y1, y2 } = this.rect
      return y1 < y2 ? y1 : y2
    },
    width () {
      return Math.abs(this.rect.x2 - this.rect.x1)
    },
    height () {
      return Math.abs(this.rect.y2 - this.rect.y1)
    },
    boundsWidth () {
      return this.bounds.width
    },
    boundsHeight () {
      return this.bounds.height
    },
    style () {
      return {
        left: `${this.x}px`,
        top: `${this.y}px`,
        visibility: this.width && this.height ? 'visible' : 'hidden'
      }
    }
  },
  mounted () {
    this.ctx = this.$el.getContext('2d')
    window.addEventListener('mousemove', e => this.mousemove(e))
    window.addEventListener('mouseup', e => this.mouseup(e))
  },
  methods: {
    mousedown (e) {
      this.is = true
      this.point = { x: e.clientX, y: e.clientY }
      this.oRect = this.rect
      this.shift(e)
    },
    mousemove (e) {
      if (this.is) {
        this.shift(e)
      }
    },
    mouseup (e) {
      if (this.is) {
        this.shift(e)
      }
      this.is = false
    },
    shift (e) {
      const x = e.clientX - this.point.x
      const y = e.clientY - this.point.y
      let { x1, y1, x2, y2 } = this.oRect
      const width = Math.abs(this.rect.x2 - this.rect.x1)
      const height = Math.abs(this.rect.y2 - this.rect.y1)
      x1 += x
      y1 += y
      x2 += x
      y2 += y
      if (x1 < x2) {
        if (x1 < 0) {
          x1 = 0
          x2 = width
        }
        if (x2 > this.boundsWidth) {
          x2 = this.boundsWidth
          x1 = this.boundsWidth - width
        }
      }
      if (x2 < x1) {
        if (x2 < 0) {
          x2 = 0
          x1 = this.oRect.x1 - this.oRect.x2
        }
        if (x1 > this.boundsWidth) {
          x1 = this.boundsWidth
          x2 = this.boundsWidth - width
        }
      }

      if (y1 < y2) {
        if (y1 < 0) {
          y1 = 0
          y2 = height
        }
        if (y2 > this.boundsHeight) {
          y2 = this.boundsHeight
          y1 = this.boundsHeight - height
        }
      }
      if (y2 < y1) {
        if (y2 < 0) {
          y2 = 0
          y1 = this.oRect.y1 - this.oRect.y2
        }
        if (y1 > this.boundsHeight) {
          y1 = this.boundsHeight
          y2 = this.boundsHeight - height
        }
      }
      this.$emit('shift', { x1, y1, x2, y2 })
    }
  }
}
</script>

<style lang="stylus">
.rectangle
  display block
  position absolute
  z-index 100
  transform translate3d(-1px, -1px, 0)
  border 1px dashed #fff
  cursor move
</style>
