<script setup>
import { ref, onMounted } from 'vue'
import AppShell from '@/components/AppShell.vue'
import Icon from '@/components/Icon.vue'
import EmptyState from '@/components/EmptyState.vue'
import { t } from '@/i18n'
import { api } from '@/api/client'
import { EP } from '@/api/endpoints'
import { ui } from '@/stores/ui'

const data = ref(null)
const loading = ref(true)

async function load() {
  loading.value = true
  try {
    const res = await api(EP.progetti, { action: 'index' })
    data.value = res?.data || {}
  } catch (e) {
    ui.error(e.message)
  } finally {
    loading.value = false
  }
}

async function leave() {
  const ok = await ui.confirm(t('projects.leaveConfirm'))
  if (!ok) return
  ui.setLoading(true)
  try {
    await api(EP.progettoRimuovi, { codice_progetto: data.value.adesione.codice_progetto })
    await load()
  } catch (e) {
    ui.error(e.message)
  } finally {
    ui.setLoading(false)
  }
}

onMounted(load)
</script>

<template>
  <AppShell :title="t('projects.title')" back>
    <div v-if="loading" class="card grid place-items-center py-12">
      <span class="h-8 w-8 animate-spin rounded-full border-[3px] border-brand-100 border-t-brand"></span>
    </div>

    <!-- Adesione corrente -->
    <template v-else-if="data && data.allow_adesione === false && data.adesione">
      <section class="overflow-hidden rounded-3xl bg-brand-gradient p-5 text-white shadow-card">
        <p class="text-xs uppercase tracking-wide text-white/70">{{ t('projects.myProject') }}</p>
        <h2 class="text-lg font-extrabold">{{ data.adesione.progetto }}</h2>
        <dl class="mt-3 space-y-1 text-sm text-white/90">
          <div class="flex justify-between"><dt>{{ t('projects.joinedOn') }}</dt><dd class="font-semibold">{{ data.adesione.data_adesione }}</dd></div>
          <div class="flex justify-between"><dt>{{ t('projects.forParticipant') }}</dt><dd class="font-semibold">{{ data.adesione.partecipante }}</dd></div>
          <div class="flex justify-between"><dt>{{ t('projects.class') }}</dt><dd class="font-semibold">{{ data.adesione.classe }}</dd></div>
          <div class="mt-2 flex items-center justify-between border-t border-white/20 pt-2">
            <dt>{{ t('projects.myPoints') }}</dt>
            <dd class="text-xl font-extrabold">{{ data.adesione.punti }}</dd>
          </div>
        </dl>
      </section>

      <h3 class="mb-2 mt-6 px-1 text-sm font-bold text-ink">{{ t('projects.ranking') }}</h3>
      <section class="card overflow-hidden">
        <ul v-if="data.classifica?.length" class="divide-y divide-slate-100">
          <li v-for="(c, i) in data.classifica" :key="i" class="flex items-center gap-3 px-4 py-3">
            <span class="grid h-7 w-7 place-items-center rounded-full text-xs font-bold"
                  :class="i === 0 ? 'bg-amber-100 text-amber-600' : 'bg-brand-50 text-brand'">{{ i + 1 }}</span>
            <span class="flex-1 truncate text-sm font-medium text-ink">{{ c.nome }}</span>
            <span class="text-sm font-bold text-accent-600">{{ c.qta }}</span>
          </li>
        </ul>
        <EmptyState v-else icon="trophy" :subtitle="t('home.noRanking')" />
      </section>

      <button class="btn-danger btn-block mt-6" @click="leave">
        <Icon name="trash" :size="18" /> {{ t('projects.leave') }}
      </button>
    </template>

    <!-- Elenco progetti -->
    <template v-else-if="data && data.progetti?.length">
      <article v-for="p in data.progetti" :key="p.id" class="card mb-4 overflow-hidden">
        <div class="bg-brand-soft px-5 py-4">
          <h2 class="font-extrabold text-ink">{{ p.nome }}</h2>
          <p class="mt-0.5 flex items-center gap-1 text-xs text-muted">
            <Icon name="calendar" :size="14" />
            {{ t('projects.activeFrom') }} {{ p.data_attivazione }} {{ t('projects.to') }} {{ p.data_chiusura }}
          </p>
        </div>
        <div class="space-y-3 px-5 py-4">
          <div v-if="p.descrizione" class="prose-mini text-sm text-ink" v-html="p.descrizione"></div>
          <template v-if="p.istruzioni">
            <p class="text-xs font-bold uppercase tracking-wide text-muted">{{ t('projects.instructions') }}</p>
            <div class="prose-mini text-sm text-ink" v-html="p.istruzioni"></div>
          </template>
          <RouterLink :to="{ name: 'project', params: { codice: p.codice_progetto } }" class="btn-primary btn-block">
            {{ t('projects.join') }}
          </RouterLink>
        </div>
      </article>
    </template>

    <div v-else class="card">
      <EmptyState icon="leaf" :subtitle="t('projects.empty')" />
    </div>
  </AppShell>
</template>

<style scoped>
.prose-mini :deep(a) { color: #0090c9; font-weight: 600; }
.prose-mini :deep(p) { margin: 0 0 0.4rem; }
.prose-mini :deep(ul) { list-style: disc; padding-left: 1.1rem; }
</style>
