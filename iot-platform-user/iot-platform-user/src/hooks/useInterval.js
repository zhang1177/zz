// src/hooks/useInterval.js
import { onUnmounted } from 'vue'

export function useInterval() {
  const timers = []

  const startInterval = (fn, interval) => {
    const timer = setInterval(fn, interval)
    timers.push(timer)
    return timer
  }

  const clearAllIntervals = () => {
    timers.forEach(timer => clearInterval(timer))
    timers.length = 0
  }

  onUnmounted(() => {
    clearAllIntervals()
  })

  return {
    startInterval,
    clearAllIntervals
  }
}
