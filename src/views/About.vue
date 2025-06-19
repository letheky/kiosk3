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
      <div
        class="map-container"
        @mousedown="onMouseDown"
        @touchstart="onTouchStart"
        :style="{
          cursor: isDragging ? 'grabbing' : 'grab',
          overflow: 'hidden',
          width: '100%',
          height: '100%',
          position: 'relative',
        }"
        ref="mapContainerRef"
      >
        <div
          class="map-content"
          :style="{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            transform: `translate(${offsetX}px, ${offsetY}px)`,
            transition: isDragging ? 'none' : 'transform 0.2s',
          }"
        >
          <img
            src="/image/about/map.png"
            alt="map"
            class="map-image"
            draggable="false"
          />
          <div
            class="marker-position"
            v-for="(position, idx) in locationList"
            :key="idx"
            :style="{
              '--xCoordinate': `${position?.coordinates.split(',')[0].trim()}%`,
              '--yCoordinate': `${position?.coordinates.split(',')[1].trim()}%`,
              transform: `translate(-50%, -50%)`,
            }"
            @click="onMarkerClick(position)"
          >
            <CustomMarker :context="position?.name" :isLtr="position?.isLtr" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import CustomMarker from "@/components/CustomMarker.vue";
import Audio from "@/components/Audio.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const locationList = [
  {
    name: "Di tích Sơn Vi",
    coordinates: "30.76,14.81",
    hasChild: true,
    id: 1,
  },
  {
    name: "Di tích Thành Dền",
    coordinates: "58.23,32.92",
    id: 2,
  },
  {
    name: "Di tích vườn chuối",
    coordinates: "58.02,40.46",
    hasChild: false,
    id: 3,
  },
  {
    name: "Di tích Cổ Loa",
    coordinates: "63.68,39.31",
    hasChild: true,
    id: 4,
  },
  {
    name: "Di tích thành Đại La",
    coordinates: "62.12,46.57",
    id: 5,
  },
].map((location, index, array) => {
  const [x, y] = location.coordinates
    .split(",")
    .map((coord) => parseFloat(coord.trim()));

  // Check for overlaps with previous markers
  const OVERLAP_THRESHOLD_Y = 4; // Minimum distance between markers
  const OVERLAP_THRESHOLD_X = 10; // Minimum distance between markers

  const hasOverlap = array.some((otherLocation, otherIndex) => {
    if (otherIndex >= index) return false; // Only check against previous markers

    const [otherX, otherY] = otherLocation.coordinates
      .split(",")
      .map((coord) => parseFloat(coord.trim()));

    // Calculate distance between markers
    const xDiff = Math.abs(x - otherX);
    const yDiff = Math.abs(y - otherY);

    // Check if the markers are close to each other in the y-axis
    return yDiff < OVERLAP_THRESHOLD_Y && xDiff < OVERLAP_THRESHOLD_X;
  });

  return {
    ...location,
    isLtr: hasOverlap, // true when overlap
  };
});

const offsetX = ref(0);
const offsetY = ref(0);
const isDragging = ref(false);
const lastX = ref(0);
const lastY = ref(0);
const mapContainerRef = ref(null);

function clampOffset(value) {
  return Math.min(Math.max(value, -1000), 1000);
}

function onMouseDown(e) {
  isDragging.value = true;
  lastX.value = e.clientX;
  lastY.value = e.clientY;
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
}
function onMouseMove(e) {
  if (!isDragging.value) return;
  const newOffsetX = offsetX.value + (e.clientX - lastX.value);
  const newOffsetY = offsetY.value + (e.clientY - lastY.value);

  offsetX.value = clampOffset(newOffsetX);
  offsetY.value = clampOffset(newOffsetY);

  lastX.value = e.clientX;
  lastY.value = e.clientY;
}
function onMouseUp() {
  isDragging.value = false;
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", onMouseUp);
}
function onTouchStart(e) {
  if (e.touches.length !== 1) return;
  isDragging.value = true;
  lastX.value = e.touches[0].clientX;
  lastY.value = e.touches[0].clientY;
  window.addEventListener("touchmove", onTouchMove);
  window.addEventListener("touchend", onTouchEnd);
}
function onTouchMove(e) {
  if (!isDragging.value || e.touches.length !== 1) return;
  const newOffsetX = offsetX.value + (e.touches[0].clientX - lastX.value);
  const newOffsetY = offsetY.value + (e.touches[0].clientY - lastY.value);

  offsetX.value = clampOffset(newOffsetX);
  offsetY.value = clampOffset(newOffsetY);

  lastX.value = e.touches[0].clientX;
  lastY.value = e.touches[0].clientY;
}
function onTouchEnd() {
  isDragging.value = false;
  window.removeEventListener("touchmove", onTouchMove);
  window.removeEventListener("touchend", onTouchEnd);
}
function onMarkerClick(position) {
  if (position.hasChild) {
    router.push(`/detail/${position.id}`);
  } else {
    router.push(`/detail/position/${position.id}`);
  }
}
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
    position: relative;
    overflow: hidden;
    .map-container {
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
      user-select: none;
      touch-action: none;

      .map-content {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        .map-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          pointer-events: none;
          user-drag: none;
          user-select: none;
        }
        .marker-position {
          position: absolute;
          top: var(--yCoordinate);
          left: var(--xCoordinate);
          transform-origin: center;
          // transform is set inline for centering only
        }
      }
    }
  }
}
</style>
