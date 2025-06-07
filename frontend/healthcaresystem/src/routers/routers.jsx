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
          component: lazy(() => import('../pages/Appointment/Appointment'))
     },
     {
          path: '/test-sti',
          component: lazy(() => import('../pages/TestSti/TestSti'))
     },
     {
          path: '/question',
          component: lazy(() => import('../pages/Question/Question'))
     }
]

export default routers;