<template>
  <button :class="['textured-button', dynamicClass]" @click="handleClick">
    <slot></slot>
  </button>
</template>

<script>
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "TexturedButton",
});
</script>
<script setup>
const router = useRouter();

const props = defineProps({
  path: { type: [String, Object] },
  dynamicClass: { type: String },
});

const handleClick = () => {
  if (props.path) {
    if (typeof props.path === "string") {
      window.location.href = props.path;
    } else {
      router
      .push(props.path);
    }
  }
};
</script>

<style lang="scss" scoped>
.textured-button {
  background: url("/image/button-bg.png") no-repeat center/cover;
  color: white;
  border: none;
  outline: none;

  &.btn-home {
    font-size: 4rem;
    padding: 2rem 16rem;
  }

  &.btn-timeline {
    font-size: 4rem;
    padding: 1rem 12rem;
    font-family: $text-family;
    letter-spacing: 2px;
  }
}
</style>
