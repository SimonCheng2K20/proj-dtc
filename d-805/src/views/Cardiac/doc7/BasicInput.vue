<template>
  <sectoin>
    <div class="dtc-car4-grid">
      <section>
        <header class="sec1">客觀</header>
        <b-textarea spellcheck="false" readonly></b-textarea>
      </section>
      <section>
        <header class="sec2">護理用藥</header>
        <b-textarea spellcheck="false" readonly></b-textarea>
      </section>
      <section>
        <header class="sec3">穿刺部位</header>
        <b-textarea spellcheck="false" readonly></b-textarea>
      </section>
      <section>
        <header class="sec4">主訴</header>
        <b-textarea spellcheck="false" readonly></b-textarea>
      </section>
    </div>
  </sectoin>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>


<style lang="scss" scoped>
.cvs {
  background: black !important;
  font-size: 16px;
  font-weight: 600;
  margin-top: 56px;
  width: 100vw;
  min-height: calc(100vh - 56px);
  padding: 2px;
}

header {
  background: var(--yellow);
  color: black;
  height: 30px;
  border-radius: 5px;
  line-height: 30px;
  padding-left: 12px;
}

.dtc-car4-grid {
  padding: 3px;
  display: grid;
  grid-template-columns: 282px repeat(3, 1fr);
  grid-gap: 8px !important;
}
section {
  display: flex;
  height: 220px;
  border: 1px solid white;
  border-radius: 5px;
  flex-direction: column;
  color: var(--light);
  font-size: 1rem;
  > div:first-child {
    height: 30px;
    padding-left: 12px;
  }
  > div:last-child {
    padding: 5px;
  }
  textarea,
  textarea:focus {
    height: 100%;
    background: black;
    color: white;
  }
}
.sec1 {
  background: var(--success);
  color: var(--light);
}
.sec2 {
  background: var(--danger);
  color: var(--light);
}
.sec3 {
  background: var(--info);
  color: var(--light);
}
.sec4 {
  background: var(--warning);
  color: var(--dark);
}
.input-group-prepend .input-group-text {
  min-width: 120px;
  max-width: 120px;
  background: rgba(0, 0, 0, 0.7);
  color: hsla(0, 0%, 100%, 0.7);
}
.input-group-append .input-group-text {
  background: rgba(0, 0, 0, 0.7);
  color: hsla(0, 0%, 100%, 0.7);
}
.input-group input,
.input-group select {
  background: rgba(0, 0, 0, 0.7);
  color: white;
}
.long .input-group-prepend .input-group-text {
  min-width: 140px;
  max-width: 140;
  background: hsla(0, 0%, 100%, 0.7);
}
</style>