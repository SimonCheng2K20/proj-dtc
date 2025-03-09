<template>
  <b-card
    no-body
    class="mx-1 my-2 my-book-info"
    :class="booking ? 'dtc-book' : ''"
  >
    <b-card-header
      :class="getBgClass"
      class="mx-0 px-0"
      no-gutters
    >
      <b-row no-gutters>
        <b-button
          v-if="title == '病患資訊'"
          class="px-0 mx-0"
          block
          href="#"
          v-b-toggle.accordion-1
          variant="info"
        >
          {{ title }}
          <font-awesome-icon
            icon="info"
            class="mr-1 cursor-pointer"
          />
        </b-button>
        <b-button
          v-if="title !== '病患資訊'"
          class="px-0 mx-0"
          block
          href="#"
          v-b-toggle.accordion-2
          variant="info"
        >
          {{ title }}
          <font-awesome-icon
            icon="edit"
            class="mr-1 cursor-pointer"
          />
        </b-button>
      </b-row>
    </b-card-header>
    <!-- <b-collapse :id="title == '病患資訊' ? 'accordion-1' : 'accordion-2'" visible accordion="my-accordion" role="tabpanel"> -->
    <b-card-text class="text-left py-1">
      <b-container
        v-if="itemInfo.length > 0"
        fluid
        class="px-1"
        style="max-height:520px; overflow-y:auto;"
      >
        <b-row
          v-for="item in items"
          v-bind:key="item.id"
          no-gutters
        >
          <b-col
            sm="12"
            class="p-1"
          >
            <b-input-group>
              <!-- prepend -->
              <b-input-group-prepend>
                <b-button
                  :variant="item.prependVariant"
                  @click="OnEmit(item)"
                >{{ item.label }}</b-button>
              </b-input-group-prepend>
              <!-- main -->
              <b-input
                v-if="BtnClick"
                v-model="item.value"
                readonly
                style="min-width:350px;"
              />
              <b-input
                v-else
                v-model="item.value"
                readonly
                style="min-width:200px;"
              />
              
              <!-- append btn -->
              <b-input-group-append v-show="BtnClick">
                <b-button
                  variant="danger"
                  @click="OnClickBtn(item)"
                >取消</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-col>

          <!-- <div v-for="item in itemInfo" v-bind:key="item.id" class="row">
            <div class="col q-chip--dense info_lb">{{ item.label }}:&nbsp;</div>
            <div class="col q-chip--dense info_val" v-html="item.value"></div>
            </div>-->
        </b-row>
      </b-container>
      <b-container
        v-else
        fluid
        class="px-1"
      >
        <b-row no-gutters>
          <div class="col q-chip--dense info_center">暫無資料</div>
        </b-row>
      </b-container>
    </b-card-text>
    <!-- </b-collapse> -->
  </b-card>
</template>

<script>
import Vue from "vue";
import { getOptionsPatientSource } from "@/assets/service/dataManager.js";
import { mapState, mapMutations } from "vuex";
export default {
  name: "infoCard",
  props: {
    title: null,
    itemInfo: null,
    colorStyle: null,
    BtnClick: { type: Function, default: null },
    maxHeight: { type: Number, default: 1080 },
    prependVariant: { type: String, default: "secondary" },
    toEmit: { type: Function, default: null },
    booking: null
  },
  data () {
    return {};
  },
  computed: {
    ...mapState(["patientSourceList"]),
    linkStyle () {
      return {
        maxHeight: 200 + "px",
        overflow: "auto"
      };
    },
    getBgClass () {
      if (this.colorStyle == null || this.colorStyle == "0") return "bg-primary text-white cardHeader";
      else if (this.colorStyle == "1") return "bg-secondary text-white cardHeader";
      else if (this.colorStyle == "3") return "bg-info text-white cardHeader";
      else return "bg-primary text-white cardHeader";
    },
    items() {
      if(!this.itemInfo) return [];
      const _items = [...this.itemInfo];
      _items.forEach((item)=>{
        if(item.label === '病患來源' && this.patientSourceList.length > 0) {
          const existSource = this.patientSourceList.find(({value})=> value===item.value);
          if(existSource && existSource.hasOwnProperty('text')) {
            item.value = existSource['text'];
          }
        }
      });
      return _items;
    }
  },
  methods: {
    ...mapMutations(['SET_PATIENT_SOURCE_LIST']),
    OnEmit (x) {
      if (this.toEmit) {
        this.toEmit(x);
      }
    },
    OnClickBtn (x) {
      if (this.BtnClick) {
        this.BtnClick(x);
      }
    },
    async getPatientSource () {
      if (this.patientSourceList.length === 0) {
        const {
          actual: { Items },
        } = await getOptionsPatientSource();
        this.SET_PATIENT_SOURCE_LIST(Items.map(({ No, Name }) => ({ text: Name, value: No })));
      }
      
    }
  },
  created () { 
    this.getPatientSource();
  }
};
</script>

<style scoped>
.info_val {
  text-align: left;
}

.info_lb {
  text-align: right;
}

.info_center {
  text-align: center;
}
.dtc-book {
  max-height: 250px;
  overflow: auto;
}
</style>

<style lang="scss" scoped>
.my-book-info .input-group-prepend button {
  min-width: 100px !important;
  //max-width: 110px !important;
}
</style>
