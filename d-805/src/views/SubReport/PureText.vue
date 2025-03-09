<template>
  <div>
    <div v-html="pureContent" />
    <!-- <div
      v-for="(items, sIdx) in sections"
      :key="sIdx"
    >
      <span
        v-for="(item, idx) in items"
        :key="`${sIdx}_${idx}`"
      >
        <span v-if="idx > 0">&emsp;{{ item.label !== "/" ? "|" : "" }} &emsp;</span>
        <span v-html="item.label" />&nbsp;<span v-html="item.value" />
        <span
          v-if="item.append"
          v-text="'&emsp;' + item.append"
        />
      </span>

      <br /><br />
    </div> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      pureContent: '',
    };
  },
  props: {
    content: {
      type: String,
      required: true,
    },
    values: {
      type: String,
      default: null,
    },
  },
  created () {

    let sections = JSON.parse(this.content)
      .source.map(({ itemRow }) => itemRow)
      .flat()
      .map(({ items }) => items); // .flat()
    const jsonValues = this.values ? JSON.parse(this.values) : null;
    if (jsonValues) {
      sections.flat().forEach((item) => {
        if (item.key && jsonValues[item.key]) {
          if (["select", "radio", "checkbox"].some((v) => item.type === v)) {
            const option = item.options.find(({ value }) => value === jsonValues[item.key]);
            if (option) item.value = option.text;
          } else if (item.type == 'table') {
            item.value = Object.entries(jsonValues[item.key]).reduce((acc, [k, v]) =>
              acc + `[ ${k} ] => ` + Object.entries(v).map(([sk, sv]) => `${sk}: ${sv}`).join(', ') + '<br />'
              , '')

          } else {
            item.value = jsonValues[item.key];
          }
        }
      });
    }

    this.pureContent = sections.reduce((acc, section) => {
      return (acc
        + section.reduce((sAcc, item) =>
          sAcc.concat(
            (item.label ? item.label : '') + ((item.label === '/' || !item.label) ? ' ' : ' : ') + item.value + (item.append ? '&nbsp;' + item.append : '')
          ), []).join('&emsp;|&emsp;')
        + '<br /><br />')
    }, '')

  },
};
</script>
