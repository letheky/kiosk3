<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import useStore from "@/store/useStore.js";
import Menu from "./components/menu.vue";
import { toast } from "vue3-toastify";
import { useIdleRedirect } from "@/composables/useIdleRedirect";

const store = useStore();
const status = ref(false);

/**
 * !This line used to redirect the user to the home page if they are idle for 30 seconds
 * !Time is set to 30 minutes after the screen is idle
 */
const idleRedirect = useIdleRedirect(1800000, "/");

function get_config() {
  axios
    .get("config/config.json")
    .then((res) => {
      store.api = res.data.api;
      status.value = true;
    })
    .catch((err) => toast.error("Error fetching config"));
}

onMounted(() => {
  get_config();
});
</script>

<template>
  <div class="main" @contextmenu.prevent>
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
  <Menu :status="status"></Menu>
</template>

<style scoped lang="scss">
/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.main {
  width: 100%;
  height: 100%;
}
</style>
