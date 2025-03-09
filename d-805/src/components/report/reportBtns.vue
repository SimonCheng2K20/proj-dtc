<template>
  <b-row no-gutters class="mt-1 main-toolbar align-items-center">
    <b-col sm="2" class="px-1">
      <b-input-group>
        <div class="form-control dtc-version-num">
          <a
            class="repoSwithBtn left"
            href="javascript:void(0);"
            @click.prevent="$emit('viewPrevRecord')"
            :style="numObj"
          >
            <font-awesome-icon icon="arrow-left" />
          </a>
          <div>{{ pageProcess }}</div>
          <a
            class="repoSwithBtn right"
            href="javascript:void(0);"
            @click.prevent="$emit('viewNextRecord', false)"
            :style="numObj2"
          >
            <font-awesome-icon icon="arrow-right" />
          </a>
        </div>
      </b-input-group>
    </b-col>
    <b-col sm="10" class="px-1">
      <div class="reportBtnsLayout">
        <div class="btnsLeft">
          <b-input-group prepend="連續報告" id="non-stop" style="flex-wrap: no-wrap; width: 172px" size="sm">
            <template v-slot="append">
              <b-radio-group
                readonly
                name="ContinuousReport"
                v-model="reportCode"
                size="sm"
                :options="[
                  { text: '啟用', value: 'Y' },
                  { text: '取消', value: 'N' },
                ]"
                buttons
                button-variant="outline-warning"
              ></b-radio-group>
            </template>
          </b-input-group>
          <b-input-group
            prepend="PACS"
            id="pacauto"
            v-if="showBtns.includes('呼叫PACS')"
            style="flex-wrap: no-wrap; width: 142px"
            size="sm"
          >
            <template v-slot="append">
              <b-radio-group
                readonly
                name="pacauto"
                v-model="isPacAuto"
                size="sm"
                :options="[
                  { text: '自動', value: 'Y' },
                  { text: '手動', value: 'N' },
                ]"
                buttons
                button-variant="outline-warning"
              ></b-radio-group>
            </template>
          </b-input-group>
        </div>
        <div class="btnsRight">
          <div class="sContent" ref="sContent">
            <div
              class="left-arrow cursor-pointer dtc-arrow"
              :style="`opacity: ${!isRightMost || !showArrow ? '0.3' : '1'}`"
              @click="clickLeftArrow"
              style="padding: 5px; color: var(--themeTextColor)"
            >
              <font-awesome-icon icon="arrow-left" />
            </div>
            <div ref="dtcToolBar" class="dtc-toolbar flex-1">
              <div :style="`display: flex; align-items: center; width: calc(${btnsWidth} + 128px)`">
                <b-button
                  v-if="showBtns.includes('原鄉篩檢') && isNeedWriteExam"
                  :variant="btnType"
                  class="mr-1"
                  @click="$bvModal.show('examination-for-805-dialog')"
                >
                  原鄉篩檢
                </b-button>
                <b-button
                  v-if="showBtns.includes('呼叫PACS')"
                  variant="success"
                  class="mr-1"
                  @click="$emit('callParentPacs', 'show')"
                  :disabled="lockingCallPacs"
                >
                  <font-awesome-icon icon="images" class="mr-1" />PACS
                </b-button>
                <b-button v-if="showBtns.includes('CALL_LAB')" variant="success" class="mr-1" @click="onCallLabClick">
                  <font-awesome-icon icon="sms" class="mr-1" />LIS
                </b-button>
                <b-button
                  v-if="showBtns.includes('正式報告')"
                  variant="success"
                  class="mr-1"
                  @click="onSaveClick"
                  :disabled="dxrStatus == 71 || isSaving"
                >
                  <font-awesome-icon icon="check" class="mr-1" />正式報告
                </b-button>
                <b-button
                  v-if="showBtns.includes('片語維護')"
                  variant="success"
                  class="mr-1"
                  @click="$emit('WinMass4Phrase')"
                >
                  <font-awesome-icon icon="book-medical" class="mr-1" />片語
                </b-button>
                <b-button
                  v-if="showBtns.includes('異常通報')"
                  variant="danger"
                  class="mr-1"
                  @click="$emit('viewAbnormalReport')"
                >
                  <font-awesome-icon icon="sms" class="mr-1" />
                  <span>通報</span>
                </b-button>
                <b-button
                  variant="success"
                  v-if="showBtns.includes('不良片')"
                  class="mr-1"
                  @click="$emit('FailImageReport')"
                >
                  不良片
                </b-button>
                <b-button
                  variant="success"
                  v-if="showBtns.includes('報告列印')"
                  class="mr-1"
                  @click="onPrintClick"
                  :disabled="!canPrint"
                >
                  報告列印
                </b-button>
                <b-button
                  v-if="showBtns.includes('暫存報告') && dxrStatus != 71"
                  variant="success"
                  class="mr-1"
                  @click="onTempSaveClick"
                  :disabled="isSaving"
                >
                  <font-awesome-icon icon="save" class="mr-1" />暫存
                </b-button>
                <b-button
                  v-if="showBtns.includes('交班記錄') && isShiftNoteAvaliable"
                  variant="success"
                  class="mr-1"
                  @click="$emit('WinMass4ShiftNote')"
                >
                  <b-spinner small type="grow" class="mr-1 align-middle" v-if="ShiftNoteNeedsToClick" />
                  <font-awesome-icon v-else icon="bell" class="mr-1" />
                  <span :class="{ blink: ShiftNoteNeedsToClick }">交班記錄</span>
                </b-button>
                <b-button
                  variant="success"
                  v-if="showBtns.includes('檢查註記')"
                  @click="openRadiographerNoteData"
                  class="mr-1"
                  v-show="radiographerNoteHasData"
                >
                  <b-spinner v-if="showClickRadiographerNoteRemind" small type="grow" class="align-middle" />
                  <font-awesome-icon v-else icon="clipboard" class="mr-1" />
                  檢查註記
                </b-button>
                <b-button
                  v-if="showBtns.includes('正式報告') && dxrStatus == 71"
                  variant="success"
                  class="mr-1"
                  :disabled="!isAbleToModifyReport"
                  :style="isEdited ? '' : 'pointer-events: none;filter: contrast(0.7);'"
                  @click="$emit('addNoteB4Save')"
                >
                  <font-awesome-icon icon="save" class="mr-1" />修改報告
                </b-button>
                <b-button
                  v-if="showBtns.includes('送交審核')"
                  variant="success"
                  class="mr-1"
                  @click="$emit('DataSave', 65)"
                  :disabled="dxrStatus == 71 || dxrStatus == 65 || theSamePerson || isSaving"
                >
                  <font-awesome-icon icon="chalkboard-teacher" class="mr-1" />送交審核
                </b-button>
                <b-button
                  v-if="showBtns.includes('退回重寫')"
                  variant="success"
                  class="mr-1"
                  @click="$emit('DataSave', 61)"
                  :disabled="!(theSamePerson && dxrStatus == 65)"
                >
                  <font-awesome-icon icon="chalkboard-teacher" class="mr-1" />退回重寫
                </b-button>
                <b-button
                  v-if="showBtns.includes('緊急通報')"
                  variant="danger"
                  class="mr-1"
                  @click="$emit('viewUrgentReport')"
                >
                  <font-awesome-icon icon="sms" class="mr-1" />
                  <span>緊急通報</span>
                </b-button>
                <b-button
                  v-if="showBtns.includes('交班記錄') && !isShiftNoteAvaliable"
                  variant="success"
                  :disabled="true"
                  class="mr-1"
                >
                  <font-awesome-icon icon="bell" class="mr-1" />
                  <span>交班記錄</span>
                </b-button>
                <b-button
                  v-if="showBtns.includes('次專科報告') && isSubReport"
                  variant="success"
                  :disabled="cstTab.length === 1"
                  @click="$emit('reportTemplateOpen')"
                  class="mr-1"
                >
                  <font-awesome-icon icon="edit" class="mr-1" />次專科報告
                </b-button>
                <b-button
                  v-if="showBtns.includes('癌症報告')"
                  variant="success"
                  :disabled="!isCtMri || cstTab.length === 6"
                  @click="$emit('reportTemplateOpen')"
                  class="mr-1"
                >
                  <font-awesome-icon icon="edit" class="mr-1" />癌症報告
                </b-button>
                <b-button
                  v-if="showBtns.includes('報告版次')"
                  variant="success"
                  :disabled="!hasReportHistory"
                  @click="$emit('versionHistoryOpen')"
                  class="mr-1"
                >
                  <font-awesome-icon icon="history" class="mr-1" />報告版次
                </b-button>
                <b-button
                  variant="success"
                  v-if="showBtns.includes('檢查註記')"
                  @click="$emit('WinMass4Radiographer')"
                  class="mr-1"
                  v-show="!radiographerNoteHasData"
                >
                  <font-awesome-icon icon="clipboard" class="mr-1" />
                  檢查註記
                </b-button>
                <b-button variant="success" class="mr-1" @click="addObjectNote" :disabled="false">
                  <font-awesome-icon icon="copy"></font-awesome-icon> 臨床註記
                </b-button>
                <!-- <b-button variant="danger" class="mr-1" @click="reNewReport" :disabled="dxrStatus != '63'">
                  <font-awesome-icon icon="eraser"></font-awesome-icon> 放棄撰打
                </b-button> -->
              </div>
            </div>
            <div
              class="right-arrow cursor-pointer dtc-arrow"
              @click="clickRightArrow"
              :style="`opacity: ${isRightMost || !showArrow ? '0.3' : '1'}`"
              style="padding: 5px; color: var(--themeTextColor)"
            >
              <font-awesome-icon icon="arrow-right" />
            </div>
            <b-button variant="primary" class="dtc-back" @click="backToPreviousRoute"
              ><font-awesome-icon icon="arrow-circle-left" />返回</b-button
            >
          </div>
        </div>
      </div>
    </b-col>

    <examination-for-805
      :reportData="theReport"
      @finish="(data) => $emit('examination-for-805-finish', data)"
    ></examination-for-805>

    <iframe v-if="this.pdfSrc" ref="printRef" :src="pdfSrc" style="display: none"></iframe>
  </b-row>
</template>

<script>
import ExaminationFor805 from '@/views/MI03/components/ExaminationFor805.vue'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { getPacsLab } from '@/assets/service/dataManager.js'

export default {
  components: { 'examination-for-805': ExaminationFor805 },
  props: {
    origReportContent: {
      type: String,
    },
    continuousReportCode: {
      type: String,
    },
    pageProcess: {
      type: String,
    },
    isShiftNoteAvaliable: {
      type: Boolean,
    },
    ShiftNoteNeedsToClick: {
      type: Boolean,
    },
    lockingCallPacs: {
      type: Boolean,
    },
    theReport: {
      type: Object,
    },
    procedure: {
      type: Object,
    },
    cstTab: {
      type: Array,
      default: () => [],
    },
    hasReportHistory: {
      type: Boolean,
      default: false,
    },
    numObj: {
      type: Object,
      default: () => ({}),
    },
    numObj2: {
      type: Object,
      default: () => ({}),
    },
    isSubReport: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      testCode: 'Y',
      reportCode: '',
      isRightMost: false,
      btnsWidth: 'calc(100% - 128px)',
      showArrow: true,

      showClickRadiographerNoteRemind: false,
      radiographerNoteHasData: false,

      interval: null,
      btnType: 'success',

      pdfSrc: null,
      reportDiff: null,
      reportDiffAfter: null,
      recordCount: 0,
      recordObj: 0,
      reportContentRecord: null,
      regObj: /\[Clinical Information\]|\[None.\]/g,
    }
  },
  computed: {
    ...mapGetters(['getUserId']),
    versionNo() {
      return process.env.VUE_APP_VERSION_NO
    },
    showBtns() {
      switch (this.versionNo) {
        case '805':
          return [
            '呼叫PACS',
            'CALL_LAB',
            '暫存報告',
            '正式報告',
            '片語維護',
            '報告版次',
            '異常通報',
            '不良片',
            '原鄉篩檢',
            '報告列印',
          ]
        default:
          return [
            '檢查註記',
            '送交審核',
            '退回重寫',
            '緊急通報',
            '交班記錄',
            '癌症報告',
            '報告版次',
            '呼叫PACS',
            'CALL_LAB',
            '暫存報告',
            '正式報告',
            '片語維護',
            '報告版次',
            '異常通報',
            '不良片',
            '原鄉篩檢',
            '報告列印',
          ]
      }
    },
    isNeedWriteExam() {
      // return true
      // return (
      //   (this.procedure.ProcedureCode === 'E4009C' || this.procedure.ProcedureCode === 'E4006C') &&
      //   this.procedure.Modality === 'CR'
      // )
      return (
        (this.procedure.ProcedureCodeList && this.procedure.ProcedureCodeList.includes('E4009C'))
        ||
        (this.procedure.ProcedureCodeList && this.procedure.ProcedureCodeList.includes('E4006C'))
        &&
        this.procedure.Modality === 'CR'
      )
    },
    canPrint() {
      return Number(this.dxrStatus) === 71
    },
    hasScreeningWarning() {
      return this.theReport.ScreeningWarning === -1 ? false : true
    },
    isAbleToModifyReport() {
      const ok1 = this.theReport.IssuePhysicianId === this.getUserId && this.dxrStatus == 71
      const ok2 = this.$store.state.Profile4User.staffType >= 20 && this.$store.state.Profile4User.staffType <= 30

      return ok1 || ok2
    },
    dxrStatus() {
      return Number(this.theReport.DxrStatus)
    },
    dxrReportContent() {
      return this.theReport.ReportContent
    },
    reportCount: {
      get() {
        return this.getTempReportCount()
      },
      set(val) {
        this.SET_TEMPREPORTCOUNT(val)
      },
    },
    objCount: {
      get() {
        return this.getTempObjCount()
      },
      set(val) {
        this.SET_TEMPOBJCOUNT(val)
      },
    },
    dxrReportHasObj: {
      get() {
        return this.regObj.test(this.dxrReportContent)
      },
    },
    theSamePerson() {
      return this.theReport.IssuePhysicianId === this.getUserId
    },
    isSaving() {
      return !window.isSavingDtc ? false : window.isSavingDtc
    },
    isCtMri() {
      return (
        this.theReport.Modality && (this.theReport.Modality.includes('CT') || this.theReport.Modality.includes('MR'))
      )
    },
    isEdited() {
      //  return !(this.origReportContent && this.theReport.ReportContent == this.origReportContent);
      return !this.dxrStatus
        ? false
        : this.dxrStatus !== 71
        ? true
        : this.theReport.ReportContent != this.origReportContent
        ? true
        : false
    },
    isPacAuto: {
      get() {
        return this.getPacAutoValue()
      },
      set(val) {
        this.SET_PACAUTO(val)
      },
    },
    isSaveAuto: {
      get() {
        return this.getSaveAutoValue()
      },
      set(val) {
        this.SET_SAVEAUTO(val)
      },
    },
    isObjAuto: {
      get() {
        return this.getObjAutoValue()
      },
      set(val) {
        this.SET_OBJAUTO(val)
      },
    },
    recordReportContent: {
      get() {
        return this.getTempReportContent()
      },
      set(val) {
        this.SET_TEMPREPORTCONTENT(val)
      },
    },
    autoRevoke: {
      get() {
        return this.getAutoRevoke()
      },
      set(val) {
        this.SET_AUTOREVOKE(val)
      },
    },
    autoRevokeAccessionNo: {
      get() {
        return this.getAutoRevokeAccessionNo()
      },
      set(val) {
        this.SET_AUTOREVOKEACCESSIONNO(val)
      },
    },
  },
  methods: {
    ...mapGetters([
      'getREPOValue',
      'getPacAutoValue',
      'getSaveAutoValue',
      'getObjAutoValue',
      'getTempReportCount',
      'getTempObjCount',
      'getTempReportContent',
      'getAutoRevoke',
      'getAutoRevokeAccessionNo',
    ]),
    ...mapMutations([
      'SET_REPO',
      'SET_PACAUTO',
      'SET_SAVEAUTO',
      'SET_OBJAUTO',
      'SET_TEMPREPORTCOUNT',
      'SET_TEMPOBJCOUNT',
      'SHOW_LOADING',
      'HIDE_LOADING',
      'SET_SIDE_MESSAGE',
      'SET_AUTOREVOKE',
      'SET_AUTOREVOKEACCESSIONNO',
      'SET_TEMPREPORTCONTENT',
    ]),
    ...mapActions(['action_savingPersonalSetting']),
    FocusOnContent() {
      setTimeout(() => {
        this.$nextTick(() => {
          if (this.$refs['reportPlainText']) this.$refs['reportPlainText'].focus()
        })
      }, 250)
    },
    async onPrintClick() {
      if (!this.canPrint) {
        return
      }

      const data = await window.axios(`/report/GetPDF?orderNo=${this.theReport.OrderNo}`, { responseType: 'blob' })
      const file = new Blob([data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(file)
      if (this.pdfSrc) {
        window.URL.revokeObjectURL(this.pdfSrc)
        this.pdfSrc = null
      }
      this.pdfSrc = url
      await this.$nextTick()
      this.$refs.printRef.onload = () => {
        this.$refs.printRef.contentWindow.print()
      }
    },
    async onCallLabClick() {
      try {
        const { data, error } = await this.getPacsLab()

        if (error) this.SET_SIDE_MESSAGE({ msg: '發生錯誤:' + error, type: 2 })
        if (data) {
          window.open(data)
        }
      } catch (err) {
        console.log(`error: `, err)
      } finally {
        this.FocusOnContent()
      }
    },
    async getPacsLab() {
      try {
        const data = await getPacsLab(`?patientId=${this.procedure.PatientId}`)
        return { data }
      } catch (error) {
        return { error }
      } finally {
        this.FocusOnContent()
      }
    },
    backToPreviousRoute() {
      this.$emit('backToPreviousRoute')
    },
    addObjectNote() {
      this.$emit('addObjectNote')
    },
    reNewReport() {
      this.$emit('reNewReport')
    },
    clickLeftArrow() {
      this.$refs.dtcToolBar.children[0].scrollLeft = 0
      this.isRightMost = false
    },
    clickRightArrow() {
      const scrollSpace = this.$refs.dtcToolBar.children[0].scrollWidth - this.$refs.dtcToolBar.children[0].offsetWidth
      this.$refs.dtcToolBar.children[0].scrollLeft = scrollSpace
      this.isRightMost = true
    },
    setRadiographerNoteData() {
      this.showClickRadiographerNoteRemind = false
      this.radiographerNoteHasData = false

      if (this.procedure.RadiographerNote) {
        this.radiographerNoteHasData = true
        this.showClickRadiographerNoteRemind = true
      }
    },
    openRadiographerNoteData() {
      this.showClickRadiographerNoteRemind = false
      this.$emit('WinMass4Radiographer')
    },
    onTempSaveClick() {
      this.$emit('DataSave', 63)
    },
    onSaveClick() {
      if (this.isNeedWriteExam && this.theReport.ScreeningWarning === -1) {
        this.$bvModal.show('examination-for-805-dialog')
      } else {
        this.$emit('DataSave', 71)
      }
    },
    needWriteExamSet() {
      this.interval = setInterval(() => {
        if (this.btnType === 'success') {
          this.btnType = 'danger'
        } else {
          this.btnType = 'success'
        }
      }, 600)
    },
    romoveWriteExamSet() {
      clearInterval(this.interval)
    },
    hisBtnFocus(target = '.repoSwithBtn.right', timer = 150) {
      let el = document.querySelector(target)
      if (el) {
        setTimeout(() => {
          el.focus()
        }, timer)
      }
    },
    BtnWatch(evt) {
      if (evt.key === 'ArrowRight') {
        this.hisBtnFocus()
      }

      if (evt.key === 'ArrowLeft') {
        this.hisBtnFocus('.repoSwithBtn.left')
      }
    },
  },
  created() {
    this.reportCode = this.continuousReportCode
  },
  mounted() {
    // this.btnsWidth = this.$refs.dtcToolBar.clientWidth - 90
    this.$nextTick(() => {
      this.$refs.dtcToolBar.style.maxWidth = this.btnsWidth
      this.$refs.dtcToolBar.children[0].style.overflowX = 'hidden'

      if (this.$refs.dtcToolBar.children[0].scrollWidth > this.$refs.dtcToolBar.children[0].clientWidth) {
        this.showArrow = true
        // this.$refs.dtcToolBar.style.maxWidth = this.btnsWidth + 'px'
        // this.$refs.dtcToolBar.children[0].style.overflowX = 'hidden'
      } else {
        this.showArrow = false
      }

      this.setRadiographerNoteData()
    })

    // window.addEventListener('keydown', this.BtnWatch)
  },
  beforeDestroy() {
    this.romoveWriteExamSet()
    if (this.pdfSrc) window.URL.revokeObjectURL(this.pdfSrc)

    // ****
    this.reportCount = 0
    this.recordReportContent = null
    this.objCount = 0
    this.autoRevoke = false
  },
  watch: {
    reportCode: {
      handler(newVal, oldVal) {
        if (oldVal && newVal) {
          this.SET_REPO(newVal)
          this.action_savingPersonalSetting()
          this.$emit('update:continuousReportCode', newVal)
        }
      },
      immediate: true,
      deep: true,
    },
    isPacAuto: {
      handler(newVal, oldVal) {
        if (oldVal && newVal && newVal !== oldVal) {
          this.action_savingPersonalSetting()
        }
      },
      immediate: true,
      deep: true,
    },
    dxrStatus: {
      handler(val) {
        if (val === 56 || val === 63) {
          if (this.reportCount === 0) {
            this.recordReportContent = this.dxrReportContent
            this.reportCount++
          }
          if (this.isObjAuto === 'Y') {
            // if(!this.dxrReportHasObj){
            //   if(this.objCount === 0 && val === 56){
            //     this.objCount++
            //     setTimeout(()=>{
            //       this.addObjectNote()
            //     }, 500)
            //   }
            // }
            if (this.objCount === 0 && val === 56) {
              this.objCount++
              setTimeout(() => {
                this.addObjectNote()
              }, 500)
            }
          }
        }
      },
      immediate: true,
      deep: true,
    },
    hasScreeningWarning(val) {
      if (!val && this.isNeedWriteExam && this.interval === null) {
        this.needWriteExamSet()
      } else if (val && this.interval) {
        this.romoveWriteExamSet()
      }
    },
  },
}
</script>

<style lang="scss">
.dtc-toolbar {
  height: 40px;
  > div {
    white-space: nowrap;
  }
}
.dtc-version-num {
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  text-align: center;
}
</style>

<style lang="scss" scoped>
#non-stop {
  .input-group-append,
  .input-group-prepend {
    width: 74px;
    overflow: hidden;
    .input-group-text {
      width: 100%;
      min-width: auto;
    }
  }
}

#pacauto {
  .input-group-append,
  .input-group-prepend {
    width: 50px;
    overflow: hidden;
    .input-group-text {
      width: 100%;
      min-width: auto;
    }
  }
}

.reportBtnsLayout {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: flex-start;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: 40px;

  .btnsLeft,
  .btnsRight {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: flex-start;
    justify-content: flex-start;
    align-items: center;
  }
  .btnsLeft {
    width: 324px;
    height: 40px;
  }
  .btnsRight {
    position: relative;
    width: calc(100% - 324px);

    .sContent {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-content: flex-start;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
    }

    .dtc-back {
      margin-left: 4px;
      min-width: 76px;
    }
  }
}

.repoSwithBtn {
  color: inherit;
  text-decoration: none;
  cursor: pointer;

  &:focus,
  &:hover {
    color: #007bff;
  }

  &:active {
    color: orange;
  }
}
</style>
