<template>
  <div class="content-diff">
    <div class="dtc-grid d-flex justify-content-between mt-2">
      <div>歷史版本：{{ oldVersion }}</div>
      <div>當前版本: {{ newVersion }}</div>
    </div>
    <div id="viewid"></div>
  </div>
</template>

<script>
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/merge/merge.js";
import "codemirror/addon/merge/merge.css";
import DiffMatchPatch from "diff-match-patch";
window.diff_match_patch = DiffMatchPatch;
window.DIFF_DELETE = -1;
window.DIFF_INSERT = 1;
window.DIFF_EQUAL = 0;

export default {
  name: "contentDiff",
  data () {
    return {
    };
  },
  props: {
    oldVersion: {
      type: String,
      default: ""
    },
    oldString: {
      type: String,
      default: ""
    },
    newVersion: {
      type: String,
      default: ""
    },
    newString: {
      type: String,
      default: ""
    }
  },

  mounted () {
    this.createdHtml(this.oldString || '', this.newString || '');
  },
  methods: {
    createdHtml (oldString, newString) {
      let target = document.getElementById("viewid");
      target.innerHTML = "";
      setTimeout(() => {
        const mirror = CodeMirror.MergeView(target, {
          value: oldString, //上次内容
          orig: newString, //本次内容
          origLeft: null,
          lineNumbers: true, //显示行号
          //mode: "text/html",
          highlightDifferences: true,
          connect: "align",
          readOnly: true //只读 不可修改
        });
      }, 200);
    },

  },
  beforeDestroy () {

  },
  // watch: {
  //   show (val) {
  //     alert("TET");
  //     if (val) document.getElementById("WinDiff0307___BV_modal_content_").requestFullscreen();
  //   }
  // }
};
</script>
<style>
.CodeMirror-merge-copy {
  display: none;
}
.CodeMirror-merge-gap {
  background-color: transparent;
}
.CodeMirror {
  color: inherit;
  background-color: inherit;
}
</style>
<style scoped>
.dtc-grid {
  font-size: 16px;
}

#viewid {
  min-height: calac(100vh - 200px) !important;
}
*::-webkit-scrollbar {
  width: 0px; /* Remove scrollbar space */
  background: transparent; /* Optional: just make scrollbar invisible */
}

/deep/ .CodeMirror-linenumber {
  background-color: #fff !important;
}

/deep/ .CodeMirror-line {
  margin-left: 33px !important;
}

/deep/ .CodeMirror {
  height: 100% !important;
}
</style>

<style>
.CodeMirror-merge-2pane .CodeMirror-merge-pane,
.CodeMirror-merge {
  height: 85vh;
}

.CodeMirror-merge {
  height: calc(100%-3px);
}

#WinDiff0307 /deep/ .modal-dialog {
  margin-bottom: 0 !important;
}
.content-diff {
  min-height: calc(100vh - 50px);
}
</style>
