import Vue from 'vue'
import VueRouter from 'vue-router'
import PageNotFound from '@/components/PageNotFound.vue'
import Main from '@/components/Main.vue'

Vue.use(VueRouter)

export default new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        { path: '*', component: PageNotFound },
        { path: '/', component: Main }
    ]
})