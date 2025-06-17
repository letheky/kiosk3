<template>
  <div class="modal-tour" v-if="isOpenTour">
    <iframe
      src="https://demo-map.vietnaminfo.net/tours/denquanthanh/"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
    <div class="close-modal" @click="close">Đóng</div>
  </div>
</template>

<script setup>
const props = defineProps({
  isOpenTour: {
    type: Boolean,
    required: true,
  },
  closeTour: {
    type: Function,
    required: true,
  },
});
const close = () => {
  console.log("close");
  props.closeTour();
};
</script>

<style lang="scss" scoped>
.modal-tour {
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
  iframe {
    width: 100%;
    height: 100%;
    // z-index: 1;
  }
  .close-modal {
    position: absolute;
    bottom: 5rem;
    left: 10rem;
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
    z-index: $priority-max;
  }
}
</style>
