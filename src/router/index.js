import {createRouter, createWebHistory} from 'vue-router';

// 路由组件的引入方式保持不变
const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "login" */ '../components/LogIn.vue'),
    },
    {
        path: '/',
        name: 'home',
        redirect: '/login',
    },
    {
        path: '/map',
        name: 'map',
        component: () => import(/* webpackChunkName: "map" */ '../components/SustechMap.vue'),
    },
    {
        path: '/register',
        name: 'register',
        component: () => import(/* webpackChunkName: "map" */ '../components/UserRegister.vue'),
    },
    {
        path: '/side',
        name: 'side',
        component: () => import('../components/SideBar.vue'),
        props: true,
    },
    {
        path: '/product',
        name: 'product',
        component: () => import(/* webpackChunkName: "order" */ '../components/CulturalProduct.vue'),
    }
    // ...其他路由
];

// 使用 createRouter 创建路由实例
const router = createRouter({
    history: createWebHistory(), // 使用 HTML5 模式的路由
    routes,
});

export default router;
