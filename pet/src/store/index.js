import { createStore } from 'vuex'
const user = {
    state: {
        user: '' || window.localStorage.getItem('petUserInfo') || {}
    },
    mutations: {
        // 设置用户信息
        setUserInfo(state, userInfo) {
            state.user = userInfo
            window.localStorage.setItem('petUserInfo', JSON.stringify(userInfo))
        }
    }
}

export default createStore({
    modules: {
        user
    }
})