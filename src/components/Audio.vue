<template>
  <div class="player">
    <audio
      ref="audioRef"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @ended="onAudioEnded"
    >
      <source :src="resolvedAudioSrc" type="audio/mp4" />
    </audio>
    <p style="color: #fff">{{ name }}</p>
    <div class="my-progress-bar">
      <div
        class="play-button"
        :class="{ playing: isPlaying }"
        @click="togglePlay"
      >
        <Transition name="fade" mode="out-in">
          <img v-if="!isPlaying" :src="PlayIcon" alt="Play" />
          <img v-else :src="PauseIcon" alt="Pause" />
        </Transition>
      </div>

      <div class="slider-container" ref="sliderContainer">
        <!-- Progress bar -->
        <div
          class="slider-progress"
          :style="{ width: progressPercentage + '%' }"
        >
          <span class="played-audio" />
        </div>

        <!-- Custom smooth thumb -->
        <div
          class="custom-thumb"
          :style="{
            left: thumbPosition + 'px',
            transform: `translateX(-50%) ${
              isUserSeeking ? 'scale(1.1)' : 'scale(1)'
            }`,
          }"
        />

        <!-- Invisible range input for interaction -->
        <input
          type="range"
          min="0"
          :max="duration"
          step="0.001"
          v-model="currentTime"
          @input="onSliderInput"
          @mousedown="onSliderMouseDown"
          @mouseup="onSliderMouseUp"
          @touchstart="onSliderMouseDown"
          @touchend="onSliderMouseUp"
          class="invisible-slider"
        />
      </div>

      <div class="time-display">
        {{ formatTime(duration) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  onBeforeUnmount,
  computed,
  watch,
  nextTick,
} from "vue";

import PlayIcon from "/image/play.svg";
import PauseIcon from "/image/pause.svg";

const audioRef = ref(null);
const sliderContainer = ref(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const isUserSeeking = ref(false);
const sliderWidth = ref(600); // Default width, will be updated

const props = defineProps({
  close: Function,
  audioSrc: String,
  name: String,
});

const resolvedAudioSrc = ref("");

// Smooth thumb position calculation
const thumbPosition = computed(() => {
  if (duration.value === 0 || sliderWidth.value === 0) return 0;
  return (currentTime.value / duration.value) * sliderWidth.value;
});

const progressPercentage = computed(() => {
  if (duration.value === 0) return 0;
  return (currentTime.value / duration.value) * 100;
});

// Update slider width when component mounts or window resizes
const updateSliderWidth = () => {
  if (sliderContainer.value) {
    sliderWidth.value = sliderContainer.value.offsetWidth;
  }
};

// Watch for changes to audioSrc prop
watch(
  () => props.audioSrc,
  async (newAudioSrc) => {
    if (newAudioSrc) {
      try {
        resolvedAudioSrc.value = await newAudioSrc;
        if (audioRef.value) {
          audioRef.value.load();
        }
      } catch (error) {
        console.error("Error resolving audioSrc:", error);
      }
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (audioRef.value) {
    audioRef.value.addEventListener("loadedmetadata", onLoadedMetadata);
    audioRef.value.addEventListener("timeupdate", onTimeUpdate);
    audioRef.value.addEventListener("ended", onAudioEnded);
  }

  // Update slider width
  nextTick(() => {
    updateSliderWidth();
  });

  // Listen for window resize
  window.addEventListener("resize", updateSliderWidth);
});

onBeforeUnmount(() => {
  if (audioRef.value) {
    audioRef.value.removeEventListener("loadedmetadata", onLoadedMetadata);
    audioRef.value.removeEventListener("timeupdate", onTimeUpdate);
    audioRef.value.removeEventListener("ended", onAudioEnded);
  }
  window.removeEventListener("resize", updateSliderWidth);
});

const onLoadedMetadata = () => {
  if (audioRef.value) {
    duration.value = audioRef.value.duration;
  }
};

// Smooth time updates using requestAnimationFrame
let animationId = null;
const smoothTimeUpdate = () => {
  if (audioRef.value && !isUserSeeking.value && isPlaying.value) {
    currentTime.value = audioRef.value.currentTime;
  }
  animationId = requestAnimationFrame(smoothTimeUpdate);
};

const onTimeUpdate = () => {
  // Start smooth animation loop if not already running
  if (!animationId && isPlaying.value && !isUserSeeking.value) {
    smoothTimeUpdate();
  }
};

const onAudioEnded = () => {
  isPlaying.value = false;
  currentTime.value = 0;
  if (audioRef.value) {
    audioRef.value.currentTime = 0;
  }
  // Stop animation loop
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
};

const togglePlay = () => {
  if (!audioRef.value) return;

  if (isPlaying.value) {
    audioRef.value.pause();
    isPlaying.value = false;
    // Stop smooth animation when paused
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  } else {
    audioRef.value.play();
    isPlaying.value = true;
    // Start smooth animation when playing
    if (!animationId) {
      smoothTimeUpdate();
    }
  }
};

const onSliderMouseDown = () => {
  isUserSeeking.value = true;
  // Stop smooth animation during seeking
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
};

const onSliderMouseUp = () => {
  isUserSeeking.value = false;
  if (audioRef.value) {
    audioRef.value.currentTime = currentTime.value;
  }
  // Restart smooth animation if playing
  if (isPlaying.value && !animationId) {
    smoothTimeUpdate();
  }
};

const onSliderInput = () => {
  if (isUserSeeking.value && audioRef.value) {
    // Immediate update during seeking for responsiveness
    audioRef.value.currentTime = currentTime.value;
  }
};

const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};

defineExpose({
  audioRef,
});
</script>

<style lang="scss" scoped>
.player {
  padding-bottom: 4rem;
  .my-progress-bar {
    position: relative;
    display: flex;
    align-items: center;
    gap: 3rem;
    contain: layout style;

    .play-button {
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        img {
          filter: brightness(0.9);
        }
      }

      img {
        width: 8rem;
        height: 8rem;
      }
    }

    .slider-container {
      position: relative;
      height: 6rem;
      background: $audio-unplayed-color;
      width: 60rem;
      background-image: url("/image/audio-pattern.svg");
      background-repeat: repeat-x;
      background-size: contain;
      background-position: center;

      .slider-progress {
        position: absolute;
        height: 100%;
        background: $audio-played-color;
        overflow: hidden; /* Change to hidden to clip the pattern */
        left: 0;
        top: 0;
        pointer-events: none;
        z-index: 1;
        transform-origin: left center;
        transition: width 0.05s linear; /* Change to width transition */

        .played-audio {
          position: absolute;
          height: 100%;
          width: 60rem;
          background-image: url("/image/audio-pattern-played.svg");
          background-repeat: repeat-x;
          background-size: contain;
          background-position: center;
          z-index: 1;
          left: 0; /* Ensure proper positioning */
        }
      }

      /* Custom smooth thumb */
      .custom-thumb {
        position: absolute;
        height: 9rem;
        width: 3.5rem;
        margin-top: -4.25rem;
        background-color: white;
        box-shadow: 1px 0 4px rgba(0, 0, 0, 0.3);
        top: 50%;
        transform: translateY(-50%) translateX(-50%);
        z-index: 3;
        pointer-events: none;
        border-radius: 2px;
        /* Smooth movement transition */
        transition: transform 0.05s cubic-bezier(0.4, 0, 0.2, 1);

        /* Add a subtle glow effect when seeking */
        &::after {
          content: "";
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
      }

      /* Invisible range input for interaction */
      .invisible-slider {
        position: absolute;
        width: 100%;
        height: 100%;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background: transparent;
        cursor: pointer;
        margin: 0;
        outline: none;
        z-index: 2;

        /* Hide all default slider elements */
        &::-webkit-slider-runnable-track {
          -webkit-appearance: none;
          height: 100%;
          background: transparent;
          border: none;
        }

        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 0;
          height: 0;
          background: transparent;
          border: none;
          cursor: pointer;
        }

        &::-moz-range-track {
          height: 100%;
          background: transparent;
          border: none;
        }

        &::-moz-range-thumb {
          width: 0;
          height: 0;
          background: transparent;
          border: none;
          cursor: pointer;
        }
      }

      /* Show glow effect when user is seeking */
      &:hover .custom-thumb::after,
      .invisible-slider:active ~ .custom-thumb::after {
        opacity: 1;
      }
    }

    .time-display {
      font-size: 4rem;
      font-weight: 400;
      text-align: right;
      position: absolute;
      top: calc(50%);
      left: 60rem;
      transform: translateY(-50%);
      pointer-events: none;
    }
  }
}
</style>
