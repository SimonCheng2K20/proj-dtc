<template>
  <div>
    <card-frame
      title="影像顯示"
      v-if="showImage"
      class="position-relative"
    >
      <b-button
        class="px-2 position-absolute"
        style="line-height: 1; font-size: 21px; right: 0; top: 0;"
        size="sm"
        variant="transparent"
        @click="closeImageDisplay"
      >
        <font-awesome-icon
          class="text-white"
          icon="times-circle"
        />
      </b-button>

      <div v-if="loading">
        <b class="text-success"><i class="fas fa-spinner fa-spin"></i>&nbsp;圖片載入中, 請稍待 ...</b>
      </div>
      <div
        class="text-black text-center py-3"
        v-else-if="imgItems.length === 0"
      >
        <b>暫無圖片</b>
      </div>
      <template v-else>

        <imgList
          :items="imgItems"
          @remove="removeFailImage"
          @show="showSpecificImage"
          @draw="drawSpecificImage"
        />

        <b-pagination
          class="mb-1"
          v-model="pagination.current"
          :total-rows="items.length"
          :per-page="pagination.per"
          aria-controls="my-table"
        />
      </template>

    </card-frame>

    <b-modal
      v-model="drawImage.show"
      id="drawImage"
      centered
      size="lg"
      :title="'ID: ' + (drawImage.img ? drawImage.img.ID : '')"
      scrollable
      ok-only
      ok-title="save"
      @ok="saveImageBase64"
    >
      <drawing
        v-if="drawImage.img"
        ref="drawing"
        :imgUrl="drawImage.img['FILE_PATH']"
        :isFullScreen="displayImage.fullScreen"
        :color="penColor"
        :length="penLength"
        :fontSize="fontSize"
      />

      <div
        class="d-flex justify-content-end pt-2"
        :class="{'position-absolute': displayImage.fullScreen}"
        style="right: 10px; bottom: 10px;"
      >
        <b-btn
          variant="transparent"
          @click.stop="clearDrawing()"
        >
          <font-awesome-icon
            style="color: var(--themeTextColor);"
            icon="eraser"
          />
        </b-btn>

        <b-btn
          variant="transparent"
          @click.stop="fullScreenItem('drawImage')"
        >
          <font-awesome-icon
            style="color: var(--themeTextColor);"
            :icon="displayImage.fullScreen ? 'compress':'expand'"
          />
        </b-btn>

        <b-form-input
          class="mr-2"
          style="width: 38px;"
          id="typeColor"
          type="color"
          @change="changeDrawColor"
          v-model="penColor"
        />

        <b-form-input
          v-if="drawMode==='draw'"
          style="width: 65px;"
          id="typeLength"
          type="number"
          min="1"
          max="99"
          @change="changeDrawLength"
          v-model="penLength"
        />

        <b-form-input
          v-else
          style="width: 65px;"
          id="typeLength"
          type="number"
          min="18"
          max="100"
          @change="changeDrawFontSize"
          v-model="fontSize"
        />
      </div>

    </b-modal>

    <b-modal
      v-model="displayImage.show"
      id="displayImage"
      centered
      size="lg"
      :title="'ID: ' + (displayImage.img ? displayImage.img.ID : '')"
      :hideFooter="true"
      class="position-relative"
      scrollable
    >
      <b-img
        v-if="displayImage.img"
        class="mx-auto d-table"
        :class="{'h-100': displayImage.fullScreen}"
        :src="displayImage.img['FILE_PATH']"
      />
      <b-btn
        class="position-absolute"
        style="right: 0; bottom: 0;"
        variant="transparent"
        @click.stop="fullScreenItem('displayImage')"
      >
        <font-awesome-icon
          style="color: var(--themeTextColor);"
          :icon="displayImage.fullScreen ? 'compress':'expand'"
        />
      </b-btn>
    </b-modal>

  </div>
</template>

<script>
import drawing from "./displayWork/drawing.vue";
import imgList from "./displayWork/imageList.vue";
export default {
  data () {
    return {
      checkFullScreenTimer: null,
      showImage: false,
      isFullScreen: false,
      displayImage: {
        show: false,
        img: null,
        fullScreen: false
      },
      drawImage: {
        show: false,
        img: null,
        fullScreen: false
      },
      pagination: {
        per: 12,
        current: 1
      },
      isMounted: false,
      penColor: "#ffffff",
      penLength: 10,
      fontSize: 24
    }
  },
  methods: {
    exitFullscreen () {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    },
    closeImageDisplay () {
      this.showImage = false;
      this.$emit('update:show', false);
      this.mounted = false;
    },
    drawSpecificImage (img) {
      this.drawImage.img = { ...img };
      this.drawImage.show = true;
    },
    showSpecificImage (img) {
      this.displayImage.img = { ...img };
      this.displayImage.show = true;
    },
    fullScreenItem (id) {

      if (this.displayImage.fullScreen) {
        this.exitFullscreen();
      } else {
        const el = document.querySelector(`#${id}___BV_modal_content_`);
        el.requestFullscreen();
        if (this.checkFullScreenTimer) { clearInterval(this.checkFullScreenTimer) };
        this.checkFullScreenTimer = setInterval(this.checkFullScreenElement, 1000);

      }
      this.$nextTick(() => {
        this.displayImage.fullScreen = !this.displayImage.fullScreen;
      });
    },
    checkFullScreenElement () {
      this.isFullScreen = !!document.fullscreenElement;
    },
    removeFailImage ({ ID }) {
      this.$emit("removeImag", ID);
    },
    saveImageBase64 () {
      this.$emit('uploadImg', this.$refs.drawing.canvas.toDataURL())
    },
    clearDrawing () {
      this.$refs.drawing.resetDrawing();
    },
    changeDrawColor () {
      this.$refs.drawing.resetColor();
    },
    changeDrawLength () {
      this.$refs.drawing.resetLength();
    },
    changeDrawFontSize () {
      this.$refs.drawing.resetFontSize();
    }
  },
  props: {
    show: {
      type: Boolean
    },
    loading: {
      type: Boolean
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  components: {
    drawing, imgList
  },
  computed: {
    imgItems () {
      const { per, current } = this.pagination;
      return !this.show || this.loading
        ? []
        : this.items.filter((item, index) => index >= (current - 1) * per && index < current * per);
    },
    drawMode () {
      return this.isMounted && this.drawImage.show && this.$refs.drawing
        ? this.$refs.drawing.mode
        : 'none';
    }
  },
  mounted () {
    //  && !!document.fullscreenElement
    // const el = document.querySelector("#displayImage___BV_modal_content_");
  },
  beforeDestroy () {
    // const el = document.querySelector("#displayImage___BV_modal_content_");
    if (this.checkFullScreenTimer) clearInterval(this.checkFullScreenTimer);
  },
  watch: {
    show (val) {
      this.showImage = val;
    },
    loading (val) {
      if (this.show && !val) {
        this.pagination.current = 1;
      }
    },
    "displayImage.show" (val) {
      if (!val) {
        this.displayImage.fullScreen = false;
        this.displayImage.img = null;
      }
    },
    "drawImage.show" (val) {
      if (val) this.$nextTick(() => { this.isMounted = true });
      else this.drawImage.img = null;
    },
    isFullScreen (val) {
      if (!val) {
        if (this.checkFullScreenTimer) { clearInterval(this.checkFullScreenTimer) };
        this.displayImage.fullScreen = false;
      }
    }
  }
}
</script>
