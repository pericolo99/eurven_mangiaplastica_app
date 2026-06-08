<script setup>
import { useRoute } from 'vue-router'
import Icon from './Icon.vue'
import { t } from '@/i18n'

const route = useRoute()
const isActive = (name) => route.name === name

const left = [
  { name: 'home', to: { name: 'home' }, icon: 'home', label: 'nav.home' },
  { name: 'machines', to: { name: 'machines' }, icon: 'pin', label: 'nav.machines' },
]
const right = [
  { name: 'cards', to: { name: 'cards' }, icon: 'card', label: 'nav.cards' },
  { name: 'profile', to: { name: 'profile' }, icon: 'user', label: 'nav.profile' },
]
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-40 border-t border-slate-100 bg-white/95 backdrop-blur"
    :style="{ paddingBottom: 'var(--safe-bottom)' }"
  >
    <div class="relative mx-auto grid max-w-md grid-cols-5 items-end px-2 pt-2">
      <RouterLink
        v-for="it in left"
        :key="it.name"
        :to="it.to"
        class="flex flex-col items-center gap-1 py-2 text-[0.65rem] font-semibold transition"
        :class="isActive(it.name) ? 'text-brand' : 'text-slate-400'"
      >
        <Icon :name="it.icon" :size="23" :stroke="isActive(it.name) ? 2.4 : 2" />
        <span>{{ t(it.label) }}</span>
      </RouterLink>

      <!-- Pulsante centrale: codice personale -->
      <div class="flex justify-center">
        <RouterLink
          :to="{ name: 'code' }"
          class="-mt-7 grid h-16 w-16 place-items-center rounded-full bg-brand-gradient text-white shadow-glow ring-4 ring-white transition active:scale-95"
        >
          <Icon name="qr" :size="28" />
        </RouterLink>
      </div>

      <RouterLink
        v-for="it in right"
        :key="it.name"
        :to="it.to"
        class="flex flex-col items-center gap-1 py-2 text-[0.65rem] font-semibold transition"
        :class="isActive(it.name) ? 'text-brand' : 'text-slate-400'"
      >
        <Icon :name="it.icon" :size="23" :stroke="isActive(it.name) ? 2.4 : 2" />
        <span>{{ t(it.label) }}</span>
      </RouterLink>
    </div>
  </nav>
</template>
