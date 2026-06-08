<script setup>
defineProps({
  // numero di righe-placeholder da generare
  rows: { type: Number, default: 3 },
  // variante: 'list' (righe con avatar) | 'cards' (blocchi) | 'stats' (3 colonne)
  variant: { type: String, default: 'list' },
})
</script>

<template>
  <div v-if="variant === 'stats'" class="grid grid-cols-3 gap-3">
    <div v-for="i in 3" :key="i" class="card flex flex-col items-center gap-2 p-4">
      <div class="skeleton h-11 w-11 rounded-2xl"></div>
      <div class="skeleton h-5 w-12"></div>
      <div class="skeleton h-3 w-14"></div>
    </div>
  </div>

  <div v-else-if="variant === 'cards'" class="space-y-3">
    <div v-for="i in rows" :key="i" class="card space-y-3 p-4">
      <div class="skeleton h-5 w-2/3"></div>
      <div class="skeleton h-3 w-full"></div>
      <div class="skeleton h-3 w-4/5"></div>
      <div class="skeleton h-10 w-full rounded-2xl"></div>
    </div>
  </div>

  <div v-else class="card divide-y divide-slate-100">
    <div v-for="i in rows" :key="i" class="flex items-center gap-3 p-4">
      <div class="skeleton h-10 w-10 rounded-2xl"></div>
      <div class="flex-1 space-y-2">
        <div class="skeleton h-4 w-1/2"></div>
        <div class="skeleton h-3 w-1/3"></div>
      </div>
      <div class="skeleton h-6 w-12 rounded-full"></div>
    </div>
  </div>
</template>
