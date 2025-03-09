<template>
  <div class="dtc-img-click" ref="dtcImgClick">
    <header>心臟電生理紀錄</header>
    <div ref="dtcImg" class="dtc-img" :style="{ backgroundImage: 'url(' + dataUrl + ')' }"></div>
  </div>
</template>

<script>
import Loading from "@/components/home/Loading";
export default {
  name: "DtcClickImgCmp",
  data() {
    return {
      dataUrl: "",
      inputPoints: "",
      ctxPoints: []
    };
  },
  components: { Loading },
  computed: {
    getReport() {
      if (this.inputPoints.length) {
        let ids = this.inputPoints.filter(s => s.selected).map(s => s.msg);
        const list = ids.join(" , ");
        const str = " ( " + list + " )";
        return `共${this.items.length}筆${str}`;
      } else {
        return "";
      }
    }
  },
  methods: {
    loadImgUrl() {
      let img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.src = this.url + "?" + new Date().getTime();
      img.onload = () => {
        let canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        this.dataUrl = canvas.toDataURL("image/jpeg");
        // construct clickable points
        this.constructPoints();
      };
    },

    updatePoint(msg, selected) {
      const { x: _x, y: _y, ctx, el } = this.ctxPoints.find(s => s.msg === msg);
      let x = _x;
      let y = _y;
      let w = 12;
      // Create circle
      let circle = new Path2D();
      ctx.fillStyle = selected ? "rgba(255,255,0,0.9)" : "rgba(0,0,255,0.9)";
      circle.arc(x, y, w, 0, 2 * Math.PI, false);
      ctx.fill(circle);

      // draw the msg into circle
      let ctx2 = el.getContext("2d");
      ctx2.font = "12pt Calibri";
      ctx2.fillStyle = selected ? "black" : "white";
      ctx2.textAlign = "center";
      ctx2.fillText(msg.substr(1), x, y + 5);
    },

    constructPoints() {
      if (!this.inputPoints) {
        return;
      }
      let eventList = [];
      //step 1: get img el
      const img = this.$refs.dtcImg;
      //step 2:  create new canvas element that will have same size of passed in img
      let el = document.createElement("canvas");
      el.width = this.width;
      el.height = this.height;

      //step 3: append into dom right below the img
      img.append(el);
      //step 4: create 2d context(s) with msg inside
      this.inputPoints.forEach(({ x: _x, y: _y, msg, selected }) => {
        let ctx = el.getContext("2d");
        this.ctxPoints.push({ x: _x, y: _y, msg, selected, ctx, el });
        let x = _x;
        let y = _y;
        let w = 12;
        // Create circle
        let circle = new Path2D();
        ctx.fillStyle = selected ? "rgba(255,255,0,0.9)" : "rgba(0,0,255,0.9)";
        circle.arc(x, y, w, 0, 2 * Math.PI, false);
        ctx.fill(circle);

        // draw the msg into circle
        let ctx2 = el.getContext("2d");
        ctx2.font = "12pt Calibri";
        ctx2.fillStyle = selected ? "black" : "white";
        ctx2.textAlign = "center";
        ctx2.fillText(msg.substr(1), x, y + 5);
        // push to event list for listening the click event
        eventList.push({ ctx, circle });
      }); // end of step 4
      //step 5 listen for click event for each 2d ctx
      el.onclick = event => {
        for (let i = 0; i < eventList.length; ++i) {
          const e = eventList[i];
          if (e.ctx.isPointInPath(e.circle, event.offsetX, event.offsetY)) {
            const msg = this.inputPoints[i].msg;
            this.$emit("dtc-img-click", msg);
            const obj = this.ctxPoints.find(s => s.msg === msg);
            obj.selected = !obj.selected;
            this.updatePoint(msg, obj.selected);
            break;
          }
        }
      };
      const elRect = el.getBoundingClientRect();
      const mainEl = this.$refs.dtcImgClick; // hold for toggle the cursor
      //step 6 show cursor when needed
      el.onmousemove = event => {
        let cursor = false;
        for (let i = 0; i < eventList.length; ++i) {
          const e = eventList[i];
          const myX = event.clientX - elRect.left;
          const myY = event.clientY - elRect.top;
          if (e.ctx.isPointInPath(e.circle, myX, myY)) {
            mainEl.style.cursor = "pointer";
            cursor = true;
            break;
          }
        }
        if (!cursor) {
          mainEl.style.cursor = "default";
        }
      };
    }
  },
  props: ["width", "height", "url", "points"],
  beforeMount() {
    const jstr = JSON.stringify(this.points);
    this.inputPoints = JSON.parse(jstr);
    this.$root.$on("dtc-remove-heart-point", msg => {
      const obj = this.inputPoints.find(s => s.msg == msg);
      if (!obj.selected) return;
      obj.selected = false;
      const ret = this.ctxPoints.find(s => s.msg === msg);
      ret.selected = obj.selected;
      this.updatePoint(msg, false);
    });
    this.$root.$on("dtc-add-heart-point", msg => {
      const obj = this.inputPoints.find(s => s.msg == msg);
      if (obj.selected) return;
      obj.selected = true;
      const ret = this.ctxPoints.find(s => s.msg === msg);
      ret.selected = obj.selected;
      this.updatePoint(msg, true);
    });
  },
  mounted() {
    // set width / height based on pass in props
    const el = this.$refs.dtcImgClick;
    el.style.setProperty("--width", this.width + "px");
    el.style.setProperty("--height", this.height + "px");
    this.loadImgUrl();
  },
  beforeDestroy() {},
  watch: {}
};
</script>

<style lang="scss" scoped>
header {
  height: 30px;
  background: var(--primary);
  padding-left: 5px;
  line-height: 30px;
  font-size: 1rem;
  color: white;
  border-radius: 5px;
}
.dtc-img-click {
  --width: 0px;
  --height: 0px;
  width: var(--width) !important;
  height: var(--height) !important;
  .dtc-img {
    width: var(--width) !important;
    height: var(--height) !important;
    background: transparent no-repeat top left / cover;
    position: relative;
    > canvas {
      position: absolute;
      min-width: var(--width) !important;
      min-height: var(--height) !important;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
}
</style>
