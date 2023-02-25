// 生成vue3 router模板
import { createRouter, createWebHistory } from 'vue-router';
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: () => import('../views/Home.vue'),
        },
        {
            path: '/login',
            name: 'Login',
            component: () => import('../views/Login.vue'),
        },
        {
            path: '/admin',
            redirect: '/admin/home',
            meta: {
                title: '首页',
            },
            name: 'Admin',
            component: () => import('../views/Admin.vue'),
            children: [
                {
                    path: '/admin/home',
                    name: 'AdminHome',
                    meta: {
                        title: 'welcome',
                    },
                    component: () => import('../views/AdminHome.vue'),
                },
                {
                    path: '/admin/user',
                    name: 'User',
                    meta: {
                        title: '用户管理',
                    },
                    component: () => import('../views/User.vue'),
                },
                {
                    path: '/admin/help',
                    name: 'Help',
                    meta: {
                        title: '救助管理',
                    },
                    component: () => import('../views/Help.vue'),
                },
                {
                    path: '/admin/adopt',
                    name: 'Adopt',
                    meta: {
                        title: '领养管理',
                    },
                    component: () => import('../views/Adopt.vue'),
                },
                {
                    path: '/admin/article',
                    name: 'Article',
                    meta: {
                        title: '所有文章',
                    },
                    component: () => import('../views/Article.vue'),
                },
                {
                    path: 'addArticle',
                    name: 'AddArticle',
                    meta: {
                        title: '添加与编辑',
                    },
                    component: () => import('../views/AddArticle.vue'),
                },
                {
                    path: '/admin/order',
                    name: 'Order',
                    meta: {
                        title: '订单管理',
                    },
                    component: () => import('../views/Order.vue'),
                },
                {
                    path: '/admin/goods',
                    name: 'Goods',
                    meta: {
                        title: '商品管理',
                    },
                    component: () => import('../views/Goods.vue'),
                },
                {
                    path: '/admin/self',
                    name: 'Self',
                    meta: {
                        title: '个人中心',
                    },
                    component: () => import('../views/Self.vue'),
                },
            ]
        },
    ],
});

export default router;