<template>
  <div>
    <b-row no-gutters>
      <b-col sm="2" class="px-1">
        <b-input-group prepend="申請單號">
          <b-input v-model="checkQuery.AccessionNo" />
        </b-input-group>
      </b-col>
      <b-col sm="2" class="px-1">
        <b-input-group prepend="病歷號">
          <b-input ref="AccessionNo" :autofocus="true" v-model="checkQuery.PatientId" />
        </b-input-group>
      </b-col>
      <b-col sm="2" class="px-1">
        <b-input-group prepend="身分證號">
          <b-input v-model="checkQuery.OtherPatientId" />
        </b-input-group>
      </b-col>
      <b-col sm="3" class="px-1">
        <b-input-group prepend="開單起訖" style="width:100%">
          <div id="OpenDataPicker" class="form-control" style="padding: 0px 0px ;">
            <ejs-daterangepicker :strictMode="true" v-model="OpenDateRange"></ejs-daterangepicker>
          </div>
        </b-input-group>
      </b-col>
      <b-col sm="3" class="px-1">
        <b-input-group prepend="檢查起訖" style="width:100%">
          <div id="CheckDataPicker" class="form-control" style="padding: 0px 0px ;">
            <ejs-daterangepicker :strictMode="true" v-model="CheckDateRange"></ejs-daterangepicker>
          </div>
        </b-input-group>
      </b-col>
    </b-row>
    <b-row no-gutters class="mt-1">
      <b-col sm="2" class="px-1">
        <b-input-group prepend="檢查項目">
          <v-super-select
            noneFoundText="無此筆資料"
            placeholder="請選擇"
            v-model="checkQuery.ProcedureCode"
            :items="optionsCheckItem"
            style="z-index:1"
          />
        </b-input-group>
      </b-col>
      <b-col sm="2" class="px-1">
        <b-input-group prepend="病患來源">
          <b-select v-model="checkQuery.PatientSourceTypeCode" :options="optionsPatientSource" />
        </b-input-group>
      </b-col>
      <b-col sm="2" class="px-1">
        <b-input-group prepend="檢查室">
          <b-select v-model="checkQuery.Location" :options="optionsLocationSource" />
        </b-input-group>
      </b-col>
      <b-col sm="2" class="px-1">
        <b-input-group prepend="報到狀態">
          <b-select v-model="checkQuery.status" :options="CheckinStatusSource" />
        </b-input-group>
      </b-col>
      <b-col sm="2" class="px-1">
        <b-input-group prepend="急作">
          <b-form-radio-group
            name="eId"
            class="pl-2"
            style="border:1px solid #ced4da;width:calc(100% - 58px);display:flex;align-items:center;justify-content:center;border-radius:0px 5px 5px 0px"
            v-model="checkQuery.EmgFlag"
          >
            <b-form-radio value="Y">是</b-form-radio>
            <b-form-radio value="N">否</b-form-radio>
          </b-form-radio-group>
        </b-input-group>
      </b-col>
    </b-row>
    <b-row no-gutters class="mt-1 px-1">
      <b-col cols="2" class="pr-2">
        <b-input-group prepend="審單記錄">
          <b-select v-model="IsPreAudit" :options="IsPreAuditOptions" />
        </b-input-group>
      </b-col>
      <b-col class="text-right">
        <b-button variant="info" @click="TomorrowExam">
          <i class="far fa-calendar-alt"></i> 明日檢查
        </b-button>&nbsp;
        <b-button variant="success" @click="Clear">
          <font-awesome-icon icon="eraser" class="mr-1" />清除條件
        </b-button>&nbsp;
        <b-button variant="primary" @click="getQueryBtn">
          <font-awesome-icon icon="search" class="mr-1" />進行查詢
        </b-button>&nbsp;
      </b-col>
    </b-row>
  </div>
</template>
<script>
//DataManager 需要使用到
import * as configs from "@/config";
//串接api資料
import { DataManager, WebApiAdaptor, Query } from "@syncfusion/ej2-data";
//審單記錄list
import { IsPreAudit } from "@/views/ShiftNote/TableFields.js";
//vue的超級選單
import VSuperSelect from "v-super-select";
export default {
  components: {
    VSuperSelect
  },
  data() {
    return {
      checkQuery: {
        //申請單號
        AccessionNo: "",
        //病歷號
        PatientId: "",
        //身分證字號
        OtherPatientId: "",
        //開單日期From
        StartDT: "",
        //開單日期To
        EndDT: "",
        //檢查項目
        ProcedureCode: null,
        //病患來源
        PatientSourceTypeCode: null,
        //急作
        eId: null,
        //報到狀態
        status: null,
        EmgFlag: null,
        //檢查醫令
        ENCOUNTER_NO: "",
        //檢查室
        Location: null,
        PatientStatus: null
      },
      //檢查項目選單
      optionsCheckItem: [],
      //病患來源選單
      optionsPatientSource: [],
      //檢查室選單
      optionsLocationSource: [],
      //報到狀態選單
      CheckinStatusSource: [],
      //審單options
      IsPreAuditOptions: [],
      IsPreAudit: null,

      //開單起訖日
      OpenDateRange: ["", ""],
      //檢查起訖日
      CheckDateRange: ["", ""]
    };
  },

  created() {
    //得到檢查項目
    if (localStorage["dtcOptionsCheckItem"]) {
      this.optionsCheckItem = JSON.parse(localStorage["dtcOptionsCheckItem"]);
    }
    //審單記錄options
    this.IsPreAuditOptions = IsPreAudit;
    //病患來源下拉選單
    this.GetOptionsPatientSource();
    //檢查室下拉選單
    this.GetLocationSource();
    //報到狀態下拉選單
    this.GetStatusSource();
    //病患狀態下拉選單
  },
  methods: {
    //取得病患來源列表
    async GetOptionsPatientSource() {
      console.log(this.$logs());
      //
      let itemPack = null;
      let convertedCollections = [{ value: null, text: "請選擇" }];
      //
      let subPath = "../GeneralData/SelectNoList?groupNo=PatientSource";
      //
      await new DataManager({
        url: configs.publicPath + subPath,
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      })
        .executeQuery(new Query())
        .then(r => {
          itemPack = r.actual; //資料;
        });

      itemPack.Items.forEach(i => {
        let collection = { value: i.No, text: i.Name };
        convertedCollections.push(collection);
      });
      this.optionsPatientSource = convertedCollections;
    },
    async GetLocationSource() {
      console.log(this.$logs());
      //
      let itemPack = null;
      let convertedCollections = [{ value: null, text: "請選擇" }];
      //
      let subPath = "../Room/SelectNoList";
      //
      await new DataManager({
        url: configs.publicPath + subPath,
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      })
        .executeQuery(new Query())
        .then(r => {
          itemPack = r.actual; //資料;
        });

      itemPack.Items.forEach(i => {
        let collection = { value: i.No, text: i.Name };
        convertedCollections.push(collection);
      });
      this.optionsLocationSource = convertedCollections;
    },
    //取得報到狀態的清單
    async GetStatusSource() {
      console.log(this.$logs());
      //
      let itemPack = null;
      let convertedCollections = [{ value: null, text: "請選擇" }];
      //
      let subPath = "../GeneralData/SelectNoList" + "?groupNo=ExamState";
      //
      await new DataManager({
        url: configs.publicPath + subPath,
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      })
        .executeQuery(new Query())
        .then(r => {
          itemPack = r.actual; //資料;
        });

      itemPack.Items.forEach(i => {
        let collection = { value: i.No, text: i.Name };
        convertedCollections.push(collection);
      });
      //報到櫃台的Source

      let _tempList = [];
      convertedCollections.forEach(x => {
        // console.log(x);
        if (
          x.value == "63" ||
          x.value == "71" ||
          x.value == "65" ||
          x.value == "61"
        ) {
          // console.log("正式報告 | 報告撰寫 | 等待審核 | 退件重寫  不放入");
        } else {
          _tempList.push(x);
        }
        // console.log(_tempList);
      });

      this.CheckinStatusSource = this.$DeepCopy(_tempList);
      //綜合查詢的Source
      this.TotalStatusSource = this.$DeepCopy(convertedCollections);
    },
    //---------------------searchBar Fn------------------------------//
    TomorrowExam() {
      //清楚searchBar condition
      this.clearCondition();
      //明天的時間
      let temp_tow = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate() +
        1}`;
      //設定預設條件 明天檢查
      this.preStatus = "";
      this.preSchedulgurl = [temp_tow, temp_tow];
      //重新跑過api
      this.getFliterData();
      //重新render出table
      this.$refs["twp1"].OnForceRefresh();
    },
    Clear() {
      //告訴user預計條件
      this.ObjApp.TimingMessage("報告到狀態為( 排定檢查 & 排定檢查)");
      this.ObjApp.TimingMessage("檢查起訖時間為(今天 -- 明天)");
      //清除searchBar時間
      this.clearCondition();
      //FI0305預計搜尋條件[ consdition: A(11.尚未排檢 12.排定檢查) , B(今天日期,明天日期) ] -- new Date(下列為測試時間)
      //明天的時間
      let temp_tod = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      let temp_tow = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate() +
        1}`;
      //
      this.preStatus = "11,12";
      this.preSchedulgurl = [temp_tod, temp_tow];
      //關掉編輯區域
      this.shiftNoteShoBox = true;
      this.AuditNoteShowBox = true;
      //重新跑過api
      this.getFliterData();
      //重新render出table
      this.$refs["twp1"].OnForceRefresh();
    },
    async getQueryBtn() {
      //放入設定的報到狀態給api抓資料
      let arr = [];
      for (let i = 1; this.CheckinStatusSource.length > i; i++) {
        arr.push(this.CheckinStatusSource[i].value);
        // console.log(arr.join());
      }
      //清除預設condition
      this.preStatus = arr.join();
      this.preSchedulgurl = ["", ""];
      //將按鈕狀態改為有條件查詢(輸入的資料查詢)
      this.ObjApp.WaitingShow();
      this.BtnNo = 1;
      console.log(this.$refs["twp1"]);
      this.$refs["twp1"].OnCancelAllSelects();
      this.$refs["twp1"].OnForceRefresh();
      this.ObjApp.WaitingHide();
    }
  }
};
</script> 
<style lang="scss" scoped>
* {
  // border: 1px solid;
}
</style>
