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
     }
]

export default routers;