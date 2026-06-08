<script setup>
import { ref, onMounted } from 'vue'
import AppShell from '@/components/AppShell.vue'
import SegmentedTabs from '@/components/SegmentedTabs.vue'
import Icon from '@/components/Icon.vue'
import EmptyState from '@/components/EmptyState.vue'
import { t } from '@/i18n'
import { session } from '@/stores/session'
import { api } from '@/api/client'
import { EP } from '@/api/endpoints'
import { ui } from '@/stores/ui'
import { scanBarcode } from '@/native'

const tab = ref('mine')
const codice = ref('')
const tipo = ref('')

const tabs = [
  { key: 'mine', label: t('cards.tabMine'), icon: 'card' },
  { key: 'add', label: t('cards.tabAdd'), icon: 'plus' },
]

onMounted(async () => {
  try {
    await api(EP.elencoTessere, {})
  } catch (e) {
    /* non bloccante */
  }
})

async function scan() {
  const v = await scanBarcode(t('cards.codePh'))
  if (v) codice.value = v
}

async function save() {
  if (!codice.value) return ui.error(t('cards.codeError'))
  if (!tipo.value) return ui.error(t('cards.typeError'))
  ui.setLoading(true)
  try {
    await api(EP.registraTessera, { codice_tessera: codice.value, tipo_tessera: tipo.value })
    ui.success(t('common.save'))
    codice.value = ''
    tipo.value = ''
    tab.value = 'mine'
  } catch (e) {
    ui.error(e.message)
  } finally {
    ui.setLoading(false)
  }
}

async function remove(card) {
  const ok = await ui.confirm(t('cards.deleteConfirm'))
  if (!ok) return
  ui.setLoading(true)
  try {
    await api(EP.eliminaTessera, { codice_tessera: card.codice_tessera })
  } catch (e) {
    ui.error(e.message)
  } finally {
    ui.setLoading(false)
  }
}
</script>

<template>
  <AppShell :title="t('cards.title')">
    <SegmentedTabs v-model="tab" :tabs="tabs" class="mb-4" />

    <Transition name="tab" mode="out-in">
      <!-- Le mie tessere -->
      <div v-if="tab === 'mine'" key="mine">
        <ul v-if="session.tessere?.length" class="space-y-3">
          <li v-for="(c, i) in session.tessere" :key="i" class="card flex items-center gap-3 p-4">
            <span class="grid h-12 w-12 place-items-center rounded-2xl bg-brand-gradient text-white">
              <Icon name="card" :size="24" />
            </span>
            <div class="min-w-0 flex-1">
              <p class="truncate font-bold text-ink">{{ c.tipo_tessera }}</p>
              <p class="truncate text-sm text-muted">{{ c.codice_tessera }}</p>
            </div>
            <span v-if="c.numero_conferimenti" class="chip bg-eco-500/10 text-eco-600">{{ c.numero_conferimenti }}</span>
            <button class="grid h-9 w-9 place-items-center rounded-xl bg-red-50 text-red-500 active:scale-90" @click="remove(c)">
              <Icon name="trash" :size="18" />
            </button>
          </li>
        </ul>

        <div v-else class="card">
          <EmptyState icon="card" :title="t('cards.empty')" :subtitle="t('cards.addCta')">
            <button class="btn-primary mt-2" @click="tab = 'add'">
              <Icon name="plus" :size="18" /> {{ t('cards.add') }}
            </button>
          </EmptyState>
        </div>
      </div>

      <!-- Aggiungi tessera -->
      <div v-else key="add">
        <div class="card p-5">
          <p class="mb-4 text-sm text-muted">{{ t('cards.info1') }}</p>

          <label class="field-label">{{ t('cards.codeLabel') }}</label>
          <div class="relative mb-4">
            <input v-model="codice" class="field pr-12" :placeholder="t('cards.codePh')" />
            <button class="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-xl bg-brand-50 text-brand" @click="scan">
              <Icon name="camera" :size="18" />
            </button>
          </div>

          <label class="field-label">{{ t('cards.type') }}</label>
          <select v-model="tipo" class="field mb-5">
            <option value="">{{ t('cards.selectType') }}</option>
            <option v-for="ti in session.elencoTessere" :key="ti.id || ti.nome" :value="ti.nome">{{ ti.nome }}</option>
          </select>

          <button class="btn-primary btn-block" @click="save">{{ t('common.add') }}</button>
        </div>

        <div class="mt-4 flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-700">
          <Icon name="info" :size="20" class="mt-0.5 shrink-0" />
          <p><b>{{ t('cards.warning') }}.</b> {{ t('cards.warningText') }}</p>
        </div>
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
