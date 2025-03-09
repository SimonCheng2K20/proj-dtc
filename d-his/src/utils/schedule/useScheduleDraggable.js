import { ref } from 'vue'
import { cloneDeep } from 'lodash-es'

export const useScheduleDraggable = () => {
  const clone = () => undefined

  const originData = ref(null)
  let cancelCallback = null

  const start = ({ data, onCancel }) => {
    originData.value = data
    cancelCallback = onCancel
  }

  const targetData = ref(null)
  const targetItems = ref(null)
  const move = (evt) => {
    const attrs = evt.relatedContext.component.$attrs
    targetData.value = {
      AsignDate: attrs.AsignDate.format(),
      TimeSlotNo: attrs.TimeSlotNo,
    }
    targetItems.value = evt.relatedContext.list
  }

  const end = (evt, callback) => {
    if (evt.to !== evt.from) {
      const find = targetItems.value.find((item) => item.PersonId === originData.value.PersonId)
      if (find) {
        $q.notify({
          type: 'negative',
          position: 'top',
          message: originData.value.Name + '已存在該排班時段',
        })
      } else {
        callback({
          originData: cloneDeep(originData.value),
          targetData: cloneDeep(targetData.value),
          okCallback: (item) => {
            targetItems.value.push(item)
          },
          cancelCallback: cancelCallback,
        })
      }
    }
  }

  return { clone, start, move, end }
}

