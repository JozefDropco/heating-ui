import Vue from 'vue'

import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

export default new VueI18n({
    locale: 'sk',
    fallbackLocale: 'en',
    messages: {
        sk: {
            menu: 'Menu',
            menu_serviceMenu: 'Servisné menu'
        },
        en: {menu: 'Menu',
            menu_serviceMenu: 'Service menu'}
    }
})
