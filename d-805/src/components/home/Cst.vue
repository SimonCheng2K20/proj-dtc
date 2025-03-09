<div class="dtc-chart">
    <Bar :chartdata="chartData" :options="chartOptions"  />
</div>

<script>
//import VueCharts from "vue-chartjs";
import { Bar, mixins } from "vue-chartjs";
const { reactiveData } = mixins;
// #1
const PRE_URL = "/reportStatistics/NegativeCount?startDate={%0}&endDate={%1}&$inlinecount=allpages&$skip=0&$top=11111440";
export default {
  extends: Bar,
  mixins: [reactiveData],
  name: "homeCST",
  props: ["time"],
  data() {
    return {
      chartdata: {},
      labels: [],
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
    async getData(num = 1) {
      // CSTID: "CST2019001", CSTNAME: "肺癌", NEGATIVE_COUNT: 18, POSITIVE_COUNT: 3}
      this.$root.$emit("陰性報告", true);
      const labels = [];
      let data1 = [];
      let data2 = [];
      const today = window.dtcToday;
      const start = window.dtcStart(num);
      const url = PRE_URL.replace(/{%0}/, start).replace(/{%1}/, today);
      try {
        const map = await window.axios.get(url);
        map.Items.forEach(s => {
          labels.push(s.CSTNAME);
          data1.push(s.POSITIVE_COUNT);
          data2.push(s.NEGATIVE_COUNT);
        });
      } catch (e) {
        alert(e);
      }
      this.labels = [...labels];
      this.$root.$emit("陰性報告", false);
      this.drawReport(data1, data2);
    },
    async drawReport(data1, data2) {
      const labels = this.labels;
      this.chartData = {
        labels,
        datasets: [
          {
            label: "陽性反應",
            backgroundColor: "#f87979",
            data: data1
          },
          {
            label: "陰性反應",
            backgroundColor: "#28a745",
            data: data2
          }
        ]
      };
    }
  },
  async mounted() {
    const reports = await window.axios.get("/cst/List");
    const labels = reports.map(s => s.CSTName);
    window.cstLabels = [...labels];
    this.getData();
  },
  watch: {
    time(val) {
      this.getData(val);
    }
  }
};
</script>

<style lang="scss" scoped>
.dtc-chart {
  color: white;
}
</style>
