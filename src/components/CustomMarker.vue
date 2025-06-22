<template>
  <div class="parent-element">
    <div
      class="name-tag"
      :class="{ ltr: isLtr }"
      :style="{ backgroundColor: color }"
    >
      <p :style="{ color: textColor }">{{ context }}</p>
    </div>
    <div class="empty-circle">
      <div class="outer-circle" :class="{ ltr: isLtr }"></div>
      <div class="inner-circle" :class="{ ltr: isLtr }"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  color: {
    type: String,
    default: "#8c4f27",
  },
  textColor: {
    type: String,
    default: "#fff",
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
  left: -34%;

  .name-tag {
    position: relative;
    background-color: #8d4f27;
    padding: 2rem 9rem 2rem 3rem;
    margin-right: -6%;
    --c: 13%;
    mask: radial-gradient(
      var(--c) 61% at right,
      rgba(0, 0, 0, 0) calc(100% - 4px),
      #000
    );
    left: 4.5%;

    p {
      color: #fff;
      font-size: 4.65rem;
      line-height: 1.2;
      margin: 0;
      white-space: nowrap;
    }

    &.ltr {
      padding: 2rem 3rem 2rem 8rem;
      left: 90%;
      margin-right: 0;
      mask: radial-gradient(
        var(--c) 56% at left,
        rgba(0, 0, 0, 0) calc(100% - 4px),
        #000
      );
    }
  }

  .empty-circle {
    width: 10.22rem;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    position: relative;
    mix-blend-mode: multiply;
    background: transparent;

    .outer-circle {
      width: 9.16rem;
      aspect-ratio: 1 / 1;
      border-radius: 50%;
      position: absolute;
      top: 0;
      right: 0;
      transform: translateY(5%);
      background: #ecbbbb;
      mix-blend-mode: multiply;
      opacity: 0.8;
      animation: wave 2s ease-in-out infinite;

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
      left: 55%;
      transform: translate(-50%, -50%);
      mix-blend-mode: normal;
      &.ltr {
        left: 45%;
      }
    }
  }
}

@keyframes wave {
  0%,
  100% {
    transform: translateY(5%) scale(0.6);
  }
  50% {
    transform: translateY(5%) scale(1.1);
  }
}
</style>
