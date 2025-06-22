<template>
  <Transition name="fade">
    <div class="modal" v-if="modelValue">
      <div class="modal-context">
        <img class="background" src="/image/home-bg.webp" alt="" />
        <template v-if="activeTab === 1">
          <Swiper
            v-if="selectedLocation.image_list?.[0]?.image_list?.length > 1"
            :modules="[Navigation, Autoplay]"
            :slides-per-view="1"
            :centered-slides="true"
            :space-between="20"
            :loop="true"
            :navigation="true"
            :autoplay="{
              delay: 3000,
              disableOnInteraction: false,
              enabled: false,
            }"
            class="location-swiper"
            @swiper="onSwiper"
          >
            <SwiperSlide
              v-for="(img, index) in selectedLocation.image_list[0]
                .image_list"
              :key="index"
            >
              <div class="swiper-image">
                <img :src="img.image" alt="" @load="onImageLoad" />
                <p>
                  {{ img.translations?.[store.lang]?.name }}
                </p>
              </div>
            </SwiperSlide>
          </Swiper>
          <div
            v-else-if="selectedLocation.image_list?.[0]?.image_list?.length > 0"
            class="location-swiper"
          >
            <div class="swiper-image">
              <img
                :src="selectedLocation.image_list[0].image_list[0].image"
                alt=""
              />
              <p>
                {{
                  selectedLocation.image_list[0].image_list[0].translations?.[
                    store.lang
                  ]?.name
                }}
              </p>
            </div>
          </div>
        </template>
        <div v-if="activeTab === 2" class="content">
          <div class="context-wrapper">
            <div class="left-content">
              <h1>
                {{
                  selectedLocation.artifact_list.find(
                    (el) => el.id === selectedItem
                  ).translations?.[store.lang]?.name
                }}
              </h1>
              <p>
                {{
                  selectedLocation.artifact_list.find(
                    (el) => el.id === selectedItem
                  ).translations?.[store.lang]?.des
                }}
              </p>
            </div>
            <div class="right-content">
              <img
                :src="
                  selectedLocation.artifact_list.find(
                    (el) => el.id === selectedItem
                  ).thumbnail
                "
                alt=""
              />
              <button
                v-if="
                  selectedLocation.artifact_list.find(
                    (el) => el.id === selectedItem
                  ).file ||
                  selectedLocation.artifact_list.find(
                    (el) => el.id === selectedItem
                  ).link
                "
                class="btn-3d"
                @click="handleClick3D"
              >
                Tương tác 3D
              </button>
            </div>
          </div>
          <hr class="hr-line" />
          <div class="artifact-list">
            <div
              class="artifact-item"
              v-for="item in selectedLocation.artifact_list"
              :key="item"
              :class="{ active: selectedItem === item.id }"
              @click="selectedItem = item.id"
            >
              <img :src="item.thumbnail" alt="" />
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
      <div class="close-modal" @click="closeModal">Đóng</div>
    </div>
  </Transition>
  <Transition name="fade">
    <ModalEnviroment @close="close3DModal" v-if="isOpen3DModal" />
  </Transition>
</template>

<script setup>
import { onUnmounted, ref, computed, watch } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Navigation } from "swiper/modules";
import useModal from "@/composables/useModal";
import ModalEnviroment from "./ModalEnviroment.vue";
import useStore from "@/store/useStore";

const store = useStore();

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  selectedLocation: {
    type: Object,
    required: true,
  },
  close: {
    type: Function,
    required: true,
  },
});

const {
  isOpen: isOpen3DModal,
  open: open3DModal,
  close: close3DModal,
} = useModal();

const selectedItem = ref(0);
const activeTab = ref(1);

const locationSwiper = ref(null);
const loadedImagesCount = ref(0);
const totalImages = computed(
  () => props.selectedLocation?.image_list?.[0]?.image_list?.length || 0
);

const onSwiper = (swiper) => {
  locationSwiper.value = swiper;
};

const onImageLoad = () => {
  loadedImagesCount.value++;
  if (totalImages.value > 0 && loadedImagesCount.value >= totalImages.value) {
    if (locationSwiper.value && !locationSwiper.value.destroyed) {
      locationSwiper.value.autoplay.start();
    }
  }
};

// Base tab list
const baseTabList = [
  {
    id: 1,
    name: "Khai quật",
    image: "./image/detail/button-bg.png",
  },
  {
    id: 2,
    name: "Hiện vật",
    image: "./image/detail/button-bg.png",
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
];

// Computed tab list that conditionally includes tab 2
const tabList = computed(() => {
  const hasArtifacts = props.selectedLocation?.artifact_list?.length > 0;

  if (hasArtifacts) {
    return baseTabList;
  } else {
    // Filter out tab 2 (id: 2) when there are no artifacts
    return baseTabList.filter((tab) => tab.id !== 2);
  }
});

// Watch for changes in selectedLocation and reset activeTab if needed
watch(
  () => props.selectedLocation,
  (newLocation) => {
    // Autoplay logic
    loadedImagesCount.value = 0;
    if (locationSwiper.value && !locationSwiper.value.destroyed) {
      locationSwiper.value.autoplay.stop();
    }

    const hasArtifacts = newLocation?.artifact_list?.length > 0;
    selectedItem.value = newLocation?.artifact_list[0]?.id;

    // If user is on tab 2 and there are no artifacts, reset to tab 1
    if (activeTab.value === 2 && !hasArtifacts) {
      activeTab.value = 1;
    }
  },
  { immediate: true, deep: true }
);

const closeModal = () => {
  props.close();
  activeTab.value = 1;
};

const handleClick3D = () => {
  console.log(selectedItem.value);
  open3DModal();
};

onUnmounted(() => {
  if (locationSwiper.value && !locationSwiper.value.destroyed) {
    locationSwiper.value.autoplay.stop();
  }
  close3DModal();
});
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
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 80%;
      padding: 4rem;
      z-index: 1;
      flex: 1;

      .context-wrapper {
        width: 100%;
        height: 75.87rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        overflow: hidden;
        .left-content {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          color: $text-color;

          h1 {
            font-size: 8.66rem;
            font-family: $heading-family;
            color: $text-color;
          }
          p {
            font-size: 4.2rem;
            color: $text-color;
            padding-right: 2rem;
            overflow-y: auto;
            text-align: justify;
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
          padding: 5rem 14.5rem 5rem 14.5rem;
          gap: 2rem;

          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
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
        height: 26rem;
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
          width: 26rem;
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
    .location-swiper {
      width: 100%;
      height: 83%;
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
            bottom: 13%;
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
