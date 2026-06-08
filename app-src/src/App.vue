<script setup>
import { RouterView } from 'vue-router'
import GlobalOverlay from '@/components/GlobalOverlay.vue'
</script>

<template>
  <RouterView v-slot="{ Component }">
    <Transition name="page" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
  <GlobalOverlay />
</template>
