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
    },
    {
        path: '/manager',
        name:'manager',
        component:()=>import('../components/manager/manager.vue'),
        children:[
            {
                path: '/person',
                name:'person',
                component:()=>import('../components/manager/Person.vue')
            },
            {
                path: '/checkComment',
                name: 'check',
                component:()=>import('../components/manager/checkComment.vue')
            },
            {
                path: '/misc',
                name:'misc',
                component:()=>import('../components/manager/misc.vue')
            },
            {
                path: '/bookingInfo',
                name:'BookingInfo',
                component:()=>import('../components/manager/booking-info.vue')
            },
            {
                path: '/productUpload',
                name:'ProductUpload',
                component:()=>import('../components/manager/ProductUpload.vue')
            },
            {
                path: '/building',
                name:'Building',
                component:()=>import('../components/manager/building.vue')
            },
            {
                path: '/statisticInfo',
                name:'StatisticInfo',
                component:()=>import('../components/manager/StatisticInfo.vue')
            },
        ]
    },
    {
        path:'/calendar',
        name:'calendar',
        component:()=>import('../components/CalenDar.vue')
    }
    // ...其他路由
];

// 使用 createRouter 创建路由实例
const router = createRouter({
    history: createWebHistory(), // 使用 HTML5 模式的路由
    routes,
});

export default router;
