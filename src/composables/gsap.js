// composables/gsap.js
import {
  ref,
  onMounted,
  onBeforeUnmount
} from 'vue'
import {
  gsap
} from 'gsap'
import {
  SplitText
} from 'gsap/SplitText'

gsap.registerPlugin(SplitText)

export function useMaskedLine(options = {}) {
  const elementRef = ref(null)
  let splitInstance = null

  const defaultOptions = {
    duration: 0.6,
    yPercent: 100,
    opacity: 0,
    stagger: 0.1,
    ease: "expo.out",
    delay: 0,
    ...options
  }

  const animate = () => {
    if (!elementRef.value) return

    // Set initial opacity
    gsap.set(elementRef.value, {
      opacity: 1
    })

    // Create SplitText instance
    splitInstance = SplitText.create(elementRef.value, {
      type: "words,lines",
      linesClass: "line",
      mask: "lines",
      onSplit: (self) => {
        gsap.from(self.lines, {
          duration: defaultOptions.duration,
          yPercent: defaultOptions.yPercent,
          opacity: defaultOptions.opacity,
          stagger: defaultOptions.stagger,
          ease: defaultOptions.ease,
          delay: defaultOptions.delay
        })
      }
    })
  }

  const replay = (timeScale = 1) => {
    if (splitInstance) {
      const tl = gsap.from(splitInstance.lines, {
        duration: defaultOptions.duration,
        yPercent: defaultOptions.yPercent,
        opacity: defaultOptions.opacity,
        stagger: defaultOptions.stagger,
        ease: defaultOptions.ease
      })
      tl.timeScale(timeScale).play(0)
    }
  }

  const cleanup = () => {
    if (splitInstance) {
      splitInstance.revert()
      splitInstance = null
    }
  }

  onMounted(() => {
    animate()
  })

  onBeforeUnmount(() => {
    cleanup()
  })

  return {
    elementRef,
    animate,
    replay,
    cleanup
  }
}

export function useMaskedLetter(options = {}) {
  const elementRef = ref(null); // Ref to be bound to the HTML element
  let splitInstance = null; // Stores the SplitText instance

  // Default animation options, merged with any provided options
  const defaultOptions = {
    duration: 1,
    yPercent: "random([-150, 150])", // Random Y offset
    xPercent: "random([-150, 150])", // Random X offset
    staggerAmount: 0.6, // Stagger amount for individual characters
    ease: "power3.out",
    delay: 0,
    timeScaleOnReplay: 0.5, // Time scale when replaying
    // Custom options for SplitText type and class if needed
    splitType: "chars, words",
    splitMask: "chars",
    charsClass: "char", // Class applied to each character span
    ...options
  };

  /**
   * Initializes the SplitText instance and plays the initial animation.
   * This is automatically called on component mount.
   */
  const animate = () => {
    // Only proceed if the element is available in the DOM
    if (!elementRef.value) {
      console.warn("Element ref not found for useMaskedLetter animation.");
      return;
    }

    // Ensure fonts are ready before creating SplitText for accurate layout
    document.fonts.ready.then(() => {
      // Set initial opacity to 1 once fonts are loaded and before split
      gsap.set(elementRef.value, {
        opacity: 1
      });

      // Create SplitText instance on the element
      splitInstance = SplitText.create(elementRef.value, {
        type: defaultOptions.splitType,
        mask: defaultOptions.splitMask,
        charsClass: defaultOptions.charsClass,
        onSplit: (self) => {
          // Animate the individual characters
          gsap.from(self.chars, {
            duration: defaultOptions.duration,
            yPercent: defaultOptions.yPercent,
            xPercent: defaultOptions.xPercent,
            stagger: {
              from: "random", // Stagger from a random character
              amount: defaultOptions.staggerAmount,
            },
            ease: defaultOptions.ease,
            delay: defaultOptions.delay,
          });
        }
      });
    });
  };

  /**
   * Replays the animation from the start.
   * @param {number} timeScale - The time scale to apply to the animation. Defaults to defaultOptions.timeScaleOnReplay.
   */
  const replay = (timeScale = defaultOptions.timeScaleOnReplay) => {
    if (splitInstance && splitInstance.chars) {
      // Re-create the animation tween to play from scratch
      const tl = gsap.from(splitInstance.chars, {
        duration: defaultOptions.duration,
        yPercent: defaultOptions.yPercent,
        xPercent: defaultOptions.xPercent,
        stagger: {
          from: "random",
          amount: defaultOptions.staggerAmount,
        },
        ease: defaultOptions.ease,
      });
      tl.timeScale(timeScale).play(0); // Set timeScale and play from the beginning
    } else {
      console.warn("SplitText instance or characters not found for replay. Ensure animate() was called.");
    }
  };

  /**
   * Cleans up the SplitText instance and any related GSAP tweens.
   * This is automatically called when the component unmounts.
   */
  const cleanup = () => {
    if (splitInstance) {
      splitInstance.revert(); // Reverts the HTML back to its original state
      splitInstance = null; // Clear the instance
    }
  };

  // Lifecycle hooks for Vue composable
  onMounted(() => {
    animate();
  });

  onBeforeUnmount(() => {
    cleanup();
  });

  // Return the element ref and control functions
  return {
    elementRef,
    animate,
    replay,
    cleanup
  };
}