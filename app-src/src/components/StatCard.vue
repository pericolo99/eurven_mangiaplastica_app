<script setup>
import Icon from './Icon.vue'
defineProps({
  icon: { type: String, default: 'recycle' },
  value: { type: [String, Number], default: '0' },
  label: { type: String, default: '' },
  tone: { type: String, default: 'accent' }, // accent | brand | eco
})
const tones = {
  accent: 'from-accent-400/15 to-accent/10 text-accent-700',
  brand: 'from-brand-400/15 to-brand/10 text-brand',
  eco: 'from-eco-500/15 to-eco-500/10 text-eco-600',
}
</script>

<template>
  <div class="card flex flex-col items-center gap-1 p-4 text-center">
    <div
      class="mb-1 grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br"
      :class="tones[tone]"
    >
      <Icon :name="icon" :size="22" />
    </div>
    <div class="text-xl font-extrabold leading-none text-ink">{{ value }}</div>
    <div class="text-[0.7rem] font-medium leading-tight text-muted">{{ label }}</div>
  </div>
</template>
