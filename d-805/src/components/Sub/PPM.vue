<template>
  <section class="body mt-2">
    <div>
      <header>Diagnosis for Pacemaker Implantation</header>
      <div v-for="(item, i) in mod1Ops" :key="i" class="ops-grid">
        <input type="radio" v-model="mod1" :value="item.value" />
        <label>{{ item.text }}</label>
      </div>
      <div class="ops-grid-other">
        <input type="radio" v-model="mod1" :value="6" />
        <label>Others</label>
        <b-input></b-input>
      </div>
    </div>
    <div>
      <header class="sec">Mode</header>
      <div v-for="(item, i) in mod2Ops" :key="i" class="ops-grid">
        <input type="radio" v-model="mod2" :value="item.value" />
        <label>{{ item.text }}</label>
      </div>
    </div>
    <div>
      <header class="thrid">Type</header>
      <div class="ops-grid-other2">
        <input type="radio" v-model="pm" :value="99" />
        <label>Medtronic</label>
        <b-input></b-input>
      </div>
      <div class="ops-grid-other2">
        <input type="radio" v-model="pm" :value="98" />
        <label>Biotronik</label>
        <b-input></b-input>
      </div>
      <div class="ops-grid-other2">
        <input type="radio" v-model="pm" :value="108" />
        <label>ST JUDE Medical</label>
        <b-input></b-input>
      </div>
    </div>
    <div>
      <header class="last">Initial Parameter</header>
      <div class="init-grid">
        <header class="bg-success">Initial Parameter</header>
        <b-input-group prepend="Threshold" append="V">
          <b-input />
        </b-input-group>
        <b-input-group prepend="Impedance" append="ohm">
          <b-input />
        </b-input-group>
        <b-input-group prepend="P/R wave" append="mv">
          <b-input />
        </b-input-group>
        <b-input-group prepend="Rate" append="PPM">
          <b-input />
        </b-input-group>
        <b-input-group prepend="Amplitude" append="V">
          <b-input />
        </b-input-group>
        <b-input-group prepend="Sensitivity" append="mv">
          <b-input />
        </b-input-group>
        <b-input-group prepend="Pulse width" append="ms">
          <b-input />
        </b-input-group>
        <b-input-group prepend="Refractory" append="msec">
          <b-input />
        </b-input-group>
        <b-input-group prepend="Polarity">
          <b-input v-model="polar" />
        </b-input-group>
        <b-input-group prepend="A-V delay" append="msec">
          <b-input />
        </b-input-group>
        <b-input-group prepend="Hysteresis" append=":OFF">
          <b-input />
        </b-input-group>
      </div>
    </div>
  </section>
</template>

<script>
const polar = "Bipolar";
export default {
  data() {
    return {
      polar,
      mod1: "",
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
  --font-family-sans-serif: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol", "Noto Color Emoji";
  --font-family-monospace: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
</style>

<style lang="scss" scoped>
.body {
  display: grid;
  grid-template-columns: 330px 120px 330px 1fr; //repeat(4, 1fr);
  grid-column-gap: 0.4rem;
  > div {
    min-height: 400px;
    border: 1px solid white;
    border-radius: 5px;
    header {
      height: 24px;
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
  grid-column-gap: 0.3rem;
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
  .input-group-prepend .input-group-text {
    min-width: 110px;
    max-width: 110px;
  }
  .input-group-append .input-group-text {
    min-width: 60px;
    max-width: 60px;
  }
}
</style>
