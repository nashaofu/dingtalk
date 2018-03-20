<template lang="pug">
button.dt-button(
  :class="getClass",
  @click="click($event)"
)
  slot
</template>

<script>
export default {
  name: 'dt-button',
  props: {
    type: {
      type: String,
      default: '',
      validator (val) {
        if (!val) return true
        return [
          'primary',
          'warning',
          'info'
        ].indexOf(val) !== -1
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    getClass () {
      return {
        'dt-button-disabled': this.disabled,
        'dt-button-block': this.block,
        'dt-button-primary': this.type === 'primary',
        'dt-button-warning': this.type === 'warning',
        'dt-button-info': this.type === 'info'
      }
    }
  },
  methods: {
    click () {
      if (!this.disabled) {
        this.$emit('click')
      }
    }
  }
}
</script>

<style lang="stylus">
$color-info = #909399
$color-primary = #409eff
$color-warning = #e6a23c
type(name)
  &-{name}
    color #fff
    background-color lookup('$color-' + name)
    border-color lookup('$color-' + name)
    &:active:not(^[-1]-disabled)
      background-color darken(lookup('$color-' + name), 20%)
      border-color darken(lookup('$color-' + name), 20%)

.dt-button
  display inline-block
  padding 8px 12px
  background-color #fff
  font-size 16px
  border-radius 3px
  border 1px solid #ccc
  cursor pointer
  position relative
  outline none
  &:active:not(&-disabled)
    box-shadow inset 0 2px 20px rgba(0, 0, 0, 0.1)

  &-disabled
    opacity 0.65
    cursor not-allowed

  type(info)
  type(primary)
  type(warning)

</style>
