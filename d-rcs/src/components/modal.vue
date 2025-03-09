<template>
  <div>
    <Dialog class="custom-modal custom-scroll-bar" v-model:visible="modelValue.show" :draggable="false" modal :breakpoints="{ '960px': '75vw', '640px': '95vw' }" :style="`width: ${modalWidth}; max-width: 1536px;`" :closable="false">
      <template #header>
        <div class="flex items-center w-full">
          <h3 class="flex-1" v-text="modelValue.title" />
          <!-- <h3>{{ modelValue }} </h3> -->
          <Button class="p-button-sm p-button-text" @click.stop="buttonEvent('cancel')" style="transform: translateX(20px);"><i class="pi pi-times text-white" /></Button>
        </div>
      </template>
      <slot />
      <template #footer v-if="showFooter">
        <template v-if="showButtons">
          <Button @click.stop="buttonEvent('cancel')">取消</Button>
          <Button @click.stop="buttonEvent('confirm')">確認</Button>
        </template>
        <slot name="footer"></slot>
      </template>
    </Dialog>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Object
    },
    width: {
      type: [String, Number],
      default: '450px'
    },
    showButtons: {
      type: Boolean,
      default: true
    },
    showFooter: {
      type: Boolean,
      default: true
    }
  },
  setup (props, { emit }) {
    const modalWidth = typeof props.width === 'number'
      ? props.width + 'px'
      : typeof props.width === 'string' && !['px', 'vw', 'vh'].some( unit => props.width.includes(unit))
        ? props.width + 'px'
        : props.width;
    function buttonEvent (key) {
      if (key === 'cancel') {
        emit('update:modelValue', { show: false })
        emit('cancel')
      } else if (key === 'confirm') {
        emit('confirm')
      }
    }

    return { modalWidth, buttonEvent }
  }
}
</script>
