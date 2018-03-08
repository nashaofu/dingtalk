<template lang="pug">
.app(v-show="sources.length")
  background(
    ref="background",
    :bounds="bounds"
  )
  rectangle(
    ref="rectangle",
    :rect="rect",
    :bounds="bounds",
    @shift="shift"
  )
  toolbar(
    :rect="rect",
    @click="click"
  )
  layer(@draw="drawRectangle")
</template>

<script>
import { ipcRenderer, screen } from 'electron'
import Layer from './components/Layer'
import Toolbar from './components/Toolbar'
import Rectangle from './components/Rectangle'
import Background from './components/Background'

import getBounds from './assets/js/getBounds'
import getSources from './assets/js/getSources'
import getDisplays from './assets/js/getDisplays'

export default {
  name: 'App',
  components: {
    Layer,
    Toolbar,
    Rectangle,
    Background
  },
  data () {
    return {
      displays: [],
      sources: [],
      rect: { x1: 0, y1: 0, x2: 0, y2: 0 }
    }
  },
  computed: {
    bounds () {
      return getBounds(this.displays)
    },
    width () {
      return this.bounds.width
    },
    height () {
      return this.bounds.height
    }
  },
  created () {
    this.displays = getDisplays()
  },
  mounted () {
    screen.on('display-metrics-changed', () => {
      this.displays = getDisplays()
    })
    ipcRenderer.on('ShortcutCapture::CAPTURE', async () => {
      this.hideWin()
      this.sources = await getSources(this.displays, this.bounds)
      this.drawBackground(this.sources)
      this.showWin()
    })
    window.addEventListener('keydown', this.keydown)
  },
  methods: {
    showWin () {
      ipcRenderer.send('ShortcutCapture::SHOW', this.bounds)
    },
    hideWin () {
      this.reset()
      ipcRenderer.send('ShortcutCapture::HIDE', this.bounds)
    },
    reset () {
      this.sources = []
      this.$refs.background.ctx.clearRect(0, 0, this.width, this.height)
      this.$refs.rectangle.ctx.clearRect(0, 0, this.width, this.height)
      this.rect = { x1: 0, y1: 0, x2: 0, y2: 0 }
    },
    drawBackground (sources) {
      // 确保dom更新后再更新canvas
      this.$nextTick(() => {
        const ctx = this.$refs.background.ctx
        ctx.clearRect(0, 0, this.width, this.height)
        sources.forEach(({ x, y, width, height, thumbnail }) => {
          const $img = new Image()
          const blob = new Blob([thumbnail.toPNG()], { type: 'image/png' })
          $img.src = URL.createObjectURL(blob)
          $img.addEventListener('load', () => {
            ctx.drawImage($img, 0, 0, width, height, x, y, width, height)
          })
        })
      })
    },
    drawRectangle ({ x1, y1, x2, y2 }) {
      if (!this.sources.length) {
        return
      }
      this.rect = { x1, y1, x2, y2 }
      // 确保dom更新后再更新canvas
      this.$nextTick(() => {
        const ctx = this.$refs.rectangle.ctx
        const x = x1 < x2 ? x1 : x2
        const y = y1 < y2 ? y1 : y2
        const width = Math.abs(x2 - x1)
        const height = Math.abs(y2 - y1)
        ctx.clearRect(0, 0, this.width, this.height)
        ctx.drawImage(this.$refs.background.$el, x, y, width, height, 0, 0, width, height)
      })
    },
    shift ({ x1, y1, x2, y2 }) {
      this.drawRectangle({ x1, y1, x2, y2 })
    },
    keydown (e) {
      const is = Math.abs(this.rect.x2 - this.rect.x1) >= 7 && Math.abs(this.rect.y2 - this.rect.y1) >= 7
      switch (e.keyCode) {
        case 13:
          if (is) {
            this.done()
          }
          break
        case 27:
          if (is) {
            this.rect = { x1: 0, y1: 0, x2: 0, y2: 0 }
          } else {
            this.hideWin()
          }
          break
        default:
          break
      }
    },
    click (cmd) {
      switch (cmd) {
        case 'cancel':
          this.cancel()
          break
        case 'done':
          this.done()
          break
        default:
          break
      }
    },
    cancel () {
      this.hideWin()
    },
    done () {
      const ctx = this.$refs.rectangle.ctx
      const dataURL = ctx.canvas.toDataURL('image/png')
      ipcRenderer.send('ShortcutCapture::CAPTURE', dataURL)
      this.hideWin()
    }
  }
}
</script>

<style lang="stylus">
@import "normalize.css"
@import "./assets/css/iconfont.styl"

*
  box-sizing border-box

html,
body,
.app
  -webkit-app-region no-drag
  user-select none
  overflow hidden

.app
  position absolute
  top 0
  right 0
  bottom 0
  left 0
  cursor crosshair
</style>
