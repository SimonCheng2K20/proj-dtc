<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss>
    <my-dialog-content header="當日已掛號名單" @close="onDialogCancel">
      <div class="flex justify-between text-xl font-bold">
        <div>{{ bookingData.RoomDepartmentName }}</div>
        <div>{{ bookingData.PersonName }}</div>
        <div>{{ bookingData.RoomName }}</div>
      </div>

      <q-table
        class="mt-2"
        v-bind="QTableProps"
        :rows="rows"
        :columns="columns"
        :pagination="{ rowsPerPage: -1 }"
        :loading="tableLoading"
      >
      </q-table>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { getRoomBooking } from 'api'
import setSearchQuery from 'utils/setSearchQuery'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { QTableProps } from 'utils/quasar-extends/base-props.js'
import dayjs from 'dayjs'
import { ref, computed } from 'vue'
import { useDialogPluginComponent } from 'quasar'

const { dialogRef, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  bookingData: Object,
})

const columns = [
  { name: 'Seq', label: '號次', field: 'Seq', align: 'left' },
  { name: 'PatientName', label: '姓名', field: (row) => row.Patient.Person.Name, align: 'left' },
]

const tableLoading = ref(false)
const rows = ref([])
const GetRoomBooking = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $filter: filter.value,
    })
    const res = await getRoomBooking(query)
    if (res.status === 200) {
      rows.value = res.data.Items
    }
  } catch (err) {
    console.log(err)
  } finally {
    tableLoading.value = false
  }
}

const filter = computed(() => {
  const str = Object.entries(props.bookingData)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'AsignDate':
            const arr = [
              setOdataFilter({ key: 'BookingDate', value: encodeURIComponent(dayjs(value).format()), operator: 'ge' }),
              setOdataFilter({
                key: 'BookingDate',
                value: encodeURIComponent(dayjs(value).add(1, 'day').format()),
                operator: 'lt',
              }),
            ]
            return filterArray.concat(`(${arr.join(' and ')})`)
          case 'PersonId':
          case 'TimeSlotNo':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'eq' }))
          default:
            return filterArray
        }
      } else {
        return filterArray
      }
    }, [])
    .join(' and ')

  return str
})

const init = () => {
  console.log(props.bookingData)

  GetRoomBooking()
}
init()
</script>

