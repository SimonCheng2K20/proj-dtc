<template>
  <b-card-header
    class="bg-warning text-dark cardHeader btn-right d-flex justify-content-between align-items-center py-1"
  >
    <div class="font-weight-bold">
      報告撰寫作業
      <span @click="$emit('showCallLab')"></span>
    </div>
    <toggleWork
      style="
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        flex-grow: 1;
        justify-content: center;
        align-content: center;
        align-items: center;
        margin: 0 auto;
      "
    />
    <div @click="$emit('WinConfigOpen')" class="mr-2 text-black cursor-pointer" v-if="HotkeyList.length">
      <font-awesome-icon icon="cog" />
      Hotkey設定
    </div>
    <!-- <div>
      <font-awesome-icon
        icon="question"
        class="mr-1 cursor-pointer"
        hidden
        @click="$emit('HelpShow')"
      />
    </div> -->
  </b-card-header>
</template>

<script>
import toggleWork from '@/components/report/toggleWork'
export default {
  props: {
    HotkeyList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    toggleWork,
  },
}
</script>
