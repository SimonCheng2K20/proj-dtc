<template>
  <div>
    <twp ref="twp" :FieldConfig="reportAmount" :DataFetch="GetData" :isBackEndPagination="true" :heightForScroll="scrollHeight" />
  </div>
</template>
<script>
import twp from '@/components/TWPv5'
import { getEmrReportCount } from '@/assets/service/dataManager.js'
import { reportAmountEmr } from '@/views/TableState/ReportComponents/ReportStat.js'
import { mapMutations } from 'vuex'
export default {
  components: { twp },
  props: {
    dateRange: { type: Array },
    errLevel: { type: [Number, String] },
    reportIssueCode: {type: String, default: null},
    modalityArr: { type: Array, default: null}
  },
  data() {
    return {
      reportAmount: [],
      pagination: {
        perPage: 10,
        curPage: 1,
      },
      scrollHeight: '600px',
    }
  },
  methods: {
    ...mapMutations(['SHOW_LOADING', 'HIDE_LOADING', 'SET_SIDE_MESSAGE']),
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
        const params = []
        const filter = []
        let filterSub = []
        console.log(`this.dateRange:`,  this.dateRange)
        params.push(`$skip=${PagingRowPerPage * (PagingCurrentPage - 1)}`)
        params.push(`$top=${PagingRowPerPage}`)
        params.push('$orderby=IssueTime')

        if(this.dateRange){
          filter.push(`IssueTime gt DateTime'${this.$moment(this.dateRange[0]).format('YYYY-MM-DDT00:00:00')}' and IssueTime lt DateTime'${this.$moment(this.dateRange[1]).format('YYYY-MM-DDT23:59:59')}'`)
        }

        if(this.modalityArr && this.modalityArr.length){
          console.log(`this.modalityArr: `, this.modalityArr)
          
          let tempArr = null

          this.modalityArr.forEach((v)=>{
            filterSub.push(`substringof('${v}',Modality)`)
          })

          if(filterSub && filterSub.length){
            tempArr = `(${filterSub.join(' or ')})`
            filter.push(tempArr)
          }
        }

        if(this.reportIssueCode){
          console.log(`this.reportIssueCode: `, this.reportIssueCode)
          filter.push(`substringof('${this.reportIssueCode}',IssuePhysicianId)`)
        }
        
        if(filter && filter.length){
          params.push(`$filter=${filter.join(' and ')}`)
          
        }

        const res = await getEmrReportCount(params.join('&'))
        
        if(res && res.Items){
          res.Items.forEach((item) => {
            ['IssueTime', 'StudyTime', 'Times'].forEach((key) => {
              if (item[key] != null) {
                if(key === 'Times'){
                  item[`${key}`] = item[key]
                }else{
                  item[`${key}`] = this.$moment(item[key]).format('YYYY-MM-DD HH:mm:ss')
                }
              } else {
                item[`${key}`] = '-'
              }
            })
          })
        }

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
  created() {
    // const useField = process.env.VUE_APP_UrgentReportList_COLUMNS.split(',')
    // this.reportAmount = reportAmount.filter((item) => useField.includes(item.key))
    this.reportAmount = reportAmountEmr
    this.scrollHeight = window.innerHeight - 300 + 'px'
  },
}
</script>
