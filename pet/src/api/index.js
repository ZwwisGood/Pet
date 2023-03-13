import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '../router'

const service = axios.create({
    baseURL: '/api',
    timeout: 5000
})

const TOKEN_INVALID = 'Token认证失败，请重新登录'

// 请求拦截
service.interceptors.request.use((req) => {
    return req
})

// 响应拦截
service.interceptors.response.use((res) => {
    const { code, data, msg } = res.data;
    if (code === 200) {
        return data
    } else if (code === 50001) {
        ElMessage.error(TOKEN_INVALID)
        setTimeout(() => {
            router.push('/login')
        })
        return Promise.reject(TOKEN_INVALID)
    } else {
        ElMessage.error(msg)
        return Promise.reject(msg)
    }
})

function request(options) {
    options.method = options.method || 'get'
    if (options.method.toLowerCase() === 'get') {
        options.params = options.data
        options.data = {}
    }
    const token = JSON.parse(window.localStorage.getItem('petUserInfo')).token
    if (token) {
        options.headers = {
            Authorization: 'Bearer ' + token
        }
    }
    return service(options)
}

export default request