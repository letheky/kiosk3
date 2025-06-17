<template>
  <div class="detail">
    <Map :locationList="tabItems" v-model:activeTab="activeTab" :showDirection="false" :zoomLevel="20" />
    <div class="navigation">
      <button class="btn-back" @click="back">Quay lại</button>
      <div class="bar left-bar"></div>
      <div class="main">
        <div class="content">
          <h1>Thăng Long tứ trấn</h1>
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
      </div>
    </div>
    <ModalV2 :modelValue="isOpen" :close="close" :location="targetLocation">
    </ModalV2>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import ModalV2 from "@/components/ModalV2.vue";
import Audio from "@/components/Audio.vue";
import useModal from "@/composables/useModal";
import Map from "@/components/Map.vue";
import { useRouter } from "vue-router";

const { isOpen, open, close } = useModal();
const router = useRouter();
const openDetail = (id) => {
  open();
};

const back = () => {
  router.push("/about");
};

const activeTab = ref(0);
const tabItems = ref([
  {
    id: 0,
    name: "Đền Voi Phục",
    img: "./image/detail/voi-phuc.webp",
    thumbnail: "./image/detail/voi-phuc.webp",
    lat: 21.03066065438263,
    lng: 105.80424832944777,
    link: "https://demo-map.vietnaminfo.net/tours/denquanthanh/"
  },
  {
    id: 1,
    name: "Đền Kim Liên",
    img: "./image/detail/kim-lien.webp",
    thumbnail: "./image/detail/kim-lien.webp",
    lat: 21.01065209879005,
    lng: 105.83821039973195,
    link: "https://demo-map.vietnaminfo.net/tours/denquanthanh/"
  },
  {
    id: 2,
    name: "Đền Quán Thánh",
    img: "./image/detail/quan-thanh.webp",
    thumbnail: "./image/detail/quan-thanh.webp",
    lat: 21.04301748061639,
    lng: 105.83654619644416,
    link: "https://demo-map.vietnaminfo.net/tours/denquanthanh/"
  },
  {
    id: 3,
    name: "Đền Bạch Mã",
    img: "./image/detail/bach-ma.webp",
    thumbnail: "./image/detail/bach-ma.webp",
    lat: 21.03578788615464,
    lng: 105.85100963969766,
    link: "https://demo-map.vietnaminfo.net/tours/denquanthanh/"
  },
]);

const targetLocation = computed(() => {
  return tabItems.value[activeTab.value];
});
</script>

<style lang="scss" scoped>
.detail {
  width: 100%;
  height: 100%;
  position: relative;

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
    z-index: 10;

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
    }
  }
}
</style>
