import { defineComponent, markRaw, h, getCurrentInstance } from 'vue'
import { useDialogPluginComponent, QPage, QDialog } from 'quasar'
import MyDialogContent from './MyDialogContent.vue'

export default markRaw(
  defineComponent({
    props: {
      /**
       * @param { String } wrapperType - valid value: 'page', 'dialog'
       * @param { Object } myDialogContentProps - see components/MyDialogContent.vue
       */

      wrapperType: String,

      myDialogContentProps: Object,
    },
    setup(props, { slots, attrs }) {
      return () => {
        const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

        const { proxy } = getCurrentInstance()

        // expose public methods
        Object.assign(proxy, { onDialogOK, onDialogCancel })

        switch (props.wrapperType) {
          case 'page': {
            return h(QPage, attrs, () => slots.default())
          }
          case 'dialog': {
            const qDialogProps = {
              ref: dialogRef,
              'no-backdrop-dismiss': true,
            }
            Object.assign(qDialogProps, attrs)

            const myDialogContentProps = {
              onClose: onDialogCancel,
            }
            Object.assign(myDialogContentProps, props.myDialogContentProps)

            return h(QDialog, qDialogProps, () =>
              h(MyDialogContent, myDialogContentProps, {
                default: () => slots.default(),
                actions: () => (slots.actions ? slots.actions({ onDialogOK, onDialogCancel }) : null),
              })
            )
          }
          default: {
            return h('div', null, slots.default())
          }
        }
      }
    },
  })
)

