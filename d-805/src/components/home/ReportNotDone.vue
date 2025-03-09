
<div class="dtc-chart">
    <Bar :chartdata="chartData" :options="chartOptions"  />
</div>

<script>
import { Bar, mixins } from "vue-chartjs";
const { reactiveData } = mixins;

//#3
const PRE_URL_1 =
  "/reportStatistics/DxStatusCount?startDate={%0}&endDate={%1}&$skip={%2}&$top=10";
//const PRE_URL_2 = "/reportStatistics/DxStatusTotalVerifyCount?staftype=20,35,31&startDate={%0}&endDate={%1}&$skip={$2}&$top=10";
export default {
  extends: Bar,
  mixins: [reactiveData],
  name: "homeReportNot",
  props: ["time", "page"],
  data () {
    return {
      currentTime: "",
      pageHolder: 1,
      labels: [],
      chartdata: {},
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    };
  },
  methods: {
    getRandomInt () {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
    },
    async getData (num = 1) {
      this.$root.$emit("報告總量", true);
      const labels = [];
      let data1 = [];
      let data2 = [];
      const skip = this.pageHolder > 1 ? (this.pageHolder - 1) * 10 : 0;
      const today = window.dtcToday;
      //alert(num);
      const start = window.dtcStart(num);
      const url = PRE_URL_1.replace(/{%0}/, start)
        .replace(/{%1}/, today)
        .replace(/{%2}/, skip);
      //alert(url);
      try {
        const map = await window.axios.get(url);
        map.Items.forEach(s => {
          labels.push(s.EMPLOYEENAME);
          data1.push(s.COUNT > 0 ? parseInt(s.COUNT) : 0);
          data2.push(s.UNCOUNT > 0 ? parseInt(s.UNCOUNT) : 0);
        });
        this.$root.$emit("dtc-report-db-count", map.Count);
      } catch (e) {
        //alert(e);
        return;
      }
      this.labels = [...labels];
      this.$root.$emit("報告總量", false);
      this.drawReport(data1, data2);
    },
    drawReport (data1, data2) {
      const labels = this.labels;
      this.chartData = {
        labels,
        datasets: [
          {
            label: "報告完成",
            backgroundColor: "#E46651",
            data: data1
          },
          {
            label: "報告未完成",
            backgroundColor: "#2837ae",
            data: data2
          }
        ]
      };
    }
  },
  async mounted () {
    this.getData();
    // let reports = await window.axios.get("/employee/SelectList?staffType=35");
    // const labels = reports.Items.slice(10, 25).map(s => s.Name);
    // this.labels = labels;
    // const data1 = [];
    // const data2 = [];
    // labels.forEach(() => {
    //   data1.push(this.getRandomInt());
    //   data2.push(this.getRandomInt());
    // });
    // this.drawReport(data1, data2);
    //alert("w");
  },
  watch: {
    time (val) {
      // val from 1 ~ 4
      this.currentTime = val;
      this.pageHolder = 1;
      this.getData(val);
    },
    page (val) {
      if (this.pageHolder == val) return;
      this.pageHolder = val;
      this.getData(this.currentTime);
    }
  }
};
</script>

<style lang="scss" scoped>
.dtc-chart {
  color: white;
}
</style>
