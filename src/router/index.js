import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Recommend = (resolve) => {
  import('../components/recommend/recommend').then((module) => {
    resolve(module)
  })
}

const Rank = (resolve) => {
  import('../components/rank/rank').then((module) => {
    resolve(module)
  })
}

const Singer = (resolve) => {
  import('../components/singer/singer').then((module) => {
    resolve(module)
  })
}
export default new Router({
  routes: [
    {
      // 默认跳转到recommend
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend
    },
    {
      path: '/rank',
      component: Rank
    },
    {
      path: '/singer',
      component: Singer
    }
  ]
})
