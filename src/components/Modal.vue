<template>
  <Transition name="fade">
    <div class="modal" v-if="modelValue">
      <div class="modal-context">
        <img class="background" src="/image/home-bg.webp" alt="" />

        <Swiper
          v-if="activeTab === 1"
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
          <SwiperSlide v-for="(img, index) in 5" :key="index">
            <div class="swiper-image">
              <img :src="`./image/detail/list/list-${index + 1}.png`" alt="" />
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                bibendum libero ac est vulputate consectetur. Sed lacus velit,
                pharetra et turpis nec,
              </p>
            </div>
          </SwiperSlide>
        </Swiper>
        <div v-if="activeTab === 2" class="content">
          <div class="context-wrapper">
            <div class="left-content">
              <h1>Hiện vật</h1>
              <p>Chất liệu : Đồng</p>
              <p>Kích thước : L58,5 x W74 cm</p>
              <p>Trọng lượng : 72 Kg</p>
              <p>
                Trống đồng Cổ Loa được phát hiện năm 1982 tại cánh đồng Mả Tre,
                xã Cổ Loa, huyện Đông Anh. Trống chôn ngửa, trong lòng chứa hơn
                200 hiện vật đồng, hoa văn trang trí phong phú, phản ánh đời
                sống cư dân Di tích Đông Sơn. Giữa mặt trống là ngôi sao 14
                cánh, từ trong ra ngoài có 15 vành hoa văn, xung quanh là những
                dải trang trí hình lông công, hoạt cảnh đời thường, chim. Tang
                và thân trống trang trí hình người, hình thuyền. Chân trống để
                trơn. Trong lòng trống có khắc dòng chữ Hán. Trống đồng Cổ Loa
                thuộc loại trống đồng Heger I và là một trong những trống đẹp
                nhất tương đương các trống Ngọc Lũ và Hoàng Hạ. Kỹ thuật đúc
                trống tinh xảo. Trống được công nhận là Bảo vật Quốc gia theo
                Quyết định số 2382/QĐ-TTg ngày 25/12/2015 của Thủ tướng Chính
                phủ.
              </p>
            </div>
            <div class="right-content">
              <img src="/image/detail/artifact.png" alt="" />
              <button class="btn-3d" @click="handleClick3D">Tương tác 3D</button>
            </div>
          </div>
          <hr class="hr-line" />
          <div class="artifact-list">
            <div
              class="artifact-item"
              v-for="(item, index) in 10"
              :key="item"
              :class="{ active: selectedItem === index }"
              @click="selectedItem = index"
            >
              <img src="/image/detail/artifact.png" alt="" />
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
import { onUnmounted, ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Navigation } from "swiper/modules";
import useModal from "@/composables/useModal";
import ModalEnviroment from "./ModalEnviroment.vue";
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

const { isOpen: isOpen3DModal, open: open3DModal, close: close3DModal } =
  useModal();

const selectedItem = ref(0);
const activeTab = ref(1);
const tabList = ref([
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
]);

const closeModal = () => {
  props.close();
  activeTab.value = 1;
};

const handleClick3D = () => {
  console.log(selectedItem.value);
  open3DModal();
};

onUnmounted(() => {
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
            font-size: 5.7rem;
            font-weight: 700;
            color: $text-color;
          }
          p {
            font-size: 3.4rem;
            color: $text-color;
            &:last-child {
              padding-right: 2rem;
              overflow-y: auto;
              text-align: justify;
            }
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
          padding: 5rem 14.5rem 11.5rem 14.5rem;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
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
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
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
