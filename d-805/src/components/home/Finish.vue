<div class="dtc-chart">
    <HorizontalBar :chartdata="chartData" :options="chartOptions"  />
</div>

<script>
//import VueCharts from "vue-chartjs";
import { HorizontalBar, mixins } from "vue-chartjs";
const { reactiveData } = mixins;

// this is #6 in dashboard
const PRE_URL = "/reportStatistics/IssueDateAvg?deviceguid={%2}&startDate={%0}&endDate={%1}";
export default {
  extends: HorizontalBar,
  mixins: [reactiveData],
  name: "homeFinish",
  props: ["time", "type"],
  data() {
    return {
      deviceId: 1,
      myTime: 1,
      lables: [],
      chartdata: {},
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
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
    convertMin2Hour(num) {
      let h = num;
      h = (num / 60).toFixed(2);
      return h;
    },
    async getData(num = 1, device = 1) {
      this.$root.$emit("完成時間", true);
      const labels = [];
      const data = [];
      const today = window.dtcToday;
      const start = window.dtcStart(num);
      const url = PRE_URL.replace(/{%0}/, start)
        .replace(/{%1}/, today)
        .replace(/{%2}/, device);

      try {
        const map = await window.axios.get(url);
        map.Items.forEach(s => {
          labels.push(s.EMPLOYEENAME);
          data.push(s.PAYDAY > 0 ? this.convertMin2Hour(s.PAYDAY) : 0);
        });
      } catch (e) {
        alert(e);
      }
      this.labels = labels;
      this.$root.$emit("完成時間", false);
      this.drawReport(data);
    },
    drawReport(data) {
      const labels = this.labels;
      this.chartData = {
        labels,
        datasets: [
          {
            label: "平均完成時間(小時)TOP 10人員",
            backgroundColor: "#ffc107",
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
      this.myTime = val;
      this.getData(val, this.deviceId);
    },
    type(val) {
      this.deviceId = val;
      this.getData(this.myTime, val);
    }
  }
};
</script>

<style lang="scss" scoped>
.dtc-chart {
  color: white;
}
</style>
