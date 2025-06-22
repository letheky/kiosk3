<template>
  <div ref="container" class="three-container">
    <div class="close-modal" @click="$emit('close')">Đóng</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const emit = defineEmits(["close"]);
const container = ref(null);

let renderer;
let scene;
let camera;
let controls;
let animationId;

const handleResize = () => {
  if (!container.value || !camera || !renderer) return;

  const width = container.value.clientWidth;
  const height = container.value.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
};

onMounted(() => {
  // Scene setup
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0.5, 3);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.value.appendChild(renderer.domElement);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 7.5);
  scene.add(directionalLight);

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enablePan = false;
  controls.minDistance = 1;
  controls.maxDistance = 10;

  // Load GLB model
  const loader = new GLTFLoader();
  loader.load(
    "./model/object.glb",
    (gltf) => {
      const model = gltf.scene;
      model.position.y = 0.5;
      scene.add(model);
    },
    undefined,
    (error) => {
      console.error("Error loading GLB:", error);
    }
  );

  // Add resize listener
  window.addEventListener("resize", handleResize);

  // Initial resize
  handleResize();

  // Animation loop
  const animate = () => {
    animationId = requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };
  animate();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  cancelAnimationFrame(animationId);
  if (renderer) renderer.dispose();
  if (controls) controls.dispose();
});
</script>

<style lang="scss" scoped>
.three-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(34, 34, 34, 0.9);
  border-radius: 12px;
  overflow: hidden;
  z-index: 1000;
}

.three-container canvas {
  width: 100% !important;
  height: 100% !important;
}

.close-modal {
  position: absolute;
  bottom: 5rem;
  left: 50%;
  transform: translateX(-50%);
  width: fit-content;
  height: fit-content;
  background-color: #8c4f27;
  line-height: 1.2;
  color: #fff;
  font-size: 4rem;
  text-align: center;
  padding: 2.6rem;
  z-index: 1001;
}
</style>
