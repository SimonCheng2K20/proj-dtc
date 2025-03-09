<template>
  <div class="home">
    <div class="title-1 cus-mb">
      <p>您好，以下是 {{ $store.state.userData.Name ? $store.state.userData.Name : '貴單位' }} 的相關數據:</p>
      <p class="status">
        <span class="info red">
          未簽章 <span> (已逾時) </span> 數: <span class="showNum">{{ isOverTime ? isOverTime : 0 }}</span>
        </span>
        <span class="info green">
          未簽章 <span> (未逾時) </span> 數: <span class="showNum">{{ isOnTime ? isOnTime : 0 }}</span>
        </span>
      </p>
    </div>
    <el-row :gutter="20">
      <el-col :md="12">
        <CardBox class="mb-2">
          <div class="d-flex align-items-center">
            <div class="title-1 mr-1">稽核統計</div>
            <Button
              class="mr-1"
              :class="
                dataOpt.data1 === 'month' ? 'buttonColor-1' : 'buttonColor-11'
              "
              @click="
                dataOpt.data1 = 'month';
                getChart1();
              "
              >當月</Button
            >
            <Button
              :class="
                dataOpt.data1 === 'year' ? 'buttonColor-1' : 'buttonColor-11'
              "
              @click="
                dataOpt.data1 = 'year';
                getChart1();
              "
              >當年度</Button
            >
          </div>
          <ChartBox
            type="line"
            :data="chartData1Obj"
            height="28vh"
            v-if="chartData1Obj"
          />
        </CardBox>
      </el-col>
      <el-col :md="12">
        <CardBox class="mb-2">
          <div class="d-flex align-items-center">
            <div class="title-1 mr-1">借閱統計</div>
            <Button
              class="mr-1"
              :class="
                dataOpt.data2 === 'month' ? 'buttonColor-1' : 'buttonColor-11'
              "
              @click="
                dataOpt.data2 = 'month';
                getChart2();
              "
              >當月</Button
            >
            <Button
              :class="
                dataOpt.data2 === 'year' ? 'buttonColor-1' : 'buttonColor-11'
              "
              @click="
                dataOpt.data2 = 'year';
                getChart2();
              "
              >當年度</Button
            >
          </div>
          <ChartBox
            type="bar"
            :data="chartData2Obj"
            height="28vh"
            :options="{ plugins: { legend: { display: false } } }"
            v-if="chartData2Obj"
          />
        </CardBox>
      </el-col>
      <el-col :md="12">
        <CardBox class="mb-2">
          <div class="d-flex align-items-center">
            <div class="title-1 mr-1">data3</div>
            <Button
              class="mr-1"
              :class="
                dataOpt.data3 === 'month' ? 'buttonColor-1' : 'buttonColor-11'
              "
              @click="dataOpt.data3 = 'month'"
              >當月</Button
            >
            <Button
              :class="
                dataOpt.data3 === 'year' ? 'buttonColor-1' : 'buttonColor-11'
              "
              @click="dataOpt.data3 = 'year'"
              >當年度</Button
            >
          </div>
          <ChartBox type="pie" :data="data" height="28vh" />
        </CardBox>
      </el-col>
      <el-col :md="12">
        <CardBox class="mb-2">
          <div class="d-flex align-items-center">
            <div class="title-1 mr-1">data4</div>
            <Button
              class="mr-1"
              :class="
                dataOpt.data4 === 'month' ? 'buttonColor-1' : 'buttonColor-11'
              "
              @click="dataOpt.data4 = 'month'"
              >當月</Button
            >
            <Button
              :class="
                dataOpt.data4 === 'year' ? 'buttonColor-1' : 'buttonColor-11'
              "
              @click="dataOpt.data4 = 'year'"
              >當年度</Button
            >
          </div>
          <ChartBox
            type="bar"
            :data="data"
            height="28vh"
            :options="{ indexAxis: 'y' }"
          />
        </CardBox>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import moment from "moment";
import ChartBox from "@/components/ChartBox.vue";

export default {
  name: "Home",
  components: { ChartBox },
  data() {
    return {
      chartData1: null,
      chartData2: null,
      dataOpt: {
        data1: "month",
        data2: "month",
        data3: "month",
        data4: "month",
      },
      data: {
        labels: ["1", "2", "3", "4", "5", "6"],
        datasets: [
          {
            label: "My First dataset",
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 132)",
            data: [0, 10, 5, 2, 20, 30],
          },
        ],
      },
    };
  },
  computed: {
    chartData1Obj() {
      if (!this.chartData1) return null;
      let res = {};
      let labels = [
        ...new Set(
          this.chartData1.Items.map((r) => this.$global.YYYYMMDD(r.CreateTime))
        ),
      ];
      let Type = [...new Set(this.chartData1.Items.map((r) => r.Type))];
      res.labels = labels;
      res.datasets = [];
      for (let item of Type) {
        let dayList = [];
        let color = "#" + this.$global.randomColor();
        for (let item2 of labels) {
          dayList.push(
            this.chartData1.Items.filter(
              (r) =>
                r.Type === item && this.$global.YYYYMMDD(r.CreateTime) === item2
            ).length
          );
        }
        let obj = {
          label: this.$store.getters.typeListObj[item].Name,
          backgroundColor: color,
          borderColor: color,
          data: dayList,
        };
        res.datasets.push(obj);
      }
      return res;
    },
    chartData2Obj() {
      if (!this.chartData2) return null;
      let res = {};
      let labels = [
        ...new Set(this.chartData2.Items.map((r) => r.LendingClassOid)),
      ];
      let dataList = [];
      for (let item of labels) {
        dataList.push(
          this.chartData2.Items.filter((r) => r.LendingClassOid === item).length
        );
        //item=this.$store.getters.lendingClassObj[item].LendingClassId
      }
      let color = "#" + this.$global.randomColor();
      let obj = {
        //label: labels,
        backgroundColor: color,
        borderColor: color,
        data: dataList,
      };
      res.labels = labels.map(
        (r) => this.$store.getters.lendingClassObj[r].LendingClassId
      );
      res.datasets = [obj];
      return res;
    },
    isOverTime: {
      get() {
        return this.$store.state.sheetArchiveStatus.OverTime;
      },
      set(val) {
        this.$store.commit("setSheetArchiveStatus", { OverTime: val });
      },
    },
    isOnTime: {
      get() {
        return this.$store.state.sheetArchiveStatus.OnTime;
      },
      set(val) {
        this.$store.commit("setSheetArchiveStatus", { OnTime: val });
      },
    },
  },
  async created() {
    this.$store.commit("loading", true);
    await this.getChart1();
    await this.getChart2();
    this.$store.commit("loading", false);
  },
  async mounted() {
    // console.log(`home ~`);
    // console.log(
    //   `this.$store.state.sheetArchiveStatus.OverTime: `,
    //   this.$store.state.sheetArchiveStatus.OverTime
    // );

    await this.GetMyOverStatus();

    if (this.$store.state.sheetArchiveStatus.OverTime > 0) {
      this.$message({
        message: `未簽章(已逾時)數: ${this.$store.state.sheetArchiveStatus.OverTime}`,
        type: `error`,
        showClose: true,
      });
    }
    if (this.$store.state.sheetArchiveStatus.OnTime > 0) {
      setTimeout(() => {
        this.$message({
          message: `未簽章(未逾時)數: ${this.$store.state.sheetArchiveStatus.OnTime}`,
          type: `success`,
          showClose: true,
        });
      }, 2000);
    }
  },
  methods: {
    async getChart1() {
      let filter = "";
      if (this.dataOpt.data1 === "month") {
        filter += `CreateTime ge ${moment().format("YYYY-MM")}-01T00:00:00Z`;
      } else {
        filter += `CreateTime ge ${moment().format("YYYY")}-01-01T00:00:00Z`;
      }
      this.$store.commit("loading", true);
      this.chartData1 = null;
      this.chartData1 = await this.$api.getAuditEvent({
        $filter: filter,
        $orderby: "CreateTime",
      });
      this.$store.commit("loading", false);
    },
    async getChart2() {
      let filter = "";
      if (this.dataOpt.data2 === "month") {
        filter += `LendingFromDate ge '${moment().format("YYYYMM")}01'`;
      } else {
        filter += `LendingFromDate ge '${moment().format("YYYY")}0101'`;
      }
      this.$store.commit("loading", true);
      this.chartData2 = null;
      this.chartData2 = await this.$api.getLending({
        $filter: filter,
        $orderby: "LendingFromDate",
      });
      this.$store.commit("loading", false);
    },
    addData() {
      this.data.labels.push("zzzz");
      this.data.datasets[0].data.push(99);
      this.$forceUpdate();
    },
    async GetMyOverStatus() {
      try {
        let res = await this.$api.getMyOverStatus();
        if (res) {
          console.log(`getMyOverStatus > res: `, res);
          this.$store.commit("setSheetArchiveStatus", res);
        }
      } catch (err) {
        console.log(`error: `, err);
      }
    },
  },
};
</script>
