<script setup>
import Icon from './Icon.vue'
defineProps({
  icon: { type: String, default: 'leaf' },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
})
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3 px-6 py-10 text-center">
    <div class="grid h-16 w-16 place-items-center rounded-3xl bg-brand-50 text-brand">
      <Icon :name="icon" :size="30" />
    </div>
    <p v-if="title" class="font-semibold text-ink">{{ title }}</p>
    <p v-if="subtitle" class="max-w-xs text-sm text-muted">{{ subtitle }}</p>
    <slot />
  </div>
</template>
