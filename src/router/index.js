import { createRouter, createWebHashHistory } from 'vue-router'
// import Recommend from '@/views/recommend'
// import Singer from '@/views/singer'
// import TopList from '@/views/top-list'
// import Search from '@/views/search'
// import SingerDetail from '@/views/singer-detail'
// import Album from '@/views/album'
// import TopDetail from '@/views/top-detail'
// import UserCenter from '@/views/user-center'

// 使用工厂函数形式，异步加载，可以加载注释（模数注释），更改分隔打包后名称,注释后打包后为名字，而非数字

const Recommend = () => import('@/views/recommend'/* webpackChunkName:"recommend" */)
const Singer = () => import('@/views/singer'/* webpackChunkName:"singer" */)
const TopList = () => import('@/views/top-list'/* webpackChunkName:"toplist" */)
const Search = () => import('@/views/search'/* webpackChunkName:"search" */)
const SingerDetail = () => import('@/views/singer-detail'/* webpackChunkName:"singerdetail" */)
const Album = () => import('@/views/album'/* webpackChunkName:"album" */)
const TopDetail = () => import('@/views/top-detail'/* webpackChunkName:"topdetail" */)
const UserCenter = () => import('@/views/user-center'/* webpackChunkName:"usercenter" */)

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: Recommend,
    children: [
      {
        path: ':id',
        component: Album
      }
    ]
  },
  {
    path: '/singer',
    component: Singer,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  },
  {
    path: '/top-list',
    component: TopList,
    children: [
      {
        path: ':id',
        component: TopDetail
      }
    ]
  },
  {
    path: '/search',
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
    components: {
      user: UserCenter // 与<router-view> 上的 name 属性匹配
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
