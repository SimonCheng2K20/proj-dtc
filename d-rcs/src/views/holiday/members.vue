<template>
  <div @drop="dragEvent" @dragenter.prevent @dragover.prevent class="w-full">
    <div v-if="items.length > 0" class="members">
      <div v-for="(item, index) in items" :key="index" class="member">
        <div class="w-6" />
        {{ item }}
        <div class="icon" @click.stop="removeItemEvent(item)">
          <i class="pi pi-times-circle" />
        </div>
      </div>
    </div>
    <div class="py-5" v-else>
      <Button class="p-button-text p-button-2xl font-bold text-blue-500" @click.stop="addMemberEvent"><i class="pi pi-plus" /></Button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => []
    },
    dateAt: {
      type: Object,
    },
    timeAt: {
      type: Object,
    }
  },
  setup (props, { emit }) {
    const periodValue = { 
      date: props.dateAt.date, 
      title: props.timeAt.titleCustom1
    }

    function addMemberEvent () {
      emit('add', periodValue)
    }

    function dragEvent (evt) {
      emit('add', periodValue)
    }

    function removeItemEvent (doctor) {
      emit('remove', { ...periodValue, doctor })
    }

    return { addMemberEvent, dragEvent, removeItemEvent }
  }
}
</script>

<style lang="scss" scoped>
.member {
  @apply flex items-start justify-between p-1;
  > .icon {
    @apply cursor-pointer bg-black rounded-full flex p-1;
  }
}
</style>
