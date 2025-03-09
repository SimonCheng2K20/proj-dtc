import Options from 'comps/options.vue'
import TextArea from 'comps/textarea.vue'
import CheckboxButton from 'comps/checkboxButton.vue'
import minusIcon from 'comps/minusIcon.vue'
import plusIcon from 'comps/plusIcon.vue'
import tailwindBtn from 'comps/tailwindBtn.vue'
import VueCountdown from '@chenfengyuan/vue-countdown'
import MyInputWrapper from 'comps/MyInputWrapper.vue'
import MyInputGroup from 'comps/MyInputGroup.vue'
import MyTable from 'comps/MyTable.js'
import MySearchArea from 'comps/MySearchArea.vue'

export default (app) => {
  app.component('InputOptions', Options)
  app.component('TextArea', TextArea)
  app.component('CheckboxButton', CheckboxButton)
  app.component('minusIcon', minusIcon)
  app.component('plusIcon', plusIcon)
  app.component('tailwindBtn', tailwindBtn)
  app.component(VueCountdown.name, VueCountdown)
  app.component('my-input-wrapper', MyInputWrapper)
  app.component('my-input-group', MyInputGroup)
  app.component('my-table', MyTable)
  app.component('my-search-area', MySearchArea)

  return app
}
