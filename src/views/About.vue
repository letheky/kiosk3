<template>
  <div class="about">
    <img class="background" src="/image/home-bg.webp" alt="" />
    <img class="flat-map" src="/image/about/flat-map.png" alt="" />
    <div class="navigation">
      <div class="bar left-bar"></div>
      <div class="main">
        <div class="content">
          <h1 ref="headingText">Giới thiệu</h1>
          <p ref="desText">
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
        <div class="menu">
          <router-link to="/detail/first" class="nav-btn">
            Thăng Long <br />
            nội thành ngoại thi
          </router-link>
          <router-link to="/detail/second" class="nav-btn">
            Thăng Long <br />
            hội tụ Tinh hoa
          </router-link>
          <router-link to="/detail/third" class="nav-btn">
            Thăng Long <br />
            tam trùng thành quách
          </router-link>
          <router-link to="/detail/fourth" class="nav-btn">
            Thăng Long <br />
            tứ trấn
          </router-link>
        </div>
      </div>
      <div class="bar right-bar"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Audio from "@/components/Audio.vue";
const animating = ref(false);
const router = useRouter();
const startAnimationAndNavigate = () => {
  if (animating.value) return;

  animating.value = true;
  const doorOpenDuration = 1000;
  const zoomDuration = 800;

  setTimeout(() => {
    setTimeout(() => {
      // router.push("/detail?type=1");
      animating.value = false;
    }, zoomDuration);
  }, doorOpenDuration);
};
</script>

<style lang="scss" scoped>
.about {
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
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 70%;
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
    background-color: #9daf9b;
    overflow: hidden;

    .bar {
      position: absolute;
      top: 0;
      left: 0;
      width: 10rem;
      height: 100%;
      background-image: url("/image/about/pattern-vertical.png");
      background-size: contain;
      background-position: center;
    }
    .right-bar {
      right: 0;
      left: unset;
    }
    .main {
      position: relative;
      width: calc(100% - 20rem);
      height: 100%;
      display: flex;
      align-items: center;
      background-color: $light-color;
      box-shadow: 0px 2rem 4.5rem 0px #1f0d01;

      z-index: 2;
      .content {
        width: 50%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 2rem;
        padding: 4rem;
        color: $text-color;

        h1 {
          font-size: 7rem;
          font-family: $heading-family;
        }
        p {
          font-size: 4rem;
          // font-family: $text-family;
          color: $text-color;
          overflow-y: scroll;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          max-height: 18rem;
        }
      }
      .menu {
        flex-grow: 1;
        min-width: 45%;
        height: 100%;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(2, 1fr);
        padding: 4rem;
        gap: 2rem;

        .nav-btn {
          font-size: 4.5rem;
          font-family: $small-heading-family;
          color: $text-color;
          @include flex-center;
          text-align: center;
          border: 1px solid $dark-color;
          padding: 0 6rem;
          position: relative;
          perspective: 1200px;
          &::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 8.5rem;
            height: 100%;
            background: url("/image/about/pattern-nav.png") no-repeat
              center/cover;
          }

          &::after {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            width: 8.5rem;
            height: 100%;
            background: url("/image/about/pattern-nav.png") no-repeat
              center/cover;
            transform: rotate(180deg);
          }
        }
      }
    }
  }
}
</style>
