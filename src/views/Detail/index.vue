<template>
  <div class="about-page">
    <div class="about-page-content">
      <div class="context">
        <div class="content">
          <h3 class="title">
            {{
              articleDetailStore.articleDetail.translations?.[store.lang]?.name
            }}
          </h3>
          <div
            class="text"
            v-html="
              articleDetailStore.articleDetail.translations?.[store.lang]
                ?.content
            "
          />
        </div>
        <hr v-if="store.showAudio" class="hr-line" />
        <Audio audioSrc="/audio/test-audio.mp3" />
      </div>
      <div class="btn-back">
        <button class="btn-back-link" @click="router.back()">Quay lại</button>
      </div>
    </div>
    <div class="main-content">
      <img class="background" src="/image/home-bg.webp" alt="" />
      <div v-if="activeTab === 1" class="swiper-container">
        <template
          v-if="
            articleDetailStore?.articleDetail?.image_folder?.[0]?.image_list
              ?.length > 1
          "
        >
          <Swiper
            :modules="[Pagination]"
            :slides-per-view="1"
            :loop="true"
            :pagination="{
              clickable: true,
              dynamicBullets: true,
            }"
            :autoplay="{
              delay: 3000,
              disableOnInteraction: false,
            }"
            class="pagination-swiper"
          >
            <SwiperSlide
              v-for="(img, index) in articleDetailStore.articleDetail
                .image_folder[0].image_list"
              :key="index"
            >
              <div class="swiper-image">
                <img :src="img.image || img.thumbnail" alt="" />
              </div>
            </SwiperSlide>
          </Swiper>
        </template>
        <template v-else>
          <img
            :src="
              articleDetailStore?.articleDetail?.image_folder?.[0]?.image_list?.[0]
                ?.image
            "
            alt=""
          />
        </template>
      </div>
      <div v-if="activeTab === 2" class="content-wrapper">
        <template
          v-if="
            articleDetailStore?.articleDetail?.image_folder?.[1]?.image_list
              ?.length > 1
          "
        >
          <Swiper
            :modules="[Pagination]"
            :slides-per-view="1"
            :loop="true"
            :autoplay="{
              delay: 3000,
              disableOnInteraction: false,
            }"
            :pagination="{
              clickable: true,
              dynamicBullets: true,
            }"
            class="pagination-swiper"
          >
            <SwiperSlide
              v-for="(img, index) in articleDetailStore.articleDetail
                .image_folder[1].image_list"
              :key="index"
            >
              <div class="swiper-image">
                <img :src="img.image || img.thumbnail" alt="" />
              </div>
            </SwiperSlide>
          </Swiper>
        </template>
        <template v-else>
          <img
            :src="
              articleDetailStore?.articleDetail?.image_folder?.[1]?.image_list?.[0]
                ?.image
            "
            alt=""
          />
        </template>
      </div>
      <div v-if="activeTab === 3" class="swiper-container">
        <Swiper
          :modules="[Navigation, Thumbs]"
          :thumbs="{ swiper: thumbsSwiper }"
          :slides-per-view="1"
          :space-between="26"
          :loop="true"
          @swiper="setMainSwiper"
          class="main-swiper"
        >
          <SwiperSlide
            v-for="(img, index) in articleDetailStore.articleDetail
              .image_folder[2].image_list"
            :key="index"
          >
            <div class="swiper-image">
              <img :src="img.image || img.thumbnail" alt="" />
              <p>
                {{ img.translations?.[store.lang]?.name }}
              </p>
            </div>
          </SwiperSlide>
        </Swiper>

        <Swiper
          :modules="[Navigation, Thumbs]"
          :slides-per-view="5.2"
          :space-between="32"
          :watch-slides-progress="true"
          @swiper="setThumbsSwiper"
          class="thumbs-swiper"
        >
          <SwiperSlide
            v-for="(img, index) in articleDetailStore.articleDetail
              .image_folder[2].image_list"
            :key="index"
          >
            <div class="thumb-image">
              <img :src="img.thumbnail" alt="" />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
      <div v-if="activeTab === 4" class="content">
        <div class="context-wrapper">
          <div class="left-content">
            <h1>
              {{
                articleDetailStore.articleDetail.artifact_folder[0].artifact_list.find(
                  (el) => el.id === selectedItem
                ).translations?.[store.lang]?.name
              }}
            </h1>
            <p>
              {{
                articleDetailStore.articleDetail.artifact_folder[0].artifact_list.find(
                  (el) => el.id === selectedItem
                ).translations?.[store.lang]?.des
              }}
            </p>
          </div>
          <div class="right-content">
            <img
              :src="
                articleDetailStore.articleDetail.artifact_folder[0].artifact_list.find(
                  (el) => el.id === selectedItem
                ).thumbnail
              "
              alt=""
            />
            <button
              v-if="
                articleDetailStore.articleDetail.artifact_folder[0].artifact_list.find(
                  (el) => el.id === selectedItem
                ).file ||
                articleDetailStore.articleDetail.artifact_folder[0].artifact_list.find(
                  (el) => el.id === selectedItem
                ).link
              "
              class="btn-3d"
              @click="
                handleClick3D(
                  articleDetailStore.articleDetail.artifact_folder[0].artifact_list.find(
                    (el) => el.id === selectedItem
                  )
                )
              "
            >
              Tương tác 3D
            </button>
          </div>
        </div>
        <hr class="hr-line" />
        <div class="artifact-list">
          <div
            class="artifact-item"
            v-for="item in articleDetailStore.articleDetail.artifact_folder[0]
              .artifact_list"
            :key="item"
            :class="{ active: selectedItem === item.id }"
            @click="selectedItem = item.id"
          >
            <img :src="item.thumbnail" alt="" />
          </div>
        </div>
      </div>
      <div class="wrapper">
        <div class="tab-menu">
          <div
            class="tab-item"
            v-for="item in tabList"
            :key="item.id"
            @click="activeTab = item.id"
          >
            <Transition name="fade">
              <img
                v-if="activeTab === item.id"
                style="filter: drop-shadow(0px 8px 8px rgba(0, 0, 0, 0.65))"
                :src="item.image"
                alt=""
              />
            </Transition>
            <p>{{ item.name }}</p>
          </div>
        </div>
        <div class="pattern-bottom"></div>
      </div>
    </div>
    <Transition name="fade">
      <ModalEnviroment @close="close3DModal" v-if="isOpen3DModal" />
    </Transition>
    <Transition name="fade">
      <div v-if="showIframe" class="iframe-wrapper">
        <div class="inner-wrapper">
          <iframe
            class="iframe"
            :src="
              articleDetailStore.articleDetail.artifact_folder[0].artifact_list.find(
                (el) => el.id === selectedItem
              ).link
            "
            frameborder="0"
            allowfullscreen
          ></iframe>
        </div>
        <div class="btn-close" @click="showIframe = false">Đóng</div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onUnmounted, watch, onMounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Thumbs, Pagination, Autoplay } from "swiper/modules";
import Audio from "@/components/Audio.vue";
import ModalEnviroment from "@/components/ModalEnviroment.vue";
import { useRoute, useRouter } from "vue-router";
import useModal from "@/composables/useModal";
import useStore from "@/store/useStore";
import useArticleDetail from "@/store/useArticleDetail";
import { fetchArticleById } from "@/api/fetch";

const route = useRoute();
const router = useRouter();
const id = route.params.id;
const {
  isOpen: isOpen3DModal,
  open: open3DModal,
  close: close3DModal,
} = useModal();
const store = useStore();
const articleDetailStore = useArticleDetail();
const selectedItem = ref(0);
const activeTab = ref(1);
const thumbsSwiper = ref(null);
const mainSwiper = ref(null);
const showIframe = ref(false);

onMounted(async () => {
  const articleDetail = await fetchArticleById(store, id);
  articleDetailStore.setArticleDetail(articleDetail);
  selectedItem.value = articleDetail.artifact_folder[0].artifact_list[0].id;
});

const setThumbsSwiper = (swiper) => {
  thumbsSwiper.value = swiper;
};

const setMainSwiper = (swiper) => {
  mainSwiper.value = swiper;
};

// Reset swiper when changing tabs
watch(
  () => activeTab.value,
  (newTab, oldTab) => {
    if (oldTab === 3) {
      // Clean up when leaving tab 3
      if (thumbsSwiper.value) {
        thumbsSwiper.value.destroy();
        thumbsSwiper.value = null;
      }
      if (mainSwiper.value) {
        mainSwiper.value.destroy();
        mainSwiper.value = null;
      }
    }
  }
);

const tabList = ref([
  {
    id: 1,
    name: "Sơ đồ di tích",
    image: "./image/detail/button-bg.png",
  },
  {
    id: 2,
    name: "Bản đồ khảo cổ",
    image: "./image/detail/button-bg.png",
  },
  {
    id: 3,
    name: "Khai quật",
    image: "./image/detail/button-bg.png",
  },
  {
    id: 4,
    name: "Hiện vật",
    image: "./image/detail/button-bg.png",
  },
]);

const handleClick3D = (item) => {
  if (item.file) {
    open3DModal();
  } else {
    showIframe.value = true;
  }
};

onUnmounted(() => {
  // Clean up swiper instances
  if (thumbsSwiper.value) {
    thumbsSwiper.value.destroy();
    thumbsSwiper.value = null;
  }
  if (mainSwiper.value) {
    mainSwiper.value.destroy();
    mainSwiper.value = null;
  }
  activeTab.value = 1;
  close3DModal();
});
</script>

<style lang="scss" scoped>
.about-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  position: relative;
  .about-page-content {
    width: 25%;
    height: 100%;
    max-height: 100%;
    display: flex;

    flex-direction: column;
    align-items: center;
    background-color: $primary-color;
    padding: 0 4rem;
    box-shadow: 8px 0px 52px 0px rgba(0, 0, 0, 0.36);
    z-index: 10;

    .context {
      max-height: 90%;
      padding-top: 8rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 2rem;
      color: $text-color;
      flex-grow: 1;

      .content {
        max-height: 90%;
        .title {
          color: $text-color;
          font-family: $heading-family;
          font-size: 5.75rem;
        }
        .text {
          max-height: 90%;
          overflow-y: auto;
          padding-right: 2rem;
          :deep(p) {
            font-family: $small-heading-family !important;
            font-size: 4.25rem !important;
            text-align: justify;
            overflow-y: auto;
            // height: 78% !important;
            // max-height: 78% !important;
            padding-right: 2rem;
            margin-bottom: 0 !important;
            margin-top: 0 !important;
          }
          :deep(span) {
            font-family: $small-heading-family !important;
            font-size: 4.25rem !important;
            text-align: justify;
            overflow-y: auto;
            // height: 78% !important;
            // max-height: 78% !important;
            padding-right: 2rem;
            margin-bottom: 0 !important;
            margin-top: 0 !important;
          }
        }
      }
      .hr-line {
        width: 100%;
        height: 1px;
        background-color: $text-color;
      }
    }
    .btn-back {
      width: 100%;
      border-width: 5px 0px 5px 0px;
      border-style: solid;
      border-color: $secondary-color;
      margin-bottom: 4rem;
      @include flex-center;

      .btn-back-link {
        background-color: $primary-color;
        color: $text-color;
        font-size: 4.8rem;
        font-family: $heading-family;
        padding: 4rem;
        border-radius: 1.5rem;
        text-decoration: none;
      }
    }
  }
  .main-content {
    width: 75%;
    height: 100%;
    display: flex;
    flex-direction: column;

    background-color: $primary-color;
    img.background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      // mix-blend-mode: luminosity;
    }

    .content-wrapper {
      width: 100%;
      height: 83%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
      z-index: 10;
      padding: 4rem;
      img {
        width: 100%;
        height: 100%;
        object-fit: fill;
      }
    }

    .swiper-container {
      width: 100%;
      height: 83%;
      padding: 2rem;
      position: relative;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2rem;

      .main-swiper {
        width: 100%;
        height: 78%;
        position: relative;

        :deep(.swiper-pagination) {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;

          .swiper-pagination-bullet {
            width: 2rem;
            height: 2rem;
            background-color: transparent;
            border: 2px solid #8c4f27;
            border-radius: 50%;
            margin: 0 0.5rem;
            transition: all 0.3s ease;
            opacity: 1;

            &.swiper-pagination-bullet-active {
              background-color: #8c4f27;
              border-color: #8c4f27;
              transform: none;
            }
          }
        }

        .swiper-image {
          width: 100%;
          height: 100%;
          position: relative;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          p {
            position: absolute;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%);
            font-size: 4rem;
            text-align: center;
            color: white;
            width: 60%;
            background-color: rgba(0, 0, 0, 0.5);
            border-radius: 2rem;
            padding: 2rem;
            transition: opacity 0.3s ease-in-out;
            z-index: 2;
          }
        }
      }
      .pagination-swiper {
        width: 100%;
        height: 100%;
        position: relative;

        :deep(.swiper-pagination) {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;

          .swiper-pagination-bullet {
            width: 4rem;
            height: 4rem;
            background-color: transparent;
            border: 2px solid #8c4f27;
            border-radius: 50%;
            margin: 0 0.5rem;
            transition: all 0.3s ease;
            opacity: 1;

            &.swiper-pagination-bullet-active {
              background-color: #8c4f27;
              border-color: #8c4f27;
              transform: none;
            }
          }
        }

        .swiper-image {
          width: 100%;
          height: 100%;
          position: relative;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
      .thumbs-swiper {
        width: 100%;
        height: 22%;

        :deep(.swiper-slide) {
          &.swiper-slide-thumb-active {
            border: 10px solid #ffffff;
          }

          .thumb-image {
            width: 100%;
            height: 100%;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              border-radius: 1rem;
            }
          }
        }
      }
    }

    .content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 83%;
      padding: 4rem;
      z-index: 1;
      flex: 1;

      .context-wrapper {
        width: 100%;
        height: 100rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        overflow: hidden;
        padding-top: 2rem;
        padding-bottom: 5.33rem;
        .left-content {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          color: $text-color;
          padding: 0 3.33rem;

          h1 {
            font-size: 8.67rem;
            font-family: $heading-family;
            color: $text-color;
          }
          p {
            font-size: 4.1rem;
            color: $text-color;
            &:last-child {
              padding-right: 2rem;
              overflow-y: auto;
              text-align: justify;
            }
          }
        }
        .right-content {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: $priority-max;
          padding: 5rem 14.5rem 11.5rem 14.5rem;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: drop-shadow(5.28px 0px 10.56px #000000a6);
          }
          .btn-3d {
            width: fit-content;
            height: fit-content;
            background-color: $secondary-color;
            color: $text-color;
            padding: 2rem;
            font-size: 3rem;
            line-height: 1.2;
            color: #fff;
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
          }
        }
      }
      .hr-line {
        width: 100%;
        height: 1px;
        background-color: $text-color;
      }
      .artifact-list {
        width: 100%;
        height: 34.33rem;
        display: flex;
        flex-direction: row;
        gap: 5rem;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        scroll-behavior: smooth;
        &::-webkit-scrollbar {
          display: none;
        }
        .artifact-item {
          flex-shrink: 0;
          width: 34.33rem;
          height: 100%;
          padding: 3rem;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          &.active {
            border: 6px solid #8c4f27;
            border-radius: 2.54rem;
          }
        }
      }
    }

    .wrapper {
      width: 100%;
      background-color: #c88b66;
      height: fit-content;
      display: flex;
      // justify-content: center;
      align-items: center;
      // gap: 1.67rem;
      flex-direction: column;

      .tab-menu {
        width: 100%;
        height: 15rem;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1;
        overflow-x: scroll;
        scroll-snap-type: x mandatory;
        scroll-behavior: smooth;
        &::-webkit-scrollbar {
          display: none;
        }

        .tab-item {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #c88b66;

          img {
            width: 57rem;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }

          p {
            font-size: 4.8rem;
            color: $tab-item-color;
            z-index: 1;
          }
        }
      }
      .pattern-bottom {
        width: 100%;
        height: 8.33rem;
        background-color: #c88b66;
        background-image: url("/image/detail/bottom-pattern.png");
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        z-index: 1;
      }
    }
  }
  .iframe-wrapper {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    z-index: 1000;
    overflow: hidden;
    .inner-wrapper {
      width: 80%;
      height: 80%;
      position: fixed;
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%);
      overflow: hidden;
      .iframe {
        width: 100%;
        height: 120%;
        border: none;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .btn-close {
      position: absolute;
      bottom: 5rem;
      left: 50%;
      transform: translateX(-50%);
      width: fit-content;
      height: fit-content;
      background-color: #fff8f2;
      color: $text-color;
      font-size: 4rem;
      font-weight: 700;
      text-align: center;
      padding: 2.6rem;
      border: 2px solid #807666;
    }
  }
}
</style>
