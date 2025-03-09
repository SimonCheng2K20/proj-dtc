<template>
  <div>
    
    <div class="d-flex">
      <!-- <div class="week text-vlr p-2 border-bottom border-right">週別</div> -->
      <div class="flex-1 d-grid " :class="{'data-column': isMonit, 'data-column-print': !isMonit}">
        <div class="d-flex align-items-center justify-content-center grid-span-2 border-bottom" style="grid-row: 1 / span 2;">類別</div>
        
        <div class="grid-span-2 border-left border-bottom p-2" :class="{'monitHide' : tIdx === 1 && isMonit}" v-for="(text, tIdx) in ['門診', 'opd緊急個案', '住院']" :key="'h' +tIdx" v-text="text" />
        <div class="border-left border-bottom d-flex justify-content-center align-items-center" style="grid-row: span 2;">備註</div>

        <template v-for="k in 3">
          <div :key="k+'d'" :class="{'monitHide' : k === 2 && isMonit}" class="border-left border-bottom py-2">可排最快天數</div>
          <div :key="k+'v'" :class="{'monitHide' : k === 2 && isMonit}" class="border-left border-bottom d-flex align-items-center justify-content-center">閾值</div>
        </template>
      </div>
    </div>

    <div v-if="isLoading" class="w-100 d-flex justify-content-center align-items-center" style="height: 30vh;">
      <b-spinner label="Spinning" />
    </div>

    <div class="d-flex" v-else>
      <!-- <div class="week text-vlr p-2 border-bottom border-right d-flex justify-content-center align-items-center">　年　月　日　　第　週</div> -->
      <div class="flex-1 d-grid" :class="{'data-column': isMonit, 'data-column-print': !isMonit}">
        <template v-for="kind in kinds">
          <div v-text="kind.text" :key="kind.text"  class="d-flex justify-content-center align-items-center border-bottom" :style="`grid-row:  span ${kind.items.length};`" />
          <template v-for="(item, tIdx) in kind.items">
            <div class="border-left border-bottom d-flex justify-content-center align-items-center" v-text="item.sText" :key="kind.text + '_' + tIdx + '_' + item.sText" />
            
            <template v-for="i in 3">
              <div class="border-left border-bottom d-flex justify-content-center align-items-center" :class="{'text-danger': parseInt(item['day' + i]) > item['value' + i], 'monitHide': i === 2 && isMonit}" v-text="item['day' + i]" :key="kind.text + '_' + tIdx + '_' + item.sText + 'day' + i " />
              <div class="border-left border-bottom d-flex justify-content-center align-items-center" :class="{'monitHide' : i === 2 && isMonit}" v-text="item['value' + i]" :key="kind.text + '_' + tIdx + '_' + item.sText + 'value' + i" />
            </template>

            <div class="border-left border-bottom" v-text="item.remark" :key="kind.text + '_' + item.sText + '_' + tIdx + 'remark'" />
          </template>
        </template>
      </div>
    </div>
  </div>

</template>

<script>
  export default {
    props: {
      isMonit: {
        type: Boolean,
        default: true
      },
      isLoading: {
        type: Boolean,
        default: false
      },
      kinds: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {

      }
    } 
  }
</script>

<style lang="scss" scoped>
.data-column-print {
  grid-template-columns: 120px 240px 2fr 1fr 2fr 1fr 2fr 1fr 220px;
}

.data-column {
  grid-template-columns: 120px 240px 2fr 1fr 2fr 1fr 220px;
}

.text-vlr {
  writing-mode: vertical-lr;
}
.report {
  .kind {
    min-width: 300px;
  }
  .remark {
    min-width: 220px;
  }
}

.monitHide {
  display: none !important;
}
</style>
