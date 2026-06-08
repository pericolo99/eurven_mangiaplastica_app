<script setup>
import { ref, onMounted } from 'vue'
import AppShell from '@/components/AppShell.vue'
import Icon from '@/components/Icon.vue'
import logoDark from '@/assets/logo-dark.png'
import { t } from '@/i18n'
import { getAppVersion, openExternal } from '@/native'

const version = ref('')
onMounted(async () => (version.value = await getAppVersion()))
</script>

<template>
  <AppShell :title="t('nav.info')" back :menu="false">
    <div class="flex flex-col items-center pt-4">
      <img :src="logoDark" alt="Mangiaplastica" class="w-40" />
      <p class="mt-2 text-sm text-muted">Ver. {{ version }}</p>
    </div>

    <div class="card mt-6 space-y-4 p-5 text-sm leading-relaxed text-ink">
      <p>
        <b>Mangiaplastica</b> è il borsellino elettronico di Eurven dedicato al riciclo della
        plastica: accumula Green Points conferendo le tue bottiglie negli ecocompattatori e
        partecipa ai progetti del tuo comune.
      </p>
      <p class="text-muted">
        Eurven S.r.l. — soluzioni per l'economia circolare.
      </p>
    </div>

    <div class="mt-5 space-y-3">
      <button class="btn-soft btn-block" @click="openExternal('https://www.eurven.com')">
        <Icon name="globe" :size="18" /> www.eurven.com
      </button>
      <button class="btn-soft btn-block" @click="openExternal('mailto:developer@eurven.it')">
        <Icon name="mail" :size="18" /> developer@eurven.it
      </button>
    </div>
  </AppShell>
</template>
