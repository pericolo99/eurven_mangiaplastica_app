<script setup>
import { ref } from 'vue'
import TopBar from './TopBar.vue'
import BottomNav from './BottomNav.vue'
import Drawer from './Drawer.vue'

defineProps({
  title: { type: String, default: '' },
  back: { type: Boolean, default: false },
  nav: { type: Boolean, default: true }, // mostra bottom nav
  menu: { type: Boolean, default: true },
})

const drawer = ref(false)
</script>

<template>
  <div class="flex min-h-full flex-col">
    <TopBar :title="title" :back="back" :menu="menu" @menu="drawer = true" />

    <main
      class="mx-auto w-full max-w-md flex-1 px-4 pt-4"
      :class="nav ? 'pb-28' : 'pb-8'"
    >
      <slot />
    </main>

    <BottomNav v-if="nav" />
    <Drawer :open="drawer" @close="drawer = false" />
  </div>
</template>
