<template>
  <div class="about-page">
    <div class="about-page-content">
      <div class="context">
        <h3 class="title">Giới thiệu chung</h3>
        <p class="text">
          Thăng Long là một thành phố lớn và nổi bật trong lịch sử Việt Nam. Nó
          được biết đến là thủ đô của nước Việt Nam từ thời phong kiến phương
          Bắc cho đến thời kỳ độc lập. Thăng Long có nhiều điểm thú vị và di
          tích lịch sử, đặc biệt là các lăng mộ, cung điện và đền thờ.
        </p>
        <hr class="hr-line" />
      </div>
      <Audio audioSrc="/audio/test-audio.mp3" />
    </div>
    <div class="location-list">
      <img src="/image/about/map.png" alt="map" class="map-image" />
      <div
        class="marker-position"
        v-for="position in locationList"
        :key="position.id"
        :style="{
          '--xCoordinate': `${position?.coordinates.split(',')[0].trim()}%`,
          '--yCoordinate': `${position?.coordinates.split(',')[1].trim()}%`,
        }"
      >
        <CustomMarker
          :top="position?.coordinates.split(',')[0].trim()"
          :left="position?.coordinates.split(',')[1].trim()"
          :context="position?.name"
          :isLtr="position?.isLtr"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import CustomMarker from "@/components/CustomMarker.vue";
import Audio from "@/components/Audio.vue";

const locationList = [
  {
    name: "Di tích Sơn Vi",
    coordinates: "47.99,14.68",
    isLtr: false,
  },
  {
    name: "Di tích Thành Dền",
    coordinates: "68.98,32.92",
    isLtr: false,
  },
  {
    name: "Di tích vườn chuối",
    coordinates: "68.83,40.88",
    isLtr: false,
  },
  {
    name: "Di tích Cổ Loa",
    coordinates: "72.76,38.75",
    isLtr: true,
  },
  {
    name: "Di tích thành Đại La",
    coordinates: "71.43,45.79",
    isLtr: true,
  },
];
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
    justify-content: space-between;
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
      gap: 2rem;
      color: $text-color;

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
      }
    }
  }
  .location-list {
    width: 75%;
    height: 100%;
    @include flex-center;
    background-color: #fff;
    .map-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .marker-position {
      position: absolute;
      top: var(--yCoordinate);
      left: var(--xCoordinate);
      transform-origin: center;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
