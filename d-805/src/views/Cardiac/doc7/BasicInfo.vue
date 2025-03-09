<template>
  <sectoin>
    <div class="dtc-car5-grid" v-show="!showDetail">
      <b-input-group prepend="病患姓名">
        <b-input readonly v-model="info.name" />
      </b-input-group>
      <b-input-group prepend="檢查日期">
        <b-input readonly v-model="info.inspectDate" />
      </b-input-group>
      <b-input-group prepend="病患年齡">
        <b-input readonly v-model="info.age" />
      </b-input-group>
      <b-input-group prepend="病患性別">
        <b-input readonly v-model="info.sex" />
      </b-input-group>
      <b-input-group prepend="病患來源">
        <b-input readonly v-model="info.from" />
      </b-input-group>
      <b-input-group prepend="執行醫生">
        <b-select :options="arr"></b-select>
      </b-input-group>
      <b-input-group prepend="助手醫生">
        <b-select :options="arr"></b-select>
      </b-input-group>
      <b-input-group prepend="報告狀態">
        <b-input readonly />
      </b-input-group>
      <b-input-group prepend="局部麻醉2%Lidocaine" class="dtc-expend-cols">
        <b-input></b-input>
        <label>cc at</label>
        <input type="date" style="padding-left:1rem; border-radius:5px;" v-model="info.defaultDate" />
      </b-input-group>
    </div>
    <div class="dtc-car5-grid" v-show="showDetail">
      <b-input-group prepend="優先順序">
        <b-input readonly />
      </b-input-group>
      <b-input-group prepend="檢查日期">
        <b-input readonly />
      </b-input-group>
      <b-input-group prepend="申請單號">
        <b-input readonly />
      </b-input-group>
      <b-input-group prepend="病歷號">
        <b-input readonly />
      </b-input-group>
      <b-input-group prepend="病患來源" v-model="info.from">
        <b-input readonly />
      </b-input-group>
    </div>
    <div class="dtc-car5-grid" v-show="showDetail">
      <b-input-group prepend="病患姓名">
        <b-input readonly v-model="info.name" />
      </b-input-group>
      <b-input-group prepend="病患性別">
        <b-input v-model="info.sex" readonly />
      </b-input-group>
      <b-input-group prepend="出生日期">
        <b-input v-model="info.inspectDate" readonly />
      </b-input-group>
      <b-input-group prepend="病患年齡">
        <b-input v-model="info.age" readonly />
      </b-input-group>
      <b-input-group prepend="病床編號">
        <b-input readonly />
      </b-input-group>
    </div>
    <div class="dtc-car5-grid" v-show="showDetail">
      <b-input-group prepend="執行醫生">
        <b-select :options="arr"></b-select>
      </b-input-group>
      <b-input-group prepend="助手醫生">
        <b-select :options="arr"></b-select>
      </b-input-group>
      <b-input-group prepend="護理師">
        <b-select :options="arr"></b-select>
      </b-input-group>
      <b-input-group prepend="放設師">
        <b-select :options="arr"></b-select>
      </b-input-group>

      <b-input-group prepend="儀器類別">
        <b-input readonly />
      </b-input-group>
    </div>
    <div class="dtc-car5-grid" v-show="showDetail">
      <b-input-group prepend="導管號碼">
        <b-input />
      </b-input-group>
      <b-input-group prepend="組織庫">
        <div style="border:1px solid white;border-radius:5px;flex:1">
          <b-button variant="info" size="sm" class="ml-4" @click="tissue = true">
            是&nbsp;&nbsp;
            <font-awesome-icon icon="check" class="mt-1" v-if="tissue" />
          </b-button>

          <b-button class="ml-3" size="sm" variant="warning" @click="tissue = false">
            否&nbsp;&nbsp;
            <font-awesome-icon icon="check" class="mt-1" v-if="!tissue" />
          </b-button>
        </div>
      </b-input-group>
      <b-input-group prepend="報告狀態">
        <b-input readonly />
      </b-input-group>
      <b-input-group prepend="局部麻醉2%Lidocaine" class="dtc-expend-cols">
        <b-input></b-input>
        <label>cc at</label>
        <input type="date" style="padding-left:1rem; border-radius:5px;" v-model="info.defaultDate" />
      </b-input-group>
    </div>
  </sectoin>
</template>

<script>
import moment from "moment";
let i = 0;
const arr = new Array(10).fill("").map(_ => ++i);

export default {
  data() {
    return {
      info: {
        name: "趙大升",
        age: "76",
        inspectDate: "2019/10/14",
        from: "O-門診",
        sex: "M-男性",
        defaultDate: moment().format("YYYY-MM-DD")
      },
      showDetail: true,
      arr,
      tissue: true
    };
  },
  beforeMount() {
    this.$root.$on("car-report-toggle-detail", val => {
      this.showDetail = !this.showDetail;
    });
  }
};
</script>
<style>
root {
  --blue: #007bff;
  --indigo: #6610f2;
  --purple: #6f42c1;
  --pink: #e83e8c;
  --red: #dc3545;
  --orange: #fd7e14;
  --yellow: #ffc107;
  --green: #28a745;
  --teal: #20c997;
  --cyan: #17a2b8;
  --white: #fff;
  --gray: #6c757d;
  --gray-dark: #343a40;
  --primary: #007bff;
  --secondary: #6c757d;
  --success: #28a745;
  --info: #17a2b8;
  --warning: #ffc107;
  --danger: #dc3545;
  --light: #f8f9fa;
  --dark: #343a40;
  --breakpoint-xs: 0;
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
  --font-family-sans-serif: -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  --font-family-monospace: SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
}
</style>

<style lang="scss" scoped>
.cvs {
  background: black !important;
  font-size: 16px;
  font-weight: 600;
  margin-top: 56px;
  width: 100vw;
  min-height: calc(100vh - 56px);
  padding: 2px;
}

header {
  background: var(--yellow);
  color: black;
  height: 30px;
  border-radius: 5px;
  line-height: 30px;
  padding-left: 12px;
}

.first {
  display: flex;
}

.dtc-car5-grid {
  padding: 3px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 8px !important;
}

.input-group-prepend .input-group-text {
  min-width: 100px;
  max-width: 100px;
  background: rgba(0, 0, 0, 0.7);
  color: hsla(0, 0%, 100%, 0.7);
}
.input-group-append .input-group-text {
  background: rgba(34, 29, 29, 0.7);
  color: hsla(0, 0%, 100%, 0.7);
}
.input-group input,
.input-group select {
  background: rgba(0, 0, 0, 0.7);
  color: white;
}
.dtc-expend-cols {
  grid-column: 4 / -1;
  label {
    display: inline-block;
    margin: 6px 1rem 0 1rem;
    color: hsla(0, 0%, 100%, 0.7);
  }
  .input-group-prepend .input-group-text {
    max-width: 190px;
  }
}
</style>