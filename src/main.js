import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

import 'common/scss/index.scss'

// import Vconsole from 'vconsole'
// const vConsole = new Vconsole()

fastclick.attach(document.body)

Vue.use(VueLazyLoad, {
  loading: require('common/image/default.jpg')
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
