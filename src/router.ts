import Vue from 'vue'
import Router from 'vue-router'
import ServiceMode from './views/ServiceMode.vue'
import Empty from "./views/Empty.vue";

Vue.use(Router)

export default new Router({
    routes:[
        {
            path: '/ServiceMode',
            name: 'report',
            component: ServiceMode
        },
        {
            path: '*',
            name: 'empty',
            component: Empty
        }
    ]
})
