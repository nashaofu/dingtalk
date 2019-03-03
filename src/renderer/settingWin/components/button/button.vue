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

<style lang="less">
.type(@name, @color) {
  &-@{name} {
    color: #fff;
    background-color: @color;
    border-color: @color;
    &:active:not(.dt-button-disabled) {
      background-color: darken(@color, 20%);
      border-color: darken(@color, 20%);
    }
  }
}

.dt-button {
  display: inline-block;
  padding: 8px 12px;
  background-color: #fff;
  font-size: 16px;
  border-radius: 3px;
  border: 1px solid #ccc;
  cursor: pointer;
  position: relative;
  outline: none;

  &:active:not(&-disabled) {
    box-shadow: inset 0 2px 20px rgba(0, 0, 0, 0.1);
  }

  &-disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  .type("info", #909399);
  .type("primary", #409eff);
  .type("warning", #e6a23c);
}
</style>
