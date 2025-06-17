<template>
  <div>
    <input type="radio" :id="`radio${id}`" :value="id" />
    <label :for="`radio${id}`" class="custom-radio" @click="updateOption">
      <CheckedRadio v-if="selectedOption === id" :color="color" />
      <UncheckedRadio v-else :color="color" />
      <p>{{ optionText }}</p>
    </label>
  </div>
</template>

<script setup>
import UncheckedRadio from "@/components/icons/UncheckedRadio.vue";
import CheckedRadio from "@/components/icons/CheckedRadio.vue";
const props = defineProps({
  optionText: {
    type: String,
    default: "Tác phẩm của nhân vật",
  },
  selectedOption: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  color: {
    type: String,
  },
});

const emit = defineEmits(["update:selectedOption"]);

const updateOption = () => {
  if (props.selectedOption === props.id) {
    return; // Do nothing if the same option is clicked
  }
  emit("update:selectedOption", props.id); // Emit the updated selected option
};
</script>

<style lang="scss" scoped>
/* Hide default radio buttons */
input[type="radio"] {
  display: none;
}

/* Custom radio button styling */
.custom-radio {
  display: inline-flex;
  align-items: center;
  font-size: inherit;
  gap: 2rem;
  p {
    font-size: inherit; /* Adjust font size */
  }
}
</style>
