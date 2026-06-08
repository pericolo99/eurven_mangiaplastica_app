<script setup>
import { computed } from 'vue'
import Icon from './Icon.vue'

const props = defineProps({
  modelValue: { type: [String, Number], required: true },
  tabs: { type: Array, required: true }, // [{ key, label, icon? }]
})
const emit = defineEmits(['update:modelValue'])

const activeIndex = computed(() => props.tabs.findIndex((t) => t.key === props.modelValue))
</script>

<template>
  <div class="relative flex rounded-2xl bg-brand-50 p-1">
    <!-- Pillola attiva animata -->
    <div
      class="absolute inset-y-1 rounded-xl bg-white shadow-soft transition-all duration-300 ease-out"
      :style="{
        width: `calc((100% - 0.5rem) / ${tabs.length})`,
        transform: `translateX(${activeIndex * 100}%)`,
      }"
    ></div>

    <button
      v-for="tab in tabs"
      :key="tab.key"
      type="button"
      class="relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-[0.8rem] font-bold transition-colors"
      :class="modelValue === tab.key ? 'text-brand' : 'text-slate-400'"
      @click="emit('update:modelValue', tab.key)"
    >
      <Icon v-if="tab.icon" :name="tab.icon" :size="17" />
      {{ tab.label }}
    </button>
  </div>
</template>
