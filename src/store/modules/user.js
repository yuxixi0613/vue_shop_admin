import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter, constantRoutes, allAsyncRoutes, anyRoute } from '@/router'
import router from '@/router';

function filterAsyncRoutes(allAsyncRoutes, routeNames) {
  let asyncRoutes = allAsyncRoutes.filter(item => {
    if (routeNames.indexOf(item.name) !== -1) {
      if (item.children && item.children.length) {
        //递归调用 返回符合条件的二级路由组成的数组把原有的二级路由数组children覆盖
        item.children = filterAsyncRoutes(item.children, routeNames)
      }
      return true
    }
  })
  return asyncRoutes
}

//定义这个函数的用意，是返回的对象在RESET_STATE中合并覆盖
// const getDefaultState = () => {
//   return {
//     token: getToken(),
//     name: '',
//     avatar: ''
//   }
// }

// const state = getDefaultState()
const state = {
  // token: getToken(),  //从cookies拿token
  token: getToken("user_token"),  //从localStorage拿token
  name: '',
  avatar: '',
  buttons: [],
  roles: [],
  routes: [],  //这里到时候不是存储用户返回的路由name字符串组成的数组，而是后期用来存储
  // 登录用户对应的所有路由组成的数组，是一个对象的数组，后期用来遍历生成菜单使用
}

const mutations = {
  RESET_STATE: (state) => {
    // Object.assign(state, getDefaultState()) //将后面所有的参数对象合并到第一个参数对象上
    //我们可以直接这样写
    state.token = ''
    state.name = ''
    state.avatar = ''
    state.buttons = []
    state.roles = []
    state.routes = []
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // SET_NAME: (state, name) => {
  //   state.name = name
  // },
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // }
  SET_USERINFO: (state, userInfo) => {
    state.name = userInfo.name
    state.avatar = userInfo.avatar
    state.buttons = userInfo.buttons
    state.roles = userInfo.roles
  },

  // 单独再来一个去存储routes，它存的不是用户的信息name字符串routes
  SET_ROUTES(state, asyncRoutes) {
    // state.routes存储的是用户的所有路由，目的是为了遍历生成菜单
    state.routes = constantRoutes.concat(asyncRoutes, anyRoute)

    // 动态添加注册路由到路由器里面
    // console.log(router)
    // addRoutes是路由器router对象的原型对象上的一个API
    // router路由器中本来就配置了routes: constantRoutes，因此后面只需要追加另外两个路由（异步路由和任意路由）
    router.addRoutes([...asyncRoutes, anyRoute])
  }
}

const actions = {
  // user login
  // login({ commit }, userInfo) {
  //   const { username, password } = userInfo
  //   return new Promise((resolve, reject) => {
  //     login({ username: username.trim(), password: password }).then(response => {
  //       const { data } = response
  //       commit('SET_TOKEN', data.token)
  //       setToken(data.token)
  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  //login改写async、await
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    try {
      const result = await login({ username: username.trim(), password: password })
      if (result.code === 20000 || result.code === 200) {
        const { data } = result
        commit('SET_TOKEN', data.token)   //将请求成功回来的token提交到state中
        // setToken(data.token)  //将请求成功回来的token放到Cookies中
        setToken(data.token)  //将请求成功回来的token放到localStorage中
        return 'ok'
      } else {
        return Promise.reject(new Error('登录失败'))
      }
    } catch (error) {
      return Promise.reject(new Error('请求登录失败'))
    }
  },

  // get user info
  // getInfo({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     getInfo(state.token).then(response => {
  //       const { data } = response

  //       if (!data) {
  //         return reject('Verification failed, please Login again.')
  //       }

  //       const { name, avatar } = data

  //       commit('SET_NAME', name)
  //       commit('SET_AVATAR', avatar)
  //       resolve(data)
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  //getInfo改写async、await
  async getInfo({ commit, state }) {
    try {
      const result = await getInfo(state.token)
      if (result.code === 20000 || result.code === 200) {
        commit('SET_USERINFO', result.data)
        // 过滤出来用户自己对应的动态路由（异步路由），不是所有的路由
        commit('SET_ROUTES', filterAsyncRoutes(allAsyncRoutes, result.data.routes))
        return 'ok'
      } else {
        return Promise.reject(new Error('获取用户信息失败'))
      }
    } catch (error) {
      return Promise.reject(new Error('请求获取用户信息失败'))
    }
  },


  // user logout
  // logout({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     logout(state.token).then(() => {
  //       removeToken() // must remove  token  first
  //       resetRouter()
  //       commit('RESET_STATE')
  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  //logout改写async、await
  async logout({ commit, state }) {
    try {
      const result = await logout(state.token)
      if (result.code === 20000 || result.code === 200) {
        removeToken() // must remove  token  first
        resetRouter() // 后续再说。。。
        commit('RESET_STATE')
        return 'ok'
      } else {
        return Promise.reject(new Error('退出登录失败'))
      }
    } catch (error) {
      return Promise.reject(new Error('请求退出登录失败'))
    }
  },


  // remove token
  // resetToken({ commit }) {
  //   return new Promise(resolve => {
  //     removeToken() // must remove  token  first
  //     commit('RESET_STATE')
  //     resolve()
  //   })
  // }

  async resetToken({ commit }) {
    removeToken() // must remove  token  first
    commit('RESET_STATE')
  }   //最后返回的undefined相当于也是成功的


}

export default {
  //vuex第六个核心概念，开启命名空间
  namespaced: true,
  state,
  mutations,
  actions
}

