import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { useToast } from 'vue-toastification'
import mitt from 'mitt'
import { watch } from 'vue'

const toast = useToast()

const tOptions = (to = 2000, hpb = true, coc = true) => {
  return {
    timeout: to,
    hideProgressBar: hpb,
    closeOnClick: coc,
  }
}

const getState = () => ({
  connection: null,
  isConnecting: true,
  emitter: mitt(),
})

export default {
  namespaced: true,
  state: getState(),
  actions: {
    async connectMeetingHub({ state, dispatch }) {
      state.connection = new HubConnectionBuilder()
        .withUrl(process.env.NODE_ENV === 'development' ? 'https://rmeeting.datacom.com.tw/MeetingHub' : '/MeetingHub', {
          accessTokenFactory: () => sessionStorage.getItem('token'),
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build()

      state.connection.onreconnecting(() => {
        toast.info('重新連線中', tOptions())
      })

      state.connection.onreconnected(() => {
        toast.success('會診作業已連線', tOptions())
      })

      await dispatch('start')
    },
    async start({ state }) {
      try {
        await state.connection.start()

        state.connection.on('StatusChanged', (message) => {
          console.log('onStatusChanged:', message)
          state.emitter.emit('StatusChanged', message)
        })

        state.connection.on('CloudReady', (message) => {
          console.log('onCloudReady:', message)
          state.emitter.emit('CloudReady', message)
        })

        toast.success('會診作業已連線', tOptions())
      } catch (err) {
        console.log(err)
        toast.error('會診作業連線發生錯誤', tOptions())
      }
    },
    async invokeJoinMeeting({ state }, [id, isLook]) {
      const joinMeeting = async () => {
        try {
          await state.connection.invoke('JoinMeeting', id, isLook)
        } catch (err) {
          console.log(err)
          toast.error('加入會診作業發生錯誤', tOptions())
        }
      }

      // 斷線重連再重送一遍，避免錯誤所有流程就中斷
      if (state.connection.state === 'Connected') {
        await joinMeeting()
      } else {
        await new Promise((resolve) => {
          const unwatch = watch(
            () => state.connection.state,
            async (val) => {
              if (val === 'Connected') {
                await joinMeeting()
                unwatch()
                resolve()
              }
            }
          )
        })
      }
    },
    async invokeCancelSheet({ state }, id) {
      const cancelSheet = async () => {
        try {
          await state.connection.invoke('CancelSheet', id)
        } catch (err) {
          console.log(err)
          toast.error('抽回會診單發生錯誤', tOptions())
        }
      }

      // 斷線重連再重送一遍，避免錯誤所有流程就中斷
      if (state.connection.state === 'Connected') {
        await cancelSheet()
      } else {
        await new Promise((resolve) => {
          const unwatch = watch(
            () => state.connection.state,
            async (val) => {
              if (val === false) {
                await cancelSheet()
                unwatch()
                resolve()
              }
            }
          )
        })
      }
    },
    async invokeCloseMeeting({ state }, id) {
      const closeMeeting = async () => {
        try {
          await state.connection.invoke('CloseMeeting', id)
        } catch (err) {
          console.log(err)
          toast.error('結束會診發生錯誤', {
            timeout: 3000,
            hideProgressBar: true,
          })
        }
      }

      // 斷線重連再重送一遍，避免錯誤所有流程就中斷
      if (state.connection.state === 'Connected') {
        await closeMeeting()
      } else {
        await new Promise((resolve) => {
          const unwatch = watch(
            () => state.connection.state,
            async (val) => {
              if (val === false) {
                await closeMeeting()
                unwatch()
                resolve()
              }
            }
          )
        })
      }
    },
    init({ state }) {
      const __state = getState()
      state.connection = __state.connection
      state.emitter = __state.emitter
    },
  },
}
