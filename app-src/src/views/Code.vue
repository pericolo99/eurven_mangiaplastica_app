<script setup>
import AppShell from '@/components/AppShell.vue'
import Icon from '@/components/Icon.vue'
import { t } from '@/i18n'
import { session } from '@/stores/session'
</script>

<template>
  <AppShell :title="t('code.title')" back>
    <div class="flex min-h-[72vh] flex-col">
      <!-- Barcode vicino al bordo alto (comodo da scansionare) -->
      <div class="w-full overflow-hidden rounded-3xl bg-white pb-5 shadow-card animate-pop-in">
        <!-- Il PNG dal server e' molto basso (Code128, 30px): lo si stira in
             altezza (solo barre, nessun testo) mantenendo i bordi netti. -->
        <div class="flex justify-center bg-brand-soft px-6 pb-5">
          <img
            v-if="session.code?.image"
            :src="session.code.image"
            alt="barcode"
            class="h-40 w-full object-fill [image-rendering:pixelated]"
          />
          <div v-else class="grid h-40 w-full place-items-center text-slate-300">
            <Icon name="barcode" :size="64" />
          </div>
        </div>
        <p class="mt-4 text-center text-2xl font-extrabold tracking-[0.2em] text-ink">
          {{ session.code?.codice }}
        </p>
      </div>

      <!-- Dicitura spostata in basso -->
      <div class="mt-auto pt-8 text-center">
        <p class="text-base font-bold text-ink">{{ t('code.subtitle') }}</p>
        <p class="mt-2 flex items-center justify-center gap-2 text-sm text-muted">
          <Icon name="recycle" :size="18" class="shrink-0 text-eco-600" />
          {{ t('code.hint') }}
        </p>
      </div>
    </div>
  </AppShell>
</template>
