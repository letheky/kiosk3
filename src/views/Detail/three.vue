<template>
  <div class="detail">
    <img class="background" src="/image/home-bg.webp" alt="" />
    <img class="flat-map" src="/image/detail/fortress.png" alt="" />
    <CustomMarker2 top="46%" left="24%" context="La Thành" />
    <CustomMarker2 top="40%" left="42%" context="Hoàng thành" />
    <CustomMarker2 top="23%" left="56%" context="Cấm thành" />
    <div class="navigation">
      <button class="btn-back" @click="back">Quay lại</button>
      <div class="bar left-bar"></div>
      <div class="main">
        <div class="content">
          <h1>Thăng Long tam trùng thành quách</h1>
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
  </div>
</template>

<script setup>
import CustomMarker2 from "@/components/CustomMarker2.vue";
import Audio from "@/components/Audio.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const back = () => {
  router.push("/about");
};
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
    width: 70%;
    height: 58%;
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
      background-color: $tertiary-color;
      background-image: url("/image/about/pattern-vertical.png");
      background-repeat: repeat-y;
      background-size: contain;
      background-position: center;
      z-index: 1;
    }
    .right-bar {
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
}
</style>
