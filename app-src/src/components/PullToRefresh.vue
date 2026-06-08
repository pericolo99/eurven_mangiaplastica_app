<script setup>
import { ref, computed } from 'vue'
import Icon from './Icon.vue'

const props = defineProps({
  onRefresh: { type: Function, default: null },
})

const THRESHOLD = 70
const MAX = 110

const distance = ref(0)
const refreshing = ref(false)
let startY = 0
let ready = false

function atTop() {
  const el = document.scrollingElement || document.documentElement
  return (el?.scrollTop ?? window.scrollY) <= 0
}

function onStart(e) {
  if (refreshing.value) return
  ready = atTop()
  startY = e.touches[0].clientY
}

function onMove(e) {
  if (!ready || refreshing.value) return
  const dy = e.touches[0].clientY - startY
  if (dy > 0 && atTop()) {
    distance.value = Math.min(dy * 0.5, MAX)
  } else {
    ready = false
    distance.value = 0
  }
}

async function onEnd() {
  if (refreshing.value) return
  if (distance.value >= THRESHOLD) {
    refreshing.value = true
    distance.value = THRESHOLD
    try {
      await props.onRefresh?.()
    } finally {
      refreshing.value = false
      distance.value = 0
      ready = false
    }
  } else {
    distance.value = 0
    ready = false
  }
}

const rotation = computed(() => Math.min((distance.value / THRESHOLD) * 270, 270))
const opacity = computed(() => Math.min(distance.value / 40, 1))
</script>

<template>
  <div
    class="relative"
    @touchstart.passive="onStart"
    @touchmove.passive="onMove"
    @touchend.passive="onEnd"
    @touchcancel.passive="onEnd"
  >
    <!-- Indicatore -->
    <div
      class="pointer-events-none absolute inset-x-0 top-0 flex justify-center"
      :style="{ transform: `translateY(${distance - 38}px)`, opacity }"
    >
      <div class="grid h-9 w-9 place-items-center rounded-full bg-white text-brand shadow-card">
        <Icon
          name="refresh"
          :size="18"
          :class="refreshing ? 'animate-spin' : ''"
          :style="refreshing ? '' : `transform: rotate(${rotation}deg)`"
        />
      </div>
    </div>

    <!-- Contenuto trascinabile -->
    <div
      :style="{
        transform: `translateY(${distance}px)`,
        transition: distance === 0 || refreshing ? 'transform 0.3s ease' : 'none',
      }"
    >
      <slot />
    </div>
  </div>
</template>
