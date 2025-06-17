<template>
  <Transition name="fade">
    <div class="modal" v-if="modelValue">
      <div class="modal-context">
        <img class="background" src="/image/home-bg.webp" alt="" />
        <div v-if="activeTab === 1" class="content">
          <div class="left-content">
            <h1>Văn Miếu - <br />Quốc Tử Giám</h1>
            <p>
              Văn miếu - Quốc tử giám là một trong những di tích lịch sử văn hóa
              quốc gia được UNESCO công nhận. Đây là một điểm đến hấp dẫn với
              nhiều đặc sản văn hóa, lịch sử và kiến trúc độc đáo.
            </p>
          </div>
          <div class="right-content">
            <img src="/image/item/item.webp" alt="" />
          </div>
        </div>
        <Swiper
          v-if="activeTab === 2"
          :modules="[Navigation, Autoplay]"
          :slides-per-view="1"
          :centered-slides="true"
          :space-between="20"
          :loop="true"
          :navigation="true"
          :autoplay="{
            delay: 3000,
            disableOnInteraction: false,
          }"
          class="location-swiper"
        >
          <SwiperSlide v-for="(img, index) in 6" :key="index">
            <div class="swiper-image">
              <img
                :src="`./image/detail/list/van-mieu-${index + 1}.webp`"
                alt=""
              />
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                bibendum libero ac est vulputate consectetur. Sed lacus velit,
                pharetra et turpis nec,
              </p>
            </div>
          </SwiperSlide>
        </Swiper>
        <div class="tab-menu">
          <div
            class="tab-item"
            v-for="item in tabList"
            :key="item.id"
            @click="activeTab = item.id"
          >
            <Transition name="fade">
              <img v-if="activeTab === item.id" :src="item.image" alt="" />
            </Transition>
            <p>{{ item.name }}</p>
          </div>
        </div>
        <div class="pattern-bottom"></div>
      </div>
      <div class="close-modal" @click="closeModal">Đóng</div>
    </div>
  </Transition>
</template>

<script setup>
import { onUnmounted, ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Navigation } from "swiper/modules";
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  close: {
    type: Function,
    required: true,
  },
});

const activeTab = ref(1);
const tabList = ref([
  {
    id: 1,
    name: "Sơ đồ",
    image: "./image/item/nav-item.png",
  },
  {
    id: 2,
    name: "Hình ảnh",
    image: "./image/item/nav-item.png",
  },
  // {
  //   id: 3,
  //   name: "Video",
  //   image: "/image/item/nav-item.png",
  // },
  // {
  //   id: 4,
  //   name: "Tour 360",
  //   image: "/image/item/nav-item.png",
  // },
]);

const closeModal = () => {
  props.close();
  activeTab.value = 1;
};
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(2rem);
  display: flex;
  justify-content: center;
  z-index: $priority-high;

  .modal-context {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 70%;
    height: 80%;
    background-color: #c89d63;
    margin-top: 5vh;

    img.background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      mix-blend-mode: luminosity;
    }

    .content {
      display: flex;
      width: 100%;
      height: 80%;
      padding: 4rem;
      z-index: 1;

      .left-content {
        width: 30%;
        height: 100%;
        display: flex;
        flex-direction: column;
        color: $text-color;

        h1 {
          font-size: 5.7rem;
          font-weight: 700;
          color: $text-color;
        }
        p {
          font-size: 3.4rem;
          color: $text-color;
        }
      }
      .right-content {
        width: 70%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: $priority-max;

        img {
          width: 80%;
          height: 55%;
          object-fit: cover;
        }
      }
    }
    .location-swiper {
      width: 100%;
      height: 80%;
      padding: 2rem;
      position: relative;

      :deep(.swiper-button-next),
      :deep(.swiper-button-prev) {
        background-color: #000;
        width: 10rem;
        height: 10rem;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        position: absolute;
        margin-top: 25vh;

        &::after {
          font-size: 5.5rem;
        }
      }
      :deep(.swiper-button-next) {
        left: 50%;
        transform: translateX(50%);
        border-top-right-radius: 2rem;
        border-bottom-right-radius: 2rem;
        &::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 60%;
          border-left: 2px solid #fff;
        }
      }
      :deep(.swiper-button-prev) {
        left: 50%;
        transform: translateX(-50%);
        border-top-left-radius: 2rem;
        border-bottom-left-radius: 2rem;
      }

      :deep(.swiper-slide) {
        transition: all 0.3s ease;
        opacity: 0.4;

        &.swiper-slide-active {
          opacity: 1;
          // transform: scale(1.1);
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
            bottom: 10%;
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
    }

    .tab-menu {
      width: 100%;
      height: 10%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #dab15c;
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
        background-color: #dab15c;

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
      height: 10%;
      background-color: #dab15c;
      background-image: url("/image/modal-pattern.png");
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      z-index: 1;
    }
  }
  .close-modal {
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
</style>
