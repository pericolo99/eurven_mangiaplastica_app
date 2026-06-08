<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppShell from '@/components/AppShell.vue'
import { t } from '@/i18n'
import { api } from '@/api/client'
import { EP } from '@/api/endpoints'
import { ui } from '@/stores/ui'

const props = defineProps({ codice: { type: String, required: true } })
const router = useRouter()

const progetto = ref(null)
const loading = ref(true)
const form = ref({ codice_adesione: '', extra_input_1: '', extra_input_2: '' })

onMounted(async () => {
  try {
    const res = await api(EP.progetto, { codice_progetto: props.codice })
    progetto.value = res?.data?.progetto || null
  } catch (e) {
    ui.error(e.message)
  } finally {
    loading.value = false
  }
})

async function submit() {
  if (!form.value.codice_adesione) return ui.error(t('common.genericError'))
  if (progetto.value?.extra_input == 1 && (!form.value.extra_input_1 || !form.value.extra_input_2)) {
    return ui.error(t('common.genericError'))
  }
  ui.setLoading(true)
  try {
    await api(EP.progettoAdesione, {
      codice_progetto: progetto.value.codice_progetto,
      codice_adesione: form.value.codice_adesione,
      extra_input_1: form.value.extra_input_1,
      extra_input_2: form.value.extra_input_2,
    })
    ui.success(t('projects.joinOk'))
    router.replace({ name: 'projects' })
  } catch (e) {
    ui.error(e.message)
  } finally {
    ui.setLoading(false)
  }
}
</script>

<template>
  <AppShell :title="t('projects.title')" back>
    <div v-if="loading" class="card grid place-items-center py-12">
      <span class="h-8 w-8 animate-spin rounded-full border-[3px] border-brand-100 border-t-brand"></span>
    </div>

    <article v-else-if="progetto" class="card overflow-hidden">
      <div class="bg-brand-gradient px-5 py-5 text-white">
        <h2 class="text-lg font-extrabold">{{ progetto.nome }}</h2>
      </div>
      <form @submit.prevent="submit" class="space-y-4 px-5 py-5">
        <div>
          <label class="field-label">{{ t('projects.school') }}</label>
          <select v-model="form.codice_adesione" class="field">
            <option value="">{{ t('cards.selectType') }}</option>
            <option v-for="p in progetto.partecipanti" :key="p.codice_adesione" :value="p.codice_adesione">
              {{ p.descrizione }}
            </option>
          </select>
        </div>

        <template v-if="progetto.extra_input == 1">
          <div>
            <label class="field-label">{{ t('projects.class') }}</label>
            <input v-model="form.extra_input_1" class="field" />
          </div>
          <div>
            <label class="field-label">{{ t('projects.section') }}</label>
            <input v-model="form.extra_input_2" class="field" />
          </div>
        </template>

        <button type="submit" class="btn-primary btn-block">{{ t('common.proceed') }}</button>
      </form>
    </article>
  </AppShell>
</template>
