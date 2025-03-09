import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { useToast } from 'vue-toastification'
import mitt from 'mitt'
import { watch } from 'vue'

const toast = useToast()

const getState = () => ({
  connection: null,
  isConnecting: true,
  emitter: mitt(),
})

export default {
  namespaced: true,
  state: getState(),
  actions: {
    async connectChatHub({ state, dispatch }) {
      state.connection = new HubConnectionBuilder()
        .withUrl(process.env.NODE_ENV === 'development' ? 'https://rmeeting.datacom.com.tw/ChatHub' : '/ChatHub', {
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

        console.log('connectChatHub')

        state.connection.on('AttachChanged', (message) => {
          console.log('onAttachChanged:', message)
          state.emitter.emit('AttachChanged', message)
        })

        state.connection.on('NewChat', (message) => {
          console.log('onNewChat:', message)
          state.emitter.emit('NewChat', message)
        })

        toast.success('聊天室已連線', {
          timeout: 5000,
          hideProgressBar: true,
        })
      } catch (err) {
        console.log(err)
        toast.error('聊天室連線發生錯誤', {
          timeout: 3000,
          hideProgressBar: true,
        })
      }
    },
    async invokeJoin({ state }, id) {
      const join = async () => {
        try {
          await state.connection.invoke('Join', id)
        } catch (err) {
          console.log(err)
          toast.error('加入聊天室發生錯誤', {
            timeout: 3000,
            hideProgressBar: true,
          })
        }
      }

      // 斷線重連再重送一遍，避免錯誤所有流程就中斷
      if (state.connection.state === 'Connected') {
        await join()
      } else {
        await new Promise((resolve) => {
          const unwatch = watch(
            () => state.connection.state,
            async (val) => {
              if (val === 'Connected') {
                await join()
                unwatch()
                resolve()
              }
            }
          )
        })
      }
    },
    async invokeExit({ state }, id) {
      const exit = async () => {
        try {
          await state.connection.invoke('Exit', id)
        } catch (err) {
          console.log(err)
          toast.error('離開聊天室發生錯誤', {
            timeout: 3000,
            hideProgressBar: true,
          })
        }
      }

      // 斷線重連再重送一遍，避免錯誤所有流程就中斷
      if (state.connection.state === 'Connected') {
        await exit()
      } else {
        await new Promise((resolve) => {
          const unwatch = watch(
            () => state.connection.state,
            async (val) => {
              if (val === 'Connected') {
                await exit()
                unwatch()
                resolve()
              }
            }
          )
        })
      }
    },
    async invokeSendMessage({ state }, [id, message]) {
      const sendMessage = async () => {
        try {
          await state.connection.invoke('SendMessage', id, message)
        } catch (err) {
          console.log(err)
          toast.error('發送訊息發生錯誤', {
            timeout: 3000,
            hideProgressBar: true,
          })
        }
      }

      // 斷線重連再重送一遍，避免錯誤所有流程就中斷
      if (state.connection.state === 'Connected') {
        await sendMessage()
      } else {
        await new Promise((resolve) => {
          const unwatch = watch(
            () => state.connection.state,
            async (val) => {
              if (val === 'Connected') {
                await sendMessage()
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
