<script setup>
import { ref, onMounted } from 'vue'
import AppShell from '@/components/AppShell.vue'
import Icon from '@/components/Icon.vue'
import EmptyState from '@/components/EmptyState.vue'
import { t } from '@/i18n'
import { api } from '@/api/client'
import { EP } from '@/api/endpoints'
import { ui } from '@/stores/ui'

const items = ref([])
const loading = ref(true)

function isNegative(it) {
  return it.class === 'bg-color-red' || String(it.quantita).trim().startsWith('-')
}

onMounted(async () => {
  try {
    const res = await api(EP.storico, {})
    items.value = res?.data?.storico || []
  } catch (e) {
    ui.error(e.message)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <AppShell :title="t('nav.history')" back>
    <div v-if="loading" class="card grid place-items-center py-12">
      <span class="h-8 w-8 animate-spin rounded-full border-[3px] border-brand-100 border-t-brand"></span>
    </div>

    <div v-else-if="items.length" class="card p-5">
      <ol class="relative ml-3 border-l-2 border-slate-100">
        <li v-for="(it, i) in items" :key="i" class="mb-6 ml-5 last:mb-0">
          <span
            class="absolute -left-[9px] grid h-4 w-4 place-items-center rounded-full ring-4 ring-white"
            :class="isNegative(it) ? 'bg-red-500' : 'bg-accent'"
          ></span>
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="truncate text-sm font-bold text-ink">{{ it.descrizione }}</p>
              <p class="text-xs text-muted">{{ it.data }}</p>
            </div>
            <span
              class="chip shrink-0"
              :class="isNegative(it) ? 'bg-red-50 text-red-500' : 'bg-eco-500/10 text-eco-600'"
            >
              {{ isNegative(it) ? '' : '+' }}{{ it.quantita }}
            </span>
          </div>
        </li>
      </ol>
    </div>

    <div v-else class="card">
      <EmptyState icon="bottle" :subtitle="t('home.noDeposits')" />
    </div>
  </AppShell>
</template>
