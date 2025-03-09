<template>
  <div class="reputations">
    <div v-for="item in items" :key="item.title" class="pt-5 reputation mb-2" :style="`background-image: url('homeMobile_image/${item.img}')`">
      <div v-text="item.title" class="px-5 item-title mb-3 text-light" />
      <div class="item-list p-2" :class="{'d-grid multiple': item.list.length > 3}">
        <div v-for="(li,idx) in item.list" :key="li" v-text="`${idx+1}. ${li}`" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      items: [
        { title: '專利技術', img: 'copyright_img.png', list: ['醫療影像資料搬取整合装置', '遠距醫療無線偵測系統', '手術影像無線傳输紀錄及管理系統', '門診報到装置及門診報到系统專利','手術房影條傳输管理系統及使用其之醫療管理系統專利'] },
        { title: '國際證照及品質', img: 'quality_img.png', list: ['IS0 9001認證','GMP及FDAClass II認證','資料庫證照(Oracle,SQL)3張','網路系統(CCNA等)4張','伺服器及系統專業證照(MCP,MCSE,MCSA等)14張','磁碟陣列(EMC)1張'] },
        { title: '獲獎紀錄', img: 'prize_img.png', list: ['醫學影像軟體獲得國家優良商品金牌獎', '2018第一屆總統盃黑客松軟體創新大賽優良團隊前五名'] }
      ]
    }
  }
}




</script>

<style lang="scss">
.reputations {
  .reputation {
    background: transparent no-repeat center center / cover;
    padding-bottom: 1px;
  }
  .item-list {
    background-color: rgba(20, 0, 110, 0.75);
    font-size: 0.75rem;
    min-height: 80px;
    align-items: start;
  }
  .item-title {
    font-size: 1.5rem;
    text-shadow: 0 0 5px #000;
  }

  .reputation:nth-child(even) .item-title {
    text-align: right;
  }

  .reputation:nth-child(2n) .item-list {
    background-color: rgba(67, 78, 0, 0.75);
  }

  .reputation:nth-child(3n) .item-list {
    background-color: #0f7d58c5
  }
}

.d-grid {
  display: grid;
}

.multiple {
  grid-template-columns: repeat(2, 1fr);
}

</style>
