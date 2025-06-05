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
          path: '/blog/:id',
          component: lazy(() => import('../pages/Blog/BlogDetail'))
     }
]

export default routers;