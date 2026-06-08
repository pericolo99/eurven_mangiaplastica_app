<script setup>
import { ref } from 'vue'
import AppShell from '@/components/AppShell.vue'
import StatCard from '@/components/StatCard.vue'
import SegmentedTabs from '@/components/SegmentedTabs.vue'
import CountUp from '@/components/CountUp.vue'
import PullToRefresh from '@/components/PullToRefresh.vue'
import Icon from '@/components/Icon.vue'
import EmptyState from '@/components/EmptyState.vue'
import { t } from '@/i18n'
import { session } from '@/stores/session'
import { api } from '@/api/client'
import { EP } from '@/api/endpoints'
import { ui } from '@/stores/ui'

const refreshing = ref(false)
const tab = ref('impact')

const tabs = [
  { key: 'impact', label: t('home.tabImpact'), icon: 'recycle' },
  { key: 'activity', label: t('home.tabActivity'), icon: 'bottle' },
  { key: 'ranking', label: t('home.tabRanking'), icon: 'trophy' },
]

async function refresh() {
  refreshing.value = true
  try {
    await api(EP.loginToken, {})
  } catch (e) {
    ui.error(e.message)
  } finally {
    refreshing.value = false
  }
}
</script>

<template>
  <AppShell :title="t('appName')">
    <PullToRefresh :on-refresh="refresh">
      <!-- Hero punti (sempre visibile) -->
      <section class="overflow-hidden rounded-3xl bg-brand-gradient p-5 text-white shadow-card animate-fade-up">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm text-white/80">{{ t('home.hi') }},</p>
            <p class="text-lg font-bold leading-tight">{{ session.user?.nome }}</p>
          </div>
          <button
            class="grid h-10 w-10 place-items-center rounded-full bg-white/15 transition active:scale-90"
            :class="{ 'animate-spin': refreshing }"
            @click="refresh"
            aria-label="refresh"
          >
            <Icon name="refresh" :size="20" />
          </button>
        </div>

        <div class="mt-4 flex items-end justify-between">
          <div>
            <p class="text-xs uppercase tracking-wide text-white/70">{{ t('home.yourPoints') }}</p>
            <p class="text-5xl font-extrabold leading-none">
              <CountUp :value="session.punti ?? 0" />
            </p>
          </div>
          <div class="text-right">
            <p class="text-xs text-white/70">{{ t('home.bottles') }}</p>
            <p class="flex items-center justify-end gap-1 text-2xl font-bold">
              <Icon name="bottle" :size="20" /> <CountUp :value="session.conferimenti ?? 0" />
            </p>
          </div>
        </div>
      </section>

      <!-- Azioni rapide -->
      <section class="mt-4 grid gap-3" :class="session.progetti ? 'grid-cols-2' : 'grid-cols-1'">
        <RouterLink :to="{ name: 'machines' }" class="card flex items-center gap-3 p-4 active:scale-[0.98]">
          <span class="grid h-11 w-11 place-items-center rounded-2xl bg-accent-50 text-accent-600"><Icon name="pin" :size="22" /></span>
          <span class="text-sm font-bold leading-tight text-ink">{{ t('home.where') }}</span>
        </RouterLink>
        <RouterLink v-if="session.progetti" :to="{ name: 'projects' }" class="card flex items-center gap-3 p-4 active:scale-[0.98]">
          <span class="grid h-11 w-11 place-items-center rounded-2xl bg-eco-500/10 text-eco-600"><Icon name="leaf" :size="22" /></span>
          <span class="text-sm font-bold leading-tight text-ink">{{ t('home.schoolProjects') }}</span>
        </RouterLink>
      </section>

      <!-- Toolbar segmentata -->
      <SegmentedTabs v-model="tab" :tabs="tabs" class="mt-5" />

      <!-- Contenuto della tab -->
      <div class="mt-4">
        <Transition name="tab" mode="out-in">
          <!-- Impatto -->
          <section v-if="tab === 'impact'" key="impact" class="grid grid-cols-3 gap-3">
            <StatCard icon="bottle" tone="brand" animate :decimals="0" :value="session.elaborazioni?.bottiglie ?? 0" :label="t('home.bottlesCollected')" />
            <StatCard icon="recycle" tone="accent" animate :decimals="1" :value="session.elaborazioni?.pet ?? 0" :label="t('home.petRecycled')" />
            <StatCard icon="cloud" tone="eco" animate :decimals="2" :value="session.elaborazioni?.co ?? 0" :label="t('home.co2Saved')" />
          </section>

          <!-- Attività -->
          <section v-else-if="tab === 'activity'" key="activity">
            <div class="mb-2 flex items-center justify-between px-1">
              <h2 class="text-sm font-bold text-ink">{{ t('home.lastDeposits') }}</h2>
              <RouterLink :to="{ name: 'history' }" class="text-xs font-semibold text-accent-600">{{ t('common.details') }}</RouterLink>
            </div>
            <div class="card overflow-hidden">
              <ul v-if="session.ultimi?.length" class="divide-y divide-slate-100">
                <li v-for="(d, i) in session.ultimi" :key="i" class="flex items-center gap-3 px-4 py-3">
                  <span class="grid h-9 w-9 place-items-center rounded-xl bg-accent-50 text-accent-600"><Icon name="bottle" :size="18" /></span>
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-semibold text-ink">{{ d.macchina_desc }}</p>
                    <p class="text-xs text-muted">{{ d.data_conferimento }}</p>
                  </div>
                  <span class="chip bg-eco-500/10 text-eco-600">+{{ d.quantita }}</span>
                </li>
              </ul>
              <EmptyState v-else icon="bottle" :subtitle="t('home.noDeposits')" />
            </div>
          </section>

          <!-- Classifica -->
          <section v-else key="ranking">
            <div class="card overflow-hidden">
              <ul v-if="session.classifica?.length" class="divide-y divide-slate-100">
                <li v-for="(r, i) in session.classifica" :key="i" class="flex items-center gap-3 px-4 py-3">
                  <span
                    class="grid h-7 w-7 place-items-center rounded-full text-xs font-bold"
                    :class="i === 0 ? 'bg-amber-100 text-amber-600' : 'bg-brand-50 text-brand'"
                  >{{ i + 1 }}</span>
                  <span class="flex-1 truncate text-sm font-medium text-ink">{{ r.nominativo }}</span>
                  <span class="text-sm font-bold text-accent-600">{{ r.punti }}</span>
                </li>
              </ul>
              <EmptyState v-else icon="trophy" :subtitle="t('home.noRanking')" />
            </div>
          </section>
        </Transition>
      </div>
    </PullToRefresh>
  </AppShell>
</template>

<style scoped>
.tab-enter-active,
.tab-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.tab-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.tab-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
