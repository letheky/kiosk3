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
    name: "detail-first",
    path: "/detail/first",
    component: () => import("../views/Detail/one.vue"),
  },
  {
    name: "detail-second",
    path: "/detail/second",
    component: () => import("../views/Detail/two.vue"),
  },
  {
    name: "detail-third",
    path: "/detail/third",
    component: () => import("../views/Detail/three.vue"),
  },
  {
    name: "detail-fourth",
    path: "/detail/fourth",
    component: () => import("../views/Detail/four.vue"),
  },


];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});
export default router;
