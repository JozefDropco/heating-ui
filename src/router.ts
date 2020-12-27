import Vue from 'vue'
import Router from 'vue-router'
import ServiceMode from './views/ServiceMode.vue'
import Watering from './views/Watering.vue'
import Empty from "./views/Empty.vue";
import WateringEdit from "@/views/WateringEdit.vue";
import Temperature from "@/views/Temperature.vue";

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
            component: Empty
        }
    ]
})
