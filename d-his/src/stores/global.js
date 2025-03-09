import { defineStore } from 'pinia'
import useIdle from 'utils/use-idle.js'
import { watch, ref } from 'vue'
import { Dialog } from 'quasar'
import TimeCountdown from 'components/TimeCountdown.vue'
import mitt from 'mitt'

export const useGlobalStore = defineStore('global', {
  state: () => ({
    idle: ref(false),
    isSetIdle: false,

    emitter: mitt(),
  }),

  actions: {
    startCheckIsActive() {
      const isLongTimeLogin = sessionStorage.getItem('isLongTimeLogin')
      const { idle } = useIdle(isLongTimeLogin === 'true' ? 24 * 60 * 60 * 1000 : 10 * 60 * 1000)

      this.idle = idle

      this.isSetIdle = true

      watch(idle, (val) => {
        if (val) {
          Dialog.create({
            component: TimeCountdown,
          })
        }
      })
    },
    endCheckIsActive() {
      this.isSetIdle = false
      useIdle.remove()
    },
  },
})

