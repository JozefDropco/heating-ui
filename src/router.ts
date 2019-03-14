import Vue from 'vue'
import Router from 'vue-router'
import Report from './views/ReportPage.vue'
import Empty from "./views/Empty.vue";

Vue.use(Router)

export default new Router({
    routes:[
        {
            path: '/:reportRefCd',
            name: 'report',
            component: Report,
            props:true
        },
        {
            path: '*',
            name: 'empty',
            component: Empty
        }
    ]
})
