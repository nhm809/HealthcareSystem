import { lazy } from "react";
import Home from "../pages/Home/Home";
import StaffLayout from "../components/Layout/StaffLayout";
import ConsultantLayout from "../components/Layout/ConsultantLayout";

const routers = [
    {
        path: '/',
        component: lazy(() => import('../pages/Home/Home'))
    },
    {
        path: '/blog',
        component: lazy(() => import('../pages/Blog/BlogPage'))
    },
    {
        path: '/profile',
        component: lazy(() => import('../pages/Profile/Profile'))
    },
    {
        path: '/appointment',
        component: lazy(() => import('../pages/Appointment/Appointment'))
    },
    {
        path: '/test-sti',
        component: lazy(() => import('../pages/TestSti/TestSti'))
    },
    {
        path: '/question/:questionId?',
        component: lazy(() => import('../pages/Question/Question'))
    },
    {
        path: '/blog/:id',
        component: lazy(() => import('../pages/Blog/BlogDetail'))
    },
    {
        path: 'test-sti',
        component: lazy(() => import('../pages/TestSti/PaypalCallback'))
    },
    // Staff route: NO children, just component
    {
        path: '/staff',
        component: StaffLayout
    },

    {
        path: '/consultant',
        component: ConsultantLayout
    }
]

export default routers;