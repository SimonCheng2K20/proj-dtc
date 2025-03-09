<template>
  <div class="px-1 h-100 card-containe">
    <div class="h-100 border rounded d-flex flex-column justify-content-center align-items-center" v-if="loading">
      <b-spinner class="align-middle mr-1"></b-spinner>
      <strong>載入中, 請稍待 ...</strong>
    </div>
    <b-card v-else no-body class="border h-100" bg-variant="transparent">
      <!-- <b-card-header class="bg-primary text-white cardHeader btn-right d-flex justify-content-between align-items-center">
        <font
          v-text="`
            ${viewHistoryItem.ProcedureName}
            ${viewHistoryItem.ProcedureCompleted ? $moment(viewHistoryItem.ProcedureCompleted).format('YYYY-MM-DD hh:mm:ss') : ''}
            ${viewHistoryItem.IssuePhysicianName}
          `"
        />
        <font-awesome-icon icon="times" class="mr-2 text-black cursor-pointer" @click="$emit('closeModal')" />
      </b-card-header> -->
      <!-- <div v-text="viewHistoryItem" /> -->
      <b-card-body class="p-1">
        <div ref="tabsFrame" class="tabsFrame h-100 position-relative">
          <div v-if="!isSubReport" style="right: 8px; top: 8px; height: auto;" class="position-absolute d-flex flex-row align-items-start">
            <b-button v-if="versionNo !== '805'" @click="goToAnonymousJudge" variant="primary" class="mr-1">
              <font-awesome-icon :icon="anonymouseMode ? 'file-word' : 'male'" />
              {{ anonymouseMode ? '報告內容' : '匿名評分' }}
            </b-button>
            <b-button v-if="anonymouseMode && !evaluationIsEval" @click="clearAnonymousData" variant="warning" class="mr-1">
              <font-awesome-icon icon="eraser" />
              清除
            </b-button>
            <b-button v-if="anonymouseMode && !evaluationIsEval" @click="showEvalModel(true)" variant="danger" class="mr-1">
              <font-awesome-icon icon="save" />
              確定
            </b-button>
            <b-button @click="$emit('closeModal')" variant="success">
              <font-awesome-icon icon="times" />
              關閉
            </b-button>
          </div>

          <div class="px-2 pt-5" v-if="anonymouseMode">
            <div v-if="evaluationIsEval" class="text-white bg-danger text-center rounded">您已評過分了</div>
            <template v-else>
              <b-form-radio-group
                size="lg"
                v-model="evaluationSelected"
                :options="evaluationCheckBox"
                class="mb-1 radioOptions"
                :disabled="evaluationIsEval"
                value-field="No"
                text-field="Name"
              />
              <b-form-textarea
                id="textarea"
                variant="transparent"
                v-model="evaluationText"
                placeholder="科內審查意見"
                :disabled="evaluationIsEval"
                rows="3"
                max-rows="5"
              />
            </template>

            <b-tabs pills card v-if="evaluationItems.length > 0">
              <b-tab v-for="item in evaluationItems" :key="item.EvaluateTime" :title="$moment(item.EvaluateTime).format('YYYY-MM-DD HH:mm:ss')" active>
                <b-card-text>
                  <div v-text="'原因: ' + item.DxRAEItemName"></div>
                  <div class="border rounded p-1">
                    <span v-if="item.DxRAEComment" v-text="item.DxRAEComment" />
                    <span v-else class="mx-auto d-table">無意見</span>
                  </div>
                </b-card-text>
              </b-tab>
            </b-tabs>
          </div>

          <tabFrame v-else :cstNames="cstNames">
            <template v-slot:reportContent>
              <b-card-body class="p-2 d-flex flex-column align-items-start">
                
                <div style="display: flex; flex-direction: row; width: 100%;">
                  <b-button class="mb-1 mr-2" v-if="!isSubReport" @click="insertPasteText" variant="success">
                    <font-awesome-icon icon="copy" class="mr-1" />複製並插入
                    <span v-for="(key, index) in keyName" :key="key">
                      <kbd>{{ key }}</kbd>
                      <span v-if="index < keyName.length - 1"> + </span>
                    </span>
                  </b-button>
                  <b-button
                    class="mb-1"
                    v-if="!isSubReport"
                    @click="getHisPacImage"
                    variant="primary"
                    :disabled="lockingCallPacs"
                  >
                    <font-awesome-icon icon="image" class="mr-1" />PACS
                  </b-button>
                </div>

                <!-- <div v-if="hisPacShow">
                  <div class="hisPacDiv gap-hpd" v-if="hisPacImage && hisPacImage.length">
                    <div
                      v-for="(item, index) in hisPacImage"
                      :key="index"
                      style="
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border: 1px solid #123456;
                        background: #dddddd;
                        position: relative;
                        width: 100px;
                        height: 100px;
                      "
                    >
                      <b-img :src="item.src" style="width: 100%"></b-img>
                    </div>
                  </div>
                  <div class="hisPacDiv" v-else>
                    無PACS影像內容 ...
                  </div>
                </div> -->

                <b-textarea
                  id="reportContentText"
                  class="reportContent flex-1"
                  ref="reportContent"
                  no-resize
                  v-model="viewHistoryItem.ReportContent"
                  wrap="hard"
                  readonly
                />
              </b-card-body>
            </template>

            <template v-slot:cstContent>
              <vue-tabs active-tab-color="#e74c3c" active-text-color="white" class="dtc-vue-tab-history flex-1">
                <v-tab v-for="(cstContent, idx) in cstContents" :key="idx + '_' + cstNames[idx]" :title="cstNames[idx]" class="p-1 position-relative">
                  <div slot="title" v-text="cstNames[idx]" />
                  <div class="text-left" v-html="cstContent" />
                </v-tab>
              </vue-tabs>
            </template>
            
          </tabFrame>

        </div>
      </b-card-body>
    </b-card>

    <b-modal ref="evaluationSaveAlert" header-bg-variant="danger" hide-footer title="儲存提醒">
      <p class="my-4">請確認科內審查意見內容，儲存後無法更改資料!</p>
      <b-col class="text-right px-1 mt-1">
        <b-button class="mr-1" md="3" offset-md="3" variant="danger" @click="saveEvaluate">確認</b-button>
        <b-button md="3" offset-md="3" @click="showEvalModel(false)">取消</b-button>
      </b-col>
    </b-modal>
  </div>
</template>

<script>
import tabFrame from './tabFrame.vue'
import { getAnonymousEvaluation, getReportByAccessionNo, saveReportEvaluate, getReportEvaluate } from '@/assets/service/dataManager.js'
import { mapMutations } from 'vuex'
export default {
  props: {
    viewHistoryItem: {
      type: Object,
      required: true,
    },
    keyName: {
      type: Array,
    },
    isLoading: {
      type: Boolean,
    },
    isSubReport: {
      type: Boolean,
      default: false,
    },
    hisPacShow: {
      type: Boolean,
      default: false,
    },
    hisPacImage: {
      type: Array,
    },
    lockingCallPacs: {
      type: Boolean,
    },
  },
  components: {
    tabFrame,
  },
  data() {
    return {
      anonymouseMode: false,
      evaluationSelected: '',
      evaluationCheckBox: [],
      evaluationText: '',
      evaluationItems: [],
      evaluationIsEval: false,
      loading: true,
    }
  },
  computed: {
    cstNames() {
      return this.getSpecificContent('CSTName')
    },
    cstContents() {
      return this.getSpecificContent('StructureContent')
    },
    versionNo() {
      return process.env.VUE_APP_VERSION_NO
    },
  },
  methods: {
    ...mapMutations(['SET_SIDE_MESSAGE']),
    goToAnonymousJudge() {
      this.anonymouseMode = !this.anonymouseMode
    },
    getSpecificContent(key) {
      return Object.entries(this.viewHistoryItem).reduce((acc, cur) => (cur[0].includes(key) && cur[1] ? acc.concat(cur[1]) : acc), [])
    },
    insertPasteText() {
      this.$emit('insertHistoryContent')
    },
    getHisPacImage(){
      this.$emit('getHisPacImage', this.viewHistoryItem.PatientId, this.viewHistoryItem.AccessionNo)
    },
    keyEventListener(event) {
      // if (event.ctrlKey && event.code === 'KeyI') {
      //   this.insertPasteText();
      // } else
      if (event.code === 'Escape') {
        this.$emit('closeModal')
      }
    },
    GetEvaCheckBox() {
      //得到EvaluationCheckboxList
      getAnonymousEvaluation()
        .then((r) => {
          this.evaluationCheckBox = r.Items
        })
        .catch((e) => {
          console.log('沒有得到evaluation_checkbox_list')
        })
    },
    fetchEvalItemName(Id) {
      const item = this.evaluationCheckBox.find(({ No }) => No === Id)
      return item ? item.Name : 'NONE'
    },
    async getHistoryEvaItems() {
      try {
        const { IsEval, Items } = await getReportEvaluate(this.viewHistoryItem.AccessionNo)

        if (IsEval) {
          this.evaluationIsEval = IsEval
        } else if (Items && Items.length) {
          this.evaluationItems = Items.map((item) => ({ ...item, DxRAEItemName: this.fetchEvalItemName(item.DxRAEItemId) }))
        }
      } catch (err) {
        console.log(`getHistoryEvaItems > error: `, err)
      }
    },
    showEvalModel(status) {
      if (status) {
        if (!this.evaluationSelected) {
          this.SET_SIDE_MESSAGE({ msg: '原因不得為空', type: 2 })
          return
        }
      }
      this.$refs['evaluationSaveAlert'][status ? 'show' : 'hide']()
    },
    async saveEvaluate() {
      this.$refs['evaluationSaveAlert'].hide()
      const { PatientId, AccessionNo, OrderNo } = this.viewHistoryItem
      if (!AccessionNo || !OrderNo || !PatientId) {
        this.SET_SIDE_MESSAGE({ msg: '資料有誤，無法儲存', type: 2 })
        return
      }

      this.loading = true
      try {
        const { DxrVersion: DxRVersion } = await getReportByAccessionNo(AccessionNo, PatientId)
        await saveReportEvaluate({
          PatientId,
          OrderNo,
          AccessionNo,
          DxRVersion,
          DxRAEItemId: this.evaluationSelected,
          DxRAEComment: this.evaluationText,
          DxAEPhysicianId: '',
        })

        this.SET_SIDE_MESSAGE({ msg: '匿名評分已更完成' })
        this.clearAllData(true)
      } catch (err) {
        console.log(err)
        this.SET_SIDE_MESSAGE({ msg: err, type: 2 })
      } finally {
        this.isLoading = false
      }
    },
    clearAnonymousData() {
      this.evaluationSelected = ''
      this.evaluationText = ''
    },
    clearAllData(closeAnonyMode = false) {
      if (closeAnonyMode) this.anonymouseMode = false
      this.evaluationSelected = ''
      this.evaluationText = ''
      this.evaluationItems = []
      this.evaluationIsEval = false
      this.loading = false
      // this.getHistoryEvaItems()
    },
  },
  created() {
    console.log(`historyContent~`)

    this.GetEvaCheckBox()
    // this.getHistoryEvaItems()
  },
  mounted() {
    window.addEventListener('keydown', this.keyEventListener)
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.keyEventListener)
  },
  watch: {
    loading(val) {
      this.$emit('update:isLoading', val)
    },
    isLoading(val, oldVal) {
      this.loading = val
    },
    viewHistoryItem() {
      this.clearAllData()
    },
  },
}
</script>

<style lang="scss" scoped>
.tabsFrame {
  > div {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  /deep/ .tabs {
    height: inherit;
    display: flex;
    flex-direction: column;
    div.tab-content {
      flex: 1 0 0;
    }
    div.tab-pane.active {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }
  .dtc-vue-tab-history {
    overflow-y: auto;
  }
}
.cardHeader {
  font-size: 18px;
}

textarea#textarea {
  background-color: transparent;
}

.hisPacDiv{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
  align-items: flex-start;

  width: 100%;
  padding: 8px;
  margin: 0 auto;

  &.gap-hpd{
    gap: 0.5rem;
  }

}

.hisPacDiv-C{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
  align-items: flex-start;

  width: 100%;
  margin: 0 auto;
}

</style>
