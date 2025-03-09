<template>
  <b-modal
    id="examination-for-805-dialog"
    title="原鄉篩檢"
    size="lg"
    @ok="onOkClick"
    @show="init"
    @hide="cancelkeydownEnterSave"
    body-class="py-1 themeModal border-right border-bottom border-left"
    header-bg-variant="primary"
    header-text-variant="light"
    ok-title="確定"
    cancel-title="取消"
  >
    <b-form-group label="檢查結果" v-slot="{ ariaDescribedby }">
      <b-form-radio-group id="radio-group-1" v-model="result" :options="options" :aria-describedby="ariaDescribedby" name="radio-options"></b-form-radio-group>
    </b-form-group>
    <b-table v-if="result === false" striped hover :items="items" :fields="fields" select-mode="single" selectable @row-selected="onRowSelected" style="background: #fff;">
      <template #cell(selected)="{ item }">
        <template v-if="selected[0] === item">
          <b-icon-check-square></b-icon-check-square>
        </template>
        <template v-else>
          <b-icon-square></b-icon-square>
        </template>
      </template>
      <template #cell(keyWord)="{ value }">
        <div v-html="value"></div>
      </template>
    </b-table>
  </b-modal>
</template>

<script>
import { putSaveScreeningWarning } from '@/assets/service/dataManager.js'
import { mapMutations } from 'vuex'

export default {
  name: 'examination',
  props: { reportData: Object },
  data() {
    return {
      result: null,
      options: [
        { text: '正常', value: true },
        { text: '異常', value: false },
      ],

      fields: [
        { key: 'selected', label: '選取' },
        { key: 'code', label: '代碼' },
        { key: 'desc', label: '代碼說明' },
        { key: 'keyWord', label: '分類參考關鍵字' },
      ],
      items: [
        // { code: 0, desc: '正常', keyWord: '' },
        { code: 1, desc: '異常，但無空洞', keyWord: '' },
        { code: 2, desc: '異常，且有空洞', keyWord: '' },
        { code: 3, desc: '肋膜積水', keyWord: '肋膜積水(肺(肋)膈角變鈍/肺小裂隙處變厚)' },
        {
          code: 4,
          desc: '異常，無法排除活動性結核病',
          keyWord: `
            <div>肺浸潤/陰影 (支氣管發炎 /擴張 /浸潤 )</div>
            <div>肉芽腫/結節</div>
            <div>粟粒狀病灶</div>
            <div>陳舊性肺結核</div>
            <div>肺炎/發炎 /感染</div>
            <div>肺坍塌</div>
            <div>矽肺病</div>
          `,
        },
        {
          code: 5,
          desc: '異常，尚需醫師評估結核病可能性',
          keyWord: `
            <div>肺紋增加/粗糙</div>
            <div>肺門擴張</div>
            <div>間質增加</div>
            <div>纖維化/鈣化 /胸 (肋膜 )增厚</div>
            <div>陳舊性發炎/過去發炎反應造成</div>
            <div>上縱膈腔變/較寬</div>
          `,
        },
        {
          code: 6,
          desc: '異常，無關結核病',
          keyWord: `
            <div>肺氣腫/肺泡擴大</div>
            <div>橫膈不平整/上升</div>
            <div>原發性/轉移性肺癌</div>
            <div>心血管病變</div>
            <div>其他</div>
          `,
        },
      ],
      selected: [],
    }
  },
  watch: {
    'reportData.ScreeningWarning'(val) {
      if (val === 0) {
        this.result = true
      } else if (val > 0) {
        this.result = false
        const item = this.items.find((item) => item.code === val)
        this.selected = [item]
      }
    },
  },
  methods: {
    ...mapMutations(['SET_SIDE_MESSAGE']),
    init() {
      // 設為初始值
      this.result = this.$options.data.call(this).result
      this.selected = this.$options.data.call(this).selected

      if (this.reportData.ScreeningWarning === 0) {
        this.result = true
      } else if (this.reportData.ScreeningWarning > 0) {
        this.result = false
        const item = this.items.find((item) => item.code === this.reportData.ScreeningWarning)
        this.selected = [item]
      }

      this.keydownEnterSave()
    },
    onRowSelected(items) {
      this.selected = items
    },
    onOkClick(bvModalEvent) {
      bvModalEvent.preventDefault()

      if (!this.result && !this.selected[0]) {
        this.SET_SIDE_MESSAGE({ msg: '請選擇異常代碼', type: 2 })
        return
      }

      this.putSaveScreeningWarning()
    },
    async putSaveScreeningWarning() {
      try {
        const ScreeningWarning = this.result ? 0 : this.selected[0].code
        const body = {
          AccessionNo: this.reportData.AccessionNo,
          ScreeningWarning,
        }
        await putSaveScreeningWarning(body)
        this.$emit('finish', { ScreeningWarning })
        this.$bvModal.hide('examination-for-805-dialog')
        this.SET_SIDE_MESSAGE({ msg: '儲存成功' })
      } catch (error) {
        this.SET_SIDE_MESSAGE({ msg: '儲存失敗', type: 2 })
        console.log(error)
      }
    },
    keydownEnterSave() {
      document.addEventListener('keydown', this.saveWhenEnter)
    },
    cancelkeydownEnterSave() {
      document.removeEventListener('keydown', this.saveWhenEnter)
    },
    saveWhenEnter(evt) {
      if (evt.key === 'Enter') {
        this.onOkClick(evt)
      }
    },
  },
}
</script>
