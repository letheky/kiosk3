<template>
  <div class="parent-element">
    <div class="name-tag" :class="{ ltr: isLtr }">
      <p>{{ context }}</p>
    </div>
    <div class="empty-circle">
      <div class="outer-circle" :class="{ ltr: isLtr }">
        <div class="inner-circle"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  color: {
    type: String,
    default: "#795908",
  },
  context: {
    type: String,
    default: "Default",
  },
  isLtr: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.parent-element {
  position: relative;
  z-index: 100;
  display: flex;
  align-items: center;
  .name-tag {
    background-color: #8d4f27;

    padding: 2rem 6rem 2rem 3rem;
    position: absolute;
    min-width: max-content;
    top: 0;
    left: 0;
    transform: translateX(-90%);
    p {
      color: #fff;
      font-size: 4.65rem;
      line-height: 1.2;
    }
    &.ltr {
      padding: 2rem 3rem 2rem 6rem;
      left: unset;
      right: 0;
      transform: translateX(90%);
    }
  }
  .empty-circle {
    width: 10.22rem;
    aspect-ratio: 1 / 1;
    background-color: #fff;
    border-radius: 50%;
    position: relative;

    .outer-circle {
      width: 9.16rem;
      aspect-ratio: 1 / 1;
      background-color: #ecbbbb;
      border-radius: 50%;
      position: absolute;
      top: 0;
      right: 0;
      transform: translateY(5%);
      &.ltr {
        left: 0;
      }
    }
    .inner-circle {
      position: absolute;
      width: 5.7rem;
      aspect-ratio: 1 / 1;
      background-color: #ba1a1a;
      border-radius: 50%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
