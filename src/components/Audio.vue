<template>
  <div class="player">
    <audio
      ref="audioRef"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @ended="onAudioEnded"
    >
      <!-- Replace this with your actual audio file source -->
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

      <div class="slider-container">
        <div
          class="slider-progress"
          :style="{ width: progressPercentage + '%' }"
        >
          <span class="played-audio" />
        </div>
        <input
          type="range"
          min="0"
          :max="duration"
          step="1"
          v-model="currentTime"
          @input="onInputChange"
        />
      </div>
      <div class="time-display">
        <!-- {{ formatTime(currentTime) }} / {{ formatTime(duration) }} -->
        {{ formatTime(duration) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from "vue";

import PlayIcon from "/image/play.svg";
import PauseIcon from "/image/pause.svg";

const audioRef = ref(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const props = defineProps({
  close: Function, // Change from closeVideo to close
  audioSrc: String,
  name: String,
});

const resolvedAudioSrc = ref(""); // Resolved audio source
// Watch for changes to audioSrc prop and update resolvedAudioSrc
watch(
  () => props.audioSrc,
  async (newAudioSrc) => {
    if (newAudioSrc) {
      try {
        resolvedAudioSrc.value = await newAudioSrc; // Resolve the promise
        if (audioRef.value) {
          audioRef.value.load(); // Reload the audio element with the new source
        }
      } catch (error) {
        console.error("Error resolving audioSrc:", error);
      }
    }
  },
  { immediate: true } // Run the watcher immediately to handle initial value
);

const progressPercentage = computed(() => {
  if (duration.value === 0) return 0;
  return (currentTime.value / duration.value) * 100;
});

onMounted(() => {
  // Ensure audio element is available
  if (audioRef.value) {
    audioRef.value.addEventListener("loadedmetadata", onLoadedMetadata);
    audioRef.value.addEventListener("timeupdate", onTimeUpdate);
    audioRef.value.addEventListener("ended", onAudioEnded);
  }
});

// Cleanup event listeners when component is unmounted
onBeforeUnmount(() => {
  if (audioRef.value) {
    audioRef.value.removeEventListener("loadedmetadata", onLoadedMetadata);
    audioRef.value.removeEventListener("timeupdate", onTimeUpdate);
    audioRef.value.removeEventListener("ended", onAudioEnded);
  }
});

// When metadata is loaded (e.g., audio duration)
const onLoadedMetadata = () => {
  if (audioRef.value) {
    duration.value = Math.floor(audioRef.value.duration);
  }
};

// Update currentTime as audio plays
const onTimeUpdate = () => {
  if (audioRef.value) {
    // Round to one decimal place to reduce jitter
    currentTime.value = Math.round(audioRef.value.currentTime * 10) / 10;
  }
};

// Handle audio ended event
const onAudioEnded = () => {
  isPlaying.value = false;
  currentTime.value = 0; // Optional: reset to beginning
  if (audioRef.value) {
    audioRef.value.currentTime = 0; // Reset audio position
  }
};

// Toggle play/pause
const togglePlay = () => {
  if (!audioRef.value) return;

  if (isPlaying.value) {
    audioRef.value.pause();
    isPlaying.value = false;
  } else {
    audioRef.value.play();
    isPlaying.value = true;
  }
};

// Handle manual slider (range input) change
const onInputChange = () => {
  if (audioRef.value) {
    const newTime = parseFloat(currentTime.value);
    if (!isNaN(newTime)) {
      audioRef.value.currentTime = newTime;
    }
  }
};

// Utility to format time in mm:ss
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

    // This wrapper provides positioning context
    .slider-container {
      position: relative;
      height: 6rem;
      background: $audio-unplayed-color;
      width: 60rem;
      background-image: url("/image/audio-pattern.png");
      background-repeat: repeat-x;
      background-size: contain;
      background-position: center;

      .pattern {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      .slider-progress {
        position: absolute;
        height: 100%;
        background: $audio-played-color;
        overflow: hidden;
        .played-audio {
          position: absolute;
          height: 100%;
          width: 60rem;
          background-image: url("/image/audio-pattern-played.png");
          background-repeat: repeat-x;
          background-size: contain;
          background-position: center;
          z-index: 1;
        }

        left: 0;
        top: 0;
        pointer-events: none;
        z-index: 1;
        /* Add smooth transition for progress changes */
        transition: width 0.1s ease-in-out;
      }

      input[type="range"] {
        position: absolute;
        width: 100%;
        height: 100%;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background: transparent;
        cursor: pointer;
        margin: 0;
        outline: none; /* Remove focus outline that might cause flicker */

        /* WebKit browsers (Chrome, Safari, Edge) */
        &::-webkit-slider-runnable-track {
          -webkit-appearance: none;
          height: 100%;
          background: transparent;
          border: none;
          outline: none;
        }

        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 9rem;
          width: 3.5rem;
          background-color: white;
          border: none;
          box-shadow: 1px 0 4px rgba(0, 0, 0, 0.3);
          cursor: pointer;
          position: relative;
          z-index: 2;
          margin-top: -1.5rem;
          will-change: transform;
          transition: transform 0.1s ease-out;
          transform: translateZ(0); /* Enable hardware acceleration */
        }

        /* Firefox */
        &::-moz-range-track {
          height: 100%;
          background: transparent;
          border: none;
          outline: none;
        }

        &::-moz-range-thumb {
          height: 9rem;
          width: 3.5rem;
          background-color: white;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          cursor: pointer;
          transition: transform 0.1s ease-out;
          transform: translateZ(0); /* Enable hardware acceleration */
        }

        /* Remove any focus/active state styling that might cause shrinking */
        &:focus::-webkit-slider-thumb,
        &:active::-webkit-slider-thumb {
          outline: none;
          /* Maintain consistent size */
          height: 9rem;
          width: 3.5rem;
        }

        &:focus::-moz-range-thumb,
        &:active::-moz-range-thumb {
          outline: none;
          height: 9rem;
          width: 3.5rem;
        }
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

  video {
    width: 80%;
    // height: 90%;
  }
}
</style>
