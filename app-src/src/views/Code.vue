<script setup>
import AppShell from '@/components/AppShell.vue'
import Icon from '@/components/Icon.vue'
import { t } from '@/i18n'
import { session } from '@/stores/session'
</script>

<template>
  <AppShell :title="t('code.title')" back>
    <div class="flex flex-col items-center pt-6">
      <div class="w-full max-w-sm rounded-3xl bg-white p-6 shadow-card animate-pop-in">
        <p class="text-center text-sm font-semibold text-muted">{{ t('code.subtitle') }}</p>

        <div class="my-5 flex justify-center rounded-2xl bg-brand-soft p-5">
          <img
            v-if="session.code?.image"
            :src="session.code.image"
            alt="barcode"
            class="h-40 w-full object-contain"
          />
          <div v-else class="grid h-40 w-full place-items-center text-slate-300">
            <Icon name="barcode" :size="64" />
          </div>
        </div>

        <p class="text-center text-2xl font-extrabold tracking-[0.2em] text-ink">
          {{ session.code?.codice }}
        </p>
      </div>

      <p class="mt-5 flex items-center gap-2 px-6 text-center text-sm text-muted">
        <Icon name="recycle" :size="18" class="shrink-0 text-eco-600" />
        {{ t('code.hint') }}
      </p>
    </div>
  </AppShell>
</template>
