<template>
  <div>
    <b-card no-body>
      <b-card-header class="bg-primary text-white cardHeader">
        <b-row no-gutters>
          <b-col class="text-center">{{ slotTitle }}</b-col>
        </b-row>
      </b-card-header>

      <b-container fluid class="px-0">
        <b-row no-gutters>
          <b-col
            v-for="(section, index) in scections"
            v-bind:key="index"
            class="p-2 text-center"
            style="border-right:1px solid grey;border-bottom:1px solid grey;border-left:1px solid grey;height:360px;"
          >
            <b-row no-gutters>
              <b-col>{{section.sectionTitle}}</b-col>
            </b-row>

            <b-container fluid class="px-0">
              <b-row no-gutters>
                <b-col>
                  <div>
                    <b-input
                      v-model="section.sectionTitle"
                      readonly
                      class="bg-success text-light text-center"
                    />
                  </div>
                </b-col>
              </b-row>
            </b-container>
          </b-col>
        </b-row>

        <b-row no-gutters></b-row>
      </b-container>
    </b-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: {}
    };
  },
  props: {
    slotTitle: { Type: String, default: "title" },
    contentHeight: { Type: Number, default: 100 },
    scections: {
      Type: Array,
      default: [
        { sectionTitle: "週五 14:00 ~ 週六 12:00" },

        { sectionTitle: "週六 12:00 ~ 週日 12:00" }
      ]
    }
  }
};
</script>
