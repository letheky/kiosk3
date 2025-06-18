<template>
  <div class="home-page">
    <!-- <Transition name="fade">
      <video
        v-show="isPlayingVideo"
        class="home-video"
        ref="homeVideoRef"
        src="/video/home-banner.mp4"
      ></video>
    </Transition> -->
    <h1 class="title">
      Hành trình đến Thăng Long
    </h1>

    <Transition name="fade">
      <div class="home-banner-overlay">
        <div class="btn-overlay">
          <button class="btn" @click="handleRouting">Khám phá</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
// import { ref } from "vue";
// import axios from "axios";
// import useStore from "@/store/useStore";
// import useArticle from "@/store/useArticle";
// import { fetchGenralArticleInfo } from "@/api/fetch";
// import { onMounted } from "vue";
// import { toast } from "vue3-toastify";

// const store = useStore();
// const articleStore = useArticle();

// onMounted(async () => {
//   async function getData() {
//     await axios
//       .get(
//         `${store.api}/api/app_kiosk/page-folder/443f9fe5-a55d-404c-9bf6-ec50f58ca01b/`
//       )
//       .then((res) => {
//         if (res.data.page_list.length > 0) {
//           store.page = res.data.page_list[0];
//         }
//       })
//       .catch((err) => toast.error("Error fetching data"));
//   }
//   const fetchData = async () => {
//     const topicId = store.page.article_topic[0];

//     await fetchGenralArticleInfo(store, topicId)
//       .then((articleData) => {
//         articleStore.articleInfo = articleData;
//       })
//       .catch((error) => {
//         toast.error("Failed to fetch article info:", error);
//       });
//   };
//   await getData();
//   await fetchData();
// });

import { nextTick } from "vue";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const isPlayingVideo = ref(false);
const homeVideoRef = ref(null);

const handleRouting = async () => {
  // await nextTick();
  // isPlayingVideo.value = true;
  // homeVideoRef.value.play();
  // setTimeout(() => {
  //   isPlayingVideo.value = false;
  //   router.push("/about");
  // }, 9000);
  router.push("/about");
};
</script>

<style lang="scss" scoped>
/* Add these styles for the fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out; /* Adjust duration as needed */
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.home-page {
  width: 100%;
  height: 100%;
  background: url("/image/home-bg.webp") no-repeat center/cover;

  .title {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color:$secondary-color;
    font-family: $primary-heading-family;
    font-size: 42rem;
    text-transform: uppercase;
    text-align: center;
    line-height: 80%;
  }

  .home-banner-overlay {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url("/image/home-overlay-bg.webp") no-repeat center center/cover;

    .btn-overlay {
      position: absolute;
      bottom: 4.5rem;
      left: 50%;
      transform: translateX(-50%);
      width: 96.83rem;
      height: 24rem;
      background: url("/image/home-btn-bg.png") no-repeat center center/cover;
      overflow: visible;
      z-index: 1;

      .btn {
        font-size: 8.83rem;
        font-family: $small-heading-family;
        color: #fff;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 106%;
        height: 70%;
        background: url("/image/btn-yellow-bg.png") no-repeat center
          center/cover;
        @include flex-center;
        filter: drop-shadow(0px 8px 8px rgba(0, 0, 0, 0.65));
      }
    }
  }
  .home-video {
    width: 100%;
    height: 100%;
    position: absolute;
  }
  // .opening-img{
  //   position: absolute;
  //   top:50%;
  //   left: 50%;
  //   transform: translate(-50%,-50%);
  //   opacity: 0;
  //   animation: routing 4.5s ease-in-out forwards 6s;
  // }
}
// @keyframes routing {
//   0%{
//     opacity: 0;
//     transform: translate(-50%,-50%) scale(0);
//   }

//   100%{
//     opacity: 1;
//     transform: translate(-50%,-50%) scale(0.49);
//   }
// }
</style>
