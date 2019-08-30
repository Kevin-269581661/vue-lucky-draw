import Vue from 'vue'
import Router from 'vue-router'
import LuckyDraw from '@/components/luckyDraw'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'lucky',
      component: LuckyDraw
    }
  ]
})
