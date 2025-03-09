<template>
  <div
    class="eventBoxInner justify-content-start h-100 d-grid grid-row-48"
    :style="dragStyle"
  >
    <!-- @dragover="dragOverEvent"  % 20 + 1 -->
    <div
      v-for="(item,idx) in items"
      :key="item.EmployeeId + idx + item.WorkTime + item.WorkEndTime"
      class="text-white rounded d-flex doctorFrame position-relative"
      :class="`dtColor-${(getScheduleDrs.findIndex(({text})=>text === item.EmployeeName) + 1) % 20 + 1}`"
      :style="converRangeToGridPostion(item)"
      :draggable="!item.WorkDate"
      @click.stop="editEvent(item)"
      @dragstart="(event) => onDragStart(event, item)"
      mousetip
      :mousetip-msg="
        `
        ID: ${item.Id}<br />
        醫師: ${item.EmployeeName}<br />
        權重: ${item.Rate}<br />
        開始: ${item.WorkTime.substr(11, 5)}<br />
        結束: ${item.WorkEndTime.substr(11, 5)}<br />
        來源: ${converCode2Text(item.PatientSourceTypeCode) || 'none'}
        ${item.WorkDate ? '<br />特時: ' + item.MonthDate.substr(0, 8) + $number2Digits(item.WorkDate) : ''}
      `
      "
    >
      <div
        class="p-1 d-table doctorInfo w-100"
        style="overflow: hidden;"
      >
        <div class="d-flex flex-column">
          <span
            class="doctorName"
            style="white-space: nowrap;"
            v-text="item.EmployeeName"
          />
          <span
            style="font-size: 10px;"
            class="text-center"
            v-if="item.WorkDate"
            v-text="$number2Digits(item.WorkDate)"
          />
        </div>
      </div>

      <div
        style="font-size: 10px;"
        class="position-absolute bg-warning text-black rounded-circle p-1 cursor-pointer remove-btn"
        @click="removeEvent(item)"
      >
        <font-awesome-icon icon="times" />
      </div>
      <!-- <div
        style="margin-left: 1px; font-size: 10px;"
        class="bg-warning text-black rounded-right px-1 pt-2 d-flex justify-content-center align-items-start cursor-pointer"
        @click="removeEvent(item)"
      >
        <font-awesome-icon icon="times" />
      </div> -->
    </div>
    <!-- <div
      class="dragTmp bg-primary"
      :style="dragStyle"
      v-text="'test'"
    /> -->
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {
  data () {
    return {
      dragOverTime: 0,
      workingStart: 0,
      workingEnd: 0
    };
  },
  computed: {
    ...mapGetters(["getScheduleDrs"]),
    ...mapState(['patientSourceList']),
    dragStyle () {
      return `grid-row: ${this.workingStart} / span ${this.workingEnd}`;
    },
    patientSourceObject () {
      return this.patientSourceList.reduce((acc, cur) => ({
        ...acc, [cur.value]: cur.text
      }), {});
    }
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    eventKey: {
      type: Number,
      default: 1,
    },
    weekName: {
      type: String,
      default: "",
    },
    timeScaleHgt: {
      type: Number,
      default: 30
    },

  },
  methods: {
    converCode2Text (codeStr) {
      const codeArr = codeStr.split(',');
      return codeArr.map(code => this.patientSourceObject[code]).join(',');
    },
    setTopMargin (topNum) {
      [].forEach.call(document.querySelectorAll(".doctorFrame"), (el) => {
        const _top = el.offsetTop - 185;
        if (topNum > _top) {
          if (!el.hasAttribute("infoHeight")) {
            const _child = [].find.call(el.children, (ch) => ch.className.includes("doctorInfo"));
            el.setAttribute("infoHeight", _child.clientHeight);
          }
          const infoHgt = el.getAttribute("infoHeight");

          let minusHgt = topNum - _top;
          if (minusHgt > el.clientHeight - infoHgt) minusHgt = el.clientHeight - infoHgt;
          el.style.paddingTop = `${minusHgt}px`;
        } else {
          el.style.paddingTop = 0;
        }
      });
    },
    removeEvent (item) {
      // this.items = this.items.filter(unit => unit !== item);
      this.$emit("removeEvt", { week: this.eventKey, removeItem: item });
    },
    onDragStart (evt, employee) {
      evt.dataTransfer.dropEffect = "move";
      evt.dataTransfer.effectAllowed = "move";
      evt.target.style.opacity = 1;
      this.$store.commit("wsSetFrom", this.eventKey);
      // const newEmployee = Object.assign(
      //   this.$store.state.workingSchedule.employee,
      //   employee
      // );
      this.$store.commit("wsSetEmployee", employee);
    },
    timeConver2Num(dateTime) {
      const [whole, year, month, date, hour, min, sec] = dateTime.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/);
      return parseInt(hour) + parseFloat(min / 60);
    },
    converRangeToGridPostion ({ WorkTime, WorkEndTime }) {
      const [start, end] = [WorkTime, WorkEndTime].map((time) => this.timeConver2Num(time));
      return `grid-row: ${start * 2 + 1} / span ${(end - start) * 2}; min-width: 24px;`;
    },
    editEvent (employee) {
      this.$store.commit("wsSetCurrent", { week: this.eventKey });
      this.$store.commit("wsSetEmployee", employee);
      this.$emit("callEditPanel");
    },
    dragOverEvent (event) {
      if (this.dragOverTime + 500 > Date.now()) return;
      this.dragOverTime = Date.now();

      const getExistPosition = function (target) {
        return (target.getAttribute('mousetip-msg').replace(/\s/g, '').split('<br/>')).filter(str => str.includes('開始') || str.includes('結束')).map(str => parseInt(str.split(':')[1]));
      }
      const _classList = Array.from(event.target.classList);
      if (_classList.some(k => k === 'eventBoxInner' || k === 'eventBox')) {
        this.workingStart = Math.floor(event.offsetY / this.timeScaleHgt);
        this.workingEnd = this.workingStart + 1;
      } else if (_classList.some(k => k === 'doctorName' || k === 'doctorInfo')) {
        const _parent = event.target.closest(".doctorFrame");
        [this.workingStart, this.workingEnd] = getExistPosition(_parent);
      } else {
        [this.workingStart, this.workingEnd] = getExistPosition(event.target);
      }
    }
  }
};
</script>

<style>
.doctorFrame {
  margin-top: 1px;
  margin-left: 1px;
  transition: ease 0.25s padding-top;
  cursor: move;
}

.doctorFrame.specific-border {
  cursor: default;
}
.doctorName {
  writing-mode: vertical-lr;
  line-height: 1;
}
.remove-btn {
  right: 0;
  top: 0;
  transform: translate(50%);
  z-index: 100;
  display: none;
}
.doctorFrame:hover .remove-btn {
  display: flex;
}
.dragTmp {
  writing-mode: vertical-lr;
}
</style>

<style lang="scss">
$colors: #9c014f, #c20564, #c70465, #ce0268, #da026e, #51ad00, #61ce01, #6de405,
  #79f30e, #7ef813, #004a99, #0565cc, #0062ca, #0061c9, #036bda, #016bdd,
  #097dfa, #1f8bff, #1e85f3, #1d8afe;

@for $i from 1 through length($colors) {
  $color: nth($colors, $i);
  .color-#{$i} {
    background-color: $color;
  }
}

.specific-border {
  box-shadow: 0 0 0 1px var(--themeTextColor) inset;
}
</style>
