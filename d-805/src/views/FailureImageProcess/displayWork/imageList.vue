<template>
  <div
    class="flex-1 d-grid grid-col-12 mb-2"
    style="grid-gap: 2px;"
  >
    <div
      v-for="item in items"
      :key="item['FILE_PATH']"
      class="position-relative"
    >
      <b-img
        :src="item['FILE_PATH']"
        fluid
        rounded
        class="d-flex justify-content-end"
      >
      </b-img>

      <div
        class="position-absolute"
        style="right: 5px; top: 5px;"
      >
        <b-btn
          v-if="item['TYPE']===1"
          size="sm"
          variant="danger"
          @click="$emit('remove', item)"
          class="mr-1"
        >
          <font-awesome-icon icon="trash-alt" />
        </b-btn>
        <b-btn
          size="sm"
          variant="success"
          @click="$emit('show', item)"
          class="mr-1"
        >
          <font-awesome-icon icon="search" />
        </b-btn>

        <b-btn
          size="sm"
          variant="primary"
          @click="$emit('draw', item)"
          class="mr-1"
        >
          <font-awesome-icon icon="pen" />
        </b-btn>

        <b-btn
          size="sm"
          variant="warning"
          @click="downloadImg(item)"
        >
          <font-awesome-icon icon="download" />

        </b-btn>

      </div>

    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    downloadImg ({ FILE_PATH }) {
      const fileName = FILE_PATH.split('/').slice(-1);
      var element = document.createElement('a');
      element.setAttribute('href', FILE_PATH);
      element.setAttribute('download', fileName);
      element.setAttribute('target', '_blank');
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

    }
  }
};
</script>
