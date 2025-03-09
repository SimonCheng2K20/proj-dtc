<template>
  <div>
    <!-- <h2 class='p-2'>Imaging finding:</h2> -->
    <div
      :id="`structure${index}`"
      v-for="(structure,index) in structures"
      :key="index"
      v-html="structure.content"
    />
  </div>
</template>
<script>
export default {
  data () {
    return {

    }
  },
  props: {
    structures: {
      type: Array,
      default: new Array()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.structures.forEach(({ content, data }, index) => {
        const iptval = !data
          ? null
          : data.reduce((a, c) => ({ ...a, [c.name]: c.value }), {});
        if (iptval && content) {
          this.$el.querySelectorAll(`#structure${index} input, #structure${index} textarea`).forEach((ipt) => {
            if (iptval[ipt.name]) {
              if (ipt.type === "text" || ipt.type === "textarea") {
                let tpd = document.createElement("div");
                ipt.type === "text" && ipt.setAttribute("value", iptval[ipt.name]);
                tpd.setAttribute("class", `editable${ipt.type === "textarea" ? " txtarea" : ""}`);
                tpd.innerHTML = iptval[ipt.name].replace(/\r\n/g, "<br class='keep' />");
                ipt.parentNode.insertBefore(tpd, ipt.nextSibling);
                ipt.parentNode.removeChild(ipt);
              } else if ((ipt.type == "checkbox" || ipt.type == "radio") && ipt.value == iptval[ipt.name]) {
                ipt.setAttribute("checked", "checked");
              }
            }
          });
        }
      });

      this.$el.querySelectorAll("input[type=radio], p, br, fieldset, div, table").forEach((el) => {
        switch (el.tagName) {
          case "INPUT":
            // eslint-disable-next-line no-case-declarations
            let trad = document.createElement("div");
            trad.setAttribute("class", `radio${el.getAttribute("checked") ? " checked" : ""}`);
            el.parentNode.insertBefore(trad, el.nextSibling);
            el.parentNode.removeChild(el);
            break;
          case "TABLE":
          case "DIV":
          case "FIELDSET":
          case "P":
            el.removeAttribute("style");
            break;
          case "BR":
            !el.classList.contains("keep") && el.parentNode.removeChild(el);
            break;
          default:
            break;
        }
      });
    });
  }
}
</script>
