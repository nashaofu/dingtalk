<template lang="pug">
.app
  .app-left
    .app-logo
      img.app-logo-image(src="~./logo.png")
      .app-logo-title 钉钉 {{ version }}(基于{{ license }}协议)

    .app-update
      button.app-update-button(@click="checkForUpdates") 检查更新

    .app-desc {{ description }}

    .app-url(@click="openURL") {{ homepage }}
    .app-url(@click="openMail") {{ author }}

  .app-right
    .app-mpqrcode
      img.app-mpqrcode-img(src="~./mpqrcode.jpg")
      .app-mpqrcode-title 欢迎关注作者公众号
</template>

<script>
import pkg from '#/package.json'

import {
  webFrame,
  ipcRenderer,
  shell
} from 'electron'

export default {
  name: 'App',
  data () {
    return {
      version: pkg.version,
      description: pkg.description,
      author: pkg.author,
      license: pkg.license,
      homepage: pkg.homepage
    }
  },
  created () {
    ipcRenderer.on('dom-ready', e => {
      this.setZoomLevel()
    })
  },
  methods: {
    setZoomLevel () {
      // 设置缩放限制
      webFrame.setZoomFactor(100)
      webFrame.setZoomLevel(0)
      webFrame.setVisualZoomLevelLimits(1, 1)
    },
    checkForUpdates () {
      ipcRenderer.send('ABOUTWIN:checkForUpdates')
    },
    openMail () {
      const result = this.author.match(/<(.+)>/)
      if (!result) {
        return
      }
      shell.openExternal(`mailto:${result[1]}`)
    },
    openURL () {
      shell.openExternal(this.homepage)
    }
  }
}
</script>

<style lang="less">
@import "~normalize.css";

@font-family: "PingFang-SC-Medium", "Source Han Sans", "Segoe UI",
  "Lucida Grande", Helvetica, Arial, "Microsoft YaHei", FreeSans, Arimo,
  "Droid Sans", "wenquanyi micro hei", "Hiragino Sans GB", "Hiragino Sans GB W3",
  sans-serif;

*,
*:before,
*:after {
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  font-family: @font-family;
  color: #333;
  overflow: hidden;
}

.app {
  height: 100%;
  display: flex;
  padding: 15px 0;
  font-size: 14px;
  &-left {
    width: 60%;
    height: 100%;
    position: relative;
    padding: 10px 36px;
    &:after {
      content: "";
      width: 1px;
      position: absolute;
      right: 0;
      top: 0;
      bottom: 5px;
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
  &-right {
    width: 40%;
    height: 100%;
  }

  &-logo {
    text-align: center;
    &-image {
      margin: 0 auto;
      display: block;
      width: 96px;
      height: 96px;
    }
    &-title {
      margin: 10px auto;
      font-size: 18px;
      font-weight: 600;
    }
  }

  &-update {
    text-align: center;
    margin: 10px auto;
    &-button {
      display: inline-block;
      padding: 7px 14px;
      background-color: #fff;
      font-size: 14px;
      border-radius: 3px;
      border: 1px solid #ccc;
      cursor: pointer;
      outline: none;
      &:hover {
        background-color: #f3f3f3;
      }
      &:active {
        box-shadow: inset 0 2px 20px rgba(0, 0, 0, 0.1);
      }
    }
  }

  &-desc {
    margin: 30px auto;
    text-align: center;
    font-size: 15px;
    color: #555;
    word-break: break-all;
  }

  &-url {
    margin: 10px auto;
    white-space: nowrap;
    text-align: center;
    color: #08f;
    text-decoration: underline;
  }

  &-mpqrcode {
    text-align: center;
    padding-top: 50px;
    &-img {
      width: 190px;
      height: 190px;
      display: block;
      margin: 0 auto;
    }
    &-title {
      margin-top: 20px;
      font-weight: 500;
    }
  }
}
</style>
