<template>
  <q-layout view="hHh Lpr fFf">
    <my-header></my-header>

    <q-drawer v-model="leftDrawer" id="left-aside" side="left" :width="drawerWidth" :bordered="drawerBorder"></q-drawer>

    <my-aside v-if="isHaveAside" width="240">
      <aside class="min-h-full bg-[#3399e2]">
        <div class="font-bold text-xl p-2 text-white">
          {{ route.meta.asideTitle }}
        </div>
        <q-list class="text-white">
          <q-item
            active-class="text-default bg-amber-1"
            v-for="(item, index) in route.meta.asideList"
            :key="index"
            :to="item.to"
          >
            <q-item-section>
              <q-item-label>
                {{ item.text }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </aside>
    </my-aside>

    <q-page-container>
      <router-view />
    </q-page-container>

    <my-footer v-if="route.name === 'Login'"></my-footer>
  </q-layout>
</template>

<script setup>
import { provide, ref, nextTick, computed, onMounted } from 'vue'
import MyHeader from './components/MyHeader.vue'
import MyFooter from './components/MyFooter.vue'
import mitt from 'mitt'
import { useRoute } from 'vue-router'
import MyAside from 'components/MyAside.vue'

const isLayoutMouted = ref(false)
onMounted(() => {
  isLayoutMouted.value = true

  const observer = new MutationObserver(async (mutationList) => {
    for (const mutation of mutationList) {
      if (mutation.type === 'childList') {
        await nextTick()

        if (mutation.target.children.length > 0) {
          leftDrawer.value = true
        } else {
          leftDrawer.value = false
        }
      }
    }
  })

  const targetNode = document.querySelector('#left-aside')

  observer.observe(targetNode, { childList: true })
})
provide('isLayoutMouted', isLayoutMouted)

const route = useRoute()
const isHaveAside = computed(() => !!route.meta.asideTitle && !!route.meta.asideList)

const leftDrawer = ref(isHaveAside.value)

const drawerWidth = ref(240)
provide('leftDrawerWidth', drawerWidth)

const drawerBorder = ref(true)
provide('leftDrawerBorder', drawerBorder)

const emitter = mitt()
provide('layoutEmitter', emitter)
</script>

