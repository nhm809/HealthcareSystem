import { lazy } from "react";
import Home from "../pages/Home/Home";

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
          component: lazy(() => import('../pages/Appointment/ConsultantsList'))
     },
     {
          path: '/appointment/:id',
          component: lazy(() => import('../pages/Appointment/ConsultantDetail'))
     },
     {
          path: '/test-sti',
          component: lazy(() => import('../pages/TestSti/TestSti'))
     },
     {
          path: '/question',
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
     {
          path: '/reproductive-cycle',
          component: lazy(() => import('../pages/ReproductiveCycle/ReproductiveCycle'))
     },
     {
          path: '/booking-confirmation',
          component: lazy(() => import('../pages/Appointment/BookingConfirmation'))
     },
]

export default routers;