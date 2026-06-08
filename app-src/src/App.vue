<script setup>
import { defineAsyncComponent } from 'vue'
import { RouterView } from 'vue-router'
import GlobalOverlay from '@/components/GlobalOverlay.vue'

// Toggle di sviluppo: solo in modalita' mock; assente nel build di produzione.
const isMock = import.meta.env.DEV && import.meta.env.VITE_MOCK === '1'
const MockToggle = isMock ? defineAsyncComponent(() => import('@/components/MockToggle.vue')) : null
</script>

<template>
  <RouterView v-slot="{ Component }">
    <Transition name="page" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
  <GlobalOverlay />
  <component :is="MockToggle" v-if="isMock" />
</template>
