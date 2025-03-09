<template>
  <!-- style="max-width:700px" -->
  <div class="hrrMessageReport" style="overflow-x: scroll;">
    <twp ref="twp" :FieldConfig="hrrCompleted" :DataFetch="GetData" :isBackEndPagination="true" :heightForScroll="scrollHgt" />
  </div>
</template>
<script>
import twp from '@/components/TWPv5'
import { getHrrMessageList } from '@/assets/service/dataManager.js'
import { hrrCompleted } from '@/views/TableState/ReportComponents/ReportStat.js'
import { mapMutations } from 'vuex'
import { DataManager, WebApiAdaptor, Query } from '@syncfusion/ej2-data'
import * as configs from '@/config'
export default {
  components: { twp },
  props: {
    dateRange: { type: Array },
    errLevel: { type: [Number, String] },
    selectSMSStatus: { type: [Number, String] },
    selectReturnCode: { type: [Number, String] },
  },
  data() {
    return {
      hrrCompleted: [],
      pagination: {
        perPage: 10,
        curPage: 1,
      },
      scrollHgt: '600px',
      IssuePhysicianSource: []
    }
  },
  methods: {
    ...mapMutations(['SHOW_LOADING', 'HIDE_LOADING', 'SET_SIDE_MESSAGE']),
    async GetOptionsIssuePhysicianSource() {
      let itemPack = null
      let convertedCollections = []
      let subPath = '../Employee/SelectNoList?staffType=21&getAll=false'
      await new DataManager({
        url: configs.publicPath + subPath,
        adaptor: new WebApiAdaptor(),
        crossDomain: true,
      })
        .executeQuery(new Query())
        .then((r) => {
          itemPack = r.actual
        })

      itemPack.Items.forEach((i) => {
        let collection = { value: i.No, text: i.Name }
        convertedCollections.push(collection)
      })

      this.IssuePhysicianSource = convertedCollections
    },
    async GetData() {
      if (this.dateRange[0] == null && this.dateRange[1] == null) return { Items: [], Count: 0 }
      this.SHOW_LOADING()
      const waiting = () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve()
          }, 50)
        })
      try {
        await waiting()

        const { PagingCurrentPage, PagingRowPerPage } = this.$refs.twp
        const params = this.dateRange.reduce((acc, cur, idx) => acc.concat(`${idx === 0 ? 'start' : 'end'}Date=${cur}`), [])
        const filter = []

        params.push(`$skip=${PagingRowPerPage * (PagingCurrentPage - 1)}`)
        params.push(`$top=${PagingRowPerPage}`)

        if (this.errLevel) params.push(`hrrLevel=${this.errLevel}`)

        if (this.selectSMSStatus !== null) {
          filter.push(`SmsStatus eq ${this.selectSMSStatus}`)
        }

        if (this.selectReturnCode !== null) {
          filter.push(`ReturnCode eq ${this.selectReturnCode}`)
        }

        if(filter && filter.length){
          params.push(`$filter=${filter.join(' and ')}`)
        }

        params.push('$orderby=NoticeTime')
        const res = await getHrrMessageList(params.join('&'))
        res.Items.forEach((item) => {
          ['NoticeTime', 'StudyTime'].forEach((key) => {
            if (item[key] != null) {
              item[`${key}ForShow`] = this.$moment(item[key]).format('YYYY-MM-DD HH:mm:ss')
            } else {
              item[`${key}ForShow`] = '-'
            }
          })
          
          if(item.RequestingPhysicianId){
            this.IssuePhysicianSource.forEach((i)=>{
              if(i.value === item.RequestingPhysicianId){
                item.RequestingPhysicianId = i.text
              }
            })
          }
        })
        return res
      } catch (err) {
        this.SET_SIDE_MESSAGE({ msg: 'error', type: 2 })
      } finally {
        this.HIDE_LOADING()
      }
    },
    refreshTWP() {
      this.$refs.twp.OnForceRefresh()
    },
  },
  async created() {
    // const useField = process.env.VUE_APP_UrgentReportList_COLUMNS.split(',')
    // this.hrrCompleted = hrrCompleted.filter((item) => useField.includes(item.key))
    await this.GetOptionsIssuePhysicianSource()
    
    this.hrrCompleted = hrrCompleted
    this.scrollHgt = window.innerHeight - 300 + 'px'
  },
}
</script>
