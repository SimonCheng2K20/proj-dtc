import dayjs from 'dayjs'
import { ref } from 'vue'

const useIdle = (timeout = 5000) => {
  const defaultEvents = ['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel']
  let idle = ref(false)
  let lastActive = ref(dayjs().unix())

  let timer
  const onEvent = () => {
    idle.value = false
    lastActive.value = dayjs().unix()
    clearTimeout(timer)
    timer = setTimeout(() => (idle.value = true), timeout)
  }

  const onVisibilitychange = () => {
    if (!document.hidden) {
      onEvent()
    }
  }

  for (const event of defaultEvents) {
    window.addEventListener(event, onEvent, { passive: true })
  }

  window.addEventListener('visibilitychange', onVisibilitychange)

  timer = setTimeout(() => (idle.value = true), timeout)

  useIdle.remove = () => {
    for (const event of defaultEvents) {
      window.removeEventListener(event, onEvent)
    }
    window.removeEventListener('visibilitychange', onVisibilitychange)
  }

  return { idle, lastActive }
}

export default useIdle
