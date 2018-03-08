<template lang="pug">
canvas.background(
  :width="width",
  :height="height"
)
</template>

<script>
export default {
  name: 'Background',
  props: {
    bounds: {
      type: Object,
      default: () => ({ x: 0, y: 0, width: 0, height: 0 })
    }
  },
  data () {
    return {
      ctx: null
    }
  },
  computed: {
    width () {
      return this.bounds.width
    },
    height () {
      return this.bounds.height
    }
  },
  mounted () {
    this.ctx = this.$el.getContext('2d')
  }
}
</script>

<style lang="stylus">
.background
  display block
  position absolute
  top 0
  right 0
  bottom 0
  left 0
</style>
