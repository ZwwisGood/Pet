import axios from 'axios'

const service = axios.create({
    baseURL: '/api',
    timeout: 5000
})

// 请求拦截
service.interceptors.request.use((req) => {
    return req
})

// 响应拦截
service.interceptors.response.use((res) => {
    const { code, data, msg } = res.data;
    if (code === 200) {
        return data
    }
    return Promise.reject(msg)
})

function request(options) {
    console.log(options);
    options.method = options.method || 'get'
    if (options.method.toLowerCase() === 'get') {
        options.params = options.data
        options.data = {}
    }
    return service(options)
}

export default request