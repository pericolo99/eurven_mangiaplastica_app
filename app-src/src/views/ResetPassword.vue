<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Icon from '@/components/Icon.vue'
import { t } from '@/i18n'
import { api } from '@/api/client'
import { EP } from '@/api/endpoints'
import { ui } from '@/stores/ui'

const router = useRouter()
const cellulare = ref('+39')
const email = ref('')

function validEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
}

async function submit() {
  if (!validEmail(email.value)) return ui.error(t('register.emailError'))
  if (!cellulare.value || cellulare.value === '+39') return ui.error(t('auth.phoneError'))
  ui.setLoading(true)
  try {
    await api(EP.recuperaPassword, { email: email.value, cellulare: cellulare.value })
    ui.success(t('reset.ok'))
    router.replace({ name: 'login' })
  } catch (e) {
    ui.error(e.message || t('common.genericError'))
  } finally {
    ui.setLoading(false)
  }
}
</script>

<template>
  <div class="flex min-h-full flex-col bg-brand-gradient">
    <header :style="{ paddingTop: 'var(--safe-top)' }">
      <div class="mx-auto flex h-14 max-w-md items-center px-3 text-white">
        <button class="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10" @click="router.back()">
          <Icon name="back" :size="24" />
        </button>
      </div>
    </header>

    <div class="px-8 pb-8 pt-2 text-center text-white">
      <div class="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-white/15">
        <Icon name="lock" :size="28" />
      </div>
      <h1 class="text-xl font-extrabold">{{ t('reset.title') }}</h1>
      <p class="mx-auto mt-1 max-w-xs text-sm text-white/80">{{ t('reset.subtitle') }}</p>
    </div>

    <div class="flex-1 rounded-t-[2rem] bg-white px-6 pt-8" :style="{ paddingBottom: 'calc(var(--safe-bottom) + 2rem)' }">
      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="field-label">{{ t('register.email') }}</label>
          <input v-model="email" type="email" class="field" :placeholder="t('register.emailPh')" />
        </div>
        <div>
          <label class="field-label">{{ t('auth.phone') }}</label>
          <input v-model="cellulare" type="tel" class="field" />
        </div>
        <button type="submit" class="btn-primary btn-block">{{ t('reset.send') }}</button>
      </form>
    </div>
  </div>
</template>
