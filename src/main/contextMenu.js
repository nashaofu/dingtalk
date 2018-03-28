import { Menu } from 'electron'

export default ($win, params) => {
  // 菜单执行命令
  const menuCmd = {
    copy: {
      id: 1,
      label: '复制'
    },
    cut: {
      id: 2,
      label: '剪切'
    },
    paste: {
      id: 3,
      label: '粘贴'
    },
    selectall: {
      id: 4,
      label: '全选'
    }
  }

  const { selectionText, isEditable, editFlags } = params

  // 生成菜单模板
  const template = Object.keys(menuCmd)
    .map(cmd => {
      const { id, label } = menuCmd[cmd]
      let enabled = false
      let visible = false
      const { canCopy, canCut, canPaste, canSelectAll } = editFlags
      switch (cmd) {
        case 'copy':
          // 有文字选中就显示
          visible = !!selectionText
          enabled = canCopy
          break
        case 'cut':
          // 可以编辑就显示项目
          visible = !!isEditable
          // 有文字选中才可用
          enabled = visible && !!selectionText && canCut
          break
        case 'paste':
          // 可以编辑就显示项目
          visible = !!isEditable
          enabled = visible && canPaste
          break
        case 'selectall':
          // 可以编辑就显示项目
          visible = !!isEditable
          enabled = visible && canSelectAll
          break
        default:
          break
      }
      return {
        id,
        label,
        role: cmd,
        enabled,
        visible
      }
    })
    .filter(item => item.visible)
    .sort((a, b) => a.id > b.id)

  // 用模板生成菜单
  if (template.length && !$win.isDestroyed()) {
    const menu = Menu.buildFromTemplate(template)
    menu.popup($win)
  }
}
