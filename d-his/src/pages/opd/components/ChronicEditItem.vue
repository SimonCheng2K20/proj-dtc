<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss>
    <my-dialog-content header="慢性病特療" @close="onDialogCancel">
      <my-input-group class="grid gap-2">
        <my-input-wrapper v-for="(_, index) in opdChronics" :label="`特療碼${index + 1}`" :key="index">
          <q-select
            v-bind="QSelectProps"
            v-model="opdChronics[index]"
            :options="chronicItems"
            :option-label="optionLabel"
            use-input
            lazy-rules
            @input-value="filterLoading = true"
            @filter="onChronicFilter"
          >
            <template #no-option="{ inputValue }">
              <q-item v-if="!!inputValue">
                <q-item-section class="text-grey">
                  <q-spinner v-if="filterLoading" color="primary"></q-spinner>
                  <span v-else>找不到符合的資料</span>
                </q-item-section>
              </q-item>
            </template>
            <template #option="scope">
              <q-item
                clickable
                :disable="
                  opdChronics.find((item) =>
                    item ? scope.opt.ChronicItems.map((item) => item.Code).includes(item.Code) : false
                  )
                "
              >
                <q-item-section>
                  <q-item-label class="flex justify-between">
                    <div
                      v-html="
                        scope.opt.filterLabel ||
                        chronicFilterKeys
                          .filter((item) => item !== 'Code')
                          .map((key) => scope.opt[key])
                          .join(' - ')
                      "
                    ></div>
                    <q-icon name="chevron_right"></q-icon>
                  </q-item-label>
                </q-item-section>

                <q-popup-proxy
                  :ref="(el) => (popupProxyRefs[scope.opt.Category] = el)"
                  max-width="300px"
                  anchor="top right"
                  self="top left"
                >
                  <q-list>
                    <q-item
                      v-for="(childItem, childIndex) in scope.opt.ChronicItems"
                      :key="childIndex"
                      clickable
                      @click="scope.toggleOption({ ...childItem, CodeName: childItem.Name })"
                    >
                      <q-item-section>
                        <q-item-label>
                          <div
                            v-html="
                              childItem.filterLabel ||
                              chronicFilterKeys
                                .filter((item) => item !== 'Category')
                                .map((key) => childItem[key])
                                .join(' - ')
                            "
                          ></div>
                        </q-item-label>
                        <q-item-label
                          v-if="opdChronics.find((item) => (item ? item.Code === childItem.Code : false))"
                          class="text-negative"
                        >
                          此 慢性病 已存在
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-popup-proxy>
              </q-item>
            </template>
          </q-select>
        </my-input-wrapper>
      </my-input-group>

      <template #actions>
        <q-btn unelevated color="primary" label="確定" @click="onDialogOK(opdChronics)" />
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useOpdStore } from 'stores/opd.js'
import { getChronic } from 'api'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { cloneDeep } from 'lodash-es'
import { QSelectProps } from 'utils/quasar-extends/base-props.js'

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const $q = useQuasar()

const popupProxyRefs = reactive({})
const opdStore = useOpdStore()

const props = defineProps({
  chronicDropdown: Array,
})

const opdChronics = reactive(Array.from(new Array(4)).map(() => null))

const optionLabel = (opt) => {
  if (opt) {
    for (let i = 0; i < chronicItems.value.length; i++) {
      const chronicParent = chronicItems.value[i]
      for (let j = 0; j < chronicParent.ChronicItems.length; j++) {
        const chronicItem = chronicParent.ChronicItems[j]
        if (chronicItem.Code === opt.Code) {
          return chronicItem.Name
        }
      }
    }

    return opt.Code || opt
  }

  return opt
}

const chronicFilterKeys = ['Category', 'Code', 'Name']
const onChronicFilter = (val, update) => {
  if (val === '') {
    update(() => {
      chronicFilterItems.value = chronicItems.value
      filterLoading.value = false
    })
    return
  }

  update(async () => {
    chronicFilterItems.value = chronicItems.value
      .map((item) => {
        return item.ChronicItems.filter(() => {
          for (const key of filterKeys) {
            if (item[key].toLocaleUpperCase().includes(val.toLocaleUpperCase())) return true
          }

          return false
        }).map(() => {
          const regex = new RegExp(val, 'gi')

          const filterStrings = filterKeys.map((key) =>
            replace(item[key], regex, (match) => {
              return '<span class="bg-amber-300">' + match + '</span>'
            })
          )

          return { ...item, filterLabel: filterStrings.filter((item) => item !== 'Category').join(' - ') }
        })
      })
      .filter((item) => {
        for (const key of filterKeys) {
          if (item[key].toLocaleUpperCase().includes(val.toLocaleUpperCase())) return true
        }

        return false
      })
      .map((item) => {
        const regex = new RegExp(val, 'gi')

        const filterStrings = filterKeys.map((key) =>
          replace(item[key], regex, (match) => {
            return '<span class="bg-amber-300">' + match + '</span>'
          })
        )

        return { ...item, filterLabel: filterStrings.filter((item) => item !== 'Code').join(' - ') }
      })

    filterLoading.value = false
  })
}

const filterLoading = ref(false)
const chronicItems = ref([])
const chronicFilterItems = ref([])
const GetChronic = async () => {
  try {
    const res = await getChronic()
    if (res.status === 200) {
      chronicItems.value = res.data.Items
      chronicFilterItems.value = res.data.Items
    }
  } catch (err) {
    console.log(err)
  }
}

const init = async () => {
  GetChronic()

  const length = opdStore.opdData.OpdChronics.length
  for (let i = 0; i < length; i++) {
    opdChronics[i] = cloneDeep(opdStore.opdData.OpdChronics[i])
  }
}
init()
</script>

