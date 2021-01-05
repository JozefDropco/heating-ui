import Vue from 'vue'
import Router from 'vue-router'
import ServiceMode from './views/ServiceMode.vue'
import Watering from './views/Watering.vue'
import Dashboard from "./views/Dashboard.vue";
import WateringEdit from "@/views/WateringEdit.vue";
import Temperature from "@/views/Temperature.vue";
import Solar from "@/views/Solar.vue";

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
