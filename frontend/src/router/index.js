import {createRouter,createWebHistory  } from 'vue-router';
import SignUp from '../components/SignUp.vue';
import Login from '../components/Login.vue';
import Dashboard from '../components/Dashboard.vue';
import EditUser from '../components/EditUser.vue';
import SetPassword from '../components/SetPassword.vue';

const routes = [
    {
        path:"/signup",
        name:"signup",
        component:SignUp,
    },
    {
        path:"/login",
        name:"login",
        component: Login,
    },
    {
        path:"/dashboard",
        name:"dashboard",
        component:Dashboard,
    },
    {
        path:"/edit-user-details/:id",
        name:"editUserDetails",
        component:EditUser,
        props:true,
    },
    {
        path:"/set-password",
        name:"setPassword",
        component:SetPassword,
    },
    {
        path: '/',
        redirect: '/login',
      },
];

const router = createRouter({
    history:createWebHistory(),
    routes,
});

export default router;