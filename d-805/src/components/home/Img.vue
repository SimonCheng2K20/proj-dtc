<div class="dtc-chart">
    <Doughnut :chartdata="chartData" :options="chartOptions"  />
</div>

<script>
import { Doughnut, mixins } from "vue-chartjs";
const { reactiveData } = mixins;
// #2
const PRE_URL = "/reportStatistics/ImageQuality?startDate={%0}&endDate={%1}&$inlinecount=allpages&$skip=0&$top=11111440";
export default {
  labels: [],
  extends: Doughnut,
  mixins: [reactiveData],
  name: "homeImg",
  props: ["time"],
  data() {
    return {
      chartdata: {},
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

    async getData(num = 1) {
      this.$root.$emit("影像品質", true);
      let imgs = await window.axios.get("/GeneralData/SelectNoList?groupNo=ImageQuality");
      let arr = [];
      const today = window.dtcToday;
      const start = window.dtcStart(num);
      imgs = imgs.Items;
      imgs.forEach(s => {
        arr.push(s.Name);
      });
      this.labels = arr;
      const url = PRE_URL.replace(/{%0}/, start).replace(/{%1}/, today);
      try {
        const map = await window.axios.get(url);
        const data = [map[0].IMAGEQUALITY30_COUNT, map[0].IMAGEQUALITY40_COUNT, map[0].IMAGEQUALITY60_COUNT];
        this.$root.$emit("影像品質", false);
        this.drawReport(data);
      } catch (e) {
        alert(e);
      }
      //this.labels = labels;
      //this.drawReport(data);
    },
    drawReport(data) {
      const labels = this.labels;
      this.chartData = {
        labels,
        datasets: [
          {
            label: "影像品質",
            backgroundColor: ["#41B883", "#E46651", "#343a40"],
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
