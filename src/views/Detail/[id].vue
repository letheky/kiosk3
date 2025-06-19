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
    <div class="location-list">
      <div
        class="map-container"
        @mousedown="onMouseDown"
        @touchstart="onTouchStart"
        @wheel="onWheel"
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
            transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
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
              position: 'absolute',
              left: `${position?.coordinates.split(',')[0].trim()}%`,
              top: `${position?.coordinates.split(',')[1].trim()}%`,
              transform: `translate(-50%, -50%) scale(${1 / scale})`,
              transformOrigin: 'center center',
            }"
            @click="onMarkerClick(position)"
          >
            <template v-if="position?.name">
              <CustomMarker
                :context="position.name"
                :isLtr="position.isLtr"
                color="#ffdbc8"
                textColor="#6F3811"
              />
            </template>
            <template v-else>
              <div class="dot-marker"></div>
            </template>
          </div>
        </div>

        <!-- Zoom Controls -->
        <div class="zoom-controls">
          <button
            class="zoom-btn"
            @click="zoomIn"
            :disabled="scale >= maxScale"
          >
            <img src="/image/zoom-in.svg" alt="zoom-in" />
          </button>
          <hr class="zoom-line" />
          <button
            class="zoom-btn"
            @click="zoomOut"
            :disabled="scale <= minScale"
          >
            <img src="/image/zoom-out.svg" alt="zoom-out" />
          </button>
        </div>
      </div>
    </div>
    <Modal :modelValue="isOpen" :close="close"> </Modal>
  </div>
</template>

<script setup>
import { ref } from "vue";
import CustomMarker from "@/components/CustomMarker.vue";
import Audio from "@/components/Audio.vue";
import Modal from "@/components/Modal.vue";
import { useRoute, useRouter } from "vue-router";
import useModal from "@/composables/useModal";

const route = useRoute();
const router = useRouter();
const id = Number(route.params.id);
const { isOpen, open, close } = useModal();

const originLocationList =
  id === 1
    ? [
        {
          id: 1,
          coordinates: "29.97,15.09",
        },
        {
          id: 2,
          coordinates: "32.74,16.39",
        },
        {
          id: 3,
          coordinates: "32.95,22.36",
        },
        {
          id: 4,
          coordinates: "32.53,22.08",
        },
        {
          id: 5,
          coordinates: "32.53,21.81",
        },
        {
          id: 6,
          coordinates: "33.23,24.35",
        },
        {
          id: 7,
          coordinates: "26.98,23.01",
        },
        {
          id: 8,
          coordinates: "28.16,24.49",
        },
        {
          id: 9,
          coordinates: "29.48,25.93",
        },
        {
          id: 10,
          coordinates: "38.58,29.98",
        },
      ]
    : id === 4
    ? [
        {
          id: 1,
          coordinates: "62.5,39.03",
          name: "Thành Cổ Loa",
        },
        {
          id: 2,
          coordinates: "61.11,41.02",
          name: "Di chỉ Mả Tre",
        },
        {
          id: 3,
          coordinates: "62.71,41.81",
          name: "Di chỉ Đình Tràng",
        },
      ]
    : [];
const locationList = originLocationList.map((location, index, array) => {
  const [x, y] = location.coordinates
    .split(",")
    .map((coord) => parseFloat(coord.trim()));

  // Check for overlaps with previous markers
  const OVERLAP_THRESHOLD_Y = 1; // Minimum distance between markers
  const OVERLAP_THRESHOLD_X = 2; // Minimum distance between markers

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
//handle panning & zoom features
const offsetX = ref(0);
const offsetY = ref(0);
const isDragging = ref(false);
const lastX = ref(0);
const lastY = ref(0);
const mapContainerRef = ref(null);
const scale = ref(1);
const maxScale = ref(3);
const minScale = ref(1);

function clampOffset(value) {
  const baseClamp = 1000;
  const scaleMultiplier = scale.value;
  const dynamicClamp = baseClamp * scaleMultiplier;
  return Math.min(Math.max(value, -dynamicClamp), dynamicClamp);
}

function zoomIn() {
  if (scale.value < maxScale.value) {
    scale.value = Math.min(scale.value + 0.2, maxScale.value);
  }
}

function zoomOut() {
  if (scale.value > minScale.value) {
    scale.value = Math.max(scale.value - 0.2, minScale.value);
  }
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
function onWheel(e) {
  e.preventDefault();
  const delta = e.deltaY;
  const zoomFactor = delta > 0 ? 0.9 : 1.1;
  const newScale = scale.value * zoomFactor;
  scale.value = Math.min(Math.max(newScale, minScale.value), maxScale.value);
}
function onMarkerClick(position) {
  if (!position.name) {
    // Parse coordinates
    const [xPercent, yPercent] = position.coordinates
      .split(",")
      .map((coord) => parseFloat(coord.trim()));

    // Get container dimensions
    const container = mapContainerRef.value;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;

    // Calculate target position in pixels
    const targetX = (xPercent / 100) * containerWidth;
    const targetY = (yPercent / 100) * containerHeight;

    // Calculate center of container
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;

    // Set zoom first
    scale.value = maxScale.value;

    // Calculate offset to center the marker, accounting for scale
    const newOffsetX = (centerX - targetX) * scale.value;
    const newOffsetY = (centerY - targetY) * scale.value;

    // Apply the new offset with clamping
    offsetX.value = clampOffset(newOffsetX);
    offsetY.value = clampOffset(newOffsetY);

    open();
  }
  else if(position.name) {
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
          transform-origin: center center;
          cursor: pointer;
          .dot-marker {
            width: 3rem;
            aspect-ratio: 1 / 1;
            background-color: #ba1a1a;
            border-radius: 50%;
            border: 1px solid #000;
          }
        }
      }

      .zoom-controls {
        position: absolute;
        bottom: 3rem;
        right: 3rem;
        display: flex;
        flex-direction: column;
        gap: 2.5rem;
        z-index: 10;
        background-color: #ffdbc8;
        padding: 2.32rem;
        border-radius: 1.33rem;

        .zoom-line {
          width: 100%;
          height: 1px;
          background-color: #000;
        }
        .zoom-btn {
          width: 4rem;
          height: 4rem;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}
</style>
