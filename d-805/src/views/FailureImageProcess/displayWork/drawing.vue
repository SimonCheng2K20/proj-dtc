<template>
  <div>
    <b-form-radio-group
      id="modeSwitch"
      v-model="mode"
      :options="[{text: '塗鴉', value: 'drawing'}, {text: '文字', value: 'text'}]"
      name="mode-switch"
    />
    <div
      class="d-flex flex-column align-items-center"
      id="canvasMainContainer"
    >

      <div :style="{transform: `scale(${aspectRatio})`, marginTop: (isFullScreen ? 178 :0) + 'px'}">
        <canvas
          ref="operatorCanvas"
          id="operatorCanvas"
        />
      </div>
    </div>

  </div>
</template>

<script>
import { fabric } from "@/plugins/fabric";
export default {
  data () {
    return {
      canvas: null,
      canvasWdt: 0,
      isImageLoaded: false,
      imageNaturalWidth: null,
      strokeLength: 5,
      mode: 'drawing'
    }
  },
  computed: {
    aspectRatio () {
      return this.isFullScreen
        ? (window.innerHeight - 120) / this.canvasWdt
        : 1;
    }
  },
  props: {
    imgUrl: {
      type: String,
      required: true
    },
    isFullScreen: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: "#ffffff"
    },
    length: {
      type: [String, Number],
      default: 5
    },
    fontSize: {
      type: [String, Number],
      default: 24
    }
  },
  methods: {
    resetDrawing () {
      this.canvas.clear();
      this.readImageFromUrl();
    },
    readImageFromUrl () {
      // const tmp = require("@/assets/imgs/xray.jpg");
      // this.imgUrl
      fabric.Image.fromURL(this.imgUrl, img => {
        // this.canvas.add(img.set({ left: 0, top: 0, angle: 0 }).scale(1));
        this.canvas.backgroundImage = img;
        this.canvasWdt = img.width;
        this.canvas.setWidth(img.width);
        this.canvas.setHeight(img.height);



        // this.useStroke = true;
        if (this.mode === 'drawing') {
          this.canvas.isDrawingMode = true;
          this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
          this.canvas.freeDrawingBrush.color = this.color;
          this.canvas.freeDrawingBrush.width = parseInt(this.length);
        } else {
          // const textbox = new fabric.Textbox('Lorum ipsum dolor sit amet', {
          //   left: 0,
          //   top: 0,
          //   width: 150,
          //   fontSize: 20,
          //   fill: this.color,
          //   editable: true
          // });
          // this.canvas.add(textbox).setActiveObject(textbox);
          // textbox.enterEditing();
          // textbox.selectAll();
          // textbox.hiddenTextarea.style.position = "fixed";
          // document.getElementById('canvasMainContainer').appendChild(textbox.hiddenTextarea);
          // textbox.hiddenTextarea.focus();

        }

      }, {
        crossOrigin: 'Anonymous'
      });
    },
    resetColor () {
      if (this.mode === 'drawing') {
        this.canvas.freeDrawingBrush.color = this.color;
      } else {
        const activeObj = this.canvas.getActiveObject();
        activeObj.set("fill", this.color);
        this.canvas.renderAll();
      }
    },
    resetLength () {
      this.canvas.freeDrawingBrush.width = parseInt(this.length);
      console.log(this.canvas.freeDrawingBrush);
    },
    resetFontSize () {
      const activeObj = this.canvas.getActiveObject();
      activeObj.set("fontSize", this.fontSize);
      this.canvas.renderAll();

    },
    getActiveObjs () {
      const activeObj = this.canvas.getActiveObject();
      return (activeObj['_objects'])
        ? activeObj['_objects']
        : [activeObj];
    },
    activeObjectEvent ({ key }) {
      if (key === "Delete") {
        this.getActiveObjs().forEach((item) => {
          this.canvas.remove(item);
        });
      }
    }

  },
  watch: {
    mode (val) {
      this.canvas.isDrawingMode = val === 'drawing';
      if (val === 'drawing') {
        this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
        this.canvas.freeDrawingBrush.color = this.color;
        this.canvas.freeDrawingBrush.width = parseInt(this.length);
      } else {

      }
    }
  },
  mounted () {
    this.canvas = new fabric.Canvas(this.$refs.operatorCanvas);
    this.readImageFromUrl();
    window.addEventListener('keydown', this.activeObjectEvent)


    this.canvas.on('mouse:dblclick', (e) => {
      if (this.mode === 'text' && !e.target) {
        const textbox = new fabric.Textbox('Please Insert Values', {
          left: e.pointer.x,
          top: e.pointer.y,
          width: 150,
          fontSize: 20,
          fill: this.color
        });
        this.canvas.add(textbox).setActiveObject(textbox);
        textbox.enterEditing();
        textbox.selectAll();
        textbox.hiddenTextarea.style.position = "fixed";
        document.getElementById('canvasMainContainer').appendChild(textbox.hiddenTextarea);
        textbox.hiddenTextarea.focus();
      } else if (this.mode === 'text' && e.target) {
        // console.log('----------------access-1--------------');
        this.$nextTick(() => {
          const activeObj = this.canvas.getActiveObject();
          if (!activeObj.hiddenTextarea.style) return;
          activeObj.hiddenTextarea.style.position = "fixed";
          document.getElementById('canvasMainContainer').appendChild(activeObj.hiddenTextarea);
        });
      }
    });

    this.canvas.on('mouse:down', (e) => {

      if (this.mode === 'text' && e.target) {
        // this.canvasMainContainer
        this.$nextTick(() => {
          const tmpTextarea = document.querySelector('body > textarea')
          if (!tmpTextarea || !tmpTextarea.style) {
            setTimeout(() => {
              const tmpTextarea2 = document.querySelector('body > textarea');
              if (!tmpTextarea2) return;
              tmpTextarea2.style.position = "fixed";
              document.getElementById('canvasMainContainer').appendChild(tmpTextarea);
            }, 1000);
            return;
          }

          tmpTextarea.style.position = "fixed";
          document.getElementById('canvasMainContainer').appendChild(tmpTextarea);
        });
      }
    });

    // this.canvas.on('mouse:down', (e) => {
    //   if (this.mode === 'text' && e.target) {
    //     // document.getElementById('canvasMainContainer').appendChild(textbox.hiddenTextarea);
    //     // textbox.hiddenTextarea.focus();
    //   }
    // });
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.activeObjectEvent)
  }
}
</script>

<style lang="scss" scoped>
/deep/.canvas-container {
  box-shadow: 0 0 1px 0 var(--themeTextColor);
}
</style>
