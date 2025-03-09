import DtxInputGroup from 'components/DtxInputGroup.vue'
import Button from 'primevue/button'
import PrimeVueDialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import Paginator from 'primevue/paginator'
import InputText from 'primevue/inputtext'
import vDataTable from 'components/v-data-table.vue'
import MyInputGroup from 'components/MyInputGroup.vue'
import MySearchArea from 'components/MySearchArea.vue'
import MyTitle from 'components/MyTitle.vue'
import MyInputWrapper from 'components/MyInputWrapper.vue'
import MyPagination from 'components/MyPagination.vue'
import MyDialogContent from 'components/MyDialogContent.vue'
import MyDateInput from 'components/MyDateInput.vue'
import MyElasticWrapper from 'components/MyElasticWrapper.js'
import MyAside from 'components/MyAside.vue'
import MyFilterSelect from 'components/MyFilterSelect.vue'

export default ({ app }) => {
  // we globally register our component in the app
  app.component('v-data-table', vDataTable)
  app.component('my-input-group', MyInputGroup)
  app.component('my-search-area', MySearchArea)
  app.component('my-date-input', MyDateInput)
  app.component('my-title', MyTitle)
  app.component('my-input-wrapper', MyInputWrapper)
  app.component('my-pagination', MyPagination)
  app.component('my-dialog-content', MyDialogContent)
  app.component('my-elastic-wrapper', MyElasticWrapper)
  app.component('my-aside', MyAside)
  app.component('my-filter-select', MyFilterSelect)

  app.component('Button', Button)
  app.component('Dialog', PrimeVueDialog)
  app.component('Dropdown', Dropdown)
  app.component('Paginator', Paginator)
  app.component('InputText', InputText)

  // DTC Custom UI components
  app.component('DtxInputGroup', DtxInputGroup)
}

