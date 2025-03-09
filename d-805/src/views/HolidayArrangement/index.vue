<template>
  <div class="holiday-arrangement">

    <page-title title="假日設定作業" img="file-alt" class="mb-4">
      <b-button class="ml-auto mr-2" size="sm" variant="primary" @click.stop="showNationHoliday">國定假日</b-button>
    </page-title>
    
    <div class="calendar-view">
      <calendar-view @click-date="(date) => dateEvent(date)" @click-item="itemEvent" :items="items"
          :show-date="showDate"
          class="theme-default holiday-us-traditional holiday-us-official">
          <calendar-view-header slot="header" slot-scope="t" :header-props="t.headerProps" @input="setShowDate" />
      </calendar-view>
    </div>


    <b-modal size="lg" v-model="holidayModal.show" hide-footer :title="`參考國定假日: ${$moment(showDate).format('YYYY年MM月')}`">
      <!-- <div v-text="officialHolidays" /> -->
      <div class="d-flex justify-content-between pb-3">
        <b-btn size="sm" variant="primary" @click.stop="changeMonth(-1)">上個月</b-btn>
        <b-btn size="sm" variant="primary" @click.stop="changeMonth(1)">下個月</b-btn>
      </div>
      <b-table v-if="officialHolidays.length > 0" striped hover :items="officialHolidays" :fields="officeHolidayField">
        <template #cell(add)="data">
          <b-btn size="sm" variant="primary" @click.stop="addFromOffice(data.item)" class="text-nowrap">新增</b-btn>
        </template>
      </b-table>
      <div v-else class="d-flex justify-content-center align-items-center" style="min-height: 100px;">
        暫無資料
      </div>
    </b-modal>

    <b-modal v-model="editHolidayModal.show" hide-footer title="修改假日">
      <template v-if="editHolidayModal.item">
        <b-input-group prepend="名稱" class="mb-1">
          <b-input v-model="editHolidayModal.item.title" />
        </b-input-group>

        <b-input-group prepend="日期" class="d-flex">
          <div class="flex-1">
            <ejs-datepicker
              name="editHolidayTime" step="5" v-model="editHolidayModal.item.startDate"
              :allowEdit="true" :format="customFormat" :validationRules="{ required: true }"
              :showClearButton="false" :showTodayButton="false" />
          </div>
        </b-input-group>
      </template>

      <div class="d-flex justify-content-end border-top pt-3">
        <b-btn variant="danger" @click.stop="modifyItem('remove')" class="mr-1">移除</b-btn>
        <b-btn variant="success" @click.stop="modifyItem('update')" class="mr-1">修改</b-btn>
        <b-btn variant="primary" @click.stop="editHolidayModal.show=false">取消</b-btn>
      </div>
      
    </b-modal>

    <b-modal v-model="setHolidayModal.show" title="新增假日" @ok="setHoliday">
      
      <b-input-group prepend="名稱" class="mb-1">
        <b-input v-model="setHolidayModal.name" />
      </b-input-group>

      <b-input-group prepend="日期" class="d-flex">
        <div class="flex-1">
          <ejs-datepicker ref="setDateTime" id="setDateTime"
            name="holidayTime" step="5" v-model="setHolidayModal.dateTime"
            :allowEdit="true" :format="customFormat" :validationRules="{ required: true }"
            :showClearButton="false" :showTodayButton="false" />
        </div>
      </b-input-group>
    </b-modal>

  </div>
</template>

<script>
import { CalendarView, CalendarViewHeader } from "vue-simple-calendar";
import { getHolidaysByYear, postHolidaysByDate, getOfficialHolidayByYear } from "@/assets/service/dataManager.js";
import { mapState, mapMutations } from "vuex";
require("vue-simple-calendar/static/css/default.css")
require("vue-simple-calendar/static/css/holidays-us.css")
export default {
  name: 'holidayArrangement',
  data() {
    return { 
      currentYear: new Date().getFullYear(),
      showDate: new Date(),
      holidayModal: {
        show: false
      },
      setHolidayModal: {
        show: false,
        name: '',
        dateTime: null
      },
      editHolidayModal: {
        show: false,
        item: null
      },
      items: [],
      customFormat: "yyyy-MM-dd",
      excludeEvent: [
        {title: '中華民國開國紀念日', datetime: '01/01'},
        {title: '和平紀念日', datetime: '02/28'},
        {title: '國慶日', datetime: '10/10'}
      ],
      officeHolidayField: [
        {key: "date", label: "日期"},
        {key: "name", label: "名稱", tdClass: "text-nowrap"},
        {key: "description", label: "內容"},
        {key: "add", label: "新增"}
      ]
    }
  },
  components: {
    CalendarView,
    CalendarViewHeader,
  },
  methods: {
    ...mapMutations(['SET_NATIONAL_HOLIDAYS', 'SET_SIDE_MESSAGE']),
    changeMonth(step) {
      this.showDate = this.$moment(this.showDate).add(step, 'M');
    },
    addFromOffice({name, date}) {
      // this.setHolidayModal.name = name;
      this.dateEvent(new Date(date), name);
    },
    modifyItem(mode) {
      const {item} = this.editHolidayModal;
      const itemYear = this.$moment(item.startDate).format('YYYY');
      const updateItems = this.items
        .filter(it => this.$moment(it.startDate).format('YYYYMMDD') !== this.$moment(item.startDate).format('YYYYMMDD'))
        .filter((it)=>this.isExcludeEvent(it, itemYear))
        .filter(({id, title, startDate})=> id !== item.id)
        .map(it => this.item2UpdateForm(it));

      if(mode === 'update') {
        updateItems.push(this.item2UpdateForm(item));
      }
      postHolidaysByDate(itemYear, updateItems).then(res=>{
        this.editHolidayModal.show = false;
        this.editHolidayModal.item = null;
        this.SET_SIDE_MESSAGE({msg: mode ==='remove' ? '移除成功':'更新成功', type: 1});
        this.getArrangedHoliday(this.currentYear);
      });
    },
    setShowDate(date) {
      this.showDate = date;
    },
    itemEvent(data) {
      this.editHolidayModal.item = {...data};
      this.editHolidayModal.show = true;
    },
    dateEvent(date, name = '') {
      this.setHolidayModal.dateTime = date;
      this.setHolidayModal.name = name;
      this.setHolidayModal.show = true;
    },
    showNationHoliday() {
      this.holidayModal.show = true;
    },
    getArrangedHoliday(year) {
      getHolidaysByYear(year).then(res=>{
        this.items = res.map((item, idx)=>({
          id: `${year}_${idx}`,
          title: item.Name,
          startDate: `${year}/${this.$number2Digits(item.Month)}/${this.$number2Digits(item.Day)}`,
          endDate: `${year}/${this.$number2Digits(item.Month)}/${this.$number2Digits(item.Day)}`
        }));
      })
    },
    getReferenceHoliday(year) {   // 官方api
      if(!this.nationalHolidays.hasOwnProperty(year)) {
        getOfficialHolidayByYear(year).then(holidays=>{
          this.SET_NATIONAL_HOLIDAYS({year, holidays})
        })
      }
    },
    isExcludeEvent(item, year) {
      return !this.excludeEvent.some(event=>
        (event.title === item.title && event.datetime === this.$moment(item.startDate).format('MM/DD')) ||
        this.$moment(item.startDate).format('YYYY') !== year
      )
    },
    item2UpdateForm(item) {
      return {
        Name: item.title,
        Month: this.$moment(item.startDate).format('MM'),
        Day: this.$moment(item.startDate).format('DD')
      };
    },
    setHoliday() {
      const [Year, Month, Day] = this.$moment(this.setHolidayModal.dateTime).format('YYYY-MM-DD').split('-');
      const {name: Name} = this.setHolidayModal;
      const updateItems = this.items
        .filter(item => this.$moment(item.startDate).format('YYYYMMDD') !== `${Year}${Month}${Day}`)
        .filter((item)=>this.isExcludeEvent(item, Year))
        .map(item=>this.item2UpdateForm(item)).concat({Name, Month, Day});
      postHolidaysByDate(Year, updateItems).then(res=>{
        this.setHolidayModal.show = false;
        this.setHolidayModal.name = '';
        this.setHolidayModal.dateTime = null;
        this.SET_SIDE_MESSAGE({msg: '新增成功', type: 1});
        this.getArrangedHoliday(this.currentYear);
      })
    }
  },
  created() {
    this.getArrangedHoliday(this.currentYear);
    this.getReferenceHoliday(this.currentYear);
  },
  computed: {
    ...mapState(['nationalHolidays']),
    officialHolidays() {
      const [year, month] = this.$moment(this.showDate).format('YYYY-MM').split('-');
      return !this.nationalHolidays.hasOwnProperty(year)
        ? []
        : this.nationalHolidays[year].filter(({date})=> this.$moment(date).format('MM') === month);
    }
  },
  watch: {
    showDate(val) {
      const year = this.$moment(val).format('YYYY');
      if(year !== this.currentYear) {
        this.currentYear = year;
        this.getReferenceHoliday(year);
        this.getArrangedHoliday(year);
      }
    }
  }
}
</script>

<style lang="scss">
  .holiday-arrangement {
    min-height: 100vh;
    padding-top: 56px;
  }
  .calendar-view {
    max-width: 1440px;
    margin: 0 auto;
  }
</style>
