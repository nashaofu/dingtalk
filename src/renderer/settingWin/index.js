// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Keybinding from './components/keybinding'
import Switch from './components/switch'
import Button from './components/button'

Vue.config.productionTip = false

Vue.use(Switch)
Vue.use(Keybinding)
Vue.use(Button)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
