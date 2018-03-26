const views = [
  {
    key: 'errorWin',
    title: '网络错误'
  },
  {
    key: 'settingWin',
    title: '设置'
  },
  {
    key: 'aboutWin',
    title: '关于'
  }
]

module.exports = {
  entries (entry) {
    return views.reduce((entries, view) => ({ ...entries, [view.key]: entry(view) }), {})
  },
  htmlWebpackPlugins (pligin) {
    return views.reduce((plugins, view) => ([...plugins, pligin(view)]), [])
  }
}
