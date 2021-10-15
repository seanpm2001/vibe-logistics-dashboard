import { getUserByTokenAPI, loginAPI, logoutAPI, registerAPI } from '../apis/api'

export const profilesModule = {
  namespaced: true,
  state: {
    showTimeoutLogin: false,
    userInfo: {},
    isLogined: false,
    isFirstLogin: false
  },
  getters: {
    getIsLogined: (state) => state.isLogined,
    getUserId: (state) => state.userInfo.id,
    getUserInfo: (state) => state.userInfo,
  },
  mutations: {
    SET_USER (state, payload) {
      state.userInfo = payload || {}
    },
    UN_SET_USER (state) {
      state.userInfo = {}
    },
    SET_IS_LOGINED (state, isLogined) {
      state.isLogined = isLogined || false
    },
    SET_FIRST_LOGIN (state, payload) {
      state.isFirstLogin = payload
    }
  },
  actions: {
    /* 登录 */
    async login (store, payload) {
      const userInfo = await loginAPI(payload)
      if (userInfo) {
        localStorage.token = userInfo.token
        

          router.push('/')

        return true
      }
      return false
    },
    /* 退出 */
    async logout (store) {
      await logoutAPI()
      store.dispatch('CLEAR_SESSIN_AND_BACK')
    },

    async getUserByToken (store, token) {
      const userInfo = await getUserByTokenAPI(token)
      if (userInfo) {
        store.commit('SET_IS_LOGINED', true)
        store.commit('SET_USER', userInfo)
      }

    },
    /* 重新登录 */
    // async relogin (store, payload) { // 弹窗登录--重新登录
    //   try {
    //     const userInfoname = _get(payload, 'userInfoname')
    //     const password = _get(payload, 'password')
    //     const res = await loginAPI(payload)
    //     if (_get(res, 'code') !== 1) {
    //       return
    //     }
    //     const token = _get(res, 'data.token')
    //     cookie.set(process.env.VUE_APP_SESSION_KEY, token)
    //     // store.commit('SET_TOKEN', token)
    //     const userInfo = { username }
    //     store.commit('SET_USER', user)
    //     store.commit('TURN_OFF_LOGIN_PAGE')
    //   } catch (e) {
    //     console.log(e)
    //   }
    // },
    /* 注册 */
    async register (store, payload) {
      const userInfo = await registerAPI(payload)
      console.log('userInfo: ', userInfo);
    }
  }
  // plugins: [
  //   CREATE_PERSISTED_STATE({ reducer: (s) => ({ user: s.user }) }),
  // ],
}
