<template>
  <section class="body mt-2">
    <div class="sec1">
      <header>
        Antegrade Function
        <input style="display:inline; width:150px;" />
      </header>
      <b-input-group prepend="SCL" style="margin-top:5px; margin-bottom:5px;">
        <b-input />
      </b-input-group>
      <b-input-group prepend="AH" style="margin-top:5px; margin-bottom:5px;">
        <b-input />
      </b-input-group>
      <b-input-group prepend="HV" style="margin-top:5px; margin-bottom:5px;">
        <b-input />
      </b-input-group>
      <b-input-group prepend="AVNF 1:1" style="margin-top:5px; margin-bottom:5px;">
        <b-input />
      </b-input-group>
      <b-input-group prepend="AVNS 1:1" style="margin-top:5px; margin-bottom:5px;">
        <b-input />
      </b-input-group>
      <b-input-group prepend="AP" style="margin-top:5px; margin-bottom:5px;">
        <b-input />
      </b-input-group>
      <b-input-group prepend="AVNFERP" style="margin-top:5px; margin-bottom:5px;">
        <b-input />
      </b-input-group>
      <b-input-group prepend="AVNSERP" style="margin-top:5px; margin-bottom:5px;">
        <b-input />
      </b-input-group>
      <b-input-group prepend="AP ERP" style="margin-top:5px; margin-bottom:5px;">
        <b-input />
      </b-input-group>
      <b-input-group prepend="AERP" style="margin-top:5px; margin-bottom:5px;">
        <b-input />
      </b-input-group>
    </div>

    <div class="sec1">
      <header>
        Retrograde Function
        <input style="display:inline; width:150px;" />
      </header>
      <b-input-group prepend="AVNF 1:1" style="margin-top:5px; margin-bottom:5px;">
        <b-input />
      </b-input-group>
      <b-input-group prepend="AVNS 1:1" style="margin-top:5px; margin-bottom:5px;">
        <b-input />
      </b-input-group>
      <b-input-group prepend="AP" style="margin-top:5px; margin-bottom:5px;">
        <b-input />
      </b-input-group>
      <b-input-group prepend="AVNSERP" style="margin-top:5px; margin-bottom:5px;">
        <b-input />
      </b-input-group>
      <b-input-group prepend="AP ERP" style="margin-top:5px; margin-bottom:5px;">
        <b-input />
      </b-input-group>
      <b-input-group prepend="VERP" style="margin-top:5px; margin-bottom:5px;">
        <b-input />
      </b-input-group>
    </div>
    <div>
      <header class="thrid">SNRT(ms)</header>
      <div style="margin-top:5px; margin-bottom:5px;" class="sec3-grid">
        <div>PCL</div>
        <div>BCL</div>
        <div>SNRT</div>
        <div>CSNRT</div>
        <b-input v-for="item in 16" :key="item"></b-input>
      </div>
    </div>
    <div class="dtc-input">
      <header class="last">Conclusion</header>
      <textarea :spellcheck="false" v-model="dtcInput" style="padding:3px;"></textarea>
    </div>
  </section>
</template>

<script>
const dtcInput =
  "The right jugular area, right femoral area and left femoral area were locally injected with 2% lidocaine. After anathesis, a HRA and RV catheter were introduced into the right heart. EPS was done and showed CSNRT was 3 ms. The patient tolerated the whole procedure well.";
export default {
  data() {
    return {
      mod1: "",
      dtcInput,
      pm: "",
      pm3: "",
      mod1Ops: [
        {
          value: "1",
          text: "Sick sinus syndrome with pause"
        },
        {
          value: "2",
          text: "High degree AV block"
        },
        {
          value: "3",
          text: "Symptomatic bradycardia"
        },
        {
          value: "4",
          text: "Recurrent syncope, hypersensitive cardioinhibitory response"
        },
        {
          value: "5",
          text: "Trifasicular block"
        }
      ],
      mod2: "",
      mod2Ops: [
        {
          value: "1",
          text: "VVI"
        },
        {
          value: "2",
          text: "VVIR"
        },
        {
          value: "3",
          text: "VDD"
        },
        {
          value: "4",
          text: "DDD"
        },
        {
          value: "5",
          text: "DDD(MRI)"
        },
        {
          value: "6",
          text: "DDR"
        },
        {
          value: "7",
          text: "DDR(MRI)"
        }
      ]
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
  --font-family-sans-serif: -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  --font-family-monospace: SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
}
</style>

<style lang="scss" scoped>
.dtc-input {
  display: flex;
  flex-direction: column;
  > textarea {
    min-height: calc(100% - 39px);
  }
}
.body {
  display: grid;
  grid-template-columns: 330px 340px 430px 1fr; //repeat(4, 1fr);
  grid-column-gap: 0.4rem;
  > div {
    min-height: 400px;
    border: 1px solid white;
    border-radius: 5px;
    padding: 3px;
    header {
      padding-top: 2px;
      height: 38px;
      font-size: 1rem;
      line-height: 24px;
      padding-left: 12px;
      background: var(--success);
    }
    .sec {
      background: var(--indigo);
    }
    .thrid {
      background: var(--info);
    }
    .last {
      background: var(--blue);
    }
  }
  > div {
    color: white;
  }
}

.form-ppm {
  margin-top: 1rem;
  padding-left: 1rem;
  display: flex;
  flex-direction: column;
}

.input-text {
  margin-left: 12px;
  width: 320px;
}

.ops-grid,
.ops-grid-other,
.ops-grid-other2 {
  display: grid;
  grid-template-columns: 24px 1fr;
  margin-top: 12px;
  padding-left: 12px;
  color: white;
}
.ops-grid-other {
  grid-template-columns: 24px 55px 220px;
  margin-top: 1rem;
}
.ops-grid-other2 {
  grid-template-columns: 24px 90px 190px;
  margin-top: 1rem;
}
input[type="radio"] {
  transform: scale(1.3);
}

.init-grid {
  display: grid;
  padding: 5px;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 6px;
  grid-row-gap: 12px;
  .input-group-text {
    min-width: 110px;
    max-width: 110px;
  }
}
.sec1 {
  .input-group-text {
    min-width: 100px;
    max-width: 100px;
  }
}
.sec3-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 2px;
  grid-row-gap: 4px;
  text-align: center;
}
</style>


