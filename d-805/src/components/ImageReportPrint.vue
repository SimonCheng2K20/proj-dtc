<template>
  <div>
    <print-service
      v-on:afterPrintEvent="finishPrint"
      spareStyle="px-3"
      :handleTextarea="true"
    >
      <div class="image-report pt-3 pb-5 noBreak">
        <div class="page-head text-right border-bottom py-2">影像診斷報告修改記錄表</div>
        <b-row class="mt-3">
          <b-col
            cols="4"
            offset="8"
          >
            <quick-input :item="ACCESSION_NO" />
          </b-col>
        </b-row>

        <b-row>
          <b-col
            v-for="(item,idx) in [PATIENT_ID, PATIENT_NAME, ISSUE_DTTM, PROCEDURE_COMPLETED]"
            cols="4"
            :key="'bas' + idx"
          >
            <quick-input :item="item" />
          </b-col>
          <b-col cols="8">
            <quick-input :item="CHECKITEM" />
          </b-col>
        </b-row>

        <b-row>
          <b-col cols="4">
            <quick-input :item="INSTITUTION_NAME" />
          </b-col>

          <b-col cols="8">
            <div class="d-flex">
              <div class="mr-2">來源: </div>
              <b-form-group>
                <b-form-radio-group
                  id="source"
                  v-model="GDATANAME"
                  :options="[{text: '門診', value: '門診'}, {text: '住院', value: '住院'}, {text: '急診', value: '急診'},{text: '健檢', value: '健檢'},{text: '轉診', value: '轉診'}]"
                  name="source-options"
                ></b-form-radio-group>
              </b-form-group>
            </div>
          </b-col>
        </b-row>

        <div class="my-3">
          <b-form-group>
            <b-form-radio-group
              id="notice"
              v-model="notice"
              :options="[{ html: `<div>臨床醫師反映 <input name='doctor' type='text' /></div>`, value: 1}, {html: `科內醫師反映 <input name='inter' type='text' />`, value: 2}, {text: '自行發現', value: 3}]"
              name="notice-options"
            ></b-form-radio-group>
          </b-form-group>
        </div>

        <div class="d-flex">
          <div class="mr-2">反映事項: </div>
          <b-form-group>
            <b-form-radio-group
              id="notice"
              v-model="notice"
              :options="[{ text: '再判讀', value: 1}, {text: '報告內容與檢查項目不符', value: 2}, {html: `其他 <input name='inter' type='text' />`, value: 3}]"
              name="notice-options"
            ></b-form-radio-group>
          </b-form-group>
        </div>

        <div>
          <div v-text="STRUCTURECONTENT1.title" />
          <div v-html="STRUCTURECONTENT1.value" />
          <!-- <b-input-group :prepend="STRUCTURECONTENT1.title">
            <b-form-textarea
              id="textarea-no-resize"
              rows="6"
              no-resize
              v-model="STRUCTURECONTENT1.value"
            ></b-form-textarea>
          </b-input-group> -->
        </div>

        <b-row class="mt-3">
          <b-col cols="3">重要修改內容</b-col>
          <b-col cols="9">
            <b-form-group>
              <b-form-radio-group
                id="modifyreasonId"
                v-model="MODIFYREASONID"
                :options="[
                  {text: '閱片太快', value: '01'}, {text: '行政疏忽（如打錯字、手寫代碼誤判、報告與影像不符）', value: '02'},
                  {text: '配合臨床', value: '03'}, {text: '獲得其他影像資訊', value: '04'}, {text: '不良影像', value: '05'},
                  {html: '其他: <input type=text />', value: '其他'}
                ]"
                name="modifyreasonId-options"
              ></b-form-radio-group>
            </b-form-group>

          </b-col>

          <b-col cols="3">重要修改內容</b-col>
          <b-col cols="9">
            <b-form-group>
              <b-form-radio-group
                id="source"
                v-model="source"
                :options="[
                  {text: '初步報告', value: '01'}, {text: '打錯左右邊', value: '02'}, {text: '打錯部位', value: '03'}, {text: '打錯病人', value: '04'}, {text: '診斷錯誤', value: '05'},
                  {html: '其他: <input type=text />', value: 6}
                ]"
                name="source-options"
              ></b-form-radio-group>
            </b-form-group>
          </b-col>
        </b-row>
        <div
          class="position-fixed w-100"
          style="bottom: 0;"
        >
          <div class="d-flex justify-content-between pr-4">
            <quick-input :item="manager" />
            <quick-input :item="doctor" />
          </div>
        </div>
      </div>
    </print-service>
  </div>
</template>

<script>
import printService from "./printService";
import quickInput from './quickInput';
export default {
  data () {
    return {
      GDATANAME: '',
      MODIFYREASONID: '',
      notice: '',
      doctorReaction: '',
      PATIENT_ID: { title: '病患號碼', value: '' },
      ACCESSION_NO: { title: '記錄編號', value: '' },
      PATIENT_NAME: { title: '姓名', value: '' },
      CHECKITEM: { title: '檢查項目', value: '' },
      ISSUE_DTTM: { title: '修改日期', value: '' },
      PROCEDURE_COMPLETED: { title: '檢查日期', value: '' },
      INSTITUTION_NAME: { title: '科別', value: '' },
      STRUCTURECONTENT1: { title: '原報告內容', value: '' },
      manager: { title: '主任', value: '' },
      doctor: { title: '結案醫師', value: '' }
    };
  },
  created () {
    Object.keys(this.item).forEach(k => {
      if (k === 'GDATANAME' || k === 'MODIFYREASONID') {
        this[k] = this.item[k];
      } else if (k === 'PROCEDURE_COMPLETED' || k === 'ISSUE_DTTM') {
        this[k].value = this.$moment(this.item[k]).format('YYYY-MM-DD');
      } else {
        this[k].value = this.item[k];
      }
    });
  },
  props: {
    item: {
      type: Object
    }
  },
  components: {
    printService, quickInput
  },
  methods: {
    finishPrint () {
      this.$emit("closePrint");
    }
  }
};
</script>

<style lang="scss" scoped>
.image-report {
  font-size: 21px;
  min-height: 130vh;
  fieldset {
    margin: 0;
    padding: 0;
    /deep/ .custom-radio {
      margin-bottom: 15px;
    }
  }
  /deep/ .cus-textarea {
    min-height: 50px;
    height: fit-content;
  }
  /deep/ .custom-control-label {
    &::before,
    &::after {
      transform: translateY(5px) !important;
    }
  }
}
</style>
