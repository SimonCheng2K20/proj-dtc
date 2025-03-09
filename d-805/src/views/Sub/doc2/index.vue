<template>
  <div class="cvs">
    <header class="dtc-header mb-1">
      <div>心臟超音波系統畫面</div>
      <b-button size="sm" variant="primary" style="max-height:30px;margin-top:1px"> <font-awesome-icon size="sm" icon="edit" />儲存變更 </b-button>
    </header>
    <section class="dtc-grid">
      <b-input-group prepend="Type" style="border:1px solid white;">
        <b-form-checkbox-group :options="types" class="text-light ml-2 mt-2" />
      </b-input-group>
      <b-input-group prepend="Tape No">
        <b-select />
      </b-input-group>
      <b-input-group prepend="Clinical Diagnosis">
        <b-select />
      </b-input-group>
    </section>
    <hr class="mt-2" />
    <section class="dtc-grid2">
      <b-input-group prepend="IVS" append="mm(6-12)">
        <b-input />
      </b-input-group>
      <b-input-group prepend="AO" append="mm(20-39)">
        <b-input />
      </b-input-group>
      <b-input-group prepend="LEEDD" append="mm(36-52)">
        <b-input />
      </b-input-group>
      <b-input-group prepend="LA" append="mm(19-40)">
        <b-input />
      </b-input-group>
      <b-input-group prepend="LVPW" append="mm(6-12)">
        <b-input />
      </b-input-group>
      <b-input-group prepend="EF" append="%">
        <b-input />
      </b-input-group>
      <b-input-group prepend="LVESD" append="mm(20-36)">
        <b-input />
      </b-input-group>
      <b-input-group prepend="LV Mass" append="*" style="outline:4px solid red;">
        <b-input />
      </b-input-group>
      <b-input-group append="Gm" style="outline:4px solid red;">
        <b-input />
      </b-input-group>
      <b-input-group prepend="RVD" append="mm(7-23)">
        <b-input />
      </b-input-group>
      <b-input-group prepend="LV MI" append="*" style="outline:4px solid red;">
        <b-input />
      </b-input-group>
      <b-input-group append="Gm/m2" style="outline:4px solid red;">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Rhythm" class="ml-2">
        <b-select></b-select>
      </b-input-group>
      <b-input-group>
        <b-select></b-select>
      </b-input-group>
    </section>
    <section class="left-right">
      <div class="left">
        <div>1. Cardicac chamber and Aorta:</div>
        <b-select />
        <b-select />
        <div>2. Wall motions:</div>
        <b-select />
        <b-select />
        <div>3. Aortic vavle:</div>
        <b-select />
        <b-input-group prepend="Mitral valve">
          <b-select />
        </b-input-group>
        <div>4. Pericardial effusion:</div>
        <b-select />
        <b-input-group prepend="Thrombus">
          <b-select />
        </b-input-group>
        <div>5. Others:</div>
        <b-select />
      </div>
      <div class="right">
        <header class="dtc-header mb-1">1. Mirtal Flow</header>
        <section class="dtc-grid-2">
          <b-input-group prepend="E/A=" append="/">
            <b-input />
          </b-input-group>
          <b-input-group append="cm/sec">
            <b-input />
          </b-input-group>
          <b-input-group prepend="MS">
            <b-select />
          </b-input-group>
          <b-input-group prepend="MR">
            <b-select />
          </b-input-group>
          <b-input-group prepend="MVA" append="cm2PHT">
            <b-input />
          </b-input-group>
          <b-input-group prepend="MVA" append="cm2D">
            <b-input />
          </b-input-group>
          <b-input-group prepend="MS-Pmax" append="mmHg">
            <b-input />
          </b-input-group>
          <b-input-group prepend="MR-Pmax" append="mmHg">
            <b-input />
          </b-input-group>
        </section>
        <header class="dtc-header mb-1 mt-1">2. Aortic Flow</header>
        <section class="dtc-grid-2">
          <b-input-group prepend="AS">
            <b-select />
          </b-input-group>
          <b-input-group prepend="AR">
            <b-select />
          </b-input-group>
          <b-input-group prepend="AS-PG" append="mmHg">
            <b-input />
          </b-input-group>
          <b-input-group prepend="AR-PG" append="mmHg">
            <b-input />
          </b-input-group>
        </section>
        <header class="dtc-header mb-1 mt-1">3. Tricuspid Flow</header>
        <section class="dtc-grid-2">
          <b-input-group prepend="TR">
            <b-select />
          </b-input-group>
          <b-input-group prepend="TR-PG">
            <b-select />
          </b-input-group>
        </section>
        <header class="dtc-header mb-1 mt-1">4. Pulmonic Flow</header>
        <section class="dtc-grid-2">
          <b-input-group prepend="PR">
            <b-input />
          </b-input-group>
          <b-input-group prepend="ACT" append="msec">
            <b-input />
          </b-input-group>
        </section>
        <header class="dtc-header mb-1 mt-1 header-grid">
          5. Others
          <b-input-group prepend="Other">
            <b-select />
          </b-input-group>
        </header>
      </div>
    </section>
  </div>
</template>

<script>
const types = ["M20 05", "Doppler 06", "Color07"];
export default {
  data() {
    return {
      types
    };
  },

  components: {}
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
  --font-family-sans-serif: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol", "Noto Color Emoji";
  --font-family-monospace: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
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
}

header {
  background: var(--yellow);
  color: black;
  height: 30px;
  border-radius: 5px;
  line-height: 30px;
  padding-left: 12px;
}

.dtc-header {
  display: grid;
  height: 32px;
  grid-template-columns: 190px max-content;
}
.dtc-grid,
.dtc-grid2 {
  width: 100vw;
  display: grid;
  margin: 0px;
  padding: 3px;
  grid-template-columns: max-content 1fr 2fr;
  grid-gap: 3px !important;
  .input-group-prepend .input-group-text {
    min-width: 160px;
    max-width: 160px;
  }

  .long .input-group-prepend .input-group-text {
    min-width: 184px;
    max-width: 184px;
  }
}
.dtc-grid2 {
  margin-top: 0.3rem;
  grid-template-columns: repeat(5, 1fr);
  grid-row-gap: 12px !important;
  .input-group-prepend .input-group-text {
    min-width: 80px;
    max-width: 80px;
  }
  .input-group-append .input-group-text {
    min-width: 90px;
    max-width: 90px;
  }
}
.left-right {
  display: grid;
  padding: 3px;
  margin-top: 5px;
  grid-template-columns: 1fr 1fr;
  grid-gap: 12px;
  > div {
    border: 1px solid white;
    border-radius: 5px;
    height: calc(100vh - 340px);
    padding: 5px;
    display: grid;
    grid-template-columns: 1fr;
    color: white;
  }
  .right {
    display: block;
  }
}
.dtc-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 3px;
  .input-group-prepend .input-group-text {
    min-width: 100px;
    max-width: 100px;
  }
  .input-group-append .input-group-text {
    min-width: 90px;
    max-width: 90px;
  }
}
.header-grid {
  display: grid;
  grid-template-columns: 100px 1fr;
  grid-gap: 12px;
  height: 40px;
}
.input-group-prepend {
  max-height: 38px;
}
</style>
