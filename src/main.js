import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import videoThumbnail from "@/directives/videoThumbnail.js";
import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";

import VueVirtualScroller from 'vue-virtual-scroller'


import "./style.css";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

import router from "./router/router.js";
import App from "./App.vue";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
const app = createApp(App);

app.directive("video-thumbnail", videoThumbnail);
app.use(pinia);
app.use(router);
app.use(Vue3Toastify, {
  autoClose: 1000,
  theme: "colored",
  transition: "slide",
  position: "top-right",
  closeOnClick: true,
});
app.use(VueVirtualScroller)
app.mount("#app");
