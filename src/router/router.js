import { createRouter, createWebHashHistory } from "vue-router";


const routes = [
  {
    name: "home",
    path: "/",
    component: () => import("../views/Home.vue"),
  },
  {
    name: "about",
    path: "/about",
    component: () => import("../views/About.vue"),
  },
  {
    name: "detail",
    path: "/detail/:id",
    component: () => import("../views/Detail/[id].vue"),
  },
  {
    name: "detail-position",
    path: "/detail/position/:id",
    component: () => import("../views/Detail/index.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});
export default router;
