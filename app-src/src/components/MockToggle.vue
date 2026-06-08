<script setup>
// Pannello di sviluppo: visibile SOLO in modalita' mock (npm run dev:mock).
// Permette di simulare comuni con/senza progetti scuola attivi.
import { ref } from 'vue'
import Icon from './Icon.vue'
import { session } from '@/stores/session'
import { api } from '@/api/client'
import { EP } from '@/api/endpoints'

const open = ref(false)
const progetti = ref((localStorage.getItem('mock_progetti') ?? 'true') === 'true')

async function setProgetti(value) {
  progetti.value = value
  localStorage.setItem('mock_progetti', String(value))
  // Ricarica i dati di sessione cosi' la Home riflette il nuovo stato
  if (session.token) {
    try {
      await api(EP.loginToken, {})
    } catch (e) {
      /* ignore */
    }
  }
}
</script>

<template>
  <div class="fixed left-3 z-[60]" :style="{ bottom: 'calc(var(--safe-bottom) + 6rem)' }">
    <!-- Pannello -->
    <Transition name="mt">
      <div v-if="open" class="mb-2 w-56 rounded-2xl bg-ink p-3 text-white shadow-card">
        <p class="mb-2 flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-wide text-white/60">
          <Icon name="info" :size="13" /> Mock dev
        </p>
        <p class="mb-2 text-xs text-white/80">Progetti scuola</p>
        <div class="flex gap-2">
          <button
            class="flex-1 rounded-xl px-3 py-1.5 text-xs font-bold transition"
            :class="progetti ? 'bg-eco-500 text-white' : 'bg-white/10 text-white/60'"
            @click="setProgetti(true)"
          >Attivi</button>
          <button
            class="flex-1 rounded-xl px-3 py-1.5 text-xs font-bold transition"
            :class="!progetti ? 'bg-red-500 text-white' : 'bg-white/10 text-white/60'"
            @click="setProgetti(false)"
          >Non attivi</button>
        </div>
      </div>
    </Transition>

    <!-- Pulsante flottante -->
    <button
      class="grid h-11 w-11 place-items-center rounded-full bg-ink text-white shadow-card transition active:scale-90"
      @click="open = !open"
      aria-label="mock dev"
    >
      <Icon name="scan" :size="20" />
    </button>
  </div>
</template>

<style scoped>
.mt-enter-active,
.mt-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.mt-enter-from,
.mt-leave-to { opacity: 0; transform: translateY(8px); }
</style>
