<div class="dtc-chart">
    <Bar :chartdata="chartData" :options="chartOptions"  />
</div>

<script>
//import VueCharts from "vue-chartjs";
import { Bar, mixins } from "vue-chartjs";
const { reactiveData } = mixins;
// #4
const PRE_URL_1 = "/reportStatistics/DxStatusTotalCount?staftype=20&startDate={%0}&endDate={%1}";
const PRE_URL_2 = "/reportStatistics/DxStatusTotalVerifyCount?startDate={%0}&endDate={%1}";
const PRE_URL_3 = "/reportStatistics/DxStatusTotalCount?staftype=35&startDate={%0}&endDate={%1}";
const PRE_URL_4 = "/reportStatistics/DxStatusTotalCount?staftype=51&startDate={%0}&endDate={%1}";

export default {
  labels: [],
  extends: Bar,
  mixins: [reactiveData],
  name: "workload",
  props: ["time", "type"],
  data() {
    return {
      url: PRE_URL_1,
      currentTime: "",
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
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
    },
    async getData(num = 1) {
      this.$root.$emit("工作總量", true);
      const labels = [];
      const data = [];
      const today = window.dtcToday;
      const start = window.dtcStart(num);
      const url = this.url.replace(/{%0}/, start).replace(/{%1}/, today);
      try {
        const map = await window.axios.get(url);
        map.Items.forEach(s => {
          labels.push(s.EMPLOYEENAME);
          data.push(s.COUNT > 0 ? parseInt(s.COUNT) : 0);
        });
      } catch (e) {
        alert(e);
      }
      this.labels = labels;
      this.$root.$emit("工作總量", false);
      this.drawReport(data);
    },
    drawReport(data) {
      const labels = this.labels;
      this.chartData = {
        labels,
        datasets: [
          {
            label: "報告件數",
            backgroundColor: "#28a745",
            data
          }
        ]
      };
    }
  },
  async mounted() {
    this.getData();
  },
  watch: {
    time(val) {
      this.currentTime = val;
      this.getData(val);
    },
    type(val) {
      if (val == 1) {
        this.url = PRE_URL_1;
      } else if (val == 2) {
        this.url = PRE_URL_2;
      } else if (val == 3) {
        this.url = PRE_URL_3;
      } else {
        this.url = PRE_URL_4;
      }
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
