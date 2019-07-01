import Vue from 'vue'
import App from './App.vue'

import './styles/quasar.styl'
import 'quasar-extras/animate'
import 'quasar-extras/material-icons'
import Quasar from 'quasar'
import router from './router'
import i18n from './I18n'
Vue.use(Quasar, {
    config: {}
})

Vue.config.productionTip = false

new Vue({
    router,
    i18n,
    render: h => h(App)
}).$mount('#app')
