<template>
  <div class="parent-element" :style="{ top, left }">
    <div
      class="rounded-element"
      :style="{
        '--color': `${color}`,
      }"
    >
      <div class="line">
        <p>{{ context }}</p>
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
  top: {
    type: String,
    default: "50%",
  },
  left: {
    type: String,
    default: "50%",
  },
  context: {
    type: String,
    default: "Default",
  },
});
</script>

<style lang="scss" scoped>
.parent-element {
  position: absolute;
  z-index: 100;
  .rounded-element {
    width: 2rem;
    aspect-ratio: 1 / 1;
    background-color: var(--color);
    border-radius: 50%;
    position: relative;
    pointer-events: auto; // Ensure the element itself is clickable

    .line {
      position: absolute;
      top: -20rem;
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
      font-weight: bold;
      border: 1px solid #000000;
      height: 20rem;
      z-index: 1;


      p {
        width: fit-content;
        min-width: max-content;
        position: absolute;
        top: -15rem;
        left: 50%;
        transform: translateX(-50%);
        height: 15rem;
        background-color: $primary-color;
        color: white;
        padding: 0 5rem;
        font-size: 7rem;
        @include flex-center;
      }
    }
  }
}

</style>
