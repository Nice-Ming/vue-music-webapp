import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 异步加载
const Recommend = () => import('components/recommend/recommend')
const Rank = () => import('components/rank/rank')
const Singer = () => import('components/singer/singer')
const Search = () => import('components/search/search')
const UserCenter = () => import('components/user-center/user-center')
const SingerDetail = () => import('components/singer-detail/singer-detail')
const Disc = () => import('components/disc/disc')
const TopList = () => import('components/top-list/top-list')

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      name: 'Recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          name: 'Disc',
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      name: 'Singer',
      component: Singer,
      children: [
        {
          path: ':id',
          name: 'SingerDetail',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      name: 'Rank',
      component: Rank,
      children: [
        {
          path: ':id',
          name: 'TopList',
          component: TopList
        }
      ]
    },
    {
      path: '/search',
      name: 'Search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/user',
      name: 'UserCenter',
      component: UserCenter
    }
  ]
})
