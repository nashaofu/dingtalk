<template lang="pug">
.dt-input
  .dt-input-title {{ title }}
  .dt-input-value
    input(
      v-model="val",
      type="text",
      :disabled="disabled"
    )
</template>

<script>
export default {
  name: 'dt-input',
  props: {
    value: {
      type: String,
      default: ''
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
    val: {
      get () {
        return this.value
      },
      set (val) {
        if (!this.disabled) {
          this.$emit('input', val)
        }
      }
    }
  }
}
</script>

<style lang="stylus">
.dt-input
  display block
  padding 5px 0
  &-title
    text-align left
  &-value
    margin-top 7px
    input
      display block
      width 100%
      border 1px solid #ccc
      background-color #fff
      border-radius 2px
      padding 6px
      outline none
      user-select none
      &:not([disabled])
        &:focus,
        &:active
          border 1px solid #0bf
          box-shadow 0 0 1px #0bf
          outline none
      &[disabled]
        background-color #eee
        cursor not-allowed

</style>
