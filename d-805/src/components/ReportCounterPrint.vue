<template>
  <div>
    <print-service v-on:afterPrintEvent="finishPrint">
      <div
        v-if="items[0] != null && items.length > 0"
        class="reportCounterPrint pb-3 position-relative"
      >
        <h2 class="sheet-header py-3">報到單</h2>
        <!-- <h2 class="sheet-header py-3">陽明交通大學醫院報到單</h2> -->

        <div class="d-flex align-item-stretch">
          <div class="flex-2 border">
            <div class="title bg-primary text-white">姓名</div>
            <div class="content" v-text="items[0].PatientName" />
          </div>

          <div class="flex-1 border">
            <div class="title bg-primary text-white">年齡</div>
            <div class="content">{{ items[0].PatientAge }}</div>
          </div>

          <div class="flex-1 border">
            <div class="title bg-primary text-white">性別</div>
            <div class="content">{{ items[0].PatientSex }}</div>
          </div>

          <!-- <div class="border">
            <div class="title bg-primary text-white">病歷號碼: {{ items[0].PatientId }}</div>
            <div class="content">
              <barcode
                :value="items[0].PatientId"
                :height="barcodeHeight"
                :displayValue="false"
              />
            </div>
          </div>

          <div class="border">
            <div class="title bg-primary text-white">
              申請單號: {{ items[0].OrderNo }}
            </div>
            <div class="content">
              <barcode
                :value="items[0].OrderNo"
                :height="barcodeHeight"
                :displayValue="false"
              />
            </div>
          </div> -->
        </div>

        <div
          v-for="item in items"
          :key="item.ProcedureCode"
          class="noBreak item"
        >
          <hr class="my-4" />
          <div class="d-flex">
            <div class="flex-1 border">
              <div class="title">來源</div>
              <div class="content">{{ item.PatientSourceTypeName }}</div>
            </div>
            <div class="flex-1 border">
              <div class="title">預約時間</div>
              <div class="content">
                {{
                  !item.ScheduleTime
                    ? "尚未排定時間"
                    : $moment(item.ScheduleTime).format("YYYY-MM-DD HH:mm:ss")
                }}
              </div>
            </div>
            <div class="flex-1 border">
              <div class="title">報到時間</div>
              <div class="content">
                {{
                  item.CounterRegister_forShow || item.StatusName || "尚未報到"
                }}
              </div>
            </div>
          </div>

          <hr class="my-4" />
          <div class="flex-1 border">
            <div class="title text-center bg-primary text-white mb-2">
              攝影名稱: {{ items[0].ProcedureName }}
            </div>
          </div>

          <div class="border">
            <div class="title bg-light text-black">
              病歷號碼: {{ items[0].PatientId }}
            </div>
            <div class="content">
              <barcode
                :value="items[0].PatientId"
                :height="barcodeHeight"
                :displayValue="false"
              />
            </div>
          </div>

          <hr class="my-4" />

          <div class="border">
            <div class="title bg-light text-black">
              申請單號: {{ items[0].OrderNo }}
            </div>
            <div class="content">
              <barcode
                :value="items[0].OrderNo"
                :height="barcodeHeight"
                :displayValue="false"
              />
            </div>
          </div>

          <!-- <div class="d-flex">
            
          </div> -->

          <!-- <div class="d-flex">
            <div class="flex-1 border">
              <div class="title text-center">攝影名稱: {{ item.ProcedureName }}</div>
            </div>
          </div>

          <div class="d-flex">
            <div class="flex-2 border">
              <div class="title">攝影代碼: {{ item.ProcedureCode }}</div>
              <div class="content">
                <barcode
                  :value="item.ProcedureCode"
                  :height="barcodeHeight"
                  :displayValue="false"
                />
              </div>
            </div>
          </div>

          <div class="d-flex">
            <div class="flex-2 border">
              <div class="title">工單序號: {{ item.AccessionNo }}</div>
              <div class="content">
                <barcode
                  :value="item.AccessionNo"
                  :height="barcodeHeight"
                  :displayValue="false"
                />
              </div>
            </div>
          </div> -->

          <div class="position-fixed print-time">
            印表時間: {{ $moment().format("YYYY/MM/DD HH:mm:ss") }}
          </div>
        </div>
      </div>
    </print-service>
  </div>
</template>

<script>
import printService from "./printService";
import VueBarcode from "vue-barcode";
export default {
  data() {
    return {
      // title: $setting.name,
      barcodeHeight: 55,
    };
  },
  props: {
    items: {
      type: Array,
    },
  },
  components: {
    printService,
    barcode: VueBarcode,
  },
  methods: {
    finishPrint() {
      this.$emit("closePrint");
    },
  },
};
</script>

<style lang="scss">
@media print {
  body {
    background-color: #fff !important;
  }
}

.reportCounterPrint {
  font-family: Microsoft Jhenghei;
  page-break-after: always;
  page-break-before: always;
  min-height: 100vh;
  color: #000;
  h2.sheet-header {
    border-bottom: 1px solid #000;
    font-size: 50px;
  }
  .d-grid {
    display: grid;
  }
  .report-column {
    grid-gap: 3px;
    grid-row-gap: 3px;
    padding: 3px;
    grid-template-columns: repeat(3, 1fr);
    > div {
      margin-bottom: 10px;
    }
  }
  .title,
  .content {
    font-size: 21px;
    padding: 5px 15px;
  }
  .title {
    background-color: #effefe;
    font-weight: bold;
  }
  hr {
    width: 100%;
    border: 0;
    border-bottom: 1px dashed #000;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .part2 {
    > div {
      display: flex;
      align-items: center;
    }
  }

  @for $i from 1 through 10 {
    .flex-#{$i} {
      flex: $i 0 0;
    }
  }

  .print-time {
    right: 0;
    bottom: 0;
  }
}
</style>
