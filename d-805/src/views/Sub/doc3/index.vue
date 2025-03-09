<template>
  <div class="cvs">
    <header class="dtc-header">
      <div>消化內科內視鏡檢查報告</div>
      <b-button
        size="sm"
        variant="primary"
        style="max-height:30px;margin-top:1px"
      >
        <font-awesome-icon
          size="sm"
          icon="edit"
        />儲存變更 </b-button>
    </header>
    <cus-info
      class='mt-1'
      :inputs="basicInfo"
      title="檢查報告基本資料"
    />

    <header class="my-1 bg-primary text-light">診斷報告</header>
    <grid-frame
      :padding="0"
      :numberOfColumn="[[1,1], [1,2]]"
    >
      <div class="border border-light">
        <cus-info
          :inputs="endoscopeInfo"
          :numberOfColumn="[[1,1]]"
        />
      </div>
      <div>
        <b-tabs fill>
          <b-tab
            v-for="{list, values, key} in [preMeds, Esophagus, CLOTest, PurposeForEndoscopy, Endoscope, Stomach, Duodenum, EndoscopicDiagnosis]"
            :title="key"
            :key="key"
          >
            <report-insert
              :reportList="list"
              :reportData="values"
              :reportKey="key"
              :isSub="typeof list[0] === 'object'"
            />
          </b-tab>
        </b-tabs>
      </div>
    </grid-frame>
  </div>
</template>

<script>
import GridFrame from '@/components/Cardiac/frame.vue';
import CusInfo from '@/components/Cardiac/cusInfo.vue';
import ReportInsert from '@/components/Cardiac/ReportInsert.vue';

//Intervention
//Hemodynamic
export default {
  data () {
    return {
      basicInfo: [],
      endoscopeInfo: [],
      preMeds: {
        list: ['Local anesthesia with Xylocane', 'Fucon 20 mg im', 'Dormicum mg iv', 'Rapifan mg iv', 'Propofol mg iv', 'Demeral mg im'],
        values: [],
        key: 'Pre-medication'
      },
      Esophagus: {
        list: ['Negative', 'Some mucosal breaks at ECJ < 5 mm in length, not extend between the tops of the mucosal folds', 'Some mucosal breaks at ECJ extend between the tops of mucosal folds, involve < 754572324f the circumference', 'Salmon colored tonges of mucosa extend above the tops of gastric folds at esophago-cardia junction'],
        values: [],
        key: 'Esophagus'
      },
      CLOTest: {
        list: ['Urease test has done', 'Urease test: positive', 'Urease test: negative'],
        values: [],
        key: 'CLOTest'
      },
      PurposeForEndoscopy: {
        list: ['健診', 'Anemia', 'Anorexia', 'BW loss', 'Dysphagia', 'Gastric malignancy', 'Esophageal varices', 'Epigastralgia', 'Gastric malignancy', 'Heart burn (pyrosis)', 'Nausea', 'Peptic ulcer', 'R/O UGI bleeding', 'Vomiting'],
        values: [],
        key: 'Purpose for Endoscopy'
      },
      Endoscope: {
        list: ['Olympus GIF-Q240-Z (machine:)', 'Olympus GIF-Q260 NO (machine:)', 'Olympus GIF-Q260-J (machine:)', 'Olympus GIF-Q260-NS (machine:)', 'Olympus GIF-HQ290-NO (machine:)', 'Olympus GIF-H290 NO (machine:)', 'Olympus GIF-H290-Z (machine:)'],
        values: [],
        key: 'Endoscope'
      },
      Stomach: {
        list: ['Mild hyperemic change of mucosa at antrum', 'Several erosions were noted at antrum and body', 'An A2 ulcer with elevated regular border were noted at antrum. mm in diameter. Biopsy 2 were taken', 'An polypoid lesion with intact mucosa and bridge fold was noted at fudus. mm in diameter'],
        values: [],
        key: 'Stomach'
      },
      Duodenum: {
        list: ['Negative up to bulb', 'Negative up to second portion', 'Hyperemic mucosa and erosions at bulb', 'An A2 round shape ulcer at anterior wall of bulb, mm in diameter'],
        values: [],
        key: 'Duodenum'
      },
      EndoscopicDiagnosis: {
        list: [
          {
            label: '常用診斷',
            options: ['Negative finding(無異常)', 'Reflux esophagitis (LA classification, grade ABCD)(逆流性食道炎)', 'Chronic superficial gastritis(慢性表淺性胃炎)']
          },
          {
            label: '食道',
            options: ['Atrophic Gastritis', 'Erosive gastritis']
          }
        ],
        values: [],
        key: 'Endoscopic diagnosis'
      }
    };
  },
  created () {
    this.basicInfo = [
      { label: '病患姓名', type: 'text', value: '' },
      { label: '性別', type: 'text', value: 'F' },
      { label: '檢查日期', type: 'date', value: new Date() },
      { label: '病歷號碼', type: 'text', value: '' },
      { label: '病床號碼', type: 'text', value: '' },
      { label: '檢查時間', type: 'text', value: '' },
      { label: '檢查項目', type: 'text', value: '' },
      { label: '年齡', type: 'text', value: 'age' },
      { label: '開單日期', type: 'date', value: new Date() },
      { label: '報告日期', type: 'date', value: new Date() },
      { label: '報告時間', type: 'text', value: this.$moment().format('HH:mm:ss') },
      { label: '開單醫師', type: 'text', value: '' }
    ];

    this.endoscopeInfo = [
      {
        label: 'Purpose for Endoscopy', type: 'select', value: '', options: [
          { text: '健診', value: 1 },
          { text: 'Anemia', value: 2 },
          { text: 'Anorexia', value: 3 },
          { text: 'BW loss', value: 4 },
          { text: 'Dysphagia', value: 5 },
          { text: 'Esophageal varices', value: 6 },
          { text: 'Epigastralgia', value: 7 },
          { text: 'Gastric malignancy', value: 8 }
        ]
      },
      {
        label: 'Endoscopy', type: 'select', value: '', options: [
          { text: 'Esophageal varices', value: 1 },
          { text: 'epigastralgia', value: 2 },
          { text: 'Gastric malignancy', value: 3 },
          { text: 'Heart burn (pyrosis)', value: 4 },
          { text: 'Nausea', value: 5 },
          { text: 'Peptic ulcer', value: 6 },
          { text: 'R/O UGI bleeding', value: 7 },
          { text: 'Vomiting', value: 8 }
        ]
      },
    ];



  },
  components: { CusInfo, GridFrame, ReportInsert }
};
</script>

<style lang="scss" scoped>
.cvs {
  background: black !important;
  font-size: 16px;
  font-weight: 600;
  margin-top: 56px;
  width: 100vw;
  min-height: calc(100vh - 56px);
  padding: 2px;
}

header {
  background: var(--yellow);
  color: black;
  height: 30px;
  border-radius: 5px;
  line-height: 30px;
  padding-left: 12px;
}
.dtc-header {
  display: grid;
  height: 32px;
  grid-template-columns: 240px max-content;
}

/deep/ .tabs li a {
  padding: 3px;
}
</style>
