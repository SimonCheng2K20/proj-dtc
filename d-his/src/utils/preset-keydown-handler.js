import { ref, isRef } from 'vue'
import { onClickOutside } from 'utils/onClickOutside.js'
import { useQuasar } from 'quasar'
import { cloneDeep } from 'lodash-es'

export const usePresetKeydown = ({ presetItems: itemsMaybeRef, target, callback }) => {
  const $q = useQuasar()
  const isFocus = ref(false)
  const onFocus = () => {
    if (isFocus.value) return

    onClickOutside(target, () => {
      isFocus.value = false
      window.removeEventListener('keydown', onPresetKeydown)
    })

    isFocus.value = true
    window.addEventListener('keydown', onPresetKeydown)
  }

  const keyUpHandler = ref(null)
  const keying = ref([])
  const onPresetKeydown = (evt) => {
    const key = evt.key
    const presetItems = isRef(itemsMaybeRef) ? itemsMaybeRef.value : itemsMaybeRef

    if (keying.value.map((item) => item.toLocaleUpperCase()).includes(key.toLocaleUpperCase())) {
      return
    }

    keying.value.push(key)

    // Shift + 任意鍵組合會自動觸發 keyup
    const addKeyupEvent = () => {
      keyUpHandler.value = window.addEventListener(
        'keyup',
        () => {
          keyUpHandler.value = null
          if (evt.key === 'Shift') {
            // Shift + 任意鍵組合會自動觸發 keyup
            addKeyupEvent()
          } else {
            keying.value = []
          }
        },
        { once: true }
      )
    }

    if (!keyUpHandler.value) addKeyupEvent()

    const item = presetItems.find((item) =>
      item.Shortcut && item.Shortcut.length > 0
        ? item.Shortcut.toLocaleUpperCase() === keying.value.join(',').toLocaleUpperCase()
        : false
    )

    if (item) {
      evt.preventDefault()
      callback(cloneDeep(item))
    }
  }

  return { isFocus, onFocus }
}

