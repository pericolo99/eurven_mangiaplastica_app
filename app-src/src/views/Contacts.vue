<script setup>
import AppShell from '@/components/AppShell.vue'
import Icon from '@/components/Icon.vue'
import { t } from '@/i18n'
import { openExternal } from '@/native'

const contacts = [
  { icon: 'mail', label: 'developer@eurven.it', action: () => openExternal('mailto:developer@eurven.it') },
  { icon: 'globe', label: 'www.eurven.com', action: () => openExternal('https://www.eurven.com') },
]
</script>

<template>
  <AppShell :title="t('nav.contacts')" back :menu="false">
    <div class="mb-5 flex flex-col items-center pt-4">
      <div class="grid h-16 w-16 place-items-center rounded-3xl bg-brand-gradient text-white shadow-glow">
        <Icon name="phone" :size="30" />
      </div>
      <p class="mt-3 font-extrabold text-ink">Eurven Dev Team</p>
    </div>

    <ul class="space-y-3">
      <li v-for="(c, i) in contacts" :key="i">
        <button class="card flex w-full items-center gap-3 p-4 text-left active:scale-[0.98]" @click="c.action">
          <span class="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand">
            <Icon :name="c.icon" :size="22" />
          </span>
          <span class="flex-1 font-semibold text-ink">{{ c.label }}</span>
          <Icon name="chevron" :size="20" class="text-slate-300" />
        </button>
      </li>
    </ul>
  </AppShell>
</template>
