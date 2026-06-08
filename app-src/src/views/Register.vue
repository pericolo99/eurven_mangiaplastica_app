<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Icon from '@/components/Icon.vue'
import { t, locale } from '@/i18n'
import { api } from '@/api/client'
import { EP } from '@/api/endpoints'
import { ui } from '@/stores/ui'
import { scanBarcode, openExternal } from '@/native'

const router = useRouter()

const form = ref({
  nome: '',
  cognome: '',
  codice_fiscale: '',
  codice_comune: '',
  email: '',
  cellulare: '+39',
  password: '',
  termini: false,
  comunicazioni: false,
})

const comuni = ref([])
const comuneQuery = ref('')
const comuneName = ref('')
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
  } catch (e) {
    /* lista comuni non disponibile: si potra' riprovare */
  }
})

function pickComune(c) {
  form.value.codice_comune = c.codice_cliente
  comuneName.value = c.nome
  comuneQuery.value = c.nome
  showComuni.value = false
}

async function scanCf() {
  const v = await scanBarcode(t('register.cf'))
  if (v) form.value.codice_fiscale = v.toUpperCase()
}

const privacyUrl = computed(
  () => `https://mangiaplastica.eurven.online/public/doc/privacy_${locale.value}.pdf`
)

function validEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
}

async function submit() {
  if (!form.value.nome || !form.value.cognome) return ui.error(t('common.genericError'))
  if (!validEmail(form.value.email)) return ui.error(t('register.emailError'))
  if (!form.value.codice_comune) return ui.error(t('register.comuneError'))
  if (!form.value.cellulare || form.value.cellulare === '+39') return ui.error(t('auth.phoneError'))
  if (!form.value.password) return ui.error(t('auth.passwordError'))
  if (!form.value.termini) return ui.error(t('register.acceptError'))

  ui.setLoading(true)
  try {
    await api(EP.registrazione, {
      ...form.value,
      termini: form.value.termini ? 1 : 0,
      comunicazioni: form.value.comunicazioni ? 1 : 0,
    })
    ui.success(t('register.ok'))
    router.replace({ name: 'login' })
  } catch (e) {
    ui.error(e.message || t('common.genericError'))
  } finally {
    ui.setLoading(false)
  }
}
</script>

<template>
  <div class="min-h-full bg-brand-soft">
    <header
      class="sticky top-0 z-30 bg-brand-gradient text-white"
      :style="{ paddingTop: 'var(--safe-top)' }"
    >
      <div class="mx-auto flex h-14 max-w-md items-center justify-between px-3">
        <h1 class="pl-2 text-[1.05rem] font-bold">{{ t('register.title') }}</h1>
        <RouterLink :to="{ name: 'login' }" class="grid h-10 w-10 place-items-center rounded-full text-white/90 hover:bg-white/10">
          <Icon name="close" :size="22" />
        </RouterLink>
      </div>
    </header>

    <form @submit.prevent="submit" class="mx-auto max-w-md space-y-4 px-4 py-5">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="field-label">{{ t('register.name') }}</label>
          <input v-model="form.nome" class="field" :placeholder="t('register.namePh')" />
        </div>
        <div>
          <label class="field-label">{{ t('register.surname') }}</label>
          <input v-model="form.cognome" class="field" :placeholder="t('register.surnamePh')" />
        </div>
      </div>

      <div>
        <label class="field-label">{{ t('register.cf') }}</label>
        <div class="relative">
          <input v-model="form.codice_fiscale" class="field pr-12 uppercase" :placeholder="t('register.cfPh')" />
          <button type="button" class="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-xl bg-brand-50 text-brand" @click="scanCf">
            <Icon name="camera" :size="18" />
          </button>
        </div>
      </div>

      <!-- Comune con ricerca -->
      <div class="relative">
        <label class="field-label">{{ t('register.comune') }} <span class="lowercase text-slate-400">{{ t('register.comuneInfo') }}</span></label>
        <div class="relative">
          <Icon name="pin" :size="18" class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            v-model="comuneQuery"
            class="field pl-11"
            :placeholder="t('register.comunePh')"
            @focus="showComuni = true"
            @input="showComuni = true; form.codice_comune = ''"
          />
        </div>
        <div
          v-if="showComuni && filteredComuni.length"
          class="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-2xl border border-slate-100 bg-white shadow-card"
        >
          <button
            v-for="c in filteredComuni"
            :key="c.codice_cliente"
            type="button"
            class="block w-full px-4 py-2.5 text-left text-sm hover:bg-brand-50"
            @click="pickComune(c)"
          >
            {{ c.nome }}
          </button>
        </div>
      </div>

      <div>
        <label class="field-label">{{ t('register.email') }}</label>
        <input v-model="form.email" type="email" class="field" :placeholder="t('register.emailPh')" />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="field-label">{{ t('auth.phone') }}</label>
          <input v-model="form.cellulare" type="tel" class="field" />
        </div>
        <div>
          <label class="field-label">{{ t('auth.password') }}</label>
          <input v-model="form.password" type="text" class="field" :placeholder="t('auth.passwordFormat')" />
        </div>
      </div>

      <!-- Toggle -->
      <label class="flex items-start gap-3 rounded-2xl bg-white p-3.5 shadow-soft">
        <input v-model="form.termini" type="checkbox" class="mt-0.5 h-5 w-5 accent-brand" />
        <span class="text-sm text-ink">
          {{ t('register.acceptPre') }} <b>{{ t('register.terms') }}</b> {{ t('register.and') }}
          <a :href="privacyUrl" class="font-bold text-accent-600" @click.prevent="openExternal(privacyUrl)">{{ t('register.privacy') }}</a>
        </span>
      </label>
      <label class="flex items-start gap-3 rounded-2xl bg-white p-3.5 shadow-soft">
        <input v-model="form.comunicazioni" type="checkbox" class="mt-0.5 h-5 w-5 accent-brand" />
        <span class="text-sm text-ink">{{ t('register.comunicazioni') }}</span>
      </label>

      <button type="submit" class="btn-primary btn-block">{{ t('auth.registerCta') }}</button>
    </form>
  </div>
</template>
