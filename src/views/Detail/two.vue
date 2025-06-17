<template>
  <div class="detail">
    <img class="background" src="/image/home-bg.webp" alt="" />
    <img class="flat-map" src="/image/detail/flat-map-2.png" alt="" />
    <div class="navigation">
      <button class="btn-back" @click="back">Quay lại</button>
      <div class="bar left-bar"></div>
      <div class="main">
        <div class="content">
          <h1>Thăng Long hội tụ Tinh hoa</h1>
          <p>
            Hang Con Moong là một chứng cứ cho sự phát triển liên tục từ văn hóa
            Sơn Vi lên văn hóa Hòa Bình. Có thể nói rằng văn hóa Hòa Bình bắt
            nguồn từ văn hóa Sơn Vi. Nếu như chủ nhân văn hóa Sơn Vi vừa cư trú
            ngoài trời vừa cư trú trong hang động tùy theo từng khu vực thì các
            bộ lạc văn hóa Hòa Bình sống chủ yếu trong các hang động. Cũng đã
            tìm thấy một số di sản văn hóa Hòa Bình ở ngoài trời như Giáp Khẩu ở
            Quảng Ninh, Sập Việt ở Sơn La, nhưng những địa điểm như vậy rất ít.
          </p>
          <Audio audioSrc="./audio/test-audio.mp3" />
        </div>
      </div>
      <div class="bar right-bar"></div>
    </div>
    <div class="tab-menu">
      <div
        v-for="item in tabItems"
        :key="item.id"
        class="tab-item"
        @click="activeTab = item.id"
      >
        {{ item.name }}
        <p
          class="aria-label"
          v-if="activeTab === item.id"
          @click="openDetail(item.id)"
        >
          Chi tiết
        </p>
        <span class="marker" v-if="activeTab === item.id">
          <div class="wrapper">
            <SkeletonImage v-if="isLoading" />
            <img
              v-show="!isLoading"
              @load="isLoading = false"
              :src="item.img"
              alt=""
            />
          </div>
        </span>
      </div>
    </div>
    <Modal :modelValue="isOpen" :close="close"> </Modal>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Modal from "@/components/Modal.vue";
import Audio from "@/components/Audio.vue";
import useModal from "@/composables/useModal";
import { useRouter } from "vue-router";
import SkeletonImage from "@/components/SkeletonImage.vue";

const { isOpen, open, close } = useModal();
const router = useRouter();
const openDetail = (id) => {
  open();
};

const isLoading = ref(true);

const back = () => {
  router.push("/about");
};

const activeTab = ref(0);
const tabItems = ref([
  {
    id: 0,
    name: "Văn miếu - Quốc tử giám",
    img: "./image/detail/van-mieu.webp",
  },
  {
    id: 1,
    name: "Giảng võ đường",
    img: "./image/detail/van-mieu.webp",
  },
]);
</script>

<style lang="scss" scoped>
.detail {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #c89d63;

  img.background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    mix-blend-mode: luminosity;
  }
  .flat-map {
    position: absolute;
    top: 5rem;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 59%;
    object-fit: cover;
    z-index: 10;
  }

  .navigation {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 30%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    .btn-back {
      position: absolute;
      top: 5rem;
      left: calc(10% + 15rem);
      min-width: max-content;
      height: fit-content;
      color: $secondary-color;
      font-family: $small-heading-family;
      z-index: 10;
      cursor: pointer;
      font-size: 3.5rem;
      border: 1px solid $border-color;
      padding: 1.5rem ;
    }

    .bar {
      position: absolute;
      top: 0;
      left: 10%;
      width: 10rem;
      height: 100%;
      background-image: url("/image/about/pattern-vertical.png");
      background-size: contain;
      background-position: center;
      background-color: #9daf9b;
    }
    .right-bar {
      // transform: translateX(-50%);
      left: unset;
      right: 10%;
    }
    .main {
      position: relative;
      width: calc(80% - 20rem);
      height: 100%;
      @include flex-center;
      background-color: $light-color;
      box-shadow: 0px 2rem 4.5rem 0px #1f0d01;

      z-index: 2;

      .content {
        width: 100%;
        height: 100%;
        @include flex-center-vertical;
        gap: 2rem;
        padding: 4rem;
        color: $text-color;

        h1 {
          font-size: 7rem;
          font-family: $heading-family;
        }
        p {
          padding: 0 15%;
          font-size: 4rem;
          // font-family: $text-family;
          color: $text-color;
          overflow-y: scroll;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          max-height: 18rem;
          margin-bottom: 3rem;
        }
      }
    }
  }

  .tab-menu {
    position: absolute;
    bottom: 31.5%;
    left: 50%;
    transform: translateX(-50%);
    width: fit-content;
    height: fit-content;

    display: flex;
    align-items: end;
    gap: 4rem;
    z-index: 99;

    .tab-item {
      position: relative;
      min-width: max-content;
      padding: 2rem 4rem;
      @include flex-center-vertical;
      font-size: 5.6rem;
      font-family: $small-heading-family;
      background-color: $tab-item-bg-color;
      color: $tab-item-color;
      transition: all 0.3s ease-in-out;

      .aria-label {
        color: $secondary-color;
        font-size: 4rem;
        text-decoration: underline !important;
      }

      .marker {
        position: absolute;
        top: -36rem;
        left: 50%;
        transform: translateX(-50%);
        // border: 0.4rem solid #fff;
        height: 36rem;
        &::before {
          content: "";
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0.4rem;
          height: 100%;
          background-color: #fff;
        }

        .wrapper {
          width: 10rem;
          height: 10rem;
          overflow: hidden;
          border-radius: 50%;
          border: 0.4rem solid #fff;
          position: absolute;
          z-index: 1;
          top: -5rem;
          left: 50%;
          transform: translateX(-50%);

          img {
            width: 100%;
            aspect-ratio: 1/1;
            object-fit: cover;
          }
        }
      }
    }
  }
}
</style>
