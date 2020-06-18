import Vue from 'vue'
import App from '@/App'
import store from '@/store'

import Default from '@/layouts/Default'

Vue.component(Default.name, Default)

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
