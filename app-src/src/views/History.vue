<script setup>
import { ref, computed, onMounted } from 'vue'
import AppShell from '@/components/AppShell.vue'
import SegmentedTabs from '@/components/SegmentedTabs.vue'
import Skeleton from '@/components/Skeleton.vue'
import EmptyState from '@/components/EmptyState.vue'
import { t } from '@/i18n'
import { api } from '@/api/client'
import { EP } from '@/api/endpoints'
import { ui } from '@/stores/ui'

const items = ref([])
const loading = ref(true)
const tab = ref('deposits')

const tabs = [
  { key: 'deposits', label: t('history.tabDeposits'), icon: 'bottle' },
  { key: 'rewards', label: t('history.tabRewards'), icon: 'star' },
]

function isNegative(it) {
  return it.class === 'bg-color-red' || String(it.quantita).trim().startsWith('-')
}

const filtered = computed(() =>
  items.value.filter((it) => (tab.value === 'rewards' ? isNegative(it) : !isNegative(it)))
)

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
  <AppShell :title="t('nav.history')">
    <SegmentedTabs v-model="tab" :tabs="tabs" class="mb-4" />

    <Skeleton v-if="loading" :rows="5" variant="list" />

    <Transition v-else name="tab" mode="out-in">
      <div v-if="filtered.length" :key="tab" class="card p-5">
        <ol class="relative ml-3 border-l-2 border-slate-100">
          <li v-for="(it, i) in filtered" :key="i" class="mb-6 ml-5 last:mb-0">
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

      <div v-else :key="`${tab}-empty`" class="card">
        <EmptyState
          :icon="tab === 'rewards' ? 'star' : 'bottle'"
          :subtitle="tab === 'rewards' ? t('history.noRewards') : t('home.noDeposits')"
        />
      </div>
    </Transition>
  </AppShell>
</template>

<style scoped>
.tab-enter-active,
.tab-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.tab-enter-from { opacity: 0; transform: translateY(8px); }
.tab-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
