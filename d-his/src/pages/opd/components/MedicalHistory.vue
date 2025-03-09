<template>
  <q-card flat square bordered>
    <q-card-section class="my-card-title flex items-center gap-2">
      <q-checkbox v-if="props.isDitto" v-model="dittoSelected" val="Subjective" @click="emit('update:modelValue',dittoSelected)" dense :disable="!!props.selectedItem === false"></q-checkbox>
      S 病患主訴
    </q-card-section>
    <q-card-section>{{ props.opdData.Subjective }}</q-card-section>
  </q-card>

  <q-card flat square bordered>
    <q-card-section class="my-card-title flex items-center gap-2">
      <q-checkbox v-if="props.isDitto" v-model="dittoSelected" val="Objective" @click="emit('update:modelValue',dittoSelected)" dense :disable="!!props.selectedItem === false"></q-checkbox>
      O 病患客觀
    </q-card-section>
    <q-card-section>{{ props.opdData.Objective }}</q-card-section>
  </q-card>
  <slot></slot>

  <q-card flat square bordered>
    <q-card-section class="my-card-title flex items-center gap-2">
      <q-checkbox v-if="props.isDitto" v-model="dittoSelected" val="OpdPlan" @click="emit('update:modelValue',dittoSelected)" dense :disable="!!props.selectedItem === false"></q-checkbox>
      P 診療計畫
    </q-card-section>
    <q-card-section>{{ props.opdData.OpdPlan }}</q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'
import { update } from 'lodash-es'
import { QInputProps, QSelectProps, QTableProps } from 'utils/quasar-extends/base-props.js'


const props = defineProps({
  isDitto:Boolean,
  selectedItem:Boolean,
  opdData:{
    type:Object,
    difault:()=>{}
  },
  modelValue:Array,
})

const emit = defineEmits(['update:modelValue'])

const dittoSelected = ref([])
</script>
