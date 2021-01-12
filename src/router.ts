import Vue from 'vue'
import Router from 'vue-router'
import ServiceMode from './views/settings/ServiceMode.vue'
import Watering from './views/settings/Watering.vue'
import Dashboard from "./views/Dashboard.vue";
import WateringEdit from "@/views/settings/WateringEdit.vue";
import Temperature from "@/views/settings/Temperature.vue";
import Solar from "@/views/settings/Solar.vue";
import Constants from "@/views/settings/Constants.vue";

Vue.use(Router)

export default new Router({
    routes:[
        {
            path: '/ServiceMode',
            name: 'servicemode',
            component: ServiceMode
        },
        {
            path: '/Watering',
            name: 'watering',
            component: Watering
        },
        {
            path: '/Solar',
            name: 'solar',
            component: Solar
        },
        {
            path: '/Temperature',
            name: 'temperature',
            component: Temperature
        }, {
            path: '/Constants',
            name: 'constants',
            component: Constants
        },
        {
            path: '/Watering/:wId',
            name: 'edit_watering',
            component: WateringEdit
        },

        {
            path: '*',
            name: 'empty',
            component: Dashboard
        }
    ]
})
