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
            <my-input-wrapper label="訪視紀錄類別" input-border>
              <q-option-group inline :options="options4"></q-option-group>
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
              <my-input-wrapper label="醫囑日期">
                <my-date-input v-bind="QInputProps"></my-date-input>
              </my-input-wrapper>
              <div class="leading-10">(本醫囑單之效期為30日)</div>
              <my-input-wrapper class="col-span-4" label="目前狀況">
                <q-input v-bind="QInputProps"></q-input>
              </my-input-wrapper>
            </my-input-group>
          </section>

          <section>
            <icd-table class="min-h-[180px]" ref="icdTableRef">
              <template #btn-expand>
                <q-btn color="primary" label="科室公用組套" dense unelevated></q-btn>
              </template>
            </icd-table>
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
              class="col-span-full"
              :columns="procedureColumns"
              :rows="[]"
              title="訪視/特殊照顧"
              preset
            ></ProcedureTable>
          </section>

          <section class="border border-[#1e40af]">
            <p class="text-lg bg-[#deecff] px-1 border-b border-[#1e40af]">醫囑</p>
            <div class="p-2 grid gap-2">
              <div class="grid grid-cols-2 gap-2">
                <my-input-group class="grid gap-2">
                  <my-input-wrapper label="更換鼻胃管" inputBorder>
                    <div class="flex flex-nowrap items-center mr-1">
                      <q-checkbox></q-checkbox>
                      <q-option-group :options="options2"></q-option-group>
                    </div>
                    <div class="grid grid-cols-2 gap-1 m-1">
                      <my-input-wrapper label="更換頻率">
                        <q-input v-bind="QInputProps">
                          <template #append> <div class="text-lg">天/次</div> </template>
                        </q-input>
                      </my-input-wrapper>
                      <my-input-wrapper label="管徑大小">
                        <q-input v-bind="QInputProps">
                          <template #append> <div class="text-lg">FF</div> </template>
                        </q-input>
                      </my-input-wrapper>
                      <my-input-wrapper class="col-span-2" label="材質" inputBorder>
                        <div class="flex flex-col grow">
                          <q-option-group inline :options="options3"></q-option-group>
                          <my-input-wrapper class="m-1" label="其它">
                            <q-input v-bind="QInputProps"></q-input>
                          </my-input-wrapper>
                        </div>
                      </my-input-wrapper>
                    </div>
                  </my-input-wrapper>

                  <my-input-wrapper label="更換導尿管" inputBorder>
                    <div class="flex flex-nowrap items-center mr-1">
                      <q-checkbox></q-checkbox>
                      <q-option-group :options="options2"></q-option-group>
                    </div>
                    <div class="grid grid-cols-2 gap-1 m-1">
                      <my-input-wrapper label="更換頻率">
                        <q-input v-bind="QInputProps">
                          <template #append> <div class="text-lg">天/次</div> </template>
                        </q-input>
                      </my-input-wrapper>
                      <my-input-wrapper label="管徑大小">
                        <q-input v-bind="QInputProps">
                          <template #append> <div class="text-lg">FF</div> </template>
                        </q-input>
                      </my-input-wrapper>
                      <my-input-wrapper class="col-span-2" label="材質" inputBorder>
                        <div class="flex flex-col grow">
                          <q-option-group inline :options="options3"></q-option-group>
                          <my-input-wrapper class="m-1" label="其它">
                            <q-input v-bind="QInputProps"></q-input>
                          </my-input-wrapper>
                        </div>
                      </my-input-wrapper>
                    </div>
                  </my-input-wrapper>

                  <my-input-wrapper label="更換氣切管" inputBorder>
                    <div class="flex flex-nowrap items-center mr-1">
                      <q-checkbox></q-checkbox>
                      <q-option-group :options="options2"></q-option-group>
                    </div>
                    <div class="grid grid-cols-2 gap-1 m-1">
                      <my-input-wrapper label="更換頻率">
                        <q-input v-bind="QInputProps">
                          <template #append> <div class="text-lg">天/次</div> </template>
                        </q-input>
                      </my-input-wrapper>
                      <my-input-wrapper label="管徑大小">
                        <q-input v-bind="QInputProps">
                          <template #append> <div class="text-lg">mm</div> </template>
                        </q-input>
                      </my-input-wrapper>
                      <my-input-wrapper class="col-span-2" label="材質" inputBorder>
                        <div class="flex flex-col grow">
                          <q-option-group inline :options="options5"></q-option-group>
                          <my-input-wrapper class="m-1" label="其它">
                            <q-input v-bind="QInputProps"></q-input>
                          </my-input-wrapper>
                        </div>
                      </my-input-wrapper>
                    </div>
                  </my-input-wrapper>
                </my-input-group>

                <div class="grid gap-2">
                  <my-input-group class="grid gap-2 grid-cols-2">
                    <my-input-wrapper label="腸造口" inputBorder>
                      <q-checkbox></q-checkbox>
                      <q-option-group inline :options="options2"></q-option-group>
                    </my-input-wrapper>
                    <my-input-wrapper label="胃造口" inputBorder>
                      <q-checkbox></q-checkbox>
                      <q-option-group inline :options="options2"></q-option-group>
                    </my-input-wrapper>
                    <my-input-wrapper label="膀胱造口" inputBorder>
                      <q-checkbox></q-checkbox>
                      <q-option-group inline :options="options2"></q-option-group>
                    </my-input-wrapper>
                    <my-input-wrapper label="壓瘡" inputBorder>
                      <q-checkbox></q-checkbox>
                      <q-option-group inline :options="options2"></q-option-group>
                    </my-input-wrapper>
                  </my-input-group>

                  <my-input-group class="grid gap-2">
                    <my-input-wrapper label="尿液檢查" inputBorder>
                      <div class="flex flex-nowrap items-center mr-1">
                        <q-checkbox></q-checkbox>
                        <q-option-group :options="options2"></q-option-group>
                      </div>
                      <div class="grid grid-cols-2 content-center m-1 gap-1">
                        <my-input-wrapper label="頻率">
                          <q-input v-bind="QInputProps">
                            <template #append> <div class="text-lg">天/次</div> </template>
                          </q-input>
                        </my-input-wrapper>
                        <my-input-wrapper label="項目">
                          <q-input v-bind="QInputProps"> </q-input>
                        </my-input-wrapper>
                      </div>
                    </my-input-wrapper>

                    <my-input-wrapper label="血液檢查" inputBorder>
                      <div class="flex flex-nowrap items-center mr-1">
                        <q-checkbox></q-checkbox>
                        <q-option-group :options="options2"></q-option-group>
                      </div>
                      <div class="grid grid-cols-2 content-center m-1 gap-1">
                        <my-input-wrapper label="頻率">
                          <q-input v-bind="QInputProps">
                            <template #append> <div class="text-lg">天/次</div> </template>
                          </q-input>
                        </my-input-wrapper>
                        <my-input-wrapper label="項目">
                          <q-input v-bind="QInputProps"> </q-input>
                        </my-input-wrapper>
                      </div>
                    </my-input-wrapper>

                    <my-input-wrapper label="膀胱灌洗" inputBorder>
                      <div class="flex items-center">
                        <q-checkbox></q-checkbox>
                        <q-option-group inline :options="options2"></q-option-group>
                        <my-input-wrapper class="m-1 mr-2" label="頻率">
                          <q-input v-bind="QInputProps">
                            <template #append> <div class="text-lg">天/次</div> </template>
                          </q-input>
                        </my-input-wrapper>
                      </div>
                    </my-input-wrapper>

                    <my-input-wrapper label="傷口照護" inputBorder>
                      <div class="flex items-center">
                        <q-checkbox></q-checkbox>
                        <q-option-group inline :options="options2"></q-option-group>
                        <my-input-wrapper class="m-1 mr-2" label="頻率">
                          <q-input v-bind="QInputProps">
                            <template #append> <div class="text-lg">天/次</div> </template>
                          </q-input>
                        </my-input-wrapper>
                      </div>
                    </my-input-wrapper>
                  </my-input-group>
                </div>
              </div>

              <my-input-wrapper label="其它處置">
                <q-input v-bind="QInputProps"></q-input>
              </my-input-wrapper>

              <MedicineTable
                ref="medicineTableRef"
                class="col-span-full"
                :columns="medicineColumns"
                preset
              ></MedicineTable>

              <my-input-wrapper label="其它">
                <q-input v-bind="QInputProps"></q-input>
              </my-input-wrapper>

              <div class="flex gap-2 p-1 justify-end">
                <my-input-wrapper label="醫師身分證號">
                  <q-input v-bind="QInputProps"></q-input>
                </my-input-wrapper>
                <my-input-wrapper label="醫師簽名">
                  <q-input v-bind="QInputProps"></q-input>
                </my-input-wrapper>
              </div>
            </div>
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
import IcdTable from 'components/opd/IcdTable.vue'
import DataHeader from 'components/DataHeader.vue'
import ProcedureTable from 'components/opd/ProcedureTable.vue'
import MedicineTable from 'components/opd/MedicineTable.vue'

// utils
import { QInputProps, QTableProps } from 'utils/quasar-extends/base-props.js'

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
  'ChronicNotes',
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
  { label: '男', value: '1' },
  { label: '女', value: '2' },
]
const options2 = [
  { label: 'Y', value: '1' },
  { label: 'N', value: '2' },
]
const options3 = [
  { label: '一般塑膠', value: '1' },
  { label: '矽質', value: '2' },
  { label: '其它', value: '2' },
]
const options4 = [
  { label: '居家照護醫囑單', value: '1' },
  { label: '居家照護紀錄單', value: '2' },
]
const options5 = [
  { label: '一般塑膠', value: '1' },
  { label: '矽質', value: '2' },
  { label: '鐵質', value: '2' },
  { label: '其它', value: '3' },
]
</script>
