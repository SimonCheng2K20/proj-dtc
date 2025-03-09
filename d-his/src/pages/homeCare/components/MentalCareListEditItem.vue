<template>
  <q-dialog ref="dialogRef" full-width>
    <my-dialog-content header="新增訪視單" class="font-bold" width="90%" @close="onDialogCancel()">
      <div class="flex flex-nowrap items-start">
        <aside class="grow pr-2 sticky top-0">
          <q-table
            v-bind="QTableProps"
            style="max-height: 700px; width: 320px"
            :columns="columns"
            :rows="rows"
            virtual-scroll
            :rows-per-page-options="[0]"
          >
            <template v-slot:top> <p class="grow text-center">訪視歷次紀錄</p> </template>
          </q-table>
        </aside>

        <div class="grid gap-2 col-span-3">
          <my-input-group class="grid grid-cols-3">
            <my-input-wrapper label="訪視紀錄類別">
              <q-select v-bind="QSelectProps"></q-select>
            </my-input-wrapper>
          </my-input-group>

          <q-separator></q-separator>

          <DataHeader :items="patientData">
            <div class="w-full grid grid-cols-5">
              <div>聯絡人：{{}}</div>
              <div>電話：{{}}</div>
              <div>與病人關係：{{}}</div>
              <div class="col-span-2">居住地址：{{ '台北市文山區崇德路38巷5弄56號3樓之5' }}</div>
              <div class="col-span-5">過去病史：{{}}</div>
            </div>
          </DataHeader>

          <section>
            <my-input-group class="grid gap-2 grid-cols-4">
              <my-input-wrapper label="申請日期">
                <my-date-input v-bind="QInputProps"></my-date-input>
              </my-input-wrapper>
              <my-input-wrapper label="訪視日期">
                <my-date-input v-bind="QInputProps"></my-date-input>
              </my-input-wrapper>
              <my-input-wrapper label="下次訪視日期">
                <my-date-input v-bind="QInputProps"></my-date-input>
              </my-input-wrapper>
            </my-input-group>
          </section>

          <section class="grid grid-cols-2 gap-2">
            <div class="border border-[#1e40af]">
              <p class="text-lg bg-[#deecff] px-1 border-b border-[#1e40af]">住院個案填寫</p>
              <my-input-group class="grid gap-2 grid-cols-2 p-2">
                <my-input-wrapper label="住院日期">
                  <my-date-input v-bind="QInputProps"></my-date-input>
                </my-input-wrapper>
                <my-input-wrapper label="轉介醫院代號">
                  <q-input v-bind="QInputProps"></q-input>
                </my-input-wrapper>
                <my-input-wrapper label="出院日期">
                  <q-input v-bind="QInputProps"></q-input>
                </my-input-wrapper>
                <my-input-wrapper label="轉介醫師身分證號">
                  <q-input v-bind="QInputProps"></q-input>
                </my-input-wrapper>
                <my-input-wrapper label="醫院電話">
                  <q-input v-bind="QInputProps"></q-input>
                </my-input-wrapper>
              </my-input-group>
            </div>
            <div class="border border-[#1e40af]">
              <p class="text-lg bg-[#deecff] px-1 border-b border-[#1e40af]">非住院個案填寫</p>
              <my-input-group class="grid gap-2 grid-cols-2 p-2">
                <my-input-wrapper label="收案訪視日期">
                  <my-date-input v-bind="QInputProps"></my-date-input>
                </my-input-wrapper>
                <my-input-wrapper label="契約醫院代號">
                  <q-input v-bind="QInputProps"></q-input>
                </my-input-wrapper>
                <my-input-wrapper label="收案訪視醫師身分證號">
                  <q-input v-bind="QInputProps"></q-input>
                </my-input-wrapper>
                <my-input-wrapper label="醫院電話">
                  <q-input v-bind="QInputProps"></q-input>
                </my-input-wrapper>
              </my-input-group>
            </div>
          </section>

          <section>
            <ProcedureTable
              ref="procedureTableRef"
              :columns="procedureColumns"
              :rows="[]"
              title="診療項目"
              preset
            ></ProcedureTable>
          </section>

          <section class="border border-[#1e40af] p-2">
            <p class="text-lg">功能量表</p>
            <my-input-group class="grid gap-1">
              <my-input-wrapper label="積極症狀" inputBorder>
                <div class="grow">
                  <q-option-group :options="options1"></q-option-group>

                  <my-input-wrapper label="說明" class="p-2">
                    <q-input v-bind="QInputProps"></q-input>
                  </my-input-wrapper>
                </div>
              </my-input-wrapper>
              <my-input-wrapper label="退化症狀" inputBorder>
                <q-option-group :options="options2"></q-option-group>
              </my-input-wrapper>
              <my-input-wrapper label="自殺、自傷傾向">
                <q-option-group :options="options3"></q-option-group>
              </my-input-wrapper>
              <my-input-wrapper label="暴力傾向" inputBorder>
                <q-option-group :options="options4"></q-option-group>
              </my-input-wrapper>
              <my-input-wrapper label="人際關係" inputBorder>
                <q-option-group :options="options5"></q-option-group>
              </my-input-wrapper>
              <my-input-wrapper label="工作、家務或功課" inputBorder>
                <q-option-group :options="options6"></q-option-group>
              </my-input-wrapper>
              <my-input-wrapper label="時間分配" inputBorder>
                <q-option-group :options="options7"></q-option-group>
              </my-input-wrapper>
              <my-input-wrapper label="家庭生活" inputBorder>
                <q-option-group :options="options8"></q-option-group>
              </my-input-wrapper>
              <my-input-wrapper label="物質濫用病史" inputBorder>
                <div class="grow">
                  <q-option-group :options="options9"></q-option-group>

                  <my-input-wrapper label="說明" class="p-2">
                    <q-input v-bind="QInputProps"></q-input>
                  </my-input-wrapper>
                </div>
              </my-input-wrapper>
            </my-input-group>
          </section>

          <section class="grid gap-2">
            <my-input-wrapper label="其它處置">
              <q-input v-bind="QInputProps"></q-input>
            </my-input-wrapper>
            <MedicineTable :columns="medicineColumns"></MedicineTable>
            <my-input-wrapper label="其它">
              <q-input v-bind="QInputProps"></q-input>
            </my-input-wrapper>
          </section>

          <section>
            <my-input-group class="grid grid-cols-4 gap-2">
              <my-input-wrapper class="col-start-3" label="醫師身分證號" required-mark>
                <q-input v-bind="QInputProps"></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="醫師簽名" required-mark>
                <q-input v-bind="QInputProps"></q-input>
              </my-input-wrapper>
            </my-input-group>
          </section>
        </div>
      </div>
      <template #actions>
        <q-btn unelevated dense color="grey" label="取消" @click="onDialogCancel"></q-btn>
        <q-btn unelevated dense color="add" label="儲存並列印"></q-btn>
        <q-btn unelevated dense color="edit" label="儲存"></q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useQuasar, useDialogPluginComponent } from 'quasar'

// components
import DataHeader from 'components/DataHeader.vue'
import ProcedureTable from 'components/opd/ProcedureTable.vue'
import MedicineTable from 'components/opd/MedicineTable.vue'

// utils
import { QInputProps, QTableProps, QSelectProps } from 'utils/quasar-extends/base-props.js'

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const patientData = ref([
  { label: '姓名', value: '' },
  { label: '姓別', value: '' },
  { label: '年齡', value: '' },
  { label: '生日', value: '' },
  { label: '身分證號', value: '' },
])

const medicineColumns = [
  'index',
  'MedicineId',
  'book',
  'Name',
  'DoseOnce',
  'MedicationUnitCode',
  'FrequencyCode',
  'TimesOneDay',
  'MedicationDays',
  'MedicationDays2',
  'Formula',
  'Mill',
  'TotalAmount',
  'TotalAmount2',
  'RouteCode',
  'action',
]

const procedureColumns = [
  'index',
  'ProcedureCode',
  'Name',
  'TreatmentSites',
  'ToothSurface',
  'EmergencyFlag',
  'Amount',
  'SelfPrice',
  'Note',
  'SelfPayFlag',
  'SelfFlag',
  'action',
]

const columns = computed(() => {
  return [
    {
      name: 'Date',
      label: '登打日期',
      field: 'action',
      align: 'center',
      headerStyle: 'position: sticky; top:0; z-index:10',
    },
    {
      name: 'action',
      label: '訪視紀錄類別',
      field: 'action',
      align: 'center',
      headerStyle: 'position: sticky top:0; z-index:10',
    },
    {
      name: 'action',
      label: '登打人員',
      field: 'action',
      align: 'center',
      headerStyle: 'position: sticky; top:0;  z-index:10',
    },
  ]
})

const rows = ref([
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
])

const options1 = [
  { label: '重度症狀：對生活干擾極嚴重，一般人觀察即發現有異狀', value: '3' },
  { label: '中度症狀：對生活有明顯干擾，家人或專業人員觀察即發現症狀', value: '2' },
  { label: '輕微症狀：對生活無太大干擾，經詢問才可發現症狀', value: '1' },
  { label: '無明顯精神症狀', value: '0' },
]

const options2 = [
  {
    label:
      '重度退化：極少有人際關係之興趣與活動動機，縱使鼓勵之，亦不參與活動生活極度懶散，不活潑，個人衛生極差，情感一直很平板，因思考極度沒有內容而甚少說話',
    value: '3',
  },
  {
    label:
      '中度退化：人際關係之興趣與活動動機很低，要積極鼓勵才可以參與活動，而且不能持久，個人衛生差，情感很遲滯，講話時，思考內容甚少',
    value: '2',
  },
  {
    label:
      '輕度退化：人際關係與活動興趣嫌少，均在被動情況下才參與活動；參與活動之持久性不高，個人衛生差，情感較貧乏，思考內容不多',
    value: '1',
  },
  { label: '無退化症狀：人際關係與活動興趣，可主動參與或經鼓勵即可主動參與', value: '0' },
]
const options3 = [
  { label: '極度傾向：一再重複或手段致命性高', value: '4' },
  { label: '重度傾向：有具體行為', value: '3' },
  { label: '中度傾向：重覆表現確定意念', value: '1' },
  { label: '輕度傾向：意念搖擺不定', value: '1' },
  { label: '無明顯傾向', value: '1' },
]
const options4 = [
  { label: '極度傾向：強烈妄想或幻想，曾傷人致送醫', value: '4' },
  { label: '重度傾向：曾攻擊別人，但無嚴重後果', value: '3' },
  { label: '中度傾向：粗暴行為或破壞物品', value: '1' },
  { label: '輕度傾向：口頭威脅，言詞激動', value: '1' },
  { label: '無明顯傾向', value: '1' },
]
const options5 = [
  { label: '與人有衝突，不易相處或房門深鎖，刻意孤僻生活', value: '6' },
  { label: '與人相處退縮，有意避開別人或易發脾氣，但不致明顯衝突', value: '5' },
  { label: '與人相處，顯的被動或情緒不穩，但無大礙', value: '4' },
  { label: '一般常人般之人際關係，應付無困難，與人相處沒有困難，少有朋友，無社交生活', value: '3' },
  { label: '一般常人般之人際關係，應付人際關係得體，有朋友，偶有社交生活', value: '2' },
  { label: '較一般人更能處理人際關係，有朋友來往，常有社交活動，可以享受人際關係樂趣', value: '1' },
  { label: '人際關係良好，容易交朋友，常有社交活動，心胸開闊，能主動，助人為樂', value: '0' },
]
const options6 = [
  { label: '沒有工作又無動機找工作，沒有動機做家務或上學', value: '6' },
  { label: '只偶爾工作，找工作不熱心；只偶爾做家事，做家事不熱心；只偶爾上學，上學不熱心', value: '5' },
  {
    label: '工作不穩定，時常換工作，時常不規則上班；只被動的做家事，做得不理想；只被動上學，時常不上學，應付上學而已',
    value: '4',
  },
  { label: '有工作，工作表現尚可，感受相當壓力；主動做家事或上學，但表現馬馬虎虎', value: '3' },
  { label: '工作表現良好，工作壓力能順利應付，家務或功課表現良好', value: '2' },
  { label: '工作、家務、功課表現優良，沒有感受壓力，能順利處理工作、家務、功課上之困難，同時獲得樂趣', value: '1' },
  {
    label:
      '工作、家務、功課表現極優，能得上司、家人、老師的器重，並能幫助同事、家人、同學處理特殊難題，工作、家務、功課，很有樂趣',
    value: '0',
  },
]
const options7 = [
  { label: '成天無所事是，沒有特殊活動', value: '6' },
  { label: '只能被動的參與活動，空閒時間多，但工作與休閒均少', value: '5' },
  { label: '只偶爾有主動得活動，大部分為被動參與，多空與生活時間安排凌亂', value: '4' },
  { label: '鮮有社交活動，工作緊湊，沒有休閒', value: '3' },
  { label: '工作緊湊、有休閒活動，但缺社交', value: '2' },
  { label: '工作與休閒有良好調配，偶有社交活動', value: '1' },
  { label: '生活悠閒，工作與社交時間有理想的調配', value: '0' },
]
const options8 = [
  { label: '與家人常常有衝突，對家庭生活不負責任，在家裡生活感到痛苦', value: '6' },
  { label: '不理會家裡生活，對家庭生活時有抱怨，與家人偶有衝突', value: '5' },
  { label: '不照顧家裡生活，或不理會家人，只獨處房間，但無明顯衝突', value: '4' },
  { label: '能照顧家裡生活，與家人少溝通，可正常生活，缺少感情來往', value: '3' },
  { label: '對家庭負責盡職，與家人和好相處', value: '2' },
  { label: '主動關心家人生活，對家庭負責盡職，生活融洽，有說有笑，有家庭生活之樂趣', value: '1' },
  { label: '對家庭負責盡職，生活融洽，主動關心家人，能主動安排家庭生活的種種活動，頗能享受家庭生活', value: '0' },
]
const options9 = [
  { label: '煙', value: '1' },
  { label: '酒', value: '2' },
  { label: '違禁藥', value: '3' },
  { label: '治療藥', value: '4' },
]
</script>
