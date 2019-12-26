/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-28 14:54:47
 * @LastEditTime: 2019-08-29 15:36:27
 * @LastEditors: Please set LastEditors
 */
import Vue from 'vue'
import Router from 'vue-router'
import login from './views/login.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/main',
      name: 'main',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/main.vue'),
      redirect: '/service',
      children: [
        {
          path: '/service',
          name: 'service',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "about" */ './views/service.vue')
        },
        {
          path: '/delMax',
          name: 'delMax',
          component: () => import(/* webpackChunkName: "about" */ './views/delMax.vue')
        },
        {
          path: '/addCol',
          name: 'addCol',
          component: () => import(/* webpackChunkName: "about" */ './views/addCol.vue')
        }
      ]
    }

  ]
})
