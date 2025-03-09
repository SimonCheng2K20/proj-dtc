<template>
  <div style="overflow:auto">
    <b-tabs v-if="TitleList.length !== 0">
      <b-tab
        v-for="(item, idx) in TitleList"
        :key="idx"
        :title="item"
      >
        <b-table
          striped
          small
          hover
          head-variant="dark"
          :fields="Title"
          :items="TableData(idx)"
          :heightForScroll="'450px'"
          :sticky-header="'500px'"
        ></b-table>
      </b-tab>
    </b-tabs>
    <NoDataShow v-else></NoDataShow>
  </div>
</template>
<script>
import twp from "@/components/TWPv5";
import { PhysExamItemFields } from "@/views/TableState/ImageComponents/ImageStat.js";
import { reportMonthPhysicianGraphCheck } from "@/assets/service/dataManager.js";
import NoDataShow from "@/views/TableState/SearchBar/NoDataShow.vue";

export default {
  components: { twp, NoDataShow },
  props: {
    dateRange: { type: Array },
    selectedInspectDevice: { type: String },
    selectedCheckRoom: { type: Number }
  },
  data () {
    return {
      ListFields: [],
      Title: [],
      Data: [],
      TitleList: []
      // DataSource
    };
  },
  methods: {
    async GetData () {
      this.ObjApp.WaitingShow();
      //一進來沒有資料不打api
      let data = { Items: [] };
      if (this.dateRange[0] == null && this.dateRange[1] == null) {
        this.ObjApp.WaitingHide();
        return data;
      }
      //預計建立
      let date = "?date=" + this.dateRange[0];
      // "?startDate=" + "2020-1-13" + "&endDate=" + "2020-1-24";

      if (!this.excelUrlData.urls.hasOwnProperty(this.excelUrlData.currentCondition)) {
        this.$store.commit("wsAddExcelUrl", { url: '', condition: this.excelUrlData.currentCondition });
        this.generateExcelUrl(this.excelUrlData.currentCondition);
      }


      await window.axios.get("/schedule/ReportMonthPhysicianGraphCheckList" + date).then(r => {
        console.log(r);
        data = r;
      });
      //backend 無法把'值放'到Items.DoctorColSum
      //把sum的值放到DoctorColSum
      data.Items.forEach(e => {
        if (e.checkItemCode.length == 0) {
          e.DoctorColSum = e.Doctor.pop();
        }
      });
      //取得到tabs的titile的值
      let TitleArr = [];
      data.Items.forEach(e => {
        let title = e.checkType;
        TitleArr.push(title);
      });
      const filter = TitleArr.filter((e, i, arr) => arr.indexOf(e) === i);
      this.TitleList = filter;
      //組資料格式
      //["檢查項目代碼", "檢查項目"]
      this.Title = [
        {
          key: "checkItemCode",
          label: "檢查項目代碼",
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "checkItem",
          label: "檢查項目",
          thClass: "no-wrap",
          tdClass: "no-wrap"
        }
      ];
      let arr = [];
      //設定欄位為DoctorName -- bs欄位no wrap
      data.Items[0].DoctorName.forEach(e => {
        let obj = {};
        obj["label"] = e;
        obj["thClass"] = "no-wrap";
        obj["tdClass"] = "no-wrap";
        arr.push(obj);
      });
      //把key值放進去到data裡面
      for (let i = 0; i < data.Items[0].DoctorID.length; i++) {
        //table要用的key值 (label)
        arr[i]["key"] = data.Items[0].DoctorID[i];
      }
      this.Title = this.Title.concat(arr);
      this.Title.push({ key: "DoctorColSum", label: "總計", thClass: "no-wrap", tdClass: "no-wrap" });

      //data計算
      let DataArr = [];
      data.Items.forEach(e => {
        let DataObj = {};
        DataObj["checkType"] = e.checkType;
        DataObj["checkItemCode"] = e.checkItemCode;
        DataObj["checkItem"] = e.checkItem;
        DataArr.push(DataObj);
      });
      // 每一個row 的header 資料
      let headerData = [];
      for (let i = 0; i < data.Items.length; i++) {
        //header的obj
        let headObj = {};
        headObj["checkType"] = data.Items[i].checkType;
        headObj["checkItemCode"] = data.Items[i].checkItemCode;
        headObj["checkItem"] = data.Items[i].checkItem;

        headerData.push(headObj);
      }

      //每一個row 後面的data
      let rowData = [];
      console.log(data.Items);
      for (let k = 0; k < data.Items.length; k++) {
        let dataPushObj = {};
        for (let i = 0; i < data.Items[0].DoctorID.length; i++) {
          let key = data.Items[k].DoctorID[i];
          let value = data.Items[k].Doctor[i];
          dataPushObj[key] = value;
          dataPushObj["DoctorColSum"] = data.Items[k].DoctorColSum;
          // console.log(dataPushObj);
          // console.log(i);
        }
        rowData.push(dataPushObj);
        // console.log(rowData);
      }
      //sum
      let sumData = [];

      //把header 和 row資料加在一起
      let total = [];
      for (let x = 0; x < data.Items.length; x++) {
        rowData[x];
        headerData[x];
        let ttobj = Object.assign(rowData[x], headerData[x]);
        // console.log(ttobj);
        total.push(ttobj);
      }

      console.log(total);
      this.ObjApp.WaitingHide();
      this.Data = total;
    },
    refreshTWP () {
      //refreshTWP
      this.GetData();
      // this.$refs["twp"].OnForceRefresh();
    },
    TableData (x) {
      // console.log(x);
      //組成tab的group
      const group = this.Data.reduce((accu, item) => {
        // console.log(accu[item.checkType]);
        accu[item.checkType] = accu[item.checkType] || [];
        accu[item.checkType].push(item);
        return accu;
      }, {});
      // console.log(group);
      //
      // console.log(this.TitleList[x]);
      //把group的資料分裝
      const arr = Object.keys(group);
      // console.log(length);
      // group[arr[x]].pop().DoctorColSum = ;

      // console.log(groupTitle);
      return group[arr[x]];
    },
    async generateExcelUrl (condition) {
      try {
        const { Url } = await reportMonthPhysicianGraphCheck(`date=${condition}`); //&top=10&indexPage=0
        this.$store.commit("wsAddExcelUrl", { url: Url, condition });
      } catch (err) {
        console.log(err);
      }
    },
  },
  created () {
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
    this.ListFields = PhysExamItemFields;
    // console.log(this.ListFields);
  },
  computed: {
    excelUrlData () {
      return this.$store.state.excelUrl;
    }
  }
};
</script>
