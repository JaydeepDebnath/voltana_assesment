import {createRouter,createWebHistory  } from 'vue-router';
import SignUp from '../components/SignUp.vue';
import Login from '../components/Login.vue';
import Dashboard from '../components/Dashboard.vue';
import EditUser from '../components/EditUser.vue';

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
        path:"/edit-userDetails/:id",
        name:"editUserDetails",
        component:EditUser,
        props:true,
    },
];

const router = createRouter({
    history:createWebHistory(),
    routes,
});

export default router;