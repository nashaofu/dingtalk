import { globalShortcut } from 'electron'

export default dingtalk => () => {
  const actions = {
    'shortcut-capture': () => dingtalk.shortcutCapture()
  }
  const keymap = dingtalk.setting.keymap

  if (!dingtalk.setting.enableCapture) delete actions['shortcut-capture']

  // 注销所有的快捷键
  globalShortcut.unregisterAll()
  Object.keys(actions).forEach(key => {
    if (keymap[key] && keymap[key].length) {
      globalShortcut.register(keymap[key].join('+'), actions[key])
    }
  })
}
