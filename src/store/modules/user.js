import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'


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
  token: getToken(),  //从cookies拿token
  name: '',
  avatar: ''
}

const mutations = {
  RESET_STATE: (state) => {
    // Object.assign(state, getDefaultState()) //将后面所有的参数对象合并到第一个参数对象上
    //我们可以直接这样写
    state.token = '',
      state.name = '',
      state.avatar = ''
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
        setToken(data.token)  //将请求成功回来的token放到Cookies中
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

