<template>
  <section class="body mt-2">
    <div class="sec1">
      <header>VPCS/VT</header>

      <b-input-group prepend="Activation map: Earliest diastolic activity" style="margin-top:5px; margin-bottom:5px;" append="mS">
        <b-input></b-input>
      </b-input-group>
      <b-input-group prepend="Pacemapping" style="margin-top:5px; margin-bottom:5px;" append="/12 compatible">
        <b-input></b-input>
      </b-input-group>
      <b-input-group prepend="ECG/Scar based assessment " style="margin-top:5px; margin-bottom:5px;border:1px solid white;">
        <b-form-radio-group style="margin-left:12px;margin-top:5px;" v-model="value5" :options="answers"></b-form-radio-group>
      </b-input-group>
      <b-input-group prepend="Late potential or LAVA " style="margin-top:5px; margin-bottom:5px;border:1px solid white;">
        <b-form-radio-group style="margin-left:12px;margin-top:5px;" v-model="value5" :options="answers"></b-form-radio-group>
      </b-input-group>
      <section class="dtc-car24-grid">
        <div class="dtc-car24-grid">
          <b-check style="grid-column:1/-1">VT type/substrates</b-check>
          <div></div>
          <b-check>mono</b-check>
          <b-check>multifrom</b-check>
          <b-input style="max-height:30px;font-size:16px;min-width:120px"></b-input>
          <span>from;</span>
          <b-check>single</b-check>
          <b-check style="min-width:110px">multi-sites</b-check>
          <span>ABL</span>
          <b-input style="max-height:30px;font-size:16px;min-width:120px"></b-input>
          <span>site:</span>
        </div>
      </section>
      <section class="dtc-car24-grid mt-2">
        <b-check style="grid-column:2/-1">Idiopathic VT:</b-check>
        <b-check style="grid-column:3/-1">RVOT(could be multi-choices):</b-check>
        <b-check style="grid-column:4/span 7">Septal origin: </b-check>
        <b-check style="grid-column:11">anterior </b-check>
        <b-check style="grid-column:12">intermediate </b-check>
        <b-check style="grid-column:13/-1">posterior </b-check>
        <b-check style="grid-column:11">high </b-check>
        <b-check style="grid-column:12">middle </b-check>
        <b-check style="grid-column:13/-1">low</b-check>

        <b-check style="grid-column:4/span 7">Free wall origin: </b-check>
        <b-check style="grid-column:11">anterior </b-check>
        <b-check style="grid-column:12">intermediate </b-check>
        <b-check style="grid-column:13/-1">posterior </b-check>
        <b-check style="grid-column:11">high </b-check>
        <b-check style="grid-column:12">middle </b-check>
        <b-check style="grid-column:13/-1">low</b-check>
      </section>
      <section class="dtc-car24-grid mt-2">
        <div class="dtc-car24-grid">
          <div></div>
          <b-check style="grid-column:2/-1">LVOT VT/VPC</b-check>
        </div>
      </section>
      <section class="dtc-car24-grid mt-2">
        <div class="dtc-car24-grid">
          <div></div>
          <b-check style="grid-column:2/-1">Basal mitral VT/VPC</b-check>
        </div>
      </section>
      <section class="dtc-car24-grid mt-2">
        <b-check style="grid-column:2/ span 5">Septal-parahisian </b-check>
        <b-check style="grid-column:7/span 3">AMC </b-check>
        <b-check style="grid-column:11/span 4">Superior MA </b-check>
        <b-check style="grid-column:15/-1">Superolateral MA</b-check>
        <b-check style="grid-column:2/ span 5">Lateral MA </b-check>
        <b-check style="grid-column:7/span 3">Posterior </b-check>
        <b-check style="grid-column:11/span 4">Posteroseptal </b-check>
      </section>
      <section class="dtc-car24-grid mt-2">
        <div class="dtc-car24-grid">
          <div></div>
          <b-check style="min-width:470px;">LV VT/VPC(Other than LVOT and Basal mitral VT): Zone</b-check>
          <b-input style="min-width:160px;max-width:160px;max-height:28px;"></b-input>
        </div>
      </section>
      <section class="dtc-car24-grid mt-2">
        <div class="dtc-car24-grid">
          <div></div>
          <b-check style="grid-column:2/-1">Right Ventricle VT/VPC</b-check>
        </div>
      </section>
      <section class="dtc-car24-grid mt-2">
        <b-check style="grid-column:2/ span 5">Septal origin: </b-check>
        <b-check style="grid-column:8/span 3">TVA </b-check>
        <b-check style="grid-column:11/span 4">Basal </b-check>
        <b-check style="grid-column:15/-1">Apical</b-check>
        <b-check style="grid-column:8/ span 3">Superior </b-check>
        <b-check style="grid-column:11/span 3">Inferior</b-check>
      </section>
      <section class="dtc-car24-grid mt-2">
        <b-check style="grid-column:2/ span 5">Free wall origin: </b-check>
        <b-check style="grid-column:7/span 3">TVA </b-check>
        <b-check style="grid-column:11/span 4">Basal </b-check>
        <b-check style="grid-column:15/-1">Apical</b-check>
        <b-check style="grid-column:7/ span 3">Superior </b-check>
        <b-check style="grid-column:11/span 3">Inferior</b-check>
        <b-check style="grid-column:2/ -1">PA VT/VPC </b-check>
        <b-check style="grid-column:2/ -1">Cuspid VT/VPC </b-check>
        <b-check style="grid-column:3">LCC </b-check>
        <b-check style="grid-column:5">RCC </b-check>
        <b-check style="grid-column:7">NCC</b-check>
        <b-check style="grid-column:9 / span 7">Cuspid Junction:</b-check>
        <b-input style="min-width:160px;max-width:160px;max-height:28px;grid-column:16 /-3"></b-input>
        <b-check style="grid-column:2/ span 5">Epicardial VT/VPC </b-check>
      </section>
      <section class="dtc-car24-grid mt-2">
        <div class="dtc-car24-grid">
          <div></div>
          <b-check style="min-width:190px">Fascicular VT: </b-check>
          <b-check style="grid-column:4">Anterior</b-check>
          <b-check style="grid-column:8">Posterior</b-check>
          <b-check style="grid-column:10/-1">Upper septal-type</b-check>
        </div>
      </section>
      <section class="dtc-car24-grid mt-2">
        <div class="dtc-car24-grid">
          <div></div>
          <b-check style="min-width:190px">Papillary muscle VT: </b-check>
          <b-check style="grid-column:4">anteriolateral</b-check>
          <b-check style="grid-column:10">posteriomedial</b-check>
        </div>
      </section>
      <section class="dtc-car24-grid mt-2">
        <div class="dtc-car24-grid">
          <div></div>
          <b-check style="grid-column:2/-1">BBRVT</b-check>
        </div>
      </section>
      <section class="dtc-car24-grid mt-2 mb-4">
        <div class="dtc-car24-grid">
          <div></div>
          <b-check style="grid-column:2/9">CPVT(evidence):</b-check>
          <b-input style="grid-column:18/-2;min-width:300px;max-width:300px;max-height:28px;"></b-input>
        </div>
      </section>
    </div>

    <div>
      <header>Ediology</header>
      <b-form-checkbox-group class="pl-2 mt-1" v-model="selected" :options="edis"></b-form-checkbox-group>
      <div class="pl-2 others">
        <b-form-checkbox v-model="status" style="display:inline-block;margin-top:5px;">Others</b-form-checkbox>
        <b-input></b-input>
      </div>
    </div>

    <div class="dtc-input">
      <header class="last">Procedure Note</header>
      <textarea :spellcheck="false" v-model="dtcInput" style="padding:3px;"></textarea>
    </div>
  </section>
</template>

<script>
const dtcInput = `Jugular vein and right femoral vein were cannulated with sheathes after local anathesic with 2% Lidocaine. A CS electrical cathter was inserted into the coronary sinus through the jugular vein. LAT mapping(early __ s) and PACE mapping (__%) showed origin from __ wall. Ablation was done at the same site. After 20 minutes observation, recurrence was not happened. The patient tolerated the whole procedure well.`;
const answers = ["Yes", "No"];
const origins = ["anterior", "intermediate", "posterior", "high", "middle", "low"];
const basals = ["Septal-parahisian", "AMC", "Superior MA", "Superolateral MA", "Lateral MA", "Posterior", "Posteroseptal"];
const right = ["TVA", "Basal", "Apical", "Superior", "Inferior"];

const vtType = ["Septal origin", "Free wall origin"];
const clocks = ["counterclockwise", "clockwise"];
const edis = ["ARVD", "DCM VT", "CAD/Ischmic VT", "Sarcoidosis", "Congenital heart disease", "Non-ischemic cardiomyopathy", "Brugada syndrome"];

export default {
  data() {
    return {
      basals,
      right,
      mod1: "",
      origins,
      vt: "",
      vtType,
      edis,
      clocks,
      answers,
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
  --font-family-sans-serif: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol", "Noto Color Emoji";
  --font-family-monospace: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
</style>

<style lang="scss" scoped>
.dtc-input {
  display: flex;
  flex-direction: column;
  > textarea {
    min-height: calc(1100px - 39px);
  }
}
.body {
  display: grid;
  grid-template-columns: 799px 300px 1fr;
  grid-column-gap: 0.4rem;
  > div {
    min-height: 400px;
    border: 1px solid white;
    border-radius: 5px;
    padding: 3px;
    header {
      padding-top: 2px;
      height: 30px;
      font-size: 1rem;
      line-height: 24px;
      padding-left: 12px;
      background: var(--danger);
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
input[type="radio"],
input[type="checkbox"] {
  transform: scale(1.3);
}

.init-grid {
  display: grid;
  padding: 5px;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 6px;
  grid-row-gap: 12px;
  .input-group-text {
    min-width: 260px;
    max-width: 260px;
  }
}
.sec1 {
  .input-group-prepend .input-group-text {
    min-width: 360px;
    max-width: 360px;
  }
}
.sec3-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 2px;
  grid-row-gap: 4px;
  text-align: center;
}
.edis {
  background: rgba(255, 255, 255, 0.7);
  height: 38px;
  line-height: 38px;
  padding-left: 0.8rem;
  color: #495057;
  font-weight: normal;
}
.others {
  display: grid;
  grid-template-columns: 90px 180px;
}
.vt-type {
  display: grid;
  grid-template-columns: 90px 1fe;
}
.dtc-car24-grid {
  display: grid;
  grid-template-columns: repeat(24, 1fr);
  grid-gap: 12px;
}
</style>
