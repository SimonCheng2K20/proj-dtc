import { defineStore } from 'pinia'
import mitt from 'mitt'
import {
  getPresetObjective,
  getPresetSubjective,
  getPresetMedication,
  getPresetProcedure,
  getPresetDiagnosis,
  getOperationMaterialPreset,
  getDepSpecialCurePresets,
  getPieceProcedurePreset,
  getIpdMedicationPresets,
  getDepPreset,
} from 'api'
import setSearchQuery from 'utils/setSearchQuery.js'

export const usePresetStore = defineStore('preset', {
  state: () => ({
    presetItems: {
      // Medication: [],
      // Diagnosis: [],
      // Procedure: [],
    },

    emitter: mitt(),
  }),
  actions: {
    async getPreset(key) {
      try {
        const query = setSearchQuery({
          $filter: `Shortcut ne null and Shortcut ne ''`,
        })

        switch (key) {
          case 'Objective': {
            const res = await getPresetObjective(query)
            this.setPresetItems(key, res.data.Items)
            break
          }
          case 'Subjective': {
            const res = await getPresetSubjective(query)
            this.setPresetItems(key, res.data.Items)
            break
          }
          case 'Medication': {
            const res = await getPresetMedication(query)
            this.setPresetItems(key, res.data.Items)
            break
          }
          case 'StayMedication': {
            const res = await getIpdMedicationPresets(query)
            this.setPresetItems(key, res.data.Items)
            break
          }
          case 'Diagnosis': {
            const res = await getPresetDiagnosis(query)
            this.setPresetItems(key, res.data.Items)
            break
          }
          case 'Procedure': {
            const res = await getPresetProcedure(query)
            this.setPresetItems(key, res.data.Items)
            break
          }
          case 'twdrg': {
            const res = await getPieceProcedurePreset(query)
            this.setPresetItems(key, res.data.Items)
            break
          }
          case 'Consumable': {
            const res = await getOperationMaterialPreset(query)
            this.setPresetItems(key, res.data.Items)
            break
          }
          case 'Chronic': {
            const res = await getDepSpecialCurePresets(query)
            this.setPresetItems(key, res.data.Items)
            break
          }
          case 'PublicDiagnosis': {
            const res = await getDepPreset(query)
            this.setPresetItems(key, res.data.Items)
            break
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    setPresetItems(key, data) {
      this.presetItems[key] = data
    },
    reset() {
      this.$reset()
    },
  },
})

