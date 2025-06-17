import { ref, readonly, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

export function useIdleRedirect(timeoutMs = 30000, redirectPath = '/') {
  const router = useRouter()
  const isIdle = ref(false)
  const timeRemaining = ref(timeoutMs / 1000)
  
  let idleTimer = null
  let countdownTimer = null
  
  // Events that indicate user activity
  const activityEvents = [
    'mousedown',
    'mousemove',
    'keypress',
    'scroll',
    'touchstart',
    'click'
  ]
  
  const resetTimer = () => {
    isIdle.value = false
    timeRemaining.value = timeoutMs / 1000
    
    // Clear existing timers
    if (idleTimer) clearTimeout(idleTimer)
    if (countdownTimer) clearInterval(countdownTimer)
    
    // Set new idle timer
    idleTimer = setTimeout(() => {
      isIdle.value = true
      startCountdown()
    }, timeoutMs)
  }
  
  const startCountdown = () => {
    countdownTimer = setInterval(() => {
      timeRemaining.value--
      
      if (timeRemaining.value <= 0) {
        router.push(redirectPath)
      }
    }, 1000)
  }
  
  const addEventListeners = () => {
    activityEvents.forEach(event => {
      document.addEventListener(event, resetTimer, true)
    })
  }
  
  const removeEventListeners = () => {
    activityEvents.forEach(event => {
      document.removeEventListener(event, resetTimer, true)
    })
  }
  
  const startIdleDetection = () => {
    addEventListeners()
    resetTimer()
  }
  
  const stopIdleDetection = () => {
    removeEventListeners()
    if (idleTimer) clearTimeout(idleTimer)
    if (countdownTimer) clearInterval(countdownTimer)
    isIdle.value = false
  }
  
  // Auto-start when component mounts
  onMounted(() => {
    startIdleDetection()
  })
  
  // Clean up when component unmounts
  onUnmounted(() => {
    stopIdleDetection()
  })
  
  return {
    isIdle: readonly(isIdle),
    timeRemaining: readonly(timeRemaining),
    startIdleDetection,
    stopIdleDetection,
    resetTimer
  }
}