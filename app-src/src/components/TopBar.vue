<script setup>
import { useRouter } from 'vue-router'
import Icon from './Icon.vue'

const props = defineProps({
  title: { type: String, default: '' },
  back: { type: Boolean, default: false },
  menu: { type: Boolean, default: true },
  transparent: { type: Boolean, default: false },
})
const emit = defineEmits(['menu'])
const router = useRouter()
</script>

<template>
  <header
    class="sticky top-0 z-30"
    :class="transparent ? '' : 'bg-brand-gradient text-white shadow-soft'"
    :style="{ paddingTop: 'var(--safe-top)' }"
  >
    <div class="mx-auto flex h-14 max-w-md items-center gap-2 px-3">
      <button
        v-if="back"
        class="grid h-10 w-10 place-items-center rounded-full transition active:scale-90"
        :class="transparent ? 'text-ink' : 'text-white/90 hover:bg-white/10'"
        @click="router.back()"
        aria-label="back"
      >
        <Icon name="back" :size="24" />
      </button>

      <h1 class="flex-1 truncate text-[1.05rem] font-bold tracking-tight"
          :class="back ? 'text-center pr-10' : 'pl-1'">
        {{ title }}
      </h1>

      <button
        v-if="menu"
        class="grid h-10 w-10 place-items-center rounded-full transition active:scale-90"
        :class="transparent ? 'text-ink' : 'text-white/90 hover:bg-white/10'"
        @click="emit('menu')"
        aria-label="menu"
      >
        <Icon name="menu" :size="24" />
      </button>
      <div v-else class="w-10"></div>
    </div>
  </header>
</template>
