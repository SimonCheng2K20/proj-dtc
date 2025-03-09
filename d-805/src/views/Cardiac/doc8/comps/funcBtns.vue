<template>
  <div>
    <b-button v-for="btn in btns.filter(({key})=>key!=='confirm')" :key="btn.key" class="mr-1" size="sm" @click.stop="btnEvent(btn.key)">
      <font-awesome-icon :icon="btn.img" />
      {{btn.label}}
    </b-button>

    <b-button variant="white" size="sm">
      <b-img width="16" :src="require('@/assets/imgs/tick.png')" />
      認證
    </b-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      btns: [
        {label: '歷史', key: 'history', img: 'monument'},
        {label: '設定', key: 'setting', img: 'cog'},
        {label: 'PACS', key: 'pacs', img: 'images'},
        {label: '暫存', key: 'save', img: 'save'},
        {label: '認證', key: 'confirm', img: 'check'}
      ]
    }
  },
  methods: {
    btnEvent(key) {
      if(key==='save') this.$emit('savingEvent');
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.btn.btn-secondary {
  background-color: #C9E6FF;
  color: black;
  border: none;
}
</style>
