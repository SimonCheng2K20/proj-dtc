<template>
  <div>
    <div v-if="MRdata.length !== 0 || EAdata.length !== 0" class="image6">
      <!-- <twp ref="twp" :FieldConfig="ListFields" :DataFetch="GetData"></twp> -->
      <b-table-simple v-if="MRdata.length !== 0" class="revise" striped hover small caption-top responsive>
        <b-thead head-variant="dark">
          <b-tr>
            <b-th>修改原因</b-th>
            <b-th>CT</b-th>
            <b-th>MRI</b-th>
            <b-th>X-ray</b-th>
            <b-th>Special</b-th>
            <b-th>總計</b-th>
          </b-tr>
        </b-thead>
        <b-tbody style="border-bottom:1px solid #eee">
          <b-tr v-for="(item, idx) in MRdata" :key="idx">
            <b-th style="border-right:1px solid #eee ;width:220px;" rowspan="2" v-show="idx == 0 || idx % 2 == 0">{{ item.GDATANAME }}</b-th>
            <b-td>{{ item.CT }}</b-td>
            <b-td>{{ item.MRI }}</b-td>
            <b-td>{{ item.XRAY }}</b-td>
            <b-td>{{ item.SPECIAL }}</b-td>
            <b-td>{{ item.Total }}</b-td>
          </b-tr>
          <!-- <b-tr>
          <b-th class="text-right">Gent</b-th>
          <b-td>46</b-td>
          <b-td variant="warning">18</b-td>
          <b-td>50</b-td>
          <b-td>61</b-td>
          <b-td variant="danger">15</b-td>
          </b-tr>-->
        </b-tbody>
      </b-table-simple>
      <b-table-simple v-if="EAdata.length !== 0" class="important" striped hover small caption-top responsive>
        <b-thead head-variant="dark">
          <b-tr>
            <b-th>修改原因</b-th>
            <b-th>CT</b-th>
            <b-th>MRI</b-th>
            <b-th>X-ray</b-th>
            <b-th>Special</b-th>
            <b-th>總計</b-th>
          </b-tr>
        </b-thead>
        <b-tbody style="border-bottom:1px solid #eee">
          <b-tr v-for="(item, idx) in EAdata" :key="idx">
            <b-th style="border-right:1px solid #eee ;width:220px;" rowspan="1">{{ item.GDATANAME }}</b-th>
            <b-td>{{ item.CT }}</b-td>
            <b-td>{{ item.MRI }}</b-td>
            <b-td>{{ item.XRAY }}</b-td>
            <b-td>{{ item.SPECIAL }}</b-td>
            <b-td>{{ item.Total }}</b-td>
          </b-tr>
          <!-- <b-tr>
          <b-th class="text-right">Gent</b-th>
          <b-td>46</b-td>
          <b-td variant="warning">18</b-td>
          <b-td>50</b-td>
          <b-td>61</b-td>
          <b-td variant="danger">15</b-td>
          </b-tr>-->
        </b-tbody>
      </b-table-simple>
    </div>
    <NoDataShow v-else></NoDataShow>
  </div>
</template>
<script>
import twp from "@/components/TWPv5";
import { ChangeCauseFields } from "@/views/TableState/ImageComponents/ImageStat.js";
import NoDataShow from "@/views/TableState/SearchBar/NoDataShow.vue";

export default {
  components: { twp, NoDataShow },
  props: {
    dateRange: { type: Array },
    selectedInspectDevice: { type: String },
    selectedCheckRoom: { type: Number }
  },
  data() {
    return {
      ListFields: [],
      MRdata: [],
      EAdata: []
    };
  },
  methods: {
    async GetData() {
      this.ObjApp.WaitingShow();
      //一進來沒有資料不打api
      let data = { Items: [] };
      if (this.dateRange[0] == null && this.dateRange[1] == null) {
        this.ObjApp.WaitingHide();
        return data;
      }
      //預計建立
      let start = "?startDate=" + this.dateRange[0];
      let end = "&endDate=" + this.dateRange[1];
      // "?startDate=" + "2020-1-13" + "&endDate=" + "2020-1-24";
      console.log("URL : " + start + end);

      await window.axios
        .get("/reportStatistics/GetImageDxReportMr" + start + end)
        .then(r => {
          console.log(r);

          data = r;
        })
        .catch(err => {
          console.error(err);
        });
      this.ObjApp.WaitingHide();
      // let arr = [];
      // let obj = {
      //   WORKDATE:null,
      //   MODIFYREASONID:null,
      //   GDATANAME:null,
      //   CT:null,
      //   MRI:null,
      //   XRAY:null,
      //   SPECIAL:null,
      //   Total:0
      // },
      //MRdata 運算
      let MRobj = { CT: 0, MRI: 0, XRAY: 0, SPECIAL: 0, Total: 0 };
      data.ImageDxReportMR.forEach(e => {
        Object.keys(MRobj).forEach(k => {
          MRobj[k] += e[k];
        });
      });
      console.log(MRobj);
      let MRarr = [];
      data.ImageDxReportMR.forEach(e => {
        const percentage = {};
        Object.keys(MRobj).forEach(k => {
          if (MRobj[k] == 0) {
            percentage[k] = "0.0" + "%";
          } else {
            percentage[k] = ((e[k] / MRobj[k]) * 100).toFixed(1) + "%";
          }
        });
        console.log(percentage);
        MRarr.push(e);
        MRarr.push(percentage);
      });
      console.log(MRarr);
      //EAdata 運算
      let EAobj = { CT: 0, MRI: 0, XRAY: 0, SPECIAL: 0, Total: 0 };
      data.ImageDxReportMR.forEach(e => {
        Object.keys(EAobj).forEach(k => {
          EAobj[k] += e[k];
        });
      });
      console.log(EAobj);
      let EAarr = [];
      data.ImageDxReportEA.forEach(e => {
        // const percentage = {};
        // Object.keys(EAobj).forEach(k => {
        //   if (EAobj[k] == 0) {
        //     percentage[k] = "0.0" + "%";
        //   } else {
        //     percentage[k] = ((e[k] / EAobj[k]) * 100).toFixed(1) + "%";
        //   }
        // });
        // console.log(percentage);
        EAarr.push(e);
        // EAarr.push(percentage);
      });
      console.log(EAarr);

      this.MRdata = MRarr;
      this.EAdata = EAarr;
    },
    refreshTWP() {
      this.GetData();
      //refreshTWP
      // this.$refs["twp"].OnForceRefresh();
    }
  },
  created() {
    // -----------------------------取得 App.vue 參照---------------------------//
    let methodName = "created";
    let obj = this.$GetApp(this);
    console.log(obj);
    if (obj) {
      this.ObjApp = obj[0];
      this.VueNestLevel = obj[1];
      console.log(this.$logs(`Vue Nesting Level ${this.VueNestLevel}`, methodName));
    } else {
      console.log(this.$logs("Fail to get App.vue ref.", methodName));
    }
    //欄位
    this.ListFields = ChangeCauseFields;
    // console.log(this.ListFields);
  }
};
</script>
<style lang="scss" scoped>
* {
  // border: 1px solid;
}
.image6 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 5px;
  grid-gap: 5px;
  .revise {
    border: 1px solid #ddd;
    // min-height: 500px;
  }
  .important {
    border: 1px solid #ddd;
  }
}
</style>
