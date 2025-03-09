<div class="dtc-chart">
    <Radar :chartdata="chartData" :options="chartOptions"  />
</div>

<script>
//import VueCharts from "vue-chartjs";
import { Radar, mixins } from "vue-chartjs";
const { reactiveData } = mixins;
// #8 last one
export default {
  extends: Radar,
  mixins: [reactiveData],
  name: "homeDevice",
  props: ["time", "person"],
  data() {
    return {
      chartdata: {},
      labels: [],
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    };
  },
  methods: {
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
    },
    async getData() {
      // TODO: get data from person id and time
      //this.drawReport(data);
    },
    async drawReport(data) {
      const labels = this.labels;
      this.chartData = {
        labels,
        datasets: [
          {
            label: "使用儀器逾時報告(單位分鐘)",
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            pointBackgroundColor: "rgba(255,99,132,1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(255,99,132,1)",
            data
          }
        ]
      };
    }
  },
  async mounted() {
    this.$root.$emit("個別逾時", true);
    const map = await window.axios.get("/api/Device");
    let arr = [];
    map.Items.forEach(s => {
      arr.push(s.Name);
    });
    const labels = arr;
    const data = [];
    labels.forEach(() => {
      data.push(this.getRandomInt());
    });
    this.labels = labels;
    this.drawReport(data);
    this.$root.$emit("個別逾時", false);
  },
  watch: {
    time(val) {
      // val from 1 ~ 4
    },
    person(val) {
      //person id
    }
  }
};
</script>

<style lang="scss" scoped>
.dtc-chart {
  color: white;
}
</style>
