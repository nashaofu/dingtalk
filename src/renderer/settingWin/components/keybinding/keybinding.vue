<template lang="pug">
.dt-keybinding
  .dt-keybinding-title {{ title }}
  .dt-keybinding-value
    input(
      type="text",
      :value="keys | upperFirst",
      :disabled="disabled",
      @keydown="keydown",
      @input="input",
      @focus="focus",
      @blur="blur"
    )
</template>

<script>
import upperFirst from 'lodash/upperFirst'

export default {
  name: 'dt-keybinding',
  props: {
    value: {
      type: Array,
      default: () => []
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
  data () {
    return {
      keys: []
    }
  },
  mounted () {
    this.setValueToKeys()
  },
  watch: {
    value () {
      this.setValueToKeys()
    }
  },
  filters: {
    upperFirst (keys) {
      return keys.join('+')
    }
  },
  methods: {
    focus ($e) {
      $e.preventDefault()
      $e.stopPropagation()
      this.keys = []
      this.$emit('focus', $e)
    },
    keydown ($e) {
      $e.preventDefault()
      $e.stopPropagation()
      const key = upperFirst($e.key)
      if (this.keys.length >= 3) {
        this.keys = []
      }

      // 按键不能重复
      if (this.keys.indexOf(key) !== -1 || key === 'Process') {
        this.keys = [...this.keys]
        return
      }
      const keys = ['Control', 'Alt', 'Shift']

      // 第一个按键
      if (this.keys.length === 0) {
        if (keys.indexOf(key) !== -1) {
          return this.keys.push(key)
        } else if ($e.ctrlKey) {
          this.keys.push('Control')
          return this.keys.push(key)
        } else if ($e.altKey) {
          this.keys.push('Alt')
          return this.keys.push(key)
        } else if ($e.shiftKey) {
          this.keys.push('Shift')
          return this.keys.push(key)
        }
      }

      // 必须要保证按键是keys中的键按下时的
      if (($e.ctrlKey && this.keys[0] === 'Control') ||
        ($e.altKey && this.keys[0] === 'Alt') ||
        ($e.shiftKey && this.keys[0] === 'Shift')) {
        this.keys.push(key)
      } else {
        // 当this.keys中有元素的时候，单独按下keys中的键
        if (keys.indexOf(key) !== -1) {
          this.keys = [key]
        } else {
          this.keys = []
        }
      }
    },
    input ($e) {
      $e.preventDefault()
      $e.stopPropagation()
      this.keys = [...this.keys]
    },
    blur ($e) {
      $e.preventDefault()
      $e.stopPropagation()
      if (this.keys.length <= 1) {
        this.setValueToKeys()
      }
      this.$emit('input', this.keys)
    },
    setValueToKeys () {
      if (Array.isArray(this.value)) {
        this.keys = this.value.map(key => upperFirst(key))
      } else {
        this.keys = []
      }
    }
  }
}
</script>

<style lang="stylus">
.dt-keybinding
  display block
  padding 5px 0
  &-title
    text-align left
  &-value
    margin-top 7px
    input
      display block
      width 100%
      height 36px
      line-height 36px
      border 1px solid #ccc
      background-color #fff
      border-radius 2px
      padding 0 6px
      outline none
      &:not([disabled])
        &:hover,
        &:focus,
        &:active
          border 1px solid #0ef
          outline none
        &:focus,
        &:active
          box-shadow 0 0 1px #0bf

      &[disabled]
        background-color #eee
        cursor not-allowed

</style>
