<template>
  <div class="w-100">
    <div class="align-items-center btns-operator mb-2 noPrint">
      <b-form-group>
        <b-form-radio-group
          id="btn-radios-1"
          v-model="selected"
          :options="options"
          buttons
          name="radios-btn-default"
        ></b-form-radio-group>
      </b-form-group>

      <div class="mx-2 text-white d-flex align-items-center">

        <b-form-checkbox
          id="strokeChecbox"
          v-model="useStroke"
          name="strokeChecbox"
          switch
        >
          框線
        </b-form-checkbox>

        <b-form-input
          v-show="useStroke"
          class="ml-2"
          style="width: 41px;"
          v-model="strokeColor"
          type="color"
        />

        <b-form-input
          v-show="useStroke"
          class="ml-1"
          style="width: 55px;"
          v-model="strokeLength"
          type="number"
        />

        <b-form-checkbox
          id="fillChecbox"
          v-model="useFill"
          name="fillChecbox"
          class="ml-3"
          switch
        >
          填滿
        </b-form-checkbox>
        <b-form-input
          class="ml-2"
          v-show="useFill"
          style="width: 41px;"
          v-model="color"
          type="color"
        />

      </div>

      <b-button
        class="ml-2"
        @click.stop="canvas.clear();saveCanvas(); assistShape=null; points=[]; crosses=[];"
      >CLEAR ALL</b-button>

      <!-- <b-button
        class="ml-2"
        @click.stop="saveCanvas"
      >Save</b-button> -->
    </div>
    <div
      class="w-100 position-relative img-operator"
      :class="{'editing': (selected && selected!='arrow')}"
    >
      <img
        ref="operatorImage"
        :src="imgSrc"
        class="operator-image"
      />
      <canvas
        ref="operatorCanvas"
        id="operator-canvas"
      />
    </div>

  </div>
</template>

<script>
import { fabric } from "@/plugins/fabric";
export default {
  name: 'image-operator',
  props: {
    imgSrc: {
      type: String,
      required: true
    },
    canvasValue: {
      type: String
    }
  },
  data () {
    return {
      canvas: null,
      assistShape: null,
      crosses: [],
      crossInfo: { length: 10, thick: 2 },
      mode: 'drag',
      imageNaturalWidth: 0,
      isImageLoaded: false,
      isEditing: false,
      selected: null,
      color: "#000000",
      strokeLength: 1,
      strokeColor: "#000000",
      points: [],
      isPressShift: false,
      options: [
        { text: '選擇工具', value: 'arrow' },
        { text: '圓形', value: 'Ellipse' },
        { text: '長方形', value: 'Rect' },
        { text: '文字工具', value: 'Textbox' },
        { text: '線條工具', value: 'Line' },
        { text: '三角形', value: 'Polygon' },
        { text: '繪圖', value: 'Drawing' },
      ],
      useStroke: false,
      useFill: true
    }
  },
  computed: {
    rate () {
      return !this.isImageLoaded
        ? 1
        : this.$refs.operatorImage.width / this.imageNaturalWidth
    },
  },
  mounted () {
    this.canvas = new fabric.Canvas(this.$refs.operatorCanvas);
    this.$refs.operatorImage.onload = ({ target }) => {
      this.imageNaturalWidth = target.naturalWidth;
      this.isImageLoaded = true;

      this.canvas.setWidth(target.width);
      this.canvas.setHeight(target.height);



      this.canvas.on('mouse:down', (e) => {

        this.canvas.discardActiveObject();
        if (this.mode === 'drag') {
          if (this.selected === 'Drawing') return;
          if (this.selected !== 'arrow') {

            const { pointer } = e;
            this.points.push({ ...pointer });
          } else {
            this.points = [];
          }
        } else if (this.mode === 'point') {
          // alert("POINT");
        }

      })

      this.canvas.on('mouse:up', (e) => {
        const { pointer } = e;
        if (this.mode === 'drag') {
          if (this.selected === 'Drawing') {
            this.saveCanvas();
            return;
          }

          if (this.selected !== 'arrow' && this.points.length > 0) {

            this.points.push({ ...pointer });
            this.addShape();
          }
        } else if (this.mode === 'point') {
          this.points.push({ ...pointer });
          if (this.points.length > 1) {
            this.addShape();
            this.canvas.remove(this.assistShape);
            this.assistShape = null;
            this.crosses.forEach(cross => {
              this.canvas.remove(cross);
            });
            this.crosses = [];


          } else if (this.points.length === 1) {
            const { x, y } = this.points[0];
            this.assistShape = new fabric.Line([x, y, x + 5, y + 5], {
              fill: 'gray',
              stroke: 'gray',
              strokeWidth: 2,
              selectable: false,
              evented: false,
              strokeDashArray: [15, 15],
            });
            [this.generateCross(x, y), this.generateCross(x, y)].forEach(cross => {
              this.crosses.push(cross);
              this.canvas.add(cross);
            });
            this.canvas.add(this.assistShape);

          }
        }


      })


      this.canvas.on('mouse:move', (e) => {
        if (this.mode === 'point' && this.points.length > 0) {
          const { x, y } = e.pointer;
          this.assistShape.set({ 'x2': x, 'y2': y });
          this.crosses[1].set({ 'left': x - this.crossInfo.length * .5, 'top': y - this.crossInfo.length * .5 });
          this.canvas.renderAll();
        }

      });

      if (this.canvasValue) {
        this.canvas.loadFromJSON(this.canvasValue);
      }
    }
    window.addEventListener("keyup", this.keyupEvent);
    window.addEventListener("keydown", this.keydownEvent);
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.keydownEvent);
    window.removeEventListener("keyup", this.keyupEvent);
  },
  methods: {
    generateCross (x, y, color = 'gray') {
      const lineLength = this.crossInfo.length;
      const halfLength = lineLength * .5;
      const lineThick = this.crossInfo.thick;
      return new fabric.Polygon([
        { x: 0, y: halfLength },
        { x: halfLength, y: halfLength },
        { x: halfLength, y: 0 },
        { x: halfLength + lineThick, y: 0 },
        { x: halfLength + lineThick, y: halfLength },
        { x: lineLength + lineThick, y: halfLength },
        { x: lineLength + lineThick, y: halfLength + lineThick },
        { x: halfLength + lineThick, y: halfLength + lineThick },
        { x: halfLength + lineThick, y: lineLength + lineThick },
        { x: halfLength, y: lineLength + lineThick },
        { x: halfLength, y: halfLength + lineThick },
        { x: 0, y: halfLength + lineThick },
      ], {
        fill: color,
        left: x,
        top: y - lineLength,
        angle: 45
      });
    },
    getActiveObjs () {
      const activeObj = this.canvas.getActiveObject();
      return (activeObj['_objects'])
        ? activeObj['_objects']
        : [activeObj];
    },
    saveCanvas () {
      // this.selected = null;
      this.$emit('saveOperator', JSON.stringify(this.canvas));
    },
    addShape () {
      if (!["Ellipse", "Rect", "Textbox", "Line", "Polygon"].some(v => this.selected === v)) return;
      let unit = Math.abs(this.points[0].x - this.points[1].x) > 20 ? Math.abs(this.points[0].x - this.points[1].x) : 20;
      let unitHgt = Math.abs(this.points[0].y - this.points[1].y) > 20 ? Math.abs(this.points[0].y - this.points[1].y) : 20;
      let param = {
        left: this.points[0].x,
        top: this.points[0].y,
        selectable: false,
      };
      if (this.useStroke) {
        param["stroke"] = this.strokeColor;
        param["strokeWidth"] = this.strokeLength;
      }
      param["fill"] = this.useFill ? this.color : 'transparent';
      if (this.selected === "Ellipse") {
        param = Object.assign(param, { rx: unit / 2, ry: this.isPressShift ? unit / 2 : unitHgt / 2 });
      } else if (this.selected === "Rect") {
        param = Object.assign(param, { width: unit, height: this.isPressShift ? unit : unitHgt });
      } else if (this.selected === "Textbox") {
        param = Object.assign(param, { fontSize: 24, fontFamily: "Microsoft JhengHei", fill: this.color, width: unit })
        delete param.stroke;
      } else if (this.selected === "Line") {
        param = Object.assign(param, { strokeDashArray: [15, 15], });
      }

      if (this.points[0].x > this.points[1].x) {
        param.left = this.points[0].x - (this.points[0].x - this.points[1].x);
      } else {
        param.left = this.points[0].x;
      }

      if (this.points[0].y > this.points[1].y) {
        param.top = this.points[0].y - (this.points[0].y - this.points[1].y);
      } else {
        param.top = this.points[0].y;
      }
      this.canvas.isDrawingMode = false;
      const shape = this.selected === 'Textbox'
        ? new fabric[this.selected]('請輸入欲加入的文字...', param)
        : this.selected === 'Line'
          ? new fabric[this.selected](this.points.map(({ x, y }) => [x, y]).flat(), param)
          : this.selected === 'Polygon'
            ? new fabric[this.selected]([{ x: unit / 2, y: 0 }, { x: unit, y: unitHgt }, { x: 0, y: unitHgt }], param)
            : new fabric[this.selected](param);

      this.canvas.add(shape);
      this.canvas.setActiveObject(shape);

      if (this.selected === "Line") {
        this.points.forEach(({ x, y }) => {
          this.canvas.add(this.generateCross(x, y, this.strokeColor));
        });
      }

      if (this.selected === "Textbox") {
        shape.selectAll();
        shape.enterEditing();
        this.selected = 'arrow';
      } else {
        this.canvas.discardActiveObject();
      }
      this.points = [];
      this.saveCanvas();
    },
    keyupEvent () {
      this.isPressShift = false;
    },
    keydownEvent ({ key }) {
      if (key === "Shift") {
        this.isPressShift = true;
      }
      if (key === "Delete") {
        this.getActiveObjs().forEach((item) => {
          this.canvas.remove(item);
        });
      } else if (key === "Escape" && this.points.length > 0) {
        this.points = [];
      }
    }
  },
  watch: {
    selected (val) {
      this.mode = 'drag';
      if (val === 'arrow') {
        this.canvas["_objects"].forEach((obj) => {
          obj.set({ selectable: true })
        });
        this.canvas.isDrawingMode = false;
      } else if (val === 'Drawing') {
        this.canvas.isDrawingMode = true;
        this.useStroke = true;
        this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
        this.canvas.freeDrawingBrush.color = this.strokeColor;
        this.canvas.freeDrawingBrush.width = this.strokeLength;

      } else {

        if (val === 'Line') {
          this.useStroke = true;
          this.mode = 'point';
        }

        this.canvas.discardActiveObject();
        this.canvas["_objects"].forEach((obj) => {
          obj.set({ selectable: false })
        });
        this.canvas.isDrawingMode = false;
      }
    },
    useStroke (val) {
      if (this.selected === "Drawing" || !val) return;
      if (this.canvas.getActiveObject()) {
        this.canvas.getActiveObject().set("stroke", val ? this.strokeColor : 'transparent');
        this.canvas.getActiveObject().set("strokeWidth", val ? this.strokeLength : 0);
        this.canvas.requestRenderAll();
        this.saveCanvas();
      }
    },
    useFill (val) {
      if (this.selected === "Drawing" || !val) return;
      if (this.canvas.getActiveObject()) {
        this.canvas.getActiveObject().set("fill", val ? this.color : 'transparent');
        this.canvas.requestRenderAll();
        this.saveCanvas();
      }
    },
    color (val) {
      if (this.selected === "Drawing" || !val) return;
      if (this.canvas.getActiveObject()) {
        this.canvas.getActiveObject().set("fill", val);
        this.canvas.requestRenderAll();
        this.saveCanvas();
      }
    },
    strokeColor (val) {
      if (!val) return;
      if (this.selected === "Drawing") {
        this.canvas.freeDrawingBrush.color = val;
      } else {
        if (this.canvas.getActiveObject()) {
          this.canvas.getActiveObject().set("stroke", val);
          this.canvas.requestRenderAll();
          this.saveCanvas();
        }
      }
    },
    strokeLength (val) {
      if (!val) return;
      if (this.selected === "Drawing") {
        this.canvas.freeDrawingBrush.width = val;
        this.canvas.freeDrawingBrush.offsetX = 0;
      } else {
        if (this.canvas.getActiveObject()) {
          this.canvas.getActiveObject().set("strokeWidth", val);
          this.canvas.requestRenderAll();
          this.saveCanvas();
        }

      }
    }
  }
}
</script>

<style lang="scss">
.operator-image {
  width: 100%;
  // max-width: 600px;
}
.img-operator {
  .canvas-container {
    position: absolute !important;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100% !important;
    height: 100% !important;
  }
  &.editing {
    .canvas-container {
      canvas {
        cursor: crosshair !important;
      }
    }
  }
}

.btns-operator {
  display: flex;
  /deep/ fieldset {
    margin: 0;
  }
}
</style>
