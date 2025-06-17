<template>
  <div class="skeleton-image" :style="{ width, height }">
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '100%'
  }
});
</script>

<style scoped>
.skeleton-image {
  background-color: #e0e0e0; /* Light gray background */
  border-radius: 2rem; /* Matches your image border-radius */
  position: relative;
  overflow: hidden;
}

/* Optional: Add a shimmer effect */
.skeleton-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transform: translateX(-100%);
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  to {
    transform: translateX(100%);
  }
}
</style>