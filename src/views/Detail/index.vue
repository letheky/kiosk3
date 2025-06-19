<template>
  <div class="about-page">
    <div class="about-page-content">
      <div class="context">
        <div class="content">
          <h3 class="title">Giới thiệu chung</h3>
          <p class="text">
            Thăng Long là một thành phố lớn và nổi bật trong lịch sử Việt Nam.
            Nó được biết đến là thủ đô của nước Việt Nam từ thời phong kiến
            phương Bắc cho đến thời kỳ độc lập. Thăng Long có nhiều điểm thú vị
            và di tích lịch sử, đặc biệt là các lăng mộ, cung điện và đền thờ.
          </p>
          <hr class="hr-line" />
        </div>
        <Audio audioSrc="/audio/test-audio.mp3" />
      </div>
      <div class="btn-back">
        <router-link class="btn-back-link" to="/about">Quay lại</router-link>
      </div>
    </div>
    <div class="main-content">
      <img class="background" src="/image/home-bg.webp" alt="" />
      <div v-if="activeTab === 1" class="content-wrapper">
        <img src="/image/detail/map.png" alt="" />
      </div>
      <div v-if="activeTab === 2" class="content-wrapper">
        <img src="/image/detail/flat-surface.png" alt="" />
      </div>
      <div v-if="activeTab === 3" class="swiper-container">
        <Swiper
          :modules="[Navigation, Thumbs]"
          :thumbs="{ swiper: thumbsSwiper }"
          :slides-per-view="1"
          :space-between="20"
          :loop="true"
          @swiper="setMainSwiper"
          class="main-swiper"
        >
          <SwiperSlide v-for="(img, index) in 5" :key="index">
            <div class="swiper-image">
              <img :src="`./image/detail/list/list-${index + 1}.png`" alt="" />
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                bibendum libero ac est vulputate consectetur. Sed lacus velit,
                pharetra et turpis nec,
              </p>
            </div>
          </SwiperSlide>
        </Swiper>

        <Swiper
          :modules="[Navigation, Thumbs]"
          :slides-per-view="5"
          :space-between="10"
          :watch-slides-progress="true"
          @swiper="setThumbsSwiper"
          class="thumbs-swiper"
        >
          <SwiperSlide v-for="(img, index) in 5" :key="index">
            <div class="thumb-image">
              <img :src="`./image/detail/list/list-${index + 1}.png`" alt="" />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
      <div v-if="activeTab === 4" class="content">
        <div class="context-wrapper">
          <div class="left-content">
            <h1>Hiện vật</h1>
            <p>Chất liệu : Đồng</p>
            <p>Kích thước : L58,5 x W74 cm</p>
            <p>Trọng lượng : 72 Kg</p>
            <p>
              Trống đồng Cổ Loa được phát hiện năm 1982 tại cánh đồng Mả Tre, xã
              Cổ Loa, huyện Đông Anh. Trống chôn ngửa, trong lòng chứa hơn 200
              hiện vật đồng, hoa văn trang trí phong phú, phản ánh đời sống cư
              dân Di tích Đông Sơn. Giữa mặt trống là ngôi sao 14 cánh, từ trong
              ra ngoài có 15 vành hoa văn, xung quanh là những dải trang trí
              hình lông công, hoạt cảnh đời thường, chim. Tang và thân trống
              trang trí hình người, hình thuyền. Chân trống để trơn. Trong lòng
              trống có khắc dòng chữ Hán. Trống đồng Cổ Loa thuộc loại trống
              đồng Heger I và là một trong những trống đẹp nhất tương đương các
              trống Ngọc Lũ và Hoàng Hạ. Kỹ thuật đúc trống tinh xảo. Trống được
              công nhận là Bảo vật Quốc gia theo Quyết định số 2382/QĐ-TTg ngày
              25/12/2015 của Thủ tướng Chính phủ.
            </p>
          </div>
          <div class="right-content">
            <img src="/image/detail/artifact.png" alt="" />
            <button class="btn-3d" @click="handleClick3D">Tương tác 3D</button>
          </div>
        </div>
        <hr class="hr-line" />
        <div class="artifact-list">
          <div
            class="artifact-item"
            v-for="(item, index) in 10"
            :key="item"
            :class="{ active: selectedItem === index }"
            @click="selectedItem = index"
          >
            <img src="/image/detail/artifact.png" alt="" />
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
  </div>
</template>

<script setup>
import { ref, onUnmounted, watch } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Thumbs } from "swiper/modules";
import Audio from "@/components/Audio.vue";
import ModalEnviroment from "@/components/ModalEnviroment.vue";
import { useRoute, useRouter } from "vue-router";
import useModal from "@/composables/useModal";

const route = useRoute();
const router = useRouter();
const id = Number(route.params.id);
const {
  isOpen: isOpen3DModal,
  open: open3DModal,
  close: close3DModal,
} = useModal();

const selectedItem = ref(0);
const activeTab = ref(1);
const thumbsSwiper = ref(null);
const mainSwiper = ref(null);

const setThumbsSwiper = (swiper) => {
  thumbsSwiper.value = swiper;
};

const setMainSwiper = (swiper) => {
  mainSwiper.value = swiper;
};

// Reset swiper when changing tabs
watch(() => activeTab.value, (newTab, oldTab) => {
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
});

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

const handleClick3D = () => {
  open3DModal();
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

      .title {
        color: $text-color;
        font-family: $heading-family;
        font-size: 5.75rem;
      }
      .text {
        font-family: $small-heading-family;
        font-size: 4.25rem;
        text-align: justify;
        overflow-y: auto;
        max-height: 90%;

        padding-right: 2rem;
        margin-bottom: 2rem;
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

      .thumbs-swiper {
        width: 100%;
        height: 22%;

        :deep(.swiper-slide) {
          opacity: 0.4;
          cursor: pointer;

          &.swiper-slide-thumb-active {
            opacity: 1;
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
}
</style>
