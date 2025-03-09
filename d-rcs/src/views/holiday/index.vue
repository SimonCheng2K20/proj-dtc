<template>
  <div class="holiday-page">
    <h4 style="margin-top: 0;">{{ pageName }}</h4>
    <div class="maintain-area custom-scroll-bar">
      <div class="maintain-inputs">
        <filterField :columns="holidayInputs" :filterData="itemData" :enableParams="false" :gridNum="1" :showBtns="false">
          <div class="btns">
            <Button class="p-button-sm">關閉</Button>
            <Button @click.stop="holidayInputEvent('reset')" class="p-button-sm p-button-warning">還原</Button>
            <Button class="p-button-sm p-button-danger">儲存</Button>
          </div>
        </filterField>

        <!-- <div>{{ period.currentMonth }}</div> -->

        <div class="text-2xl text-gray-900 font-bold mt-4 mb-2">選擇排班醫師</div>
        <div class="doctors">
          <div class="doctor" v-for="doctor in doctors" :key="doctor" draggable="true" @dragstart="e => { handleDragEvent(e.target.innerText) }" @dragend="handleDragEvent()">
            <div v-text="doctor" class="name" />
            <div class="bar"></div>
          </div>
        </div>

      </div>
      <div class="flex-1 maintain-field">
        
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="buttons whitespace-nowrap mr-2">
              <Button class="p-button-sm prev-week" @click.stop="changeWeekEvent(false)">
                <i class="pi pi-angle-left" />
              </Button>

              <Button class="p-button-sm next-week" @click.stop="changeWeekEvent()">
                <i class="pi pi-angle-right" />
              </Button>
            </div>
            <div class="w-72">
              <Dropdown class="selection w-full" v-model="period.currentWeek.value" :options="period.weeks.month.map(({ show, value }) => ({ text: show, value }))" optionValue="value" optionLabel="text" />
            </div>
          </div>

          <div class="flex buttons">
            <Button class="p-button-outlined">今天</Button>
            <div class="border-r-2 mx-2" />
            <Button class="p-button-outlined">週</Button>
            <Button class="p-button-outlined">月</Button>
          </div>
        </div>

        <tableField class="p-1" :columns="holidayColumns" :itemsData="holidayData" :showPagination="false" thSize="text-lg">
          <template v-slot:titleCustom1="{ params }">
            <div class="table-at">
              <div class="week">星期</div>
              <div class="timing">時段</div>
            </div>
          </template>

          <template v-for="(slot, sIdx) in slots" v-slot:[slot]="{ params }">
            <members :key="sIdx" :items="params.item.items[holidayColumns[params.colIndex].date]" :timeAt="params.item" :dateAt="holidayColumns[params.colIndex]" @add="addNewMemberEvent" @remove="removeMemberEvent" />
          </template>
        </tableField>
      </div>
    </div>
    <modalField
      :modalData="dialogData" title="新增醫師"
      :columns="modalColumns"
      :filterData="draggedData"
      :gridNum="1"
      @confirm="modalConfirmEvent"
    />
  </div>
</template>

<script>
import tableField from "comps/datafields/tables.vue"
import filterField from "comps/datafields/filters.vue"
import usePeriod from 'Service/usePeriod.js'
import { useRoute } from 'vue-router'
import { ref, reactive, computed } from 'vue'
import modalField from "comps/datafields/modal.vue";
import dayjs from 'dayjs'
import members from './members.vue'
export default {
  components: { tableField, filterField, members, modalField },
  setup () {
    const period = usePeriod()
    const route = useRoute()
    const pageName = route.meta.title
    const itemData = ref({ data: { year: period.currentYear, month: period.currentMonth } });
    const doctors = new Array(10).fill(1).map((v, i) => `Doctor.${v + i}`)
    const slots = new Array(7).fill(1).reduce((acc, v, i) => ({ ...acc, [`custom${v + i}`]: `custom${v + i}` }), {})
    const dialogData = reactive({ show: false, showBtns: true });
    

    const draggedData = ref({ data: { at: '', date: '', title: '', doctor: ''} });
   
    const holidayData = reactive({ items: [
      { titleCustom1: '上午 09:00 ~ 12:00', items: {20211107: ['Doctor.1', 'Doctor.2', 'Doctor.3', 'Doctor.6', 'Doctor.7', 'Doctor.8']} },
      { titleCustom1: '下午 12:00 ~ 18:00', items: {} },
      { titleCustom1: '晚上 18:00 ~ 21:00', items: {} }
    ], total: 0, per: 5 })
    const generateOptions = (list) => list.map(value => ({ value, text: value }))
    const holidayInputs = [
      { label: '選擇年份', key: 'year', type: 'select', options: new Array(10).fill(new Date().getFullYear()).map((v, idx) => { const value = v - idx; return { text: value, value } }) },
      { label: '選擇月份', key: 'month', type: 'select', options: new Array(12).fill(1).map((v, idx) => { const value = v + idx; return { text: value, value } }) },
      { label: '縣市', key: 'city', type: 'select', options: generateOptions(['臺北市', '新北市', '桃園市', '臺中市', '臺南市', '高雄市', '基隆市', '新竹市', '嘉義市', '新竹縣', '苗栗縣', '彰化縣', '南投縣', '雲林縣', '嘉義縣', '屏東縣', '宜蘭市', '花蓮縣', '臺東縣', '澎湖縣']) },
      { label: '責任醫院', key: 'hospital', type: 'select', options: generateOptions(['臺北榮民總醫院蘇澳分院', '天主教靈醫會醫療財團法人礁溪杏和醫院', '宜蘭仁愛醫療財團法人宜蘭仁愛醫院', '天主教靈醫會醫療財團法人羅東聖母醫院', '國立陽明交通大學附設醫院', '醫療財團法人羅許基金會羅東博愛醫院', '三軍總醫院基隆分院附設民眾診療服務處', '醫療財團法人臺灣區煤礦業基金會臺灣礦工醫院', '衛生福利部基隆醫院', '長庚醫療財團法人基隆長庚紀念醫院']) },
    ]
    const holidayColumns = computed(() => [{ key: 'titleCustom1', label: '' }].concat(period.days.week.map((item, index) => ({ label: item.show, key: `custom${index + 1}`, type: 'text', date: dayjs(item.date).format('YYYYMMDD') }))))
    
    const modalColumns = [
      { key: "at", label: "日期", type: "date" },
      { key: "title", label: "時段", type: "text" },
      { key: "doctor", label: "醫師", type: "select", options: doctors.map(value => ({ text: value, value })) },
    ];

    const getHolidayCol = ({ title, date }) => {
      const _col = holidayData.items.find(({ titleCustom1 }) => title === titleCustom1)
      if (!_col) return null
      if (!_col.items[date]) _col.items[date] = []
      return _col
    }
    
    function changeWeekEvent (add = true) {
      period[ add ? 'nextWeekEvent' : 'prevWeekEvent']()
    }

    function holidayInputEvent (type) {
      if (!type) return
      else if (type === 'reset') {
        itemData.value.data.year = new Date().getFullYear()
        itemData.value.data.month = new Date().getMonth() + 1
      }
    }

    function addNewMemberEvent (data) {
      const holidayCol = getHolidayCol(data)
      if (!holidayCol) return
      if (draggedData.value.data.doctor) {
        if (!holidayCol.items[data.date].some(v => v === draggedData.value.data.doctor)) {  // 有重覆 就刪除
          holidayCol.items[data.date].push(draggedData.value.data.doctor)
        }
        draggedData.value.data = {}
      } else {
        draggedData.value.data = { ...draggedData.value.data, ...data, at: dayjs(data.date).$d }
        setTimeout(() => {
          dialogData.show = true
        }, 200)
      }
      // console.log(data.date.match(/^(\d{4})(\d{2})(\d{2})$/))
    }

    function handleDragEvent (name = null) {
      draggedData.value.data.doctor = name
    }

    function modalConfirmEvent (data) {
      draggedData.value.data.doctor = data.doctor
      addNewMemberEvent ({ ...data, date: dayjs(data.at).format('YYYYMMDD') })
    }

    function removeMemberEvent (data) {
      const holidayCol = getHolidayCol(data)
      if (!holidayCol) return
      holidayCol.items[data.date] = holidayCol.items[data.date].filter(doctor => doctor != data.doctor)
    }
    
    return { 
      pageName, itemData, holidayInputs, holidayData, holidayColumns, doctors, period, slots, dialogData, modalColumns, draggedData,
      changeWeekEvent, holidayInputEvent, addNewMemberEvent, handleDragEvent, modalConfirmEvent, removeMemberEvent
    }
  }
}
</script>

<style lang="scss" scoped>
@mixin random-bgr(){
  background: rgb(random(255), random(255), random(255));
}
.holiday-page {
  @apply flex flex-col;
  .maintain-area {
    @apply flex-1 flex px-2 py-1  overflow-y-auto;
  }
  .maintain-inputs {
    @apply p-2 w-72;
    .btns {
      @apply flex justify-between px-1 mt-2 items-start;
    }
  }
  .buttons {
    ::v-deep(.p-button) {
      @apply mx-1;
    }
  }

  ::v-deep(.filter-columns .column) {
    grid-template-columns: 100px 1fr !important;
    .condition-title {
      justify-content: start !important;
      align-items: start;
      padding: 10px 0 0 10px;
    }
  }
  ::v-deep(.p-dropdown-label.p-inputtext) {
    white-space: normal;
    @apply w-full;
  }
  ::v-deep(.filters-fields) {
    margin-top: 0;
    .filter-columns {
      @apply p-0;
    }
  }

  ::v-deep(.fields .th:nth-child(1)) {
    @apply px-0 py-0;
  }

  ::v-deep(.fields .td) {
    @apply p-1;
  }

  ::v-deep(.fields .td:nth-child(8n+1)), ::v-deep(.fields > div.th) {
    background-color: #F1F9E7 !important;
  }

  .table-at {
    @apply w-full h-full relative ;
    &::before {
      content: '';
      @apply w-full h-full bg-white block;
      clip-path: polygon(0% 2%,2% 0%,100% 98%,98% 100%);
    }
    .week {
      @apply absolute right-2 top-0 text-lg;
    }
    .timing {
      @apply absolute left-2 bottom-0 text-lg;
    }
  }
  
  
  .doctors {
    .doctor {
      @apply flex items-center py-1 px-3;
      border-top: 1px solid rgb(204, 190, 190);
      > div.name {
        @apply text-xl text-indigo-900 w-24;
      }
      > div.bar {
        @apply flex-1 rounded-3xl  my-1 h-4;
      }
      // $colors: #ff0000, #00ff00, #0000ff;
      // @each $color in $colors {
      // @for $i from 1 through length($colors) {
      //   &:nth-child(#{$i}n) div.bar {
      //     background-color: nth($colors, $i)
      //   }
      // }
      @for $i from 1 through 10 {
        &:nth-child(#{$i}n) div.bar {
          @include random-bgr();
        }
      }
      &[draggable=true] {
        cursor: pointer;
      }  
    }
  }
  
}

::v-deep(.members ) {
  @apply w-full;
  .member {
    @apply border w-full mb-1 rounded-lg text-white;
    @for $i from 1 through 10 {
      &:nth-child(#{$i}n) {
        @include random-bgr();
      }
    }
  }
}

</style>
