import { lazy } from "react";
import Home from "../pages/Home/Home";
import StaffLayout from "../components/Layout/StaffLayout";
import ConsultantLayout from "../components/Layout/ConsultantLayout";
import { useLocation } from "react-router-dom";
import BookingInformation from '../pages/Appointment/BookingInformation';

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
        path: '/test-history',
        component: lazy(() => import('../pages/TestHistory/TestHistory'))
    },
     {
          path: '/appointment',
          component: lazy(() => import('../pages/Appointment/ConsultantsList'))
     },
     {
          path: '/appointment/:id',
          component: lazy(() => import('../pages/Appointment/ConsultantDetail'))
     },
     {
          path: '/booking-confirmation',
          component: lazy(() => import('../pages/Appointment/BookingInformation'))
     },
     {
          path: '/appointment-payment-result',
          component: lazy(() => import('../pages/Appointment/AppointmentResultHandler'))
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
    },
     {
          path: '/reproductive-cycle',
          component: lazy(() => import('../pages/ReproductiveCycle/ReproductiveCycle'))
     },
]

export default routers;