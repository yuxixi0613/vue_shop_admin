import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
// 常量路由 ： 配的是所有人都能操作的路由
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },



  // 404 page must be placed at the end !!!
  
]

// 动态（异步路由）：配的是所有的根据权限数据而动态注册的路由
export const allAsyncRoutes = [
  {
    path: '/product',
    component: Layout,
    name: 'Product',
    // redirect: '/product/trademark/list',
    meta: { title: '商品管理', icon: 'el-icon-s-goods' },
    children: [
      {
        path: 'trademark/list',
        component: () => import('@/views/product/trademark/List'),
        name: 'Trademark',
        meta: { title: '品牌管理' }
      },
      {
        path: 'attr/list',
        component: () => import('@/views/product/attr/List'),
        name: 'Attr',
        meta: { title: '平台属性管理' },
      },
      {
        path: 'spu/list',
        component: () => import('@/views/product/spu/List'),
        name: 'Spu',
        meta: { title: 'Spu管理' }
      },
      {
        path: 'sku/list',
        component: () => import('@/views/product/sku/List'),
        name: 'Sku',
        meta: { title: 'Sku管理' }
      },
    ]
  },
]

// 任意路由：后期用户输入的随意的路由都会重定向到404页面，必须注册在路由器最后一个
export const anyRoute = { path: '*', redirect: '/404', hidden: true }

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
