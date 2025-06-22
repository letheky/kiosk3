<template>
  <div class="about-page">
    <div class="about-page-content">
      <div class="context">
        <div class="content">
          <h3 class="title">{{ locationInfo?.translations?.[store.lang]?.name }}</h3>
          <div
            class="text"
            v-html="locationInfo?.translations?.[store.lang]?.content"
          ></div>
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
            <template v-if="position?.translations?.[store.lang]?.name">
              <CustomMarker
                :context="position.translations?.[store.lang]?.name"
                :isLtr="position.isLtr"
                color="#ffdbc8"
                textColor="#6F3811"
              />
            </template>
            <!-- <template v-else>
              <div class="dot-marker"></div>
            </template> -->
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
    <Modal :selectedLocation="selectedLocation" :modelValue="isOpen" :close="close"> </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import CustomMarker from "@/components/CustomMarker.vue";
import Audio from "@/components/Audio.vue";
import Modal from "@/components/Modal.vue";
import { useRoute, useRouter } from "vue-router";
import useModal from "@/composables/useModal";
import { fetchArticleById, fetchMoreGenralArticleInfo } from "@/api/fetch";
import useStore from "@/store/useStore";
import useArticleChild from "@/store/useArticleChild";

const store = useStore();
const articleChildStore = useArticleChild();
const route = useRoute();
const router = useRouter();
const id = route.params.id;
const { isOpen, open, close } = useModal();

const locationInfo = ref([]);
const selectedLocation = ref(null);

onMounted(async () => {
  const articleInfo = await fetchArticleById(store, id);
  locationInfo.value = articleInfo;
  const res = await fetchMoreGenralArticleInfo(store, articleInfo.topic);
  articleChildStore.setArticleList(res.topic_list.map((el) => el.detailInfo));
  console.log('check res', res)
});

const locationList = computed(() => {
  if (!articleChildStore.articleInfo.length > 0) return [];
  return articleChildStore.articleInfo.map((location, index, array) => {
    const [x, y] = location.coordinates
      .split(",")
      .map((coord) => parseFloat(coord.trim()));

    // Check for overlaps with previous markers
    const OVERLAP_THRESHOLD_Y = 3; // Minimum distance between markers
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
      isLtr: !hasOverlap, // true when overlap
    };
  });
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
  if (position.image_list.length < 2 ) {
    selectedLocation.value = position;
    
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
  } else if (position.name) {
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
        flex: 1;
        :deep(p) {
          font-family: $small-heading-family !important;
          font-size: 4.25rem !important;
          text-align: justify;
          overflow-y: auto;
          height: 78% !important;
          max-height: 78% !important;
          padding-right: 2rem;
        }
        :deep(span) {
          font-family: $small-heading-family !important;
          font-size: 4.25rem !important;
          text-align: justify;
          overflow-y: auto;
          height: 78% !important;
          max-height: 78% !important;
          padding-right: 2rem;
        }
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
