<template>
  <div
    class="search-section d-grid grid-col-12"
    style="grid-gap: 2px;"
  >
    <b-card
      bg-variant="transparent"
      no-body
      class="border grid-span-2"
    >
      <b-card-header class="bg-success text-white font-weight-bold cardHeader">
        <b-row no-gutters>
          <b-col
            cols="6"
            class="float-left text-left"
            @click="showVersionAlert(1)"
          >檢查項目 {{ !procedure.ProcedureNameList ? "(暫無記錄)" : "" }}</b-col>
        </b-row>
      </b-card-header>
      <b-card-text class="p-0">
        <b-container
          fluid
          class="p-0"
        >
          <b-row no-gutters>
            <b-textarea
              no-resize
              tag="ProcedureNameList"
              rows="4"
              class="border-0 rounded-0"
              v-model="procedure.ProcedureNameList"
              readonly
            ></b-textarea>
          </b-row>
        </b-container>
      </b-card-text>
    </b-card>

    <b-card
      bg-variant="transparent"
      no-body
      class="border grid-span-4"
    >
      <b-card-header class="bg-danger text-white font-weight-bold cardHeader">
        <b-row no-gutters>
          <b-col
            cols="6"
            class="float-left text-left"
          >客觀 {{ !procedure.Objective ? "(暫無記錄)" : "" }}</b-col>
        </b-row>
      </b-card-header>
      <b-card-text class="p-0">
        <b-container
          fluid
          class="p-0"
        >
          <b-row no-gutters>
            <b-textarea
              id="Objective"
              tag="Objective"
              no-resize
              rows="4"
              class="border-0 rounded-0"
              v-model="procedure.Objective"
              readonly
            ></b-textarea>
          </b-row>
        </b-container>
      </b-card-text>
    </b-card>

    <b-card
      bg-variant="transparent"
      no-body
      class="border grid-span-3"
    >
      <b-card-header class="bg-info text-white font-weight-bold cardHeader">
        <b-row no-gutters>
          <b-col
            cols="6"
            class="float-left text-left"
          >主訴 {{ !procedure.Subjective ? "(暫無記錄)" : "" }}</b-col>
        </b-row>
      </b-card-header>
      <b-card-text class="p-0">
        <b-container
          fluid
          class="p-0"
        >
          <b-row
            ref="blkSubjective"
            no-gutters
          >
            <b-textarea
              tag="Subjective "
              no-resize
              rows="4"
              class="border-0 rounded-0"
              v-model="procedure.Subjective"
              readonly
            ></b-textarea>
          </b-row>
        </b-container>
      </b-card-text>
    </b-card>
    <div class="grid-span-3">
      <!-- <b-card
        class="border"
        bg-variant="transparent"
        no-body
      >
        <b-card-header class="bg-warning text-black font-weight-bold cardHeader">
          <b-row no-gutters>
            <b-col
              cols="6"
              class="float-left text-left"
            >檢查註記 {{ !procedure.RadiographerNote ? "(暫無記錄)" : "" }}</b-col>
          </b-row>
        </b-card-header>
        <b-card-text class="p-0">
          <b-container
            fluid
            class="p-0"
          >
            <b-row no-gutters>
              <b-textarea
                no-resize
                rows="1"
                tag="RadiographerNote"
                class="border-0 rounded-0"
                style="height: 45px;"
                v-model="procedure.RadiographerNote"
                readonly
              ></b-textarea>
            </b-row>
          </b-container>
        </b-card-text>
      </b-card> -->

      <b-card
        class="border"
        bg-variant="transparent"
        no-body
      >
        <b-card-header class="bg-primary text-white cardHeader">
          <b-row no-gutters>
            <b-col
              cols="6"
              class="float-left text-left"
            >ICD-10</b-col>
          </b-row>
        </b-card-header>
        <b-card-text class="p-0">
          <b-container
            fluid
            class="p-1"
          >
            <div style="height: 105px; overflow: auto;">
              <div
                v-for="disase in diseaseInfo"
                :key="disase.value"
                v-text="`${disase.text} (${disase.value})`"
              />
            </div>
          </b-container>
        </b-card-text>
      </b-card>

    </div>

  </div>
</template>

<script>
export default {
  props: {
    procedure: {
      type: Object,
      default: {}
    },
    report: {
      type: Object,
      default: {}
    }
  },
  computed: {
    diseaseInfo () {
      if (!this.report['DISEASE']) return [];
      const diseaseContent = this.report['DISEASE'].split(',');
      const diseaseCode = this.report['DISEASE_CODE'].split(',');
      return diseaseCode.reduce((acc, key, index) => {
        acc.push({
          text: diseaseContent[index],
          value: key
        })
        return acc;
      }, []);
    }
  }
}
</script>
