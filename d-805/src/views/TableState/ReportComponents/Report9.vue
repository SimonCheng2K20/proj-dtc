<template>
  <div>
    <twp ref="twp" :FieldConfig="reportAmount" :DataFetch="GetData" :isBackEndPagination="true" :heightForScroll="scrollHeight" />
  </div>
</template>
<script>
import twp from '@/components/TWPv5'
import { getFailImageReasonList } from '@/assets/service/dataManager.js'
import { reportFailImages } from '@/views/TableState/ReportComponents/ReportStat.js'
import { mapMutations } from 'vuex'
import _ from 'lodash'

export default {
  components: { twp },
  props: {
    dateRange: { type: Array },
    errLevel: { type: [Number, String] },
    reportIssueCode: {type: String, default: null},
    modalityArr: { type: Array, default: null},
    searchRange: {type: Object, default: null}
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

      const typeDisplay = (data) => {
        switch (data) {
          case 0:
            return '不良'
          case 1:
            return '重照'
          default:
            return '不良'
        }
      }

      const patientSourceTypeCodeDisplay = (data) => {
        switch (data) {
          case 'O':
            return '門診'
          case 'I':
            return '住院'
          case 'E':
            return '急診'
          case 'H':
            return '健檢'
          default:
            return '門診'
        }
      }

      try {
        await waiting()
        
        const { PagingCurrentPage, PagingRowPerPage } = this.$refs.twp
        const params = []
        const filter = []

        params.push(`$skip=${PagingRowPerPage * (PagingCurrentPage - 1)}`)
        params.push(`$top=${PagingRowPerPage}`)
        params.push('$orderby=CreateTime desc')

        if(this.searchRange){
          Object.keys(this.searchRange).forEach((v)=>{
            if(v === 'searchPatientId' && this.searchRange[v]){
              filter.push(`substringof('${this.searchRange[v]}',PatientId)`)
            }
            if(v === 'searchAccessionNo' && this.searchRange[v]){
              filter.push(`AccessionNo eq '${this.searchRange[v]}'`)
            }
            if(v === 'searchPatientSourceTypeCode' && this.searchRange[v]){
              filter.push(`substringof('${this.searchRange[v]}',PatientSourceTypeCode)`)
            }
            if(v === 'searchSelectedRadiographer' && this.searchRange[v]){
              filter.push(`substringof('${this.searchRange[v]}',EmployeeNo)`)
            }
          })
        }

        if(this.dateRange){

          console.log(`report9: `, this.dateRange)

          filter.push(`CreateTime gt DateTime'${this.$moment(this.dateRange[0]).format('YYYY-MM-DDT00:00:00')}' and CreateTime lt DateTime'${this.$moment(this.dateRange[1]).format('YYYY-MM-DDT23:59:59')}'`)
        }
        
        if(filter && filter.length){
          params.push(`$filter=${filter.join(' and ')}`)
        }

        const res = await getFailImageReasonList('?' + params.join('&'))
        
        if(res && res.Items){
          res.Items.forEach((item) => {
            ['StudyTime','IssueTime','CreateTime'].forEach((key) => {
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

            item.Type = item.Type !== null || item.Type !== undefined ? typeDisplay(item.Type) : ''
            item.PatientSourceTypeCode = item.PatientSourceTypeCode !== null || item.PatientSourceTypeCode !== undefined ? patientSourceTypeCodeDisplay(item.PatientSourceTypeCode) : ''
            item.EmployeeCodeName = item.EmployeeCodeName ? `${item.EmployeeCodeName}${item.EmployeeName ? '-' + item.EmployeeName : ''}` : ''
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
    this.reportAmount = reportFailImages
    this.scrollHeight = window.innerHeight - 300 + 'px'
  },
}
</script>
