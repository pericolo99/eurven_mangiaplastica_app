<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppShell from '@/components/AppShell.vue'
import Icon from '@/components/Icon.vue'
import { t } from '@/i18n'
import { session } from '@/stores/session'
import { api } from '@/api/client'
import { EP } from '@/api/endpoints'
import { ui } from '@/stores/ui'

const router = useRouter()

const form = ref({
  nome: session.user?.nome || '',
  cognome: session.user?.cognome || '',
  codice_fiscale: session.user?.codice_fiscale || '',
  codice_comune: session.user?.codice_comune || '',
  email: session.user?.email || '',
  cellulare: session.user?.cellulare || '',
  password: '',
})

const comuni = ref([])
const comuneQuery = ref('')
const showComuni = ref(false)

const filteredComuni = computed(() => {
  const q = comuneQuery.value.trim().toLowerCase()
  const list = q ? comuni.value.filter((c) => c.nome.toLowerCase().includes(q)) : comuni.value
  return list.slice(0, 60)
})

onMounted(async () => {
  try {
    const res = await api(EP.comuni, {})
    comuni.value = res?.data?.comuni || []
    const match = comuni.value.find((c) => c.codice_cliente === form.value.codice_comune)
    if (match) comuneQuery.value = match.nome
  } catch (e) {
    /* non bloccante */
  }
})

function pickComune(c) {
  form.value.codice_comune = c.codice_cliente
  comuneQuery.value = c.nome
  showComuni.value = false
}

async function save() {
  ui.setLoading(true)
  try {
    await api(EP.aggiorna, { ...form.value })
    ui.success(t('profile.ok'))
  } catch (e) {
    ui.error(e.message)
  } finally {
    ui.setLoading(false)
  }
}

async function removeProfile() {
  const ok = await ui.confirm(t('profile.deleteConfirm'))
  if (!ok) return
  ui.setLoading(true)
  try {
    await api(EP.cancella, { ...form.value }, { absorb: false })
    session.logout()
    router.replace({ name: 'login' })
  } catch (e) {
    ui.error(e.message)
  } finally {
    ui.setLoading(false)
  }
}
</script>

<template>
  <AppShell :title="t('profile.title')">
    <div class="mb-5 flex flex-col items-center">
      <div class="grid h-20 w-20 place-items-center rounded-3xl bg-brand-gradient text-white shadow-glow">
        <Icon name="user" :size="38" />
      </div>
      <p class="mt-2 font-extrabold text-ink">{{ form.nome }} {{ form.cognome }}</p>
    </div>

    <form @submit.prevent="save" class="space-y-4">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="field-label">{{ t('register.name') }}</label>
          <input v-model="form.nome" class="field" />
        </div>
        <div>
          <label class="field-label">{{ t('register.surname') }}</label>
          <input v-model="form.cognome" class="field" />
        </div>
      </div>

      <div>
        <label class="field-label">{{ t('register.cf') }}</label>
        <input v-model="form.codice_fiscale" class="field uppercase" />
      </div>

      <div class="relative">
        <label class="field-label">{{ t('register.comune') }}</label>
        <input
          v-model="comuneQuery"
          class="field"
          @focus="showComuni = true"
          @input="showComuni = true; form.codice_comune = ''"
        />
        <div v-if="showComuni && filteredComuni.length" class="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-2xl border border-slate-100 bg-white shadow-card">
          <button v-for="c in filteredComuni" :key="c.codice_cliente" type="button" class="block w-full px-4 py-2.5 text-left text-sm hover:bg-brand-50" @click="pickComune(c)">
            {{ c.nome }}
          </button>
        </div>
      </div>

      <div>
        <label class="field-label">{{ t('register.email') }}</label>
        <input v-model="form.email" type="email" class="field" />
      </div>

      <div>
        <label class="field-label">{{ t('auth.phone') }}</label>
        <input v-model="form.cellulare" class="field bg-slate-50 text-muted" readonly />
      </div>

      <div>
        <label class="field-label">{{ t('auth.password') }}</label>
        <input v-model="form.password" type="text" class="field" :placeholder="t('profile.updatePassword')" />
      </div>

      <div class="flex gap-3 pt-1">
        <button type="button" class="btn-danger flex-1" @click="removeProfile">{{ t('profile.delete') }}</button>
        <button type="submit" class="btn-primary flex-1">{{ t('common.update') }}</button>
      </div>
    </form>
  </AppShell>
</template>
