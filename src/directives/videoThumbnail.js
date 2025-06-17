export default {
  mounted(el, binding) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const width = binding.value?.width || (window.innerHeight / 3) * 1.5;
    const height = binding.value?.height || window.innerHeight / 3;
    const time = binding.value?.time || 0.1;

    canvas.width = width;
    canvas.height = height;

    const handleLoadedMetadata = () => {
      // Seek to a specific time to grab a thumbnail
      el.currentTime = time;
    };

    const handleSeeked = () => {
      // Draw the frame
      if (ctx) {
        ctx.drawImage(el, 0, 0, width, height);

        const img = new Image();
        img.src = canvas.toDataURL("image/png");
        img.className = el.className;
        img.style.cursor = "pointer";
        img.style.width = width + "px";
        img.style.height = height + "px";

        // Click handler forwarding
        img.addEventListener("click", () => {
          el.dispatchEvent(new Event("click"));
        });

        // Replace the video with the thumbnail
        el.parentNode?.replaceChild(img, el);
      }

      el.removeEventListener("seeked", handleSeeked);
    };

    el.addEventListener("loadedmetadata", handleLoadedMetadata);
    el.addEventListener("seeked", handleSeeked);

    // Start loading the video
    el.load();
  },
};
