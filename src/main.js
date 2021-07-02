import Vue from 'vue'
import App from '@/App'
import store from '@/store'
import router from '@/router'

import Default from '@/layouts/Default'
export const bus = new Vue()


Vue.component(Default.name, Default)

Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')