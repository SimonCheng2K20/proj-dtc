import moment from 'moment'

const useIdle = (timeout = 5000) => {
  const defaultEvents = ['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel']
  const data = {
    idle: false,
    lastActive: moment().unix(),
  }

  let timer
  const onEvent = () => {
    data.idle = false
    data.lastActive = moment().unix()
    clearTimeout(timer)
    timer = setTimeout(() => (data.idle = true), timeout)
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

  timer = setTimeout(() => (data.idle = true), timeout)

  useIdle.remove = () => {
    for (const event of defaultEvents) {
      window.removeEventListener(event, onEvent)
    }
    window.removeEventListener('visibilitychange', onVisibilitychange)
  }

  return data
}

export default useIdle
