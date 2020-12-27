import Vue from 'vue'

import VueI18n from 'vue-i18n'
import VueApexCharts from 'vue-apexcharts'
Vue.use(VueApexCharts)
Vue.use(VueI18n)
Vue.component('apexchart', VueApexCharts)

export default new VueI18n({
    locale: 'sk',
    fallbackLocale: 'en',
    messages: {
        sk: {
            menu: 'Menu',
            menu_serviceMenu: 'Servisné menu',
            serviceModeState: 'Stav servisného módu',
            serviceModeOutputs: 'Výstupy',
            serviceModeInputs: 'Vstupy',
            menu_wateringMenu: 'Zavlažovanie',
            wateringId:'Identifikátor',
            wateringActive:'Aktívny',
            wateringZoneRefCd:'Raspberry Pin',
            wateringName:'Názov zóny',
            wateringModulo:'Cyklus opakovania',
            wateringReminder:'Deň v rámci cyklu',
            wateringTime:'1. čas polievania',
            wateringRetryTime:'2. pokus o polievanie',
            wateringDuration:'Dĺžka polievania',
            temperature:'Teplota',
            menu_temperatureMenu:'Teploty',
            save:'Uložiť'
        },
        en: {
            menu: 'Menu',
            menu_serviceMenu: 'Service menu',
            serviceModeState: 'State of service mode',
            serviceModeOutputs: 'Outputs',
            serviceModeInputs: 'Inputs',
            menu_wateringMenu: "Watering",
            wateringId: "Identifier",
            wateringActive:"Active",
            wateringZoneRefCd:'Raspebrry Pin',
            wateringName:'Zone name',
            wateringModulo:'Repeat cycle',
            wateringReminder:'Day within cycle',
            wateringTime:'1st watering time',
            wateringRetryTime:'Retry time',
            wateringDuration:'Watering duration',
            temperature:'Temperature',
            menu_temperatureMenu:'Temperatures',
            save:'Save'
        }
    }
})
