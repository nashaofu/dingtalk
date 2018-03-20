<template lang="pug">
.dt-switch(
  :class="getClass"
)
  .dt-switch-title {{ title }}
  .dt-switch-container(
    @click="toggle"
  )
    .dt-switch-container-toggle
</template>

<script>
export default {
  name: 'dt-switch',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: [String, Number],
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    getClass () {
      return {
        'dt-switch-on': this.value,
        'dt-switch-disabled': this.disabled
      }
    }
  },
  methods: {
    toggle () {
      if (!this.disabled) {
        this.$emit('input', !this.value)
      }
    }
  }
}
</script>

<style lang="stylus">
.dt-switch
  display flex
  padding 5px 0
  &-title
    flex 1
    padding-right 15px
    text-align left
  &-container
    border 1px solid #c0bfbf
    background-color #c0bfbf
    width 40px
    height 24px
    border-radius 11px
    cursor pointer
    overflow hidden
    &-toggle
      background-color #fff
      width 20px
      height 20px
      margin 1px
      border-radius 50%
      transition transform 0.2s ease-in-out

  &-on &-container
      background-color #3aa4f7
      border-color #3aa4f7
      &-toggle
        transform translateX(16px)

  &-disabled &-container
    background-color #ccc
    border 1px solid #ccc
    cursor not-allowed
    &-toggle
      background-color #b2b2b2

</style>
