<template>
  <div id="anti-covid-20">
    <section class="body dtc-grid mb-2">
      <figure>
        <section class="dtc-hands-toolbar">
          <div style="grid-column:1/span 10;">
            <b-input style="max-height:29px;" v-model.trim="leftText" size="sm" placeholder="請在此輸入" @keydown.enter="addLeftText"></b-input>
          </div>
          <div v-b-tooltip title="加入左方文字" @click="addLeftText" :disabled="!leftText" :class="!leftText ? 'bg-secondary' : ''">𝐓</div>
          <div v-b-tooltip title="加入圓圈" @click="addLeftCircleShape">⭕️</div>
          <div v-b-tooltip title="加入方塊" @click="addLeftRectShape">🔲</div>
          <div v-b-tooltip title="加入直線" @click="addLeftLineShape" class="text-danger" style="font-size:24px;">/</div>
          <div v-b-tooltip title="進入手繪模式" @click="freeDrawLeft" v-if="!freeLeft">✍🏻</div>
          <div v-b-tooltip title="暫停手繪模式" @click="stopFreeDrawLeft" class="stop-free-draw" v-if="freeLeft">✍🏻</div>
          <div v-b-tooltip title="刪除全部"><font-awesome-icon icon="eraser" class="cursor-pointer bg-gray-dark" @click="removeAllLeft" /></div>
          <div style="border-right:none;" v-b-tooltip title="立即儲存">
            <font-awesome-icon icon="save" class="cursor-pointer bg-secondary" @click="saveLeftDraw" />
          </div>
        </section>
        <section class="dtc-hands-toolbar">
          <div style="grid-column:1/span 10">
            <b-input style="max-height:29px;" v-model.trim="rightText" size="sm" placeholder="請在此輸入" @keydown.enter="addRightText"></b-input>
          </div>
          <div v-b-tooltip title="加入左方文字" @click="addRightText" :disabled="!rightText" :class="!rightText ? 'bg-secondary' : ''">𝐓</div>
          <div v-b-tooltip title="加入圓圈" @click="addRightCircleShape">⭕️</div>
          <div v-b-tooltip title="加入方塊" @click="addRightRectShape">🔲</div>
          <div v-b-tooltip title="加入直線" @click="addRightLineShape" class="text-danger" style="font-size:24px;">/</div>
          <div v-b-tooltip title="進入手繪模式" @click="freeDrawRight" v-if="!freeRight">✍🏻</div>
          <div v-b-tooltip title="暫停手繪模式" @click="stopFreeDrawRight" class="stop-free-draw" v-if="freeRight">✍🏻</div>
          <div v-b-tooltip title="刪除全部"><font-awesome-icon icon="eraser" class="cursor-pointer bg-gray-dark" @click="removeAllRight" /></div>
          <div style="border-right:none;" v-b-tooltip title="立即儲存">
            <font-awesome-icon icon="save" class="cursor-pointer bg-secondary" @click="saveRightDraw" />
          </div>
        </section>
        <div>
          <img :src="leftHand" id="img1" />
          <canvas id="c1" width="700" height="486"></canvas>
        </div>
        <div>
          <img :src="rightHand" id="img2" />
          <canvas id="c2" width="700" height="486"></canvas>
        </div>
      </figure>
      <b-input-group prepend="洗腎/轉介醫院">
        <!-- <img :src="deleteIcon" /> -->
        <b-input />
      </b-input-group>

      <b-input-group prepend="AV shunt">
        <b-input />
      </b-input-group>
      <b-input-group prepend="AV shunt location">
        <b-input />
      </b-input-group>
    </section>
    <header class="dtc-neck-header">
      <div>Clinical presentation</div>
    </header>
    <b-textarea :spellcheck="false" class="big-input" placeholder="please enter here...."></b-textarea>
    <header class="dtc-neck-header">
      <div>Procedure</div>
    </header>
    <b-textarea :spellcheck="false" class="big-input" placeholder="please enter here...."></b-textarea>
    <b-input-group prepend="Contrast medium" append="cc" style="max-width:450px;margin:5px 0">
      <b-form-select v-model="constrast" :options="constrasts" variant="dark"></b-form-select>
      <b-input></b-input>
    </b-input-group>
    <Intervention :showList="true"></Intervention>
  </div>
</template>

<script>
import Intervention from "@/components/Cardiac/Intervention.vue";
import { fabric } from "@/plugins/fabric";
const constrasts = ["Ominpaque", "Ultravist", "Visipaque"];
const deleteIcon =
  "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";
export default {
  data() {
    return {
      leftHand: require("./leftHand.png"),
      rightHand: require("./rightHand.png"),
      canvas1: "",
      canvas2: "",
      timeoutTriggered: false,
      deleteIcon,
      delImg: "",
      freeLeft: false,
      freeRight: false,
      ObjApp: "",
      leftText: "",
      rightText: "",
      constrasts
    };
  },
  methods: {
    addLeftText() {
      const text = new fabric.Textbox(this.leftText, { left: 300, top: 5, fontSize: 14, fontFamily: "Microsoft JhengHei" });
      this.canvas1.add(text);
      this.canvas1.add(text);
      this.canvas1.setActiveObject(text);
    },
    addRightText() {
      const text = new fabric.Textbox(this.rightText, { left: 300, top: 5, fontSize: 14, fontFamily: "Microsoft JhengHei" });
      this.canvas2.add(text);
      this.canvas2.add(text);
      this.canvas2.setActiveObject(text);
    },
    deleteObject(eventData, target) {
      var canvas = target.canvas;
      canvas.remove(target);
      canvas.requestRenderAll();
    },
    removeAllLeft() {
      this.canvas1.clear();
    },
    removeAllRight() {
      this.canvas2.clear();
    },
    saveLeftDraw() {
      const str = JSON.stringify(this.canvas1);
      localStorage.dtcLeftHand = str;
      this.ObjApp.TimingMessage("資料已完成存檔作業");
    },
    saveRightDraw() {
      const str = JSON.stringify(this.canvas2);
      localStorage.dtcRightHand = str;
      this.ObjApp.TimingMessage("資料已完成存檔作業");
    },
    freeDrawLeft() {
      this.canvas1.isDrawingMode = true;
      this.freeLeft = true;
    },
    freeDrawRight() {
      this.canvas2.isDrawingMode = true;
      this.freeRight = true;
    },
    stopFreeDrawLeft() {
      this.canvas1.isDrawingMode = false;
      this.freeLeft = false;
    },
    stopFreeDrawRight() {
      this.canvas2.isDrawingMode = false;
      this.freeRight = false;
    },
    addRightLineShape() {
      this.canvas2.isDrawingMode = false;
      this.freeRight = false;
      let line = new fabric.Line([250, 125, 250, 355], {
        top: 100,
        left: 400,
        fill: "red",
        stroke: "red"
        //strokeWidth: 3
      });
      line.rotate(30);
      this.canvas2.add(line);
      this.canvas2.setActiveObject(line);
    },
    addLeftLineShape() {
      this.canvas1.isDrawingMode = false;
      this.freeLeft = false;
      let line = new fabric.Line([250, 125, 250, 355], {
        top: 100,
        left: 400,
        fill: "red",
        stroke: "red"
      });
      line.rotate(30);
      this.canvas1.add(line);
      this.canvas1.setActiveObject(line);
    },
    addLeftCircleShape() {
      this.canvas1.isDrawingMode = false;
      this.freeLeft = false;
      let circle = new fabric.Circle({
        radius: 40,
        top: 3,
        fill: "transparent",
        stroke: "red",
        scaleY: 0.5
      });
      this.canvas1.add(circle);
      this.canvas1.setActiveObject(circle);
    },
    addRightCircleShape() {
      this.canvas2.isDrawingMode = false;
      this.freeRight = false;
      let circle = new fabric.Circle({
        radius: 40,
        top: 3,
        fill: "transparent",
        stroke: "red",
        scaleY: 0.5
      });
      this.canvas2.add(circle);
      this.canvas2.setActiveObject(circle);
    },
    addLeftRectShape() {
      this.canvas1.isDrawingMode = false;
      this.freeLeft = false;
      const rect = new fabric.Rect({
        left: 100,
        top: 3,
        stroke: "red",
        width: 120,
        height: 120,
        fill: "transparent",
        objectCaching: false,
        transparentCorners: false,
        cornerStyle: "circle"
      });
      this.canvas1.add(rect);
      this.canvas1.setActiveObject(rect);
    },
    addRightRectShape() {
      this.canvas2.isDrawingMode = false;
      this.freeRight = false;
      const rect = new fabric.Rect({
        left: 100,
        top: 3,
        stroke: "red",
        width: 120,
        height: 120,
        fill: "transparent",
        objectCaching: false,
        transparentCorners: false,
        cornerStyle: "circle"
      });
      this.canvas2.add(rect);
      this.canvas2.setActiveObject(rect);
    },
    renderIcon(ctx, left, top, styleOverride, fabricObject) {
      var size = 24;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
      ctx.drawImage(this.delImg, -size / 2, -size / 2, size, size);
      ctx.restore();
    }
  },
  components: { Intervention },
  mounted() {
    let obj = this.$GetApp(this);
    this.ObjApp = obj[0];
    this.delImg = document.createElement("img");
    this.delImg.src = this.deleteIcon;
    this.canvas1 = new fabric.Canvas("c1", { isDrawingMode: this.freeLeft });
    this.canvas2 = new fabric.Canvas("c2");
    fabric.Object.prototype.controls.deleteControl = new fabric.Control({
      position: { x: 0.5, y: -0.5 },
      offsetY: 10,
      cursorStyle: "pointer",
      mouseUpHandler: this.deleteObject,
      render: this.renderIcon,
      cornerSize: 24
    });

    if (localStorage.dtcLeftHand) {
      this.canvas1.loadFromJSON(localStorage.dtcLeftHand);
    }
    if (localStorage.dtcRightHand) {
      this.canvas2.loadFromJSON(localStorage.dtcRightHand);
    }
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
  --font-family-sans-serif: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol", "Noto Color Emoji";
  --font-family-monospace: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
</style>

<style lang="scss" scoped>
.dtc-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 13px;
  .input-group-prepend .input-group-text {
    min-width: 169px;
    max-width: 169px;
  }
}

.dtc-hands-toolbar {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(40px, 40px));
  max-width: 685px;
  border: 1px solid white;
  border-radius: 5px;
  background: var(--primary);
  margin-left: -3px;
  > div {
    height: 30px;
    border-right: 1px solid white;
    display: grid;
    place-items: center;
    position: relative;
    z-index: 1;
  }
  .stop-free-draw::after {
    position: absolute;
    top: 0px;
    right: 0px;
    left: 0px;
    bottom: 0px;
    content: "X";
    color: rgba(red, 0.7);
    z-index: 2;
    font-size: 24px;
    display: grid;
    place-items: center;
  }
}

figure {
  display: grid;
  grid-template-columns: repeat(2, 700px);
  grid-template-rows: 32px 486px;
  grid-column-gap: 1rem;
  grid-row-gap: 2px;
  grid-column: 1/-1;
  > div {
    position: relative;
    display: grid;
    place-items: center;
  }
  img {
    object-fit: cover;
    min-height: 486px !important;
    height: 486px !important;
    max-height: 486px !important;
    min-width: 700px;
    border-radius: 5px;
  }
  // .controls {
  //   display: inline-block;
  // }
  .canvas-container {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
.dtc-neck-header {
  height: 30px !important;
  display: grid;
  margin: 3px 0px;
  padding-top: 1px;
  padding-left: 4px;
  background: var(--purple) !important;
  grid-template-columns: max-content 400px 400px;
  grid-gap: 30px;
  line-height: 30px;
  border-radius: 5px;
}
.big-input {
  width: 100%;
  height: 200px;
  margin-bottom: 3px;
}
</style>

<style>
#app .canvas-container {
  position: absolute !important;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
