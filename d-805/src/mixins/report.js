import { mapGetters, mapState, mapMutations, mapActions } from 'vuex'
// import { defaultHotKeyArr, modifyOptions1, modifyOptions2, urgOptions, urg2Options, norOptions } from "./defaultData";
import { defaultHotKeyArr } from '@/components/report/defaultData'
import {
  getCstList,
  callPaceWebSocket,
  getReportByAccessionNo,
  reportSave,
  getReportContents,
  selectNoListForImageQuality,
  getFailImageReasonId,
  postFailImageReason,
  putFailImageReason,
  getPatientReportList,
  getActionReportEdit,
  getActionReportRelease,
  postRemoveTempReport,
  putSaveScreeningWarning,
  getPacsThumbnail
} from '@/assets/service/dataManager'
import * as configs from '@/config'
import KeyPressIdentifier from '@/assets/KeyPressIdentifier'
import Swal from 'sweetalert2'
import html2canvas from 'html2canvas'
import _, { get } from 'lodash'


const KeyCode4Control = configs.KeyCode4Control // 取得相關設定(這裡是 KeyCode 字串常數)
const KeyCode4Alternate = configs.KeyCode4Alternate
const KeyCode4Shift = configs.KeyCode4Shift
var OutterProprty4DynamicDeclare = { name4ContentDiff: 'versionDiffByDynamic' }
// import { DataManager, WebApiAdaptor } from "@syncfusion/ej2-data";

export default {
  data() {
    return {
      urgentLevels: [
        { text: '異常值通報', value: 'u1' },
        { text: '緊急危險通報', value: 'u2' },
        { text: '普通通報', value: 'u3' },
      ],
      failImageGlobalData: {
        AccessionNo: '',
        Type: 0,
        Modality: '',
        Step: 0,
        ReasonType: 0,
        Reason: '',
        EmployeeNo: '',
        EmployeeName: '',
        EmployeeCodeName: '',
        // CreateTime: "",
        PatientId: '',
        PatientSourceTypeCode: '',
        PatientSourceTypeName: '',
        DxreportPhysicianId: '',
        DxreportPhysicianName: '',
        ProcedureCode: '',
        ProcedureName: '',
        // StudyTime: "",
        // IssueTime: "",
      },
      failImageGlobalText: null,
      failImageGlobalRadioGrapher: null,
      failImageGet: false,
      tempReport: null,
      globalObjInsert: false,
      regObjG: /\[Clinical Information\]/g,
    }
  },
  computed: {
    ...mapState(['DxreportPhysician', 'phrase', 'attendingDrs', 'Profile4User']),
    ...mapGetters(['getProfile4User', 'getProfileHotkeySetting', 'getIssueDrs', 'getToggleReport', 'getPacAutoValue', 'getSaveAutoValue', 'getObjAutoValue']),
    backByUser: {
      get(){
        return this.backByUserTemp
      },
      set(val){
        this.backByUserTemp = val
      }
    },
    showDetailHeight() {
      const height =
        this.getToggleReport.reportDetail && this.getToggleReport.patientDetail
          ? 450
          : this.getToggleReport.reportDetail && !this.getToggleReport.patientDetail
          ? 333
          : !this.getToggleReport.reportDetail && this.getToggleReport.patientDetail
          ? 302
          : !this.getToggleReport.reportDetail && !this.getToggleReport.patientDetail
          ? 184
          : 184

      return {
        height: `calc(100vh - ${height - (this.getToggleReport.navigation ? 0 : 60)}px)`,
      }
    },
    showHistoryHeight() {
      const height =
        this.getToggleReport.reportDetail && this.getToggleReport.patientDetail
          ? 500
          : this.getToggleReport.reportDetail && !this.getToggleReport.patientDetail
          ? 383
          : !this.getToggleReport.reportDetail && this.getToggleReport.patientDetail
          ? 352
          : !this.getToggleReport.reportDetail && !this.getToggleReport.patientDetail
          ? 234
          : 234

      return {
        height: `calc(100vh - ${height - (this.getToggleReport.navigation ? 0 : 60)}px)`,
      }
    },
    pageProcess() {
      return `${this.pageIndex}/${this.totalArrayLen ? this.totalArrayLen : this.pageIndex}`
    },
    urgentPlaceholder() {
      const selectVal = (this.urgentPriorityCode === 'u2' ? this.urgOptions : this.urgentPriorityCode === 'u1' ? this.urg2Options : this.norOptions).find(
        ({ value }) => value == this.urgentOpt
      )

      if (!selectVal) return ''
      return `病患姓名: ${this.theProcedure.PatientName} 病歷號: ${this.theProcedure.PatientId}  ${
        this.urgentPriorityCode === 'u2' ? '緊急危險' : this.urgentPriorityCode === 'u1' ? '異常值' : '普通'
      }(${selectVal.text}) ${this.urgentOpt == 90 ? this.otherInput : ''}, 請速閱放射報告,並聯絡病患.`
    },
    pageIndex() {
      return this.totalArrayLen !== this.initArray.length // 資料未載完
        ? this.currentNum + (this.currentPage - 1) * this.perPage
        : this.currentNum
    },
    isShiftNoteAvaliable() {
      return this.theProcedure.ShiftNote && this.theProcedure.ShiftNote.length > 0
    },
    isCtMri() {
      return this.theProcedure.Modality && (this.theProcedure.Modality.includes('CT') || this.theProcedure.Modality.includes('MR'))
    },
    ShiftNoteNotice() {
      return this.theProcedure.ShiftNote && this.theProcedure.ShiftNote.length > 0 // && this.ShiftNoteNeedsToClick
    },
    numObj() {
      return {
        visibility: this.currentNum + (this.currentPage - 1) * this.perPage <= 1 || this.hideNextPrevBtn ? 'hidden' : 'visible',
        cursor: 'pointer',
      }
    },
    numObj2() {
      return {
        visibility: this.pageIndex >= this.totalArrayLen || this.hideNextPrevBtn ? 'hidden' : 'visible',
        cursor: 'pointer',
      }
    },
    instantObjective() {
      return this.theProcedure.Objective
    },
    reportCount: {
      get(){
        return this.getTempReportCount()
      },
      set(val){
        this.SET_TEMPREPORTCOUNT(val)
      }
    },
    objCount: {
      get(){
        return this.getTempObjCount()
      },
      set(val){
        this.SET_TEMPOBJCOUNT(val)
      }
    },
    dxrReportHasObjG: {
      get(){
        return this.regObjG.test(this.theReport.ReportContent)
      }
    },
    autoRevoke: {
      get(){
        return this.getAutoRevoke()
      },
      set(val){
        this.SET_AUTOREVOKE(val)
      }
    },
    autoRevokeAccessionNo: {
      get(){
        return this.getAutoRevokeAccessionNo()
      },
      set(val){
        this.SET_AUTOREVOKEACCESSIONNO(val)
      }
    },
    recordReportContent: {
      get(){
        return this.getTempReportContent()
      },
      set(val){
        this.SET_TEMPREPORTCONTENT(val)
      }
    },
    instantReportContent: {
      get(){
        return this.theReport.ReportContent
      }
    },
    instantReportStatus: {
      get(){
        return this.theReport.DxrStatus
      }
    },
  },
  methods: {
    ...mapGetters(['getTempReportCount', 'getTempObjCount', 'getTempReportContent', 'getAutoRevoke', 'getAutoRevokeAccessionNo', 'getMphraseValue']),
    ...mapActions(['action_getPhrase']),
    ...mapMutations([
      'SHOW_LOADING',
      'HIDE_LOADING',
      'SET_SIDE_MESSAGE',
      'CLEAR_PHRASE',
      'SET_PRIVATE_PHRASE',
      'SET_PUBLIC_PHRASE',
      'SET_ATTENDING_DR',
      'SET_HOTKEY',
      'SET_REPORT_TOGGLE',
      'CLEAR_FAIL_IMAGE',
      'SET_TEMPREPORTCOUNT',
      'SET_TEMPOBJCOUNT',
      'SET_AUTOREVOKE',
      'SET_AUTOREVOKEACCESSIONNO',
      'SET_TEMPREPORTCONTENT',
      'SET_MPHRASE'
    ]),
    async getReportByAccessionNo(AccessionNo, PatientId) {
      try {
        const data = await getReportByAccessionNo(AccessionNo, PatientId)
        this.theReport = data
        // console.log(`getReportByAccessionNo: `, this.theReport)
      } catch (error) {
        console.log(error)
      }
    },
    async getReportFailImage(AccessionNo, PatientId) {
      try {
        const data = await getReportByAccessionNo(AccessionNo, PatientId)
        this.tempReport = data
        console.log(`getReportFailImage: `, this.tempReport)
      } catch (error) {
        console.log(error)
      }
    },
    fillReportDxDrInfo(no) {
      const existReport = this.initArray.find(({ AccessionNo }) => no === AccessionNo)
      if (existReport) {
        ;['DxreportPhysicianId', 'DxreportPhysicianName'].forEach((key) => {
          if (!this.theReport[key] || key === 'DxreportPhysicianName') this.theReport[key] = existReport[key]
        })
      }
    },
    _removeActiveHistoryCursorPos(keep) {
      const el = document.querySelector('.active-history')
      if (!el) return
      keep ? '' : el.classList.remove('active-history')
      let id = el.id.replace('dtc-history', '')
      return [Number(id), el]
    },
    _updateActiveHistoryCursorPos(id) {
      const target = document.querySelector('#dtc-history' + id)
      if (target) {
        target.classList.add('active-history')
        // target.scrollIntoView()
      }
    },
    addNoteB4Save() {
      if (!this.isAbleToModifyReport()) return
      let IsThemeBlack = this.$IsThemeBlack()
      this.winConfig4VersionHistory.HeadBgV = IsThemeBlack ? 'info' : 'primary'
      this.winConfig4VersionHistory.HeadTxV = IsThemeBlack ? 'light' : 'light'
      this.$bvModal.show('dtcModifyReport')
    },
    async callView() {
      const url = this.callLab + this.theProcedure.PatientId
      let ok = true
      //this.openPopupWindow();
      this.windowObj = window.open()
      try {
        this.SET_SIDE_MESSAGE({ msg: 'CALL LAB 送出 ' })
        this.windowObj.location.href = url
        window.callLabUrl = url
      } catch (e) {
        ok = false
      } finally {
        //setTimeout(() => this.windowObj.close(),5000);
        if (ok) console.log('')
        //this.SET_SIDE_MESSAGE('CALL LAB 成功送出 @ ' + url);
        else this.SET_SIDE_MESSAGE({ msg: 'CALL LAB 通知失敗 @ ' + url, type: 2 })
      }
    },
    BMWatch(bvEvent, modalId) {
      if (modalId === 'WinCST0301' && bvEvent.type === 'shown') {
        const item = this.cstTab.find((s) => s.CSTName === this.cstTabName)
        if (!item) return
        const myData = item.structureData
        //alert(myData);
        if (!myData) return
        window.dtcCurrentCstData = window.cstResultStr = myData
        let valueSet = JSON.parse(myData)
        if (valueSet && valueSet.length > 0) {
          valueSet.forEach((e) => {
            let item = $(`#WinCST0301DxRSC [name="${e.name}"]`)
            if (item && item.length > 0) {
              let detail = item[0]
              if (',INPUT,TEXTAREA,SELECT,'.indexOf(`,${detail.tagName},`) >= 0) {
                if (detail.type === 'radio' || detail.type === 'checkbox') {
                  $.each(item, (index, content) => {
                    if (content.value === e.value) {
                      content.checked = true
                      return false
                    }
                  })
                } else {
                  item.val(e.value)
                }
              }
            }
          })
        }
      }
      if (modalId === 'WinConfig') {
        if (',shown,'.indexOf(`,${bvEvent.type},`) >= 0) {
          this.allowHotKeyFunctional = false
        } else if (',hidden,'.indexOf(`,${bvEvent.type},`) >= 0) {
          this.allowHotKeyFunctional = true
        }
        return
      } else if (modalId === 'WinHotkeyDetect0301') {
        if (',shown,'.indexOf(`,${bvEvent.type},`) >= 0) {
          this.UnderHotkeyDetect = true
          window.removeEventListener('keydown', this.HKWatch)
        } else if (',hidden,'.indexOf(`,${bvEvent.type},`) >= 0) {
          window.addEventListener('keydown', this.HKWatch)
          this.UnderHotkeyDetect = false
        }
        return
      } else if (modalId === 'WinWait') {
        // 只是遮罩, 無須處理
        return
      }
      //
      this.allowHotKeyFunctional = ',show,shown,'.indexOf(`,${bvEvent.type},`) < 0
    },
    async callPacs(str, focus = false, AccessionNo = null) {
      
      let ok = true
      
      this.lockingCallPacs = true
      setTimeout(() => (this.lockingCallPacs = false), 10 * 1000)
      // this.openPopupWindow();

      let apiAccessionNo =  AccessionNo ? AccessionNo : this.theProcedure.AccessionNo

      try {
        str == 'show' ? '' : this.SET_SIDE_MESSAGE({ msg: '已呼叫PACS' })

        // console.log(`callPacs > AccessionNo: `, AccessionNo)
        // console.log(`callPacs > this.theProcedure.AccessionN: `, this.theProcedure.AccessionNo)
        // console.log(`callPacs > apiAccessionNo: `, apiAccessionNo)
        
        console.log(`ready to callPacs ~`)

        const url = await window.axios(`/api/PacsUri/` + apiAccessionNo)
        // window.packUrl = url

        callPaceWebSocket(url)
          .then((res)=>{
            console.log(`callPacs > res:`, res)
          }).catch((err)=>{
            console.log(`callPacs > error: `, err)
          }).finally(()=>{
            console.log(`callPacs > finally`)
            
            if(!focus){
              // this.FocusOnContent()
              // setTimeout(()=>{
              //   requestAnimationFrame(() => {
              //     this.textareaFocusWork(url)
              // })}, 3000)
              setTimeout(()=>{
                requestAnimationFrame(() => {
                  this.FocusOnContent()
              })}, 3000)
            }
          })

        // this.textareaFocusWork() //強迫把focus抓回來

        // window.packUrl = url;
        // this.windowObj.location.href = url;
      } catch (err) {
        ok = false
      } finally {
        // setTimeout(() => this.windowObj.close(), 5000);
        if (ok) {
          //this.SET_SIDE_MESSAGE('已呼叫PACS @ ' + url);
        } else if (process.env.NODE_ENV === 'production') {
          this.SET_SIDE_MESSAGE({ msg: '呼叫PACS發生錯誤', type: 2 })
        }
      }
    },
    copyPasteText() {
      this.theReport.ReportContent += '\n' + this.viewHistoryItem.ReportContent
      this.showImgReport = false
      this.$bvModal.hide('view-history')
      this.SET_SIDE_MESSAGE({ msg: '資料已複製並貼上' })
    },
    EndOfKPInterceptor() {
      // 熱鍵設定完成後, 存入暫時組態集
      // console.log(this.$logs(this.HotkeyCurrentItemName));
      let newHotkey = this.HotkeyPressed
      // 如新熱鍵不為空值, 先清掉重複的
      if (newHotkey && newHotkey.length > 0) {
        this.HotkeyTempSet.forEach((e) => {
          if (e.hotkey === newHotkey) {
            e.hotkey = ''
          }
        })
      }
      // 找到對應項目, 設入新熱鍵值
      this.HotkeyTempSet.some((e) => {
        if (e.title === this.HotkeyCurrentItemName) {
          e.hotkey = this.HotkeyPressed
          // console.log(this.$logs(`${this.HotkeyCurrentItemName} > ${e.hotkey}`));
          return true
        }
      })
      // 關閉熱鍵取值框
      this.UnderHotkeyDetect = false
      this.HotkeyConfigSave()
      this.$refs['WinHotkeyDetect'].hide()
    },
    FocusOnContent() {
      // 設定(報告內容編輯區塊)為焦點所在 ; disable run time error
      setTimeout(() => {
        this.$nextTick(() => {
          if (this.$refs['reportPlainText']) this.$refs['reportPlainText'].focus()
        })
      }, 250)
    },
    getStatus(n) {
      n = Number(n)
      let s = ''
      if (n == 61) {
        s = '退回重寫'
      } else if (n == 63) {
        s = '暫存檔案'
      } else if (n == 65) {
        s = '等待審核'
      } else if (n == 71) {
        s = '正式報告'
      }
      return s
    },
    getReportPhraseStr(v) {
      if (!this.phraseRecords.length) return ''
      const ret = this.phraseRecords.find((s) => {
        return s.PhraseCode.toLowerCase() === v.toLowerCase()
      })
      return ret ? ret.Replacement : ''
    },
    goNextHistory() {
      let [id, el] = this._removeActiveHistoryCursorPos()
      
      id = Number(id) + 1
      
      const len = this.historyList.length - 1
      
      if (id > len) {
        el.classList.add('active-history')
        return
      }

      this._updateActiveHistoryCursorPos(id)

      this.openHistory()
    },
    goPrevHistory() {
      let [id, el] = this._removeActiveHistoryCursorPos()
      
      --id

      if (id < 0) {
        el.classList.add('active-history')
        return
      }
      this._updateActiveHistoryCursorPos(id)

      this.openHistory()
    },
    HKWatch(event) {
      // 熱鍵 vs. 功能 分派器
      //console.log(this.$logs())
      // 取得 自訂按鍵辨識字串
      let keyCombine = KeyPressIdentifier(event)
      // console.log(`keyCombine > `, keyCombine)

      if (!keyCombine) {
        return
      }

      //
      // HotKey 機制之開啟或閉鎖機制
      if (!this.allowHotKeyFunctional) {
        // console.log(this.$logs("OFF"));
        return
      }
      //
      //this.HotkeyPressed = keyCombine
      let runMethod = null
      let param = ''

      //
      if (runMethod) {
        // console.log(this.$logs(runMethod));
        event.preventDefault()
        this[runMethod](param)
      }

    },
    insertHistoryContent() {
      if (!this.showHistoryDlg) return
      this.showImgReport = false
      const sltStart = this.$refs.reportPlainText.selectionStart
      // 前文
      const textBefore = this.theReport.ReportContent ? this.theReport.ReportContent.substring(0, sltStart) : ''
      // 後文
      const textAfter = this.theReport.ReportContent ? this.theReport.ReportContent.substring(sltStart, this.theReport.ReportContent.length) : ''
      // 插入後的新位置
      const newSelectPos = textBefore.length + this.viewHistoryItem.ReportContent.length
      // const newSelectPos = this.theReport.ReportContent.length + this.viewHistoryItem.ReportContent.length - textAfter.length;
      this.theReport.ReportContent = textBefore + this.viewHistoryItem.ReportContent + textAfter
      this.$refs.reportPlainText.selectionStart = this.$refs.reportPlainText.selectionEnd = newSelectPos
      this.$nextTick(() => {
        this.$refs.reportPlainText.selectionStart = this.$refs.reportPlainText.selectionEnd = newSelectPos
      })
    },
    insertObjectContent() {
      if(this.dxrReportHasObjG){
        this.SET_SIDE_MESSAGE({ msg: `'臨床註記' 已存在`, type: 2 })
        return
      }

      let noteBefore = `[Clinical Information]\n`
      let tempObjective = _.cloneDeep(this.instantObjective)
      let noteAfter = this.theReport.ReportContent ? '\n\n' : '\n'
      let noteLast = '\n'
      
      if(!tempObjective){
        // if(process.env.NODE_ENV === 'development'){
        //   this.SET_SIDE_MESSAGE({ msg: `無 '臨床註記'`, type: 2 })
        // }
        console.log(`無 '臨床註記'`)
        tempObjective = 'None.'
      }
      
      let sltStart = this.$refs.reportPlainText.selectionStart
      let textBefore = this.theReport.ReportContent ? this.theReport.ReportContent.substring(0, sltStart) : ''
      let textAfter = this.theReport.ReportContent ? this.theReport.ReportContent.substring(sltStart, this.theReport.ReportContent.length) : ''      
      let newSelectPos = textBefore.length + noteBefore.length + tempObjective.length + noteAfter.length + noteLast.length
      this.theReport.ReportContent = noteBefore + tempObjective + noteAfter + textBefore + textAfter + noteLast

      this.$nextTick(() => {
        this.$refs.reportPlainText.selectionStart = this.$refs.reportPlainText.selectionEnd = newSelectPos
        if(process.env.NODE_ENV === 'development'){
          this.SET_SIDE_MESSAGE({ msg: `'臨床註記' 已插入` })
        }
        console.log(`'臨床註記' 已插入`)
        this.$refs.reportPlainText.focus()
      })

    },
    insertAfter(newNode, referenceNode) {
      referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling)
    },
    async handleCanvasImage() {
      if (!this.$refs.reportTabs) return true
      const items = this.isSubReport ? this.$refs.reportTabs.$el.querySelectorAll('div.class-report-demo') : this.$refs.reportTabs.$el.querySelectorAll('form')

      return new Promise((resolve, reject) => {
        if (items.length === 0) resolve(false)
        ;[].forEach.call(items, (el, idx) => {
          let copiedEl = el.cloneNode(true)
          document.body.append(copiedEl)
          copiedEl.setAttribute('style', 'color: #000')
          ;[].forEach.call(copiedEl.querySelectorAll('textarea'), (tarea) => {
            const newDiv = document.createElement('div')
            newDiv.setAttribute('style', 'min-width: 50%; max-width: 80vw; min-height: 150px; border: 1px solid #000; padding: 10px; border-radius: 3px;')
            // newDiv.textContent = tarea.value.replace(/\n\r?/g, '<br />');
            newDiv.innerHTML = `<p>${tarea.value.replace(/\n\r?/g, '<br />')}</p>`
            this.insertAfter(newDiv, tarea)
            tarea.parentNode.removeChild(tarea)
          })
          html2canvas(copiedEl).then((canvas) => {
            this.theReport[`StructureImage${idx + 1}`] = canvas.toDataURL()
            if (idx === items.length - 1) {
              resolve(true)
            }
          })
          document.body.removeChild(copiedEl)
        })
      })
    },
    HotkeyConfigReset() {
      this.HotkeyTempSet = this.$DeepCopy(this.HotkeyList)
      this.SET_SIDE_MESSAGE({ msg: '組態設定已回復原值' })
    },
    async HotkeyConfigDefault() {
      this.HotkeyTempSet = this.HotkeyList
      this.HotkeyTempSet.forEach((e) => {
        e.hotkey = e.default
      })
      this.SET_SIDE_MESSAGE({ msg: 'Hotkey組態設定已重置成系統設定' })
      let obj = { EmployeeNo: this.loginId, PersonalSetting: '' }
      await window.axios.put(`/employee/SavePersonalSetting?employeeNo=${this.loginId}`, obj)
      this.SET_HOTKEY(JSON.stringify(this.HotkeyList))
    },
    async HotkeyConfigSave() {
      this.HotkeyList = this.$DeepCopy(this.HotkeyTempSet)
      let param = {
        AccId: this.UserId,
        Setting: JSON.stringify(this.HotkeyList),
      }
      try {
        this.SHOW_LOADING()
        let obj = {
          EmployeeNo: this.loginId,
          PersonalSetting: JSON.stringify(param),
        }
        await window.axios.put(`/employee/SavePersonalSetting?employeeNo=${this.loginId}`, obj)
        let okMessage = `組態設定已完成`
        this.SET_SIDE_MESSAGE({ msg: okMessage })
        this.SET_HOTKEY(JSON.stringify(this.HotkeyList))
      } catch (e) {
        this.SET_SIDE_MESSAGE({ msg: '組態設定 FAIL' })
      } finally {
        this.HIDE_LOADING()
      }
    },
    async notifyUrgentMsg() {
      if (!this.urgentPlaceholder) {
        this.SET_SIDE_MESSAGE({
          msg: '尚未輸入緊急通報原因, 不得存檔.',
          type: 2,
        })
        return
      }
      const obj = {
        RequestingPhysicianId: this.theProcedure.RequestingPhysicianId,
        DxReportPhysicianId: this.theReport.DxreportPhysicianId ? this.theReport.DxreportPhysicianId : this.loginId,
        AccessionNo: this.theProcedure.AccessionNo,
        Message: this.urgentPlaceholder,
        HRRLevelId: this.urgentPriorityCode == 'u2' ? '1' : this.urgentPriorityCode == 'u1' ? '2' : '3',
        HRRItemId: this.urgentOpt,
        HRRItemDesc: this[this.urgentPriorityCode == 'u2' ? 'urgOptions' : this.urgentPriorityCode == 'u1' ? 'urg2Options' : 'norOptions'].find(
          ({ value }) => value == this.urgentOpt
        ).text,
        HRROthersNote: this.otherInput,
      }
      this.SHOW_LOADING()
      try {
        await window.axios.post('/Hrr/Save', obj)
        this.SET_SIDE_MESSAGE({ msg: '緊急通知成功送出' })
      } catch (e) {
        this.SET_SIDE_MESSAGE({ msg: '送出緊急通知失敗', type: 2 })
      } finally {
        this.HIDE_LOADING()
        this.$bvModal.hide('urgent-report')
      }
    },
    // 按enter 執行事件  exp:寄異常報告簡訊
    keydownEnterSendSMS() {
      document.addEventListener('keydown', this.sendSMSWhenEnter)
    },
    cancelkeydownEnterSendSMS() {
      document.removeEventListener('keydown', this.sendSMSWhenEnter)
      this.FocusOnContent()
    },
    sendSMSWhenEnter(evt) {
      if (evt.key === 'Enter' && document.getElementById('abnormalSmsTextarea') != document.activeElement) {
        this.sendAbnormalReport(evt)
      }
    },
    // 寄異常報告簡訊
    async sendAbnormalReport(event) {
      event.preventDefault()
      if (!this.doctorName) {
        this.SET_SIDE_MESSAGE({
          msg: '通知醫師缺失, 不得發送.',
          type: 2,
        })
        return
      } else if (this.abnormalSms === '') {
        this.SET_SIDE_MESSAGE({
          msg: '尚未輸入緊急通報原因, 不得發送.',
          type: 2,
        })
        return
      } else if (this.phoneNumber === '') {
        this.SET_SIDE_MESSAGE({
          msg: '尚未輸入電話號碼, 不得發送.',
          type: 2,
        })
        return
      }
      const obj = {
        AccessionNo: this.theReport.AccessionNo,
        RequestingPhysicianId: this.theProcedure.RequestingPhysicianId,
        DxReportPhysicianId: this.theReport.IssuePhysicianId ? this.theReport.IssuePhysicianId : this.loginId,
        Message: this.abnormalSms,
        Tel: this.phoneNumber,
        IsAddRemark: this.autoAdd,
      }
      this.SHOW_LOADING()
      try {
        await window.axios.post('/Hrr/Save', obj)
        this.SET_SIDE_MESSAGE({ msg: '緊急通知成功送出' })
        if (this.autoAdd) {
          this.addAbnormalReportToReportContent()
          setTimeout(()=>{
            this.FocusOnContent()
          },250)
        }
      } catch (e) {
        this.SET_SIDE_MESSAGE({ msg: '送出緊急通知失敗', type: 2 })
      } finally {
        this.HIDE_LOADING()
        this.$bvModal.hide('abnormal-report')
      }
    },
    repotKeyDown119({ code, target }) {
      if (code === 'F8') this.findReportPhraseStr(target)
    },
    async editHtmlReport(item) {
      let ret = ''
      item ? (this.cstTabName = item.CSTName) : (ret = this.cstTab.find((s) => s.CSTName === this.cstTabName))
      //alert( this.cstTabName)
      if (ret) {
        item = ret
        //alert(this.cstTabName + item.structureData)
      } else if (item) {
        const t = this.cstTab.find((s) => s.CSTName === item.CSTName)
        if (t) {
          this.SET_SIDE_MESSAGE({
            msg: `${item.CSTName}已存在,請選擇其他`,
            type: 2,
          })
          return
        }
        this.$refs[this.isSubReport ? 'subTemplate' : 'reportTemplate'].hide()
        const html = (await window.axios.get('/cst/Get?cstId=' + item.CSTId)).StructureContent
        item.cstHtml = html
        if (!this.cstTab) this.cstTab = []

        this.reportImg = true
        this.showImgReport = true
        this.cstTab = [...this.cstTab, item]

        this.registerReportEvent('remove') // 移除監聽phrase
        this.$nextTick(() => {
          this.registerReportEvent('add') // 增加監聽phrase
        })
      } else {
        return
      }
      const myId = `#t-${item.CSTName}`
      setTimeout(() => document.querySelector(myId).click(), 500)
      this.cstReportHtml = item.cstHtml // it contains html only; the data is saved in differnt place
    },
    findReportPhraseStr(target) {
      const taskObject = target || this.$refs['reportPlainText']
      if (!taskObject.value) return
      const isMainReport = !target
      const value = taskObject.value.trim()
      const arr = Array.from(value)
      let words = []
      let end = taskObject.selectionEnd
      for (let i = end - 1; -1 < end; --i) {
        if (/^\w+$/.test(value[i]) || /\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\{|\}|\[|\]|\||\;|\:|\'|\"|\,|\.|\/|\<|\>|\?|\\/.test(value[i])) {
          words = [arr[i], ...words]
        } else {
          break
        }
        --end
      }
      const key = words.join('')
      const replacement = this.getReportPhraseStr(key).trim()
      // const lastKeyWord = replacement.slice(-5);
      if (!replacement) return
      const len = value.length - words.length
      const orig = 1 > len ? '' : arr.slice(0, taskObject.selectionEnd - key.length).join('')
      // alert(orig)
      let rightStr = 1 > len ? '' : arr.slice(taskObject.selectionEnd, value.length).join('')
      // alert(rightStr)
      if (rightStr === key) {
        rightStr = ''
      }
      if (isMainReport) {
        this.theReport.ReportContent = orig ? `${orig}${replacement}${rightStr}` : `${replacement}${rightStr}`
      } else {
        target.value = orig ? `${orig}${replacement}${rightStr}` : `${replacement}${rightStr}`
      }
      this.$nextTick(() => {
        taskObject.selectionStart = taskObject.selectionEnd = taskObject.selectionEnd - rightStr.length
      })

      // taskObject.selectionEnd = end + replacement.length;
    },
    registerReportEvent(state) {
      if (!this.$refs.reportTabs || !this.$refs.reportTabs.$el) return // alert("T");
      ;[].forEach.call(this.$refs.reportTabs.$el.querySelectorAll('textarea'), (el) => {
        if (state === 'add') {
          el.addEventListener('keydown', this.repotKeyDown119)
        } else {
          el.removeEventListener('keydown', this.repotKeyDown119)
        }
      })
    },
    async f() {
      if (window.isSavingDtc) return
      if (!this.isDataChange || !this.theReport || this.theReport.DxrStatus == 71) return
      const update = this.saveFullScreenForm()
      !this.isDataChange && update ? (this.isDataChange = true) : ''
      this.isDataChange = false
      console.log(`tempSave~`)
      await this.DataSave(63, true)
    },
    fillCstFromData(id) {
      if (!window.cstResultStr) return
      let valueSet = JSON.parse(window.cstResultStr)
      //this.areaBlock(id);
      if (valueSet && valueSet.length > 0) {
        valueSet.forEach((e) => {
          let item = $(`${id} [name="${e.name}"]`)
          if (item && item.length > 0) {
            let detail = item[0]
            if (',INPUT,TEXTAREA,SELECT,'.indexOf(`,${detail.tagName},`) >= 0) {
              if (detail.type === 'radio' || detail.type === 'checkbox') {
                $.each(item, (index, content) => {
                  if (content.value === e.value) {
                    content.checked = true
                    return false
                  }
                })
              } else {
                item.val(e.value)
              }
            }
          }
        })
      }
    },
    conbineData2Content(valueStr, content) {
      if (!valueStr) return content
      const value = JSON.parse(valueStr)
      const { source } = JSON.parse(content)
      source.forEach((s) => {
        s.items.forEach((item) => {
          if (value[item.key]) {
            item.value = value[item.key]
          }
        })
      })
      return JSON.stringify({ source })
    },
    async getDataFromStore() {
      if (this.$store.state.fi0304TabSource) {
        const { rows, query, searchCondition, currentKey, rowIdx, tabList } = this.$store.state.fi0304TabSource
        const specificTab = tabList.find(({ id }) => id === currentKey)
        this.storeQuery.query = query
        this.storeQuery.rows = rows
        this.storeQuery.tabList = tabList
        this.perPage = specificTab.per
        this.currentPage = specificTab.page
        this.currentNum = rowIdx
        this.currentTab = currentKey
        this.totalArrayLen = specificTab.count
        this.searchCondition = searchCondition
        this.dxrVersion = `${this.currentNum}/` + this.totalArrayLen
        this.initArray = rows
        this.$store.unregisterModule('fi0304TabSource')

        if (this.totalArrayLen > this.initArray.length) {
          getReportContents(this.searchCondition, this.storeQuery.query).then(({ actual: { Items } }) => {
            // 取得剩餘報告
            const _currentIdx = (this.currentPage - 1) * this.perPage
            Items.splice(_currentIdx, this.perPage, ...this.initArray)
            this.initArray = Items
            this.currentNum = this.currentNum + (this.currentPage - 1) * this.perPage

            if (this.isFetchingData) {
              this.HIDE_LOADING() // 強制
              const actionType = this.isFetchingData
              this.isFetchingData = ''
              this[`view${actionType === 'next' ? 'Next' : 'Prev'}Record`]()
            }
          })
        }
      } else {
        // 沒資料則回去
        this.$router.replace({
          name: this.isSubReport ? 'FI0304ForSub' : 'FI0304',
        })
      }
      this.registerSpecificProcedure(Object.assign({}, this.initArray[this.currentNum - 1]))

      if (this.initArray[this.currentNum - 1]) this.action_getPhrase(this.initArray[this.currentNum - 1]['DxreportPhysicianId']) // 取片語資料
    },
    updateSpecificReportValue({ key, value }) {
      this.theReport[key] = value
    },
    updateSpecificVariable({ key, value }) {
      this[key] = value
    },
    openHistory() {
      let [id] = this._removeActiveHistoryCursorPos(true)

      this.hisItemFocus(id, 200)

      // const item = this.historyList[id]
      // this.viewHistoryReport(item, id)
    },
    openPopupWindow() {
      const height = 5
      const width = 5
      const t = innerHeight - height
      const l = innerWidth - width
      this.windowObj = window.open(
        'DTC:PACK',
        'PACS',
        `height=10,width=10,left=${l},top=${t},resizable=no,scrollbars=no,toolbar=no,menubar=no,location=no,directories=no, status=no`
      )
    },
    isAbleToModifyReport() {
      // const { DxreportPhysicianId, IssuePhysicianId, EditDxreportPhysicianId} = this.theReport;
      // console.log({ DxreportPhysicianId, IssuePhysicianId, EditDxreportPhysicianId, loginId: this.loginId });
      const ok1 = this.theReport.DxreportPhysicianId === this.loginId && this.theReport.DxrStatus == 71
      const ok2 = this.theReport.IssuePhysicianId === this.loginId && this.theReport.DxrStatus == 71
      const ok3 = this.theReport.EditDxreportPhysicianId === this.loginId && this.theReport.DxrStatus == 71
      return ok1 || ok2 || ok3
    },
    Item4Config(e) {
      // 開啟 熱鍵取值 視窗
      this.HotkeyCurrentItemName = e
      let IsThemeBlack = this.$IsThemeBlack()
      let textVariant = IsThemeBlack ? 'warning' : 'primary'
      let currentValue = ''
      let defaultValue = ''
      this.HotkeyTempSet.some((el) => {
        if (el.title === e) {
          currentValue = this.KeyCode2Text(el.hotkey)
          defaultValue = this.KeyCode2Text(el.default)
        }
      })
      this.HotkeyPressRemark = `<span class="text-${textVariant}">目前設定值為 ${currentValue} 預設值為 ${defaultValue}</span>`
      this.HotkeyPressed = ''
      this.HotkeyPressMessage = '等待 您的輸入...'
      this.winConfig4HotkeyDetect.Title = '個人化 Hotkey 設定'
      this.winConfig4HotkeyDetect.HeadBgV = IsThemeBlack ? 'info' : 'primary'
      this.winConfig4HotkeyDetect.HeadTxV = IsThemeBlack ? 'light' : 'light'
      this.$refs['WinHotkeyDetect'].show()
    },
    InstantPhraseCreate() {
      const textarea = this.$refs['reportPlainText'].$el
      const selectionStart = textarea.selectionStart
      const selectionEnd = textarea.selectionEnd
      if (textarea) {
        if (selectionEnd > selectionStart) {
          this.instantContent = textarea.value.substring(selectionStart, selectionEnd)
          this.WinMass4Phrase()
        } else {
          const phrases = _.orderBy(this.$store.state.phrase.private.concat(this.$store.state.phrase.public), [({PhraseCode:{length}})=> length, 'PhraseCode'], ['desc'] )
          const frontContent = textarea.value.substring(0, selectionStart)
          const backContent = textarea.value.substring(selectionStart)
          let count = 0

          // isMphrase mode ?
          if(this.isMphrase === 'Y'){
            for (const phrase of phrases) {
              if(phrase.Modality === this.instantModality){
                let preReg = /[^\w]/g
                let result = phrase.PhraseCode.replace(preReg, ($)=>{
                  return '\\' + $
                })
                let regex = new RegExp(`(?<![^\\s]{1,})${result}$`)

                if(regex.test(frontContent) && count === 0){
                  count++
                  this.theReport.ReportContent = frontContent.replace(regex, phrase.Replacement) + backContent
                  let tempBefore = frontContent.replace(regex, phrase.Replacement)
                  let textFocus = tempBefore
                  let newSelectPos = textFocus.length

                  this.$nextTick(() => {
                    this.$refs.reportPlainText.selectionStart = this.$refs.reportPlainText.selectionEnd = newSelectPos
                    this.$refs.reportPlainText.focus()
                  })

                  break
                }
              }
            }
          }else{
          // normal mode
            for (const phrase of phrases) {
              let preReg = /[^\w]/g
              let result = phrase.PhraseCode.replace(preReg, ($)=>{
                return '\\' + $
              })
              let regex = new RegExp(`(?<![^\\s]{1,})${result}$`)

              if (regex.test(frontContent) && count === 0) {
                count++
                this.theReport.ReportContent = frontContent.replace(regex, phrase.Replacement) + backContent
                let tempBefore = frontContent.replace(regex, phrase.Replacement)
                let textFocus = tempBefore
                let newSelectPos = textFocus.length

                this.$nextTick(() => {
                  this.$refs.reportPlainText.selectionStart = this.$refs.reportPlainText.selectionEnd = newSelectPos
                  this.$refs.reportPlainText.focus()
                })

                break
              }
            }
          }

          // for (const phrase of phrases) {
          //   if (this.isMphrase === 'Y') {
          //     if(phrase.Modality === this.instantModality){
          //       const regex = new RegExp(`(?<![^\\s]{1,})${phrase.PhraseCode}$`)
          //       if(regex.test(frontContent)){
          //         this.theReport.ReportContent = frontContent.replace(regex, phrase.Replacement) + backContent
          //         let tempBefore = frontContent.replace(regex, phrase.Replacement)
          //         let textFocus = tempBefore
          //         let newSelectPos = textFocus.length

          //         this.$nextTick(() => {
          //           this.$refs.reportPlainText.selectionStart = this.$refs.reportPlainText.selectionEnd = newSelectPos
          //           this.$refs.reportPlainText.focus()
          //         })
          //       }
          //     }
          //   }else{
          //     const regex = new RegExp(`(?<![^\\s]{1,})${phrase.PhraseCode}$`)
          //     if (regex.test(frontContent)) {
          //       this.theReport.ReportContent = frontContent.replace(regex, phrase.Replacement) + backContent
          //       let tempBefore = frontContent.replace(regex, phrase.Replacement)
          //       let textFocus = tempBefore
          //       let newSelectPos = textFocus.length

          //       this.$nextTick(() => {
          //         this.$refs.reportPlainText.selectionStart = this.$refs.reportPlainText.selectionEnd = newSelectPos
          //         this.$refs.reportPlainText.focus()
          //       })
          //     }
          //   }
          // }
        }
      }
    },
    InstantPhraseInsert(){
      console.log(`InstantPhraseInsert~`)
    },
    async getHotKeySetting() {
      const savingMethods = this.getProfileHotkeySetting.map(({ method }) => method)
      const restOfArr = defaultHotKeyArr.filter(({ method }) => !savingMethods.includes(method))
      this.HotkeyList = this.getProfileHotkeySetting.length > 0 ? this.getProfileHotkeySetting.concat(restOfArr) : [...defaultHotKeyArr]
    },
    getCstRecords() {
      for (let i = 1; i < 7; ++i) {
        this.theReport[`StructureData${i}`] = ''
        this.theReport[`StructureContent${i}`] = ''
        this.theReport[`StructureImage${i}`] = ''
        this.theReport[`CSTName${i}`] = ''
        this.theReport[`CSTId${i}`] = ''
      }
      //if(!this.cstTab.length) return;
      this.cstTab.forEach((s, i) => {
        let idx = i + 1
        this.theReport[`StructureData${idx}`] = s.structureData ? s.structureData : ''
        this.theReport[`StructureContent${idx}`] = s.cstHtml
        this.theReport[`StructureImage${idx}`] = s.img ? s.img : ''
        this.theReport[`CSTName${idx}`] = s.CSTName
        this.theReport[`CSTId${idx}`] = s.CSTId
      })
    },
    jumpingToTextArea() {
      let jumpCount = 3
      let focusEvent = () => {
        jumpCount -= 1
        if (!document.getElementById('WinMass0301___BV_modal_body_').querySelector('textarea:focus')) {
          const _textarea = document.getElementById('WinMass0301___BV_modal_body_').querySelector('textarea')
          this.$nextTick(() => {
            _textarea.focus()
            _textarea.scrollTop = 0
          })
        }
        if (jumpCount <= 0) {
          clearInterval(jumpInterval)
        }
      }
      let jumpInterval = setInterval(focusEvent, 250)
    },
    KeyCode2Text(code) {
      // 轉換 自訂按鍵辨識字串 為 html tag 值, 以利在畫面上突顯呈現
      let value = ''
      if (code.indexOf(KeyCode4Control) >= 0) {
        value += '<kbd>Ctrl</kbd> + '
        code = code.replace(KeyCode4Control, '')
      }
      if (code.indexOf(KeyCode4Alternate) >= 0) {
        value += '<kbd>Alt</kbd> + '
        code = code.replace(KeyCode4Alternate, '')
      }
      if (code.indexOf(KeyCode4Shift) >= 0) {
        value += '<kbd>Shift</kbd> + '
        code = code.replace(KeyCode4Shift, '')
      }
      if (code && code.length > 0) {
        value += `<kbd>${code === ' ' ? 'Space' : code}</kbd>`
      }
      //
      if (!value || value.length <= 0) {
        return '(尚未設定)'
      }
      return value
    },
    normalizeReportData() {
      // clearInterval(window.timer301);
      this.isDataChange = false
      this.historyList = []
      this.reportHistory = []
      this.cstTabName = ''
      this.cstTab = []
      // hold the data for comparing in saving
      this.origReportContent = this.theReport.ReportContent ? this.theReport.ReportContent.trim() : ''
      this.reportImg = this.theReport.StructureContent1
      if (this.reportImg) {
        this.showImgReport = true
        this.cstReportHtml = '' + this.theReport.StructureContent1
        let arr = []
        for (let i = 1; i < 7; ++i) {
          if (!this.theReport[`StructureContent${i}`]) break
          let obj = {
            cstHtml: '',
            img: '',
            structureData: '',
            CSTName: '',
            updateCount: 0,
          }
          obj.structureData = this.theReport[`StructureData${i}`]
          obj.img = this.theReport[`StructureImage${i}`]
          obj.cstHtml = this.theReport[`StructureContent${i}`]
          obj.CSTName = this.theReport[`CSTName${i}`] ? this.theReport[`CSTName${i}`] : 'Name-dtc-tab-' + i
          obj.CSTId = this.theReport[`CSTId${i}`] ? this.theReport[`CSTId${i}`] : 'ID-dtc-tab-' + i
          arr.push(obj)
        }
        this.cstTab = [...arr]
        this.cstTabName = this.cstTab[0].CSTName
        setTimeout(() => {
          this.cstTab.forEach((item) => {
            this.updateVtabTitle(item)
          })
          this.updateVtabTitle(this.cstTab[0])
          this.registerReportEvent('add')
        }, 200)
      } else if (!this.reportImg && this.isSubReport) {
        this.reportTemplateOpen()
      }

      if (window.timer301) clearInterval(window.timer301)

      if(this.getSaveAutoValue === 'Y'){
        console.log('auto save w ~ 10s')
        window.timer301 = setInterval(this.saveFile, 10 * 1000)
      }else{
        console.log('no auto save ~')
      }

      if (!this.theReport.OrderNo) {
        this.theReport.OrderNo = this.theReport.AccessionNo.split('_')[0]
      }

      if (!this.theReport.DxrStatus) {
        this.theReport.DxrStatus = 63
      }

      if (!this.theReport.DxrVersion) {
        this.theReport.DxrVersion = '1'
      }

      this.theReport.PatientId = this.theProcedure.PatientId ? this.theProcedure.PatientId : '' + new Date().getTime()

      if (!this.DxReportIQCode) {
        this.DxReportIQCode = '30'
      }

      if (this.getIssueDrs.some(({ value }) => value === this.loginId)) {
        // !this.theReport.IssuePhysicianId &&
        // 報告沒有押審核醫師，而該登入者是在審核醫師名單
        this.theReport.IssuePhysicianId = this.loginId
      }

      if (!this.theReport.IssuePhysicianId && this.tempPhysicianId) this.theReport.IssuePhysicianId = this.tempPhysicianId

      console.log(`this.getPacAutoValue`, this.getPacAutoValue)
      
      if(this.getPacAutoValue === 'Y'){
        this.callPacs('show')    
      }
      
      setTimeout(async () => {
        try {
          this.loadingHistory = true
          
          const res = await getPatientReportList(this.theProcedure.PatientId)
          
          if(res && res.length){
            
            this.historyList = _.cloneDeep(res)
            this.historyList = this.historyList.sort((rp1, rp2) => (rp1.IssueTime > rp2.IssueTime ? -1 : 1))
            this.historyList.forEach((his) => {
              his['ProcedureCompletedForShow'] = this.$moment(his.ProcedureCompleted).format('YYYY-MM-DD')
            })
          }
        } catch (err) {
          console.log(`error: `, err)

          this.SET_SIDE_MESSAGE({
            msg: `取得歷史診斷報告發生錯誤: ${err.message}`,
            type: 2,
          })
        } finally {
          this.loadingHistory = false
        }
      })

      setTimeout(async () => {
        try {
          const res = await window.axios.get(`/Report/GetVersionList?accessionNo=${this.theProcedure.AccessionNo}`)

          if(res && res.length){
            this.reportHistory = _.cloneDeep(res)
          }
        } catch (err) {
          console.log(`error: `, err)
          this.SET_SIDE_MESSAGE({
            msg: `報告版次 API (/Report/GetVersionList) 發生錯誤: ${err.message}`,
            type: 2,
          })
        }
      })

    },
    // 熱鍵取值框 事件處理
    //	- 請小心注意 事件 的執行順序...
    ModalOk(bvModalEvt) {
      console.log(this.$logs())
    },
    ModalCancel(bvModalEvt) {
      console.log(this.$logs())
    },
    ModalClose(bvModalEvt) {
      this.UnderHotkeyDetect = false
      //console.log(this.$logs(`UnderHotkeyDetect: ${this.UnderHotkeyDetect}`))
    },
    ModalHide(bvModalEvt) {
      //console.log(this.$logs(`UnderHotkeyDetect: ${this.UnderHotkeyDetect}`))
      if (this.UnderHotkeyDetect) {
        bvModalEvt.preventDefault()
      }
    },
    _removeCstTab(i) {
      Swal.fire({
        title: `移除${this.isSubReport ? '癌症' : '次專科'}報告:`,
        text: `${this.cstTab[i].CSTName}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '確定',
        cancelButtonText: '取消',
      }).then((result) => {
        if (result.value) {
          this.removeCstTab(i)
          if (this.isSubReport) {
            this.$nextTick(() => {
              this.reportTemplateOpen()
            })
          }
        }
      })
    },
    removeCstTab(i) {
      this.cstTab.splice(i, 1)
      if (!this.cstTab.length) {
        this.reportImg = ''
        this.showImgReport = false
        this.cstTabName = ''
      } else {
        this.cstTabName = this.cstTab[0].CSTName
      }
      if (this.theReport.DxrStatus == 71) return
      this.DataSave(this.theReport.DxrStatus, true)
    },
    async saveFile() {
      if (window.isSavingDtc) return
      const update = this.saveFullScreenForm()
      !this.isDataChange && update ? (this.isDataChange = true) : ''
      if (!this.isDataChange || this.theReport.DxrStatus == 71) return
      this.isDataChange = false
      await this.DataSave(63, true)
    },
    showPacsUrl() {
      // alert(window.packUrl);
    },
    showCallLab() {
      alert(window.callLabUrl)
    },
    showVersionAlert(n) {
      if (!this.showAlert && n === 1) {
        this.showAlert = true
        return
      } else if (this.showAlert && n === 2) {
        // alert("this.origDxStatus " + this.origDxStatus + "\n" + "this.theReport.DxrStatus:  " + this.theReport.DxrStatus);
      }
    },
    openThenFocus(url = null, text = 'PACS Loading...'){
      if(url){
        let tab = window.open(url, '_blank')
        tab.close()
        setTimeout(()=>{
          this.FocusOnContent()
        },500)
      }
    },
    textareaFocusWork(url = null) {
      let runCount = 2

      let focusInterval = () => {
        runCount -= 1
        try {
          if(process.env.VUE_APP_VERSION_NO === '805'){
            console.log(`textareaFocusWork: `, runCount)
            this.openThenFocus(url)
            // this.FocusOnContent()
          }else{
            if (
              !document.getElementById('blkReportInput').querySelector('textarea:focus') &&
              !(this.$refs['Window4Mass'] && this.$refs['Window4Mass'].isShow) &&
              !(this.$refs[this.isSubReport ? 'subTemplate' : 'reportTemplate'] && this.$refs[this.isSubReport ? 'subTemplate' : 'reportTemplate'].isShow)
            ){
              this.FocusOnContent()
            }
          }
        } catch (error) {
          console.log(`error: `, error)
          clearInterval(focusTimer)
        }

        if (runCount <= 0) {
          clearInterval(focusTimer)
        }

      }

      this.FocusOnContent()

      let focusTimer = setInterval(focusInterval, 1000)
    },
    async viewNextRecord(redirect) {      
      // ****
      this.reportCount = 0
      this.recordReportContent = null
      this.objCount = 0
      this.autoRevoke = false
      this.autoRevokeAccessionNo = null

      // hisIndex
      this.hisIndex = 0

      console.log(`viewNextRecord > autoRevoke: `, this.autoRevoke)
      
      await getActionReportRelease(this.theProcedure.AccessionNo)

      if (this.isFetchingData) return

      if (this.currentNum >= this.initArray.length && this.currentNum < this.totalArrayLen) {
        // 未載完
        this.SHOW_LOADING()

        setTimeout(()=>{  
          this.HIDE_LOADING()
        },1500)

        this.isFetchingData = 'next'
        return
      } else if (this.currentNum === this.initArray.length && this.currentNum === this.totalArrayLen && redirect) {
        //最後一筆
        // this.$router.replace({ name: 'FI0304' })
        if(this.$route.query.backpath && process.env.VUE_APP_VERSION_NO === '805'){
          console.log(`viewNextRecord > this.$route.query.backpath: `, this.$route.query.backpath)
          this.backByUser = true
          this.$router.push({ path: this.$route.query.backpath }) 
        }else{
          this.$router.replace({ name: 'FI0304' })
        }

        return
      }
      if (this.showHistoryDlg) this.showHistoryDlg = false
      if (this.theReport && this.theReport.ReportContent) {
        this.theReport.ReportContent = null
      }

      this._removeActiveHistoryCursorPos()
      this.currentNum += 1
      this.registerSpecificProcedure(Object.assign({}, this.initArray[this.currentNum - 1]))
      this.viewRecordByCurrentNumber()

      //reset isFetchingData
      this.isFetchingData = ''
    },
    async viewPrevRecord(redirect = false) {
      
      // ****
      this.reportCount = 0
      this.recordReportContent = null
      this.objCount = 0
      this.autoRevoke = false
      this.autoRevokeAccessionNo = null

      // hisIndex
      this.hisIndex = 0

      console.log(`viewPrevRecord > autoRevoke: `, this.autoRevoke)

      await getActionReportRelease(this.theProcedure.AccessionNo)

      if (this.isFetchingData) return
      if (this.currentNum <= 1 && this.pageIndex > this.currentNum) {
        
        this.SHOW_LOADING()

        setTimeout(()=>{  
          this.HIDE_LOADING()
        },1500)

        this.isFetchingData = 'prev'
        return
      } else if (this.currentNum == 1 && this.pageIndex == 1) {
        return
      }
      if (this.showHistoryDlg) this.showHistoryDlg = false
      if (this.theReport && this.theReport.ReportContent) {
        this.theReport.ReportContent = null
      }
      this._removeActiveHistoryCursorPos()
      this.currentNum -= 1
      this.registerSpecificProcedure(Object.assign({}, this.initArray[this.currentNum - 1]))

      this.viewRecordByCurrentNumber()
      
      //reset isFetchingData
      this.isFetchingData = ''
    },
    async viewRecordByCurrentNumber() {
      const data = await getActionReportEdit(this.theProcedure.AccessionNo)

      if (data) {
        this.SET_SIDE_MESSAGE({
          msg: data + '，系統將自動轉至下一筆報告',
          type: 2,
        })
        this.viewNextRecord()
        return
      }

      this.init()
      window.isSavingDtc = true
      this.cstReportHtml = this.reportImg = this.showImgReport = ''
      this.dxrVersion = `${this.currentNum}/${this.totalArrayLen}`
      // this.SHOW_LOADING("報告");

      try {
        this.showDtcMask = true
        await this.getReportByAccessionNo(this.theProcedure.AccessionNo, this.theProcedure['PatientId'])
        this.fillReportDxDrInfo(this.theProcedure.AccessionNo)
        if (this.isCtMri) this.theReport['IsPositive'] = true
        this.normalizeReportData()
      } catch (err) {
        this.SET_SIDE_MESSAGE({
          msg: `viewRecordByCurrentNumber 發生錯誤: ${err.message}`,
          type: 2,
        })
      } finally {
        window.isSavingDtc = false
        this.showDtcMask = false
        // this.HIDE_LOADING();
      }
    },
    viewUrgentReport(item) {
      let IsThemeBlack = this.$IsThemeBlack()
      this.winConfig4VersionHistory.HeadBgV = IsThemeBlack ? 'danger' : 'primary'
      this.winConfig4VersionHistory.HeadTxV = IsThemeBlack ? 'light' : 'light'
      this.$refs['urgentReport'].show()
    },
    async viewAbnormalReport () {
      let IsThemeBlack = this.$IsThemeBlack()
      this.winConfig4VersionHistory.HeadBgV = IsThemeBlack ? 'danger' : 'primary'
      this.winConfig4VersionHistory.HeadTxV = IsThemeBlack ? 'light' : 'light'

      //save as record
      let tempReport = this.theReport.ReportContent
      let tempDoctor = this.theReport.IssuePhysicianId
      let tempImageOids =  this.theReport.ReportImageOids
      
      await this.getReportByAccessionNo(this.theProcedure.AccessionNo, this.theProcedure['PatientId'])

      //get form record
      this.theReport.ReportContent = tempReport
      this.theReport.IssuePhysicianId = tempDoctor
      this.theReport.ReportImageOids = tempImageOids
      
      this.doctorName = this.theProcedure.RequestingPhysicianName
      this.GetEmployees()
      if (this.theReport.Hrr != null) {
        this.abnormalSms = this.theReport.Hrr.Message
        this.autoAdd = this.theReport.Hrr.IsAddRemark
      } else {
        this.abnormalSms = `(影像異常通報)${this.theProcedure.RequestingPhysicianName}醫師你的病人${this.theProcedure.PatientName}[${this.theProcedure.PatientId}]，影像有異常報告，敬請您儘速關心，感恩您`
      }

      this.$refs['abnormalReport'].show()
    },
    WinCSTHide() {},
    WinIQControlEdit() {
      this.showWasteImage = true
    },
    WinMass4Objective() {
      if (!this.$refs['Window4Mass']) return
      this.winMassComponent = false
      this.winMassHeadBgV = 'danger'
      this.winMassHeadTxV = 'white'
      this.winMassTitle = 'Clinical Information'
      this.winMassContent = this.theProcedure.Objective
      this.$refs['Window4Mass'].show()
      this.jumpingToTextArea()
    },
    WinMass4Subjective() {
      this.winMassComponent = false
      this.winMassHeadBgV = 'info'
      this.winMassHeadTxV = 'white'
      this.winMassTitle = '病患主訴'
      this.winMassContent = this.theReport.Subjective ? this.theReport.Subjective : '暫無資料'
      this.$refs['Window4Mass'].show()
      this.jumpingToTextArea()
    },
    OpenExaminationFor805Dialog() {
      if (
        (this.theProcedure.ProcedureCodeList && this.theProcedure.ProcedureCodeList.includes('E4009C'))
        ||
        (this.theProcedure.ProcedureCodeList && this.theProcedure.ProcedureCodeList.includes('E4006C'))
        &&
        this.theProcedure.Modality === 'CR'
      ) {
        this.$bvModal.show('examination-for-805-dialog')
      } else {
        this.SET_SIDE_MESSAGE({ msg: '此報告無須填寫原鄉篩檢', type: 2 })
      }
    },
    WinMass4Phrase() {
      this.winMassComponent = true
      this.winMassHeadBgV = 'primary'
      this.winMassHeadTxV = 'white'
      this.winMassTitle = '片語維護'
      this.$refs['Window4Mass'].show()
    },
    reFocusF(target = '#refRadiographer', count = 5){
      let focusOne = document.querySelector(target)
      let runCount = count
      
      let focusInterval = () => {
        runCount -= 1
        try {
          document.activeElement.blur()
          if(focusOne){
            focusOne.focus()
          }
        } catch (error) {
          console.log(`error: `, error)
          clearInterval(focusTimer)
        }
        if (runCount <= 0) clearInterval(focusTimer)
      }

      if(focusOne){
        focusOne.focus()
      }

      let focusTimer = setInterval(focusInterval, 100)
    },
    clearFailimageData(data = false){
      if(data){
        this.failImageGlobalData = {
          AccessionNo: '',
          Type: 0,
          Modality: '',
          Step: 0,
          ReasonType: 0,
          Reason: '',
          EmployeeNo: '',
          EmployeeName: '',
          EmployeeCodeName: '',
          PatientId: '',
          PatientSourceTypeCode: '',
          PatientSourceTypeName: '',
          DxreportPhysicianId: '',
          DxreportPhysicianName: '',
          ProcedureCode: '',
          ProcedureName: ''
        }
      }

      this.failImageGlobalText = null
      this.failImageGlobalRadioGrapher = null
    },
    async FailImageReport() {
      this.winMassComponent = true
      this.winMassHeadBgV = 'primary'
      this.winMassHeadTxV = 'white'
      this.winMassTitle = '不良片查詢'
      this.$refs['FailImage'].show()

      await this.getReportFailImage(this.theProcedure.AccessionNo, this.theProcedure.PatientId)

      if (this.tempReport && this.tempReport.FailImage) {
        await this.GetFailImageReasonData(this.tempReport.FailImage)
      } else {
        this.failImageGlobalData = _.cloneDeep({
          ...this.failImageGlobalData,
          AccessionNo: this.tempReport.AccessionNo,
        })
      }

      this.reFocusF()
    },
    WinMass4Icd10() {
      this.winMassComponent = false
      this.winMassHeadBgV = 'warning'
      this.winMassHeadTxV = 'dark'
      this.winMassTitle = 'Icd-10'
      
      // const icd10Content = !this.theReport['DISEASE']
      //   ? '暫無資料'
      //   : this.theReport['DISEASE']
      //       .split(',')
      //       .reduce((acc, cur, index) => acc.concat(`${cur.trim()} ${this.theReport['DISEASE_CODE'].split(',')[index]}`), [])
      //       .join('\n')

      // this.report['DISEASE'] = ['icd01 , 12', 'icd02 , 34']
      // this.report['DISEASE_CODE'] = `tyrant , solider`

      let tempArr = []

      let diseaseContent = this.theReport['DISEASE'] ? this.theReport['DISEASE'] : []
      let diseaseCode = this.theReport['DISEASE_CODE'] ? this.theReport['DISEASE_CODE'].split(',') : []

      diseaseContent.forEach((v, i)=>{
        tempArr[i] = `${v}: ${diseaseCode[i]}`
      })

      let icd10Content = !this.theReport['DISEASE'] ? '暫無資料' : tempArr.join('\n')
      
      this.winMassContent = icd10Content
      this.$refs['Window4Mass'].show()
      this.jumpingToTextArea()
    },
    WinMass4Radiographer() {
      this.winMassComponent = false
      this.winMassHeadBgV = 'warning'
      this.winMassHeadTxV = 'dark'
      this.winMassTitle = '檢查註記'
      this.winMassContent = this.theProcedure.RadiographerNote
      this.$refs['Window4Mass'].show()
    },
    WinMass4ShiftNote() {
      let PhyName = this.theProcedure.ShiftPhysicianName
      PhyName == null ? (this.theProcedure.ShiftPhysicianName = '') : this.theProcedure.ShiftPhysicianName

      if (this.ShiftNoteNotice) {
        // alert(this.ShiftNoteNotic);
        this.winMassComponent = false
        this.winMassHeadBgV = 'info'
        this.winMassHeadTxV = 'white'
        this.winMassTitle = '交班記錄 記錄醫師: ' + this.theProcedure.ShiftPhysicianName
        this.winMassContent = this.theProcedure.ShiftNote
        this.$refs['Window4Mass'].show()
        if (this.ShiftNoteNeedsToClick) this.ShiftNoteNeedsToClick = false
      }
    },
    WinConfigOpen() {
      this.HotkeyTempSet = this.$DeepCopy(this.HotkeyList)

      let IsThemeBlack = this.$IsThemeBlack()
      //this.winConfigure.Title = '組態設定'
      this.winConfigure.HeadBgV = IsThemeBlack ? 'success' : 'primary'
      this.winConfigure.HeadTxV = IsThemeBlack ? 'light' : 'light'
      this.$refs['WinConfig'].show()
    },
    focusUpdate2Objective() {
      document.querySelector('#Objective').focus()
    },
    reportTemplateOpen() {
      if (!this.isCtMri && !this.isSubReport) return
      this.showTemplateModal()
    },
    showTemplateModal() {
      this.winConfig4ReportTemple.Title = this.isSubReport ? '次專科報告' : '癌症報告'
      let IsThemeBlack = this.$IsThemeBlack()
      this.winConfig4ReportTemple.HeadBgV = IsThemeBlack ? 'success' : 'primary'
      this.winConfig4ReportTemple.HeadTxV = IsThemeBlack ? 'light' : 'light'
      this.$refs[this.isSubReport ? 'subTemplate' : 'reportTemplate'].show()
      this.$nextTick(() => {
        setTimeout(() => {
          document.getElementById(`${this.isSubReport ? 'sub' : 'report'}-template___BV_modal_body_`).children[0].children[0].focus()
        }, 500)
      })
    },
    DoThis(methodName, ...args) {
      // 動態呼叫處理
      this.$refs['versionHistory'].hide()
      // console.log(this.$logv());
      // const arr = args[0].split('/')
      window.dtcDiff = args[0]
      //alert(JSON.stringify(args));
      this[methodName](args)
    },
    DataSave(num, autoSave = false) {
      
      if (window.isSavingDtc || (this.savingTimeStamp && this.savingTimeStamp + 3000 > Date.now())) {
        if (window.isSavingDtc && this.queue.prevIsAuto) {
          this.queue.number = num
          this.SHOW_LOADING()
        }
        return
      }

      if (this.theReport.DxrStatus == 71 && num == 63) {
        this.SET_SIDE_MESSAGE({ msg: '正式報告不得暫存', type: 2 })
        return
      }

      if (!autoSave) this.savingTimeStamp = Date.now()

      if (this.theReport.DxrStatus == 71 && num == 71) return

      if(this.theReport.DxrStatus == 63 && !this.theReport.ReportContent){
        this.autoRevoke = true
        // console.log(`(RC-Chk1) no content ~`, this.autoRevoke)
        
        this.autoRevokeAccessionNo = this.theProcedure.AccessionNo
        // console.log(`(RC-Chk1) AccessionNo ~`, this.autoRevokeAccessionNo)
      }

      const ok = this.checkReportContent(num, autoSave)

      //if (!ok || (this.showDtcMask && !autoSave)) return;
      if (!ok && num < 72) return
      if (!this.theReport.DxreportPhysicianId) {
        this.theReport.DxreportPhysicianId = this.loginId
      }
      
      this.save(autoSave, num)

      //this.FocusOnContent()
    },
    async save(auto, num) {
      let opStatus = true
      
      this.getCstRecords()
      
      if (window.timer301) clearInterval(window.timer301)

      if (num === 71 || num === 999 || num === 1000) {
        const canvasResult = await this.handleCanvasImage()
        if (!canvasResult) {
          this.SET_SIDE_MESSAGE({ msg: 'can not convert to image', type: 2 })
          return
        }
      }

      if (!auto) {
        this.SHOW_LOADING()
      }

      if (this.queue) this.queue.prevIsAuto = auto
      window.isSavingDtc = true

      try {
        const reportData = { ...this.theReport }
        
        if (this.selectedImage && this.selectedImage.length) {
          reportData.ReportImageOids = this.selectedImage.map((item) => item.oid)
        }

        if (this.getProfile4User.staffType === '28') {
          // 打字員
          reportData['EditDxreportPhysicianName'] = this.getProfile4User.employeeName
          reportData['EditDxreportPhysicianId'] = this.getProfile4User.id
        }

        // if (reportData.ReportContent) {
        //   reportData.ReportContent = reportData.ReportContent.trim()
        // }

        reportData.DxrType = '31'
        reportData.DxrStatus = num > 900 ? 71 : num

        if (!this.isCtMri) reportData['IsPositive'] = null

        // console.log(`reportData.DxrStatus: `, reportData.DxrStatus)
        // console.log(`this.loginId: `, this.loginId)
        // console.log(`reportSave > reportData: `, reportData.IssuePhysicianId)
        // console.log(`reportSave > stored: `, this.$store.state.reportStatus.IssuePhysicianId)

        // reportData.IssuePhysicianId = this.$store.state.reportStatus.IssuePhysicianId

        if(reportData.DxrStatus == 71){
          // console.log(`主治醫師:`, this.loginId)
          // console.log(`71: 報告 IssuePhysicianId (Before):`, reportData.IssuePhysicianId)
          reportData.IssuePhysicianId = this.loginId
          // console.log(`71: 報告 IssuePhysicianId (After):`, reportData.IssuePhysicianId)
        }

        // console.log(`(RC-Chk2) Status (b) ~`, this.autoRevoke)

        // if(reportData.DxrStatus == 63 && this.autoRevoke){
        //   console.log(`Match Condition ~`)
          
        // }

        this.emergencyKeyWords = await reportSave(
          `accessionNos=${this.theProcedure.AccessionNo}${!auto ? '&tempSave=true' : ''}${num === 10000 ? '&notify=true' : ''}&isAuto=${auto}`,
          reportData
        )

        // console.log(`(RC-Chk3) Status (a) ~`, this.autoRevoke)

        if (this.emergencyKeyWords.length > 0) {
          this.viewUrgentReport()
          this.lackNextReport = true
        }

        this.theReport.DxrType = '31' //  31 is html + normal text
        this.theReport.DxrStatus = num > 900 ? 71 : num // if > 900 ; change the offically passed doc

        if (!auto) {
          this.SET_SIDE_MESSAGE({ msg: '資料已完成存檔作業' })
        }

        if (!(this.continuousReportCode == 'N' || auto) && this.emergencyKeyWords.length === 0) {

          console.log(`DataSave: `, this.backByUser)

          if (num === 63) {
            return
          }

          if(!this.backByUser){
            this.viewNextRecord(true)
          }
        }

        this.lockingCallPacs = false

        setTimeout(() => {
          if (this.queue.prevIsAuto && this.queue.number) {
            this.DataSave(this.queue.number)
            this.queue.prevIsAuto = null
            this.queue.number = null
          }
        }, 100)

      } catch (err) {
        console.log(`err: `, err)

        opStatus = false
        this.SET_SIDE_MESSAGE({
          msg: '存取時發生錯誤!!!!' + err + '! 請稍後再試.',
          type: 2,
        })
      } finally {
        window.timer301 = setInterval(this.saveFile, 10 * 1000)
        window.isSavingDtc = false
        
        if (auto) return
        this.HIDE_LOADING()
      }

      console.log(`(RC-Chk4) Status (final) ~`, this.autoRevoke)

      return opStatus
    },
    [OutterProprty4DynamicDeclare.name4ContentDiff]: async function (x) {
      // console.log(this.$logs(null, OutterProprty4DynamicDeclare.name4ContentDiff));
      // 如果傳入參數為 array, 則轉換型別為 string
      if (typeof x !== 'string') {
        x = x[0]
      }
      const map = await window.axios.get(`/Report/Get?accessionNo=${this.theProcedure.AccessionNo}&version=${x}`) //this.GetVersionContent(x)
      this.oldStr = map.ReportContent
      this.newStr = this.theReport.ReportContent
      //
      this.$refs['Window4Diff'].show()

      setTimeout(() => {
        const el = document.querySelector('#WinDiff0301___BV_modal_content_')
        el.requestFullscreen()
      }, 200)
    },
    checkReportContent(num, auto) {
      let update = false
      
      if (!auto) {
        update = this.saveFullScreenForm()
      }
      
      let ok = true
      // this.theReport.ReportContent = this.theReport.ReportContent ? this.theReport.ReportContent.trim() : "";

      this.reportCount = 0
      this.recordReportContent = null

      console.log(`checkReportContent: `, this.autoRevoke)

      if (!this.theReport.ReportContent && !update && !this.autoRevoke) {
        auto
          ? ''
          : this.SET_SIDE_MESSAGE({
              msg: '尚未輸入報告內容, 不得存檔.',
              type: 2,
            })
        ok = false
      }

      if (this.origReportContent === this.theReport.ReportContent && !update && num > 900) {
        auto
          ? ''
          : this.SET_SIDE_MESSAGE({
              msg: '報告內容並無異動, 無需存檔.',
              type: 2,
            })
        ok = false
      } else if (!this.theReport.IssuePhysicianId && num >= 65 && !this.isSubReport) {
        auto
          ? ''
          : this.SET_SIDE_MESSAGE({
              msg: '尚未選擇審核醫師,不得存檔.',
              type: 2,
            })
        ok = false
      }

      return ok
    },
    exitFullScreen(_id) {
      //const id = _id ? _id : '#blkReportInput';
      this.showImgReport = false
      //const el = document.querySelector(id);
      //el.exitFullscreen();
    },
    enterFullScreen(_id) {
      const id = _id ? _id : '#blkReportInput'
      const el = document.querySelector(id)
      el.requestFullscreen()
      this.showImgReport = true
    },
    registerSpecificProcedure(patient) {
      this.theProcedure = Object.assign({}, patient)

      if (patient['ShiftNote']) this.ShiftNoteNeedsToClick = true

      const [t1, t2] = patient.ProcedureCompleted && patient.ProcedureCompleted.split ? patient.ProcedureCompleted.split(':') : ['', '', '']
      this.theProcedure.StudyDate = t1 ? [t1, t2].join(':') : patient.ProcedureCompleted
      this.theProcedure.PatientSourceType = patient.PatientSourceTypeCode + '-' + patient.PatientSourceTypeName
      this.theProcedure.BedNo = patient.BedNo ? patient.BedNo : '暫無記錄'
      this.theProcedure.PatientBirthday = this.DateToString(new Date(patient.PatientBirthday))
      this.casePriorityCode = patient.EmgFlag
      this.labProcedures = patient.ProcedureNameList

      if (!this.$store.state.DxreportPhysician) {
        this.$store.registerModule('DxreportPhysician', {
          state: {
            id: patient.DxreportPhysicianId,
            name: patient.DxreportPhysicianName,
          },
        })
      }
    },
    toggleDetailView() {
      if (this.toggleTime + 250 > Date.now()) return
      this.toggleTime = Date.now()
      this.SET_REPORT_TOGGLE({
        key: 'reportDetail',
        value: !this.getToggleReport.reportDetail,
      })
    },
    togglePatientDetailView() {
      if (this.toggleTime + 250 > Date.now()) return
      this.toggleTime = Date.now()
      this.SET_REPORT_TOGGLE({
        key: 'patientDetail',
        value: !this.getToggleReport.patientDetail,
      })
    },
    toggleNavigation() {
      if (this.toggleTime + 250 > Date.now()) return
      this.toggleTime = Date.now()
      this.SET_REPORT_TOGGLE({
        key: 'navigation',
        value: !this.getToggleReport.navigation,
      })
    },
    async getHisPacImage(PatientId, AccessionNo){
      await this.callPacs('show', true, AccessionNo)
    },
    async viewHistoryReport({ AccessionNo, PatientId }, i) {
      this._removeActiveHistoryCursorPos()
      this._updateActiveHistoryCursorPos(i)

      // update > hisIndex
      this.hisIndex = i

      this.showHistoryDlg = true
      this.showHistoryLoadingNo = true

      // this.hisPacShow = false

      try {
        const tmp = await getReportByAccessionNo(AccessionNo, PatientId)
        if(tmp){
            this.viewHistoryItem = _.cloneDeep(tmp)
            Object.keys(this.viewHistoryItem)
              .filter((k) => k.includes('CSTName'))
              .forEach((key) => {
                if (this.viewHistoryItem[key]) {
                  this.viewHistoryItem[key] = this.viewHistoryItem[key] + `-${key.slice(-1)}`
                }
              })

            // this.showHistoryLoadingNo = false

            // this.$nextTick(() => {
            //   document.getElementById('reportContentText').focus()
            // })
        }

      } catch (error) {
        console.log(`error: `, error)
        this.viewHistoryItem = {}
      } finally {
        this.showHistoryLoadingNo = false
      }
    },
    versionHistoryOpen() {
      if (!this.reportHistory.length) {
        this.SET_SIDE_MESSAGE({ msg: '無報告版次', type: 2 })
        return
      }
      this.HotkeyTempSet = this.$DeepCopy(this.HotkeyList)
      let IsThemeBlack = this.$IsThemeBlack()
      this.winConfig4VersionHistory.Title = '版本歷史'
      this.winConfig4VersionHistory.HeadBgV = IsThemeBlack ? 'success' : 'primary'
      this.winConfig4VersionHistory.HeadTxV = IsThemeBlack ? 'light' : 'light'
      this.$refs['versionHistory'].show()
    },
    async initReport() {
      ;['winConfigure', 'winIQControl', 'winConfig4HotkeyDetect', 'winConfig4StructureReport', 'winConfig4ReportTemple', 'winConfig4VersionHistory'].forEach(
        (k) => {
          this.$nextTick(() => {
            this[k] = {
              ...this[k],
              HeadBgV: '',
              HeadTxV: '',
              BodyBgV: '',
              BodyTxV: '',
              Content: '',
            }
          })
        }
      )

      this.isSubReport = this.$route.name === 'SubReport'

      this.getDataFromStore()
      this.getHotKeySetting()
      // window.timer301 = setInterval(this.saveFile, 10 * 1000);

      this.busFactory.$on('dtc-modify-report-dlg', (s) => {
        const { s1, s1Type, s2, s3, s4, s2Input, s3Input, s4Input, notify } = s
        this.theReport.ModifyExpressUserType = s1Type
        this.theReport.ModifyExpressUserId = s1Type == '03' ? this.loginId : s1
        this.theReport.ModifyExpressId = s2
        this.theReport.ModifyExpressNote = s2 == '90' ? s2Input : ''
        this.theReport.ModifyReasonId = s3
        this.theReport.ModifyNote = s3 == '90' ? s3Input : ''
        this.theReport.ModifyMajorCauseId = s4
        this.theReport.ModifyMajorCauseNote = s4 == '90' ? s4Input : ''
        const num = notify ? 10000 : 999
        console.log(`be 0`)
        this.DataSave(num, false) // 暫時改成false
        //this.SET_SIDE_MESSAGE({msg:"報告撰寫作業資料已完成存檔作業"});
      })

      console.log(`this.theProcedure: `, this.theProcedure)
      console.log(`this.theReport: `, this.theReport)
    },
    updateVtabTitle(item) {
      this.cstTabName = item.CSTName
      window.cstResultStr = item.structureData
      if (!this.isSubReport) this.fillCstFromData(`#p-${this.cstTabName}`)
    },
    convert2ReportContent(content, values) {
      // 用不到了
      if (!content && !values) return ''
      let sections = JSON.parse(content)
        .source.map(({ itemRow }) => itemRow)
        .flat()
        .map(({ items }) => items) // .flat()
      const jsonValues = values ? JSON.parse(values) : null
      if (jsonValues) {
        sections.flat().forEach((item) => {
          if (item.key && jsonValues[item.key]) {
            if (['select', 'radio', 'checkbox'].some((v) => item.type === v)) {
              const option = item.options.find(({ value }) => value === jsonValues[item.key])
              if (option) item.value = option.text
            } else if (item.type == 'table') {
              item.value = Object.entries(jsonValues[item.key]).reduce(
                (acc, [k, v]) =>
                  acc +
                  `[ ${k} ] => ` +
                  Object.entries(v)
                    .map(([sk, sv]) => `${sk}: ${sv}`)
                    .join(', ') +
                  '\n',
                ''
              )
            } else {
              item.value = jsonValues[item.key]
            }
          }
        })
      }

      return sections.reduce((acc, section) => {
        return (
          acc +
          section
            .reduce(
              (sAcc, item) =>
                sAcc.concat(
                  (item.label ? item.label : '') + (item.label === '/' || !item.label ? ' ' : ' : ') + item.value + (item.append ? '&nbsp;' + item.append : '')
                ),
              []
            )
            .join('&emsp;|&emsp;') +
          '\r\n\r\n'
        )
      }, '')
    },
    resetWhySave() {
      // 用不到了
      const inputs = this.modifyOptions2.slice(5, 100)
      inputs.forEach((s) => (s.input = ''))
      const org = this.modifyOptions2.slice(0, 5)
      this.modifyOptions2 = [...org, ...inputs]
      this.modifyOpt = this.modifyOptions1[0].value
    },
    async getAllRows() {
      // 用不到了
      // if (!this.storeQuery.url) {
      //   return;
      // }
      // let itemPack = "";
      // await new DataManager({
      //   url: configs.publicPath + "../exam/GetModalityList",
      //   adaptor: new WebApiAdaptor(),
      //   crossDomain: true,
      // })
      //   .executeQuery(this.storeQuery.query)
      //   .then((r) => {
      //     itemPack = r.actual; //資料;
      //   });
      // itemPack.Items.filter((i) => {
      //   i.IssueTime = this.DateToString(i.IssueTime, true);
      //   i.StudyTime = i.StudyTime == null ? "無影像" : this.DateToString(i.StudyTime, true);
      // });
      // itemPack.Items.sort((a, b) => {
      //   return b.IssueTime - a.IssueTime || a.Status - b.Status;
      // });
      // this.totalArrayLen = itemPack.Items.length;
      // // this.dxrVersion = `${this.currentNum}/` + this.totalArrayLen;
      // this.dxrVersion = `${this.currentNum + (this.currentPage - 1) * this.perPage}/` + this.totalArrayLen;
      // for (let i = 0; i < this.storeQuery.rows.length; ++i) {
      //   let idx = itemPack.Items.length && itemPack.Items.findIndex((s) => s.AccessionNo === this.storeQuery.rows[i].AccessionNo);
      //   if (!itemPack.Items.length) break;
      //   if (idx > -1) {
      //     itemPack.Items.splice(idx, 1);
      //   }
      // }
      // if (itemPack.Items.length) {
      //   this.nextViewArr = [...itemPack.Items];
      // }
    },
    async SaveFailImageReason(body) {

      console.log(`body: `, body)
      console.log(`report t`, this.tempReport)

      try {
        let updateBody = {
          AccessionNo: body.AccessionNo ? body.AccessionNo : '',
          Type: body.Type ? body.Type : 0,
          Modality: body.Modality ? body.Modality : '',
          Step: body.Step ? body.Step : 0,
          ReasonType: body.ReasonType ? body.ReasonType : 0,
          Reason: body.Reason ? body.Reason : '',
          EmployeeNo: body.EmployeeNo ? body.EmployeeNo : '',
          EmployeeCodeName: body.EmployeeCodeName ? body.EmployeeCodeName : '',
          EmployeeName: body.EmployeeName ? body.EmployeeName : '',
          // CreateTime: body.CreateTime ? body.CreateTime : '',
          PatientId: body.PatientId ? body.PatientId : '',
          PatientSourceTypeCode: body.PatientSourceTypeCode ? body.PatientSourceTypeCode : '',
          PatientSourceTypeName: body.PatientSourceTypeName ? body.PatientSourceTypeName : '',
          DxreportPhysicianId: body.DxreportPhysicianId ? body.DxreportPhysicianId : '',
          DxreportPhysicianName: body.DxreportPhysicianName ? body.DxreportPhysicianName : '',
          ProcedureCode: body.ProcedureCode ? body.ProcedureCode : '',
          ProcedureName: body.ProcedureName ? body.ProcedureName : '',
          // StudyTime: body.StudyTime ? body.StudyTime : '',
          // IssueTime: body.IssueTime ? body.IssueTime : '',
        }

        console.log(`updateBody: `, updateBody)

        this.SHOW_LOADING()

        if (this.failImageGet) {
          await this.PutFailImageReason(updateBody)
        } else {
          await this.PostFailImageReason(updateBody)
        }
      } catch (err) {
        console.log(`err: `, err)
        this.SET_SIDE_MESSAGE({ msg: '發生錯誤', type: 2 })
      } finally {
        this.HIDE_LOADING()
        this.$bvModal.hide('FailImage')
        this.failImageGet = false
      }
    },
    async PutFailImageReason(body) {
      try {
        await putFailImageReason(body)
        this.SET_SIDE_MESSAGE({ msg: '不良片儲存成功' })
      } catch (err) {
        console.log(`error`, err)
        this.SET_SIDE_MESSAGE({ msg: '不良片儲存失敗', type: 2 })
      }
    },
    async PostFailImageReason(body) {
      try {
        await postFailImageReason(body)
        this.SET_SIDE_MESSAGE({ msg: '不良片新增成功' })
      } catch (err) {
        console.log(`error`, err)
        this.SET_SIDE_MESSAGE({ msg: '不良片新增失敗', type: 2 })
      }
    },
    //   async GetFailImageReasonId(id = "") {
    //     try {
    //       this.SHOW_LOADING();
    //       const res = await getFailImageReasonId(id);
    //       if (res) {
    //         this.$nextTick(() => {
    //           this.failImageGlobalData = res;
    //           this.failImageGet = true;
    //           if (res.Reason) this.failImageGlobalText = res.Reason;
    //           if (res.EmployeeNo)
    //             this.failImageGlobalRadioGrapher = res.EployeeNo;
    //         });
    //         this.SET_SIDE_MESSAGE({ msg: "不良片讀取成功" });
    //       } else {
    //         // this.SET_SIDE_MESSAGE({ msg: '不良片讀取失敗', type: 2 })
    //       }
    //     } catch (err) {
    //       console.log(`err: `, err);
    //       // this.SET_SIDE_MESSAGE({ msg: '不良片讀取失敗', type: 2 })
    //     } finally {
    //       this.HIDE_LOADING();
    //     }
    //   },
    // },
    async GetFailImageReasonData(data) {
      try {
        this.SHOW_LOADING()
        this.$nextTick(() => {
          this.failImageGlobalData = _.cloneDeep(data)
          this.failImageGet = true
          if (!data.AccessionNo) {
            this.failImageGlobalData.AccessionNo = this.tempReport.AccessionNo
          }
          if (data.Reason) this.failImageGlobalText = data.Reason
          if (data.EmployeeNo) this.failImageGlobalRadioGrapher = data.EmployeeCodeName

          console.log(`data:`, data)

        })
        this.SET_SIDE_MESSAGE({ msg: '不良片讀取成功' })
      } catch (err) {
        console.log(`err: `, err)
      } finally {
        this.HIDE_LOADING()
      }
    },
    async viewReNewReportTemp () {
      if(this.theReport.DxrStatus != '63'){
        return
      }
      let IsThemeBlack = this.$IsThemeBlack()
      this.winConfig4VersionHistory.HeadBgV = IsThemeBlack ? 'danger' : 'primary'
      this.winConfig4VersionHistory.HeadTxV = IsThemeBlack ? 'light' : 'light'
      this.$refs['reNewReportContent'].show()
    },
    keydownEnterRevokeReport() {
      document.addEventListener('keydown', this.revokeReportWhenEnter)
    },
    cancelkeydownEnterRevokeReport() {
      document.removeEventListener('keydown', this.revokeReportWhenEnter)
    },
    async revokeReportWhenEnter(evt) {
      if (evt.key === 'Enter') {
        await this.reNewReportTemp()
      }
    },
    async reNewReportTemp(){
      try{
        this.SHOW_LOADING()
        await postRemoveTempReport(this.theReport.OrderNo)
      }catch(err){
        console.log(`error` , err)
        this.SET_SIDE_MESSAGE({ msg: '放棄撰打失敗', type: 2 })
      }finally{
        await this.getReportByAccessionNo(this.theProcedure.AccessionNo, this.theProcedure.PatientId)

        if(
          (this.theProcedure.ProcedureCodeList && this.theProcedure.ProcedureCodeList.includes('E4009C'))
          ||
          (this.theProcedure.ProcedureCodeList && this.theProcedure.ProcedureCodeList.includes('E4006C'))
          &&
          this.theProcedure.Modality === 'CR'
        ){
          await putSaveScreeningWarning({
            AccessionNo: this.theProcedure.AccessionNo,
            ScreeningWarning: -1
          })
        }

        this.HIDE_LOADING()
        this.SET_SIDE_MESSAGE({ msg: '放棄撰打成功'})
        this.$bvModal.hide('reNewReportContent')
      }
    },
    async backToPreviousRoute() {
      // this.$router.push({
      //   name: this.$route.name === 'SubReport' ? 'FI0304ForSub' : 'FI0304',
      // })

      // not to trigger next report for save
      this.backByUser = true

      if(this.instantReportStatus == 56 || this.instantReportStatus == 63){
        
        //Diff
        if(
          this.instantReportContent != this.recordReportContent
        ){
          this.DataSave('63')
        }

        //Auto Revoke Report
        if(
          this.autoRevokeAccessionNo
        ){
          console.log(`can auto revoke report`)
          await this.reNewReportTemp()
        }
      }

      if (this.$route.name === 'SubReport') {
        this.$router.push({ name: 'FI0304ForSub' })
      } else {
        this.$router.push({ path: this.$route.query.backpath })
      }
    },
  },
  async beforeMount() {

    //reset > autoRevokeAccessionNo
    this.autoRevokeAccessionNo = null
    
    // hisIndex
    this.hisIndex = 0

    this.clearFailimageData()

    await this.getReportByAccessionNo(this.theProcedure.AccessionNo, this.theProcedure.PatientId)

    this.fillReportDxDrInfo(this.theProcedure.AccessionNo)
    window.removeEventListener('keydown', this.HKWatch)
    window.addEventListener('keydown', this.HKWatch)
    this.$root.$on('close-history-dlg', () => (this.showHistoryDlg = false))
    this.$root.$on('dtc-copy-paste', (s) => {
      if (this.showImgReport) return
      if (!this.theReport.ReportContent) this.theReport.ReportContent = ''

      // setTimeout(()=>{
      //   this.$bvModal.hide('WinMass0301')
      // },1000)

      setTimeout(()=>{
        const sltStart = this.$refs.reportPlainText.selectionStart
        const textBefore = this.theReport.ReportContent ? this.theReport.ReportContent.substring(0, sltStart) : ''
        const textAfter = this.theReport.ReportContent ? this.theReport.ReportContent.substring(sltStart, this.theReport.ReportContent.length) : ''      
        const textFocus = textBefore + s
        this.theReport.ReportContent = textBefore + s + textAfter
        // const newSelectPos = textBefore.length + this.theReport.ReportContent.length
        const newSelectPos = textFocus.length
        
        this.$nextTick(() => {
          this.$refs.reportPlainText.selectionStart = this.$refs.reportPlainText.selectionEnd = newSelectPos
          this.$refs.reportPlainText.focus()
        })
  
      },2000)
    })
    this.$root.$on('focusOnReport', () => this.FocusOnContent())

    //document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);

    try {
      if (this.isCtMri) this.theReport['IsPositive'] = true // 預設陽性
      // this.theReport["IsPositive"] = true;
      //normalize array to dislay
      this.normalizeReportData()
      //step 5 get CST list; CancerScreeningTemplate
      this.reportList = await getCstList(this.isSubReport ? '?cst=false' : '')
      //step 4. get 影像品質清單API
      let imgs = await selectNoListForImageQuality()
      this.optionsImageQuality = imgs.Items.map(({ No, Name }) => ({
        value: No,
        text: Name,
      }))
      //normalize array to dislay
      // Step 6: get all rows for performance cache
      //await this.getAllRows();
      //get all report phrase
      // this.phraseRecords = await this.collectingPhrash();
      // this.busFactory.$on("reload-report-phrase", async () => {
      //   this.CLEAR_PHRASE();
      //   this.action_getPhrase();
      // });
    } catch (err) {
      this.SET_SIDE_MESSAGE({ msg: `API 發生錯誤: ${err.message}`, type: 2 })
      //alert(err.message);
    }
  },
  beforeRouteLeave(to, from, next) {
    const verChk = process.env.VUE_APP_VERSION_NO === '805' ? ['homeRoot', 'home', 'FI0304'] : ['FI0304']

    if (verChk.includes(to.name) && this.storeQuery.tabList) {
      const pageNum = Math.ceil(this.pageIndex / this.perPage)
      const tabIdx = this.storeQuery.tabList.findIndex(({ id }) => id === this.currentTab)
      this.storeQuery.tabList[tabIdx].items = this.initArray.filter((item, idx) => idx >= (pageNum - 1) * this.perPage && idx < this.perPage * pageNum)
      this.storeQuery.tabList[tabIdx].page = 1 // pageNum
      this.storeQuery.tabList[tabIdx].per = this.perPage

      this.$store.registerModule('fi0301TabSource', {
        state: {
          query: this.storeQuery.query,
          searchCondition: this.searchCondition,
          currentKey: this.currentTab,
          tabList: this.storeQuery.tabList,
        },
      })
    } else {
      if (this.$store.state && this.$store.state.fi0304TabSource) this.$store.unregisterModule('fi0304TabSource')
    }
    next()
  },
  beforeDestroy() {
    clearInterval(window.timer301)
    this.CLEAR_PHRASE()
    window.removeEventListener('keydown', this.HKWatch)
  },
  destroyed() {
    // 解除監聽器:攔截 KeyPress

    // 解除 Theme:Black
    // const el = document.body;
    // 解除 b-modal listeners
    this.$root.$off('bv::modal::show', this.BMWatch)
    this.$root.$off('bv::modal::shown', this.BMWatch)
    this.$root.$off('bv::modal::hide', this.BMWatch)
    this.$root.$off('bv::modal::hidden', this.BMWatch)

    if (this.$store.state.DxreportPhysician) {
      this.$store.unregisterModule('DxreportPhysician')
    }
  },
  watch: {
    urgentOpt(v) {
      if (v != 6) {
        this.otherInput = ''
      }
    },
    'theReport.ReportContent'() {
      if (this.theReport.ReportContent && !this.showImgReport) {
        if (this.theReport.DxrStatus == 71) {
          this.isDataChange = false
        } else {
          this.isDataChange = true
        }
      }
    },
    Window4MassShow(val) {
      if (!val) this.FocusOnContent()
    },
    ReportTempShow(val) {
      if (!val) this.FocusOnContent()
    },
    SubTemplateShow(val) {
      if (!val) this.FocusOnContent()
    },
    urgentReportShow(val) {
      if (!val && this.lackNextReport) {
        this.lackNextReport = false
        this.viewNextRecord(true)
      }
    },
  },
}
