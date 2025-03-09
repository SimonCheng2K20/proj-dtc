<template>
  <div style="height:100vh">
    <div class="dtc-grid">
      <div>歷史報告版本： {{ leftString }}</div>
      <div>當前版本</div>
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
  name: "textdiff",
  data () {
    return {
      leftString: window.dtcDiff
    };
  },
  props: {
    oldString: {
      type: String,
      default: ""
    },
    newString: {
      type: String,
      default: ""
    },
    context: {
      type: Number,
      default: 5
    },
    outputFormat: {
      type: String,
      default: "line-by-line"
    }
  },

  mounted () {
    setTimeout(() => this.createdHtml(this.oldString, this.newString), 200);
  },
  methods: {
    createdHtml (oldString, newString) {
      let target = document.getElementById("viewid");
      target.innerHTML = "";
      CodeMirror.MergeView(target, {
        value: oldString, //上次内容
        origLeft: null,
        orig: newString, //本次内容
        lineNumbers: true, //显示行号
        //mode: "text/html",
        highlightDifferences: true,
        connect: "align",
        readOnly: true //只读 不可修改
      });
    }
  }
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
  display: flex;
  justify-content: space-between;
  margin: 12px;
  font-size: 16px;
}

#viewid {
  min-height: calac(100vh - 200px) !important;
}
*::-webkit-scrollbar {
  width: 0px; /* Remove scrollbar space */
  background: transparent; /* Optional: just make scrollbar invisible */
}
</style>

<style>
.CodeMirror-merge-2pane .CodeMirror-merge-pane,
.CodeMirror-merge {
  height: 85vh;
}
</style>
