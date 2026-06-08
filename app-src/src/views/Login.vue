<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import logoWhite from '@/assets/logo-white.png'
import Icon from '@/components/Icon.vue'
import { t, setLocale, locale, availableLocales } from '@/i18n'
import { api } from '@/api/client'
import { EP } from '@/api/endpoints'
import { ui } from '@/stores/ui'
import { getAppVersion } from '@/native'

const router = useRouter()
const cellulare = ref('+39')
const password = ref('')
const version = ref('')
const showLang = ref(false)

onMounted(async () => {
  version.value = await getAppVersion()
})

async function login() {
  if (!cellulare.value || cellulare.value === '+39') return ui.error(t('auth.phoneError'))
  if (!password.value) return ui.error(t('auth.passwordError'))
  ui.setLoading(true)
  try {
    await api(EP.login, { cellulare: cellulare.value, password: password.value })
    router.replace({ name: 'home' })
  } catch (e) {
    ui.error(e.message || t('auth.loginError'))
  } finally {
    ui.setLoading(false)
  }
}
</script>

<template>
  <div class="flex min-h-full flex-col bg-brand-gradient">
    <!-- Hero -->
    <div
      class="flex flex-col items-center gap-2 px-8 pb-10 text-center text-white"
      :style="{ paddingTop: 'calc(var(--safe-top) + 3rem)' }"
    >
      <img :src="logoWhite" alt="Mangiaplastica" class="w-44 max-w-[60vw]" />
      <p class="text-sm text-white/80">{{ t('auth.subtitle') }}</p>
    </div>

    <!-- Card form -->
    <div
      class="flex-1 rounded-t-[2rem] bg-white px-6 pt-8 animate-fade-up"
      :style="{ paddingBottom: 'calc(var(--safe-bottom) + 2rem)' }"
    >
      <h2 class="mb-6 text-xl font-extrabold text-ink">{{ t('auth.welcomeBack') }}</h2>

      <form @submit.prevent="login" class="space-y-4">
        <div>
          <label class="field-label">{{ t('auth.phone') }}</label>
          <div class="relative">
            <Icon name="phone" :size="19" class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input v-model="cellulare" type="tel" class="field pl-11" :placeholder="t('auth.phonePh')" />
          </div>
        </div>
        <div>
          <label class="field-label">{{ t('auth.password') }}</label>
          <div class="relative">
            <Icon name="lock" :size="19" class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input v-model="password" type="password" class="field pl-11" :placeholder="t('auth.passwordPh')" />
          </div>
        </div>

        <button type="submit" class="btn-primary btn-block mt-2">{{ t('auth.enter') }}</button>
      </form>

      <div class="mt-5 flex flex-col items-center gap-3 text-sm">
        <RouterLink :to="{ name: 'reset' }" class="font-semibold text-accent-600">
          {{ t('auth.forgot') }}
        </RouterLink>
        <p class="text-muted">
          {{ t('auth.noAccount') }}
          <RouterLink :to="{ name: 'register' }" class="font-bold text-brand">{{ t('auth.register') }}</RouterLink>
        </p>

        <button class="mt-1 flex items-center gap-1.5 text-xs font-semibold text-muted" @click="showLang = !showLang">
          <Icon name="globe" :size="15" /> {{ t('auth.changeLang') }}
        </button>
        <div v-if="showLang" class="flex gap-2">
          <button
            v-for="l in availableLocales"
            :key="l.code"
            class="chip border"
            :class="locale.value === l.code ? 'border-brand bg-brand-50 text-brand' : 'border-slate-200 text-muted'"
            @click="setLocale(l.code)"
          >
            {{ l.label }}
          </button>
        </div>

        <p class="mt-2 text-[0.7rem] text-slate-400">Ver. {{ version }}</p>
      </div>
    </div>
  </div>
</template>
