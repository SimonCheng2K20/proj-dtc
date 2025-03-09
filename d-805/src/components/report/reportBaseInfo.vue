<template>
  <div class="search-section d-grid grid-col-5" style="grid-gap: 2px">
    <!-- <div class="d-flex align-items-center">
      <b-input-group style="width: unset" prepend="優先順序">
        <template v-slot="append">
          <b-radio-group
            tag="EmgFlag"
            name="CaseEmergency"
            v-model="emgStatus"
            :options="emgOptions"
            buttons
            button-variant="outline-danger"
            style="pointer-events: none"
          ></b-radio-group>
        </template>
      </b-input-group>

      <toggle-button
        v-show="isCtMri"
        v-model="report.IsPositive"
        class="positive-btn mx-auto"
        color="#dc3545"
        :sync="true"
        :font-size="16"
        :height="26"
        :width="72"
        :labels="{ checked: '陽性', unchecked: '陰性' }"
      />
    </div> -->

    <b-input-group prepend="檢查日期">
      <b-input tag="ScheduleTime" v-model="procedure.StudyDate" readonly />
    </b-input-group>

    <b-input-group prepend="儀器類別">
      <b-input tag="Modality" v-model="procedure.Modality" readonly />
    </b-input-group>

    <b-input-group v-if="versionNo === '805'" prepend="申請單號">
      <b-input tag="OrderNo" v-model="procedure.OrderNo" readonly />
    </b-input-group>

    <b-input-group v-else prepend="申請單號">
      <b-input tag="AccessionNo" v-model="procedure.AccessionNo" readonly />
    </b-input-group>

    <b-input-group prepend="病歷號">
      <b-input tag="PatientId" v-model="procedure.PatientId" readonly />
    </b-input-group>

    <b-input-group prepend="病患來源">
      <b-input tag="PatientSourceTypeCode" v-model="procedure.PatientSourceType" readonly />
    </b-input-group>

    <b-input-group prepend="病患姓名">
      <b-input v-model="procedure.PatientName" readonly />
    </b-input-group>

    <b-input-group prepend="病患性別">
      <b-input v-model="procedure.PatientSex" readonly />
    </b-input-group>

    <b-input-group prepend="出生日期">
      <b-input v-model="procedure.PatientBirthday" readonly />
    </b-input-group>

    <b-input-group prepend="病患年齡">
      <b-input v-model="procedure.PatientAge" readonly />
    </b-input-group>

    <b-input-group prepend="病床編號">
      <b-input v-model="procedure.BedNo" readonly />
    </b-input-group>

    <b-input-group prepend="開單醫師">
      <b-input v-model="procedure.RequestingPhysicianName" readonly />
    </b-input-group>

    <!-- <b-input-group class="bg-white" v-if="!isSubReport">
      <b-input-group-prepend>
        <b-button variant="primary" @click="$emit('ShowIQControlEdit')">影像品質</b-button>
      </b-input-group-prepend>
      <b-input v-model="NameOfImageQuality" readonly />
    </b-input-group> -->

    <b-input-group v-if="versionNo === '805'" prepend="報告醫師">
      <b-form-select
        :disabled="instantReportStatusNo == 71 || canApproveReport"
        placeholder
        v-model="report.IssuePhysicianId"
        :options="approvalList"
        @change="updateTempId"
      ></b-form-select>
    </b-input-group>

    <b-input-group v-else prepend="審核醫師">
      <b-form-select
        :disabled="instantReportStatusNo == 71 || canApproveReport"
        placeholder
        v-model="report.IssuePhysicianId"
        :options="approvalList"
        @change="updateTempId"
      ></b-form-select>
    </b-input-group>

    <b-input-group prepend="報告狀態">
      <b-input v-model="instantReportStatus" readonly />
    </b-input-group>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { getReportByAccessionNo } from '@/assets/service/dataManager'
import { relativeTimeThreshold } from 'moment'

export default {
  props: {
    report: {
      type: Object,
      default: () => {},
    },
    procedure: {
      type: Object,
      default: () => {},
    },
    optionsImageQuality: {
      type: Array,
      default: () => [],
    },
    tempPhysicianId: {
      // 方便自動選擇
      type: String,
      default: null,
    },
    isSubReport: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      emgOptions: [
        { text: '急件', value: 'Y' },
        { text: '一般', value: 'N' },
      ],
      emgStatus: 'N',
      tempReport: null,
      tempList: null,
      tempDoctors: null,
    }
  },
  methods: {
    ...mapGetters(['getFinalStatus', 'getFinalAccessionNo']),
    ...mapActions(['action_getIssueDoctors']),
    ...mapMutations([
      "CLEAR_REPORT_STATUS",
      "SET_REPORT_STATUS",
      "SET_FINAL_STATUS",
      "SET_FINAL_ACCESSIONNO"
    ]),
    updateTempId() {
      this.$emit('updateSpecificVariable', {
        value: this.report.IssuePhysicianId,
        key: 'tempPhysicianId',
      })
    },
    updateSpecificReportValue() {
      this.$emit('updateSpecificReportValue', {
        value: this.report.IssuePhysicianId,
        key: 'IssuePhysicianId',
      })
    },
    async GetReportByAccessionNo(AccessionNo, PatientId) {
      try {
        const data = await getReportByAccessionNo(AccessionNo, PatientId)
        this.tempReport = this.$DeepCopy(data)

        // console.log(`GetReportByAccessionNo: `, this.tempReport);
      
      } catch (error) {
        console.log(error)
      }
    },
  },
  computed: {
    ...mapGetters(['getIssueDrs', 'getUserId', 'getUserRoleId']),
    approvalList: {
      // get() {
      //   return [
      //     ...new Set([
      //       { value: null, text: "請選擇..." },
      //       ...this.getIssueDrs,
      //       {
      //         text: this.$store.state.Profile4User.employeeName,
      //         value: this.$store.state.Profile4User.id,
      //       },
      //     ]),
      //   ];
      // }
      get() {
        if (this.report.IssuePhysicianId) {
          return [{ value: null, text: '請選擇...' }, ...this.getIssueDrs]
        } else {
          return [...this.getIssueDrs]
        }
      },
    },
    versionNo() {
      return process.env.VUE_APP_VERSION_NO
    },
    isCtMri() {
      return this.procedure.Modality && ['CT', 'MR'].some((k) => this.procedure.Modality.includes(k))
    },
    NameOfImageQuality() {
      return this.report && this.report.ImageQualityCode && this.optionsImageQuality && this.optionsImageQuality.length > 0
        ? this.optionsImageQuality.find(({ value }) => value == this.report.ImageQualityCode)['text'] || ''
        : ''
    },
    canApproveReport() {
      return this.approvalList.findIndex(({ value }) => this.getUserId === value) >= 0
    },
    instantReportStatus: {
      get(){
        const statusNo = this.tempReport ? this.tempReport.DxrStatus : this.$store.state.reportStatus.Status
        switch(statusNo){
          case '56':
            return '待打'
          case '63':
            return '暫存'
          case '71':
            return '完成'
          default:
            switch(this.$store.state.reportStatus.Status){
              case '56':
                return '待打'
              case '63':
                return '暫存'
              case '71':
                return '完成'
              default:
                return ''
            }
        }
      }
    },
    instantReportStatusNo: {
      get(){
        const statusNo = this.tempReport ? this.tempReport.DxrStatus : this.$store.state.reportStatus.Status
        return statusNo
      }
    },
    lastStatus: {
      get(){
        return this.getFinalStatus()
      },
      set(val){
        this.SET_FINAL_STATUS(val)
      }
    },
    lastAccessionNo: {
      get(){
        return this.getFinalAccessionNo()
      },
      set(val){
        this.SET_FINAL_ACCESSIONNO(val)
      }
    }
  },
  created() {
    if (this.getIssueDrs.length === 0) this.action_getIssueDoctors()
  },
  async mounted() {
    this.emgStatus = this.procedure.EmgFlag ? this.procedure.EmgFlag : this.emgOptions[1].value
    //init get
    this.lastAccessionNo = this.procedure.AccessionNo
  },
  watch: {
    // report() {
    //   if(this.getUserRoleId === '28' && !this.report.IssuePhysicianId) {
    //     const existDr = this.approvalList.find(({value})=>this.report.DxreportPhysicianId === value);
    //     if(existDr) {
    //       this.report.IssuePhysicianId = existDr.value;
    //     }
    //   }
    // },
    'procedure.AccessionNo'() {
      this.emgStatus = this.procedure.EmgFlag ? this.procedure.EmgFlag : this.emgOptions[1].value
    },
    // "report.IssuePhysicianId": {
    //   handler(val) {
    //     if (val) {
    //       // this.report.IssuePhysicianId = this.procedure.IssuePhysicianId ? this.procedure.IssuePhysicianId : val
    //       // this.report.IssuePhysicianId = this.procedure.DxreportPhysicianId
    //       //   ? this.procedure.DxreportPhysicianId
    //       //   : this.procedure.IssuePhysicianId
    //       //   ? this.procedure.IssuePhysicianId
    //       //   : val;
    //       this.report.IssuePhysicianId = this.procedure.IssuePhysicianId
    //         ? this.procedure.IssuePhysicianId
    //         : val;
    //     } else {
    //       this.report.IssuePhysicianId = this.$store.state.Profile4User.id;
    //     }
    //   },
    //   deep: true,
    //   immediate: true,
    // },
    'report.IssuePhysicianId': {
      async handler(newVal, oldVal) {
        if (newVal && oldVal) {
          await this.GetReportByAccessionNo(this.procedure.AccessionNo, this.procedure.PatientId)

          if (this.tempReport.IssuePhysicianId) {
            this.report.IssuePhysicianId = this.tempReport.IssuePhysicianId
            // console.log(`w-ri ~`, this.report.IssuePhysicianId)
          } else {
            if (this.$store.state.Profile4User.staffType >= 20 && this.$store.state.Profile4User.staffType <= 30) {
              this.report.IssuePhysicianId = this.$store.state.Profile4User.id
            }
          }
        }
      },
      deep: true,
      // immediate: true,
    },
    'report.DxrStatus': {
      async handler(newVal, oldVal){

        this.lastStatus = newVal
        //update
        this.lastAccessionNo = this.procedure.AccessionNo
        
        if(newVal && oldVal){
          await this.GetReportByAccessionNo(this.procedure.AccessionNo, this.procedure.PatientId)
          if(newVal == 71){
            this.report.IssuePhysicianId = this.tempReport.IssuePhysicianId
            // console.log(`w-rd ~`, this.tempReport.DxrStatus)
            // console.log(`w-rd ~`, this.report.IssuePhysicianId)
          }
        }
      },
      // immediate: true,
      deep: true,
    },
    'procedure.StudyDate':{
      handler(val){
        console.log(`procedure.StudyDate: `, val)
        if(val){
          this.procedure.StudyDate = this.$moment(this.procedure.StudyDate).format('YYYY-MM-DD HH:mm:ss')
        }
      },
      immediate: true,
      deep: true,
    }
  },
}
</script>
