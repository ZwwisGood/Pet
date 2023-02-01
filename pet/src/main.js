import { createApp } from 'vue'
import router from './router/index'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import App from './App.vue'
import './style.css'
import api from './api/index.js'
import store from './store/index.js'
import 'animate.css'

const app = createApp(App)

app.config.globalProperties.$api = api

app.use(router).
    use(store).
    use(ElementPlus, { size: 'small' }).
    mount('#app')