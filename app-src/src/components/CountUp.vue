<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  // Valore target: numero o stringa numerica ('5.8', '1.240,50', ecc.)
  value: { type: [Number, String], default: 0 },
  decimals: { type: Number, default: null }, // null = auto dai decimali del valore
  duration: { type: Number, default: 900 },
  suffix: { type: String, default: '' },
})

// Estrae la parte numerica e l'eventuale suffisso testuale (es. ' kg')
function parse(v) {
  if (typeof v === 'number') return { num: v, suffix: '', decimals: 0 }
  const s = String(v).trim()
  const m = s.match(/^([\d.,\s]+)(.*)$/)
  if (!m) return { num: 0, suffix: '', decimals: 0 }
  let numStr = m[1].trim()
  const tail = m[2].trim()
  // Formato italiano "1.240,50" -> 1240.50 ; altrimenti usa il punto come decimale
  let normalized
  if (numStr.includes(',')) normalized = numStr.replace(/\./g, '').replace(',', '.')
  else normalized = numStr.replace(/\s/g, '')
  const dec = normalized.includes('.') ? normalized.split('.')[1].length : 0
  return { num: parseFloat(normalized) || 0, suffix: tail ? ' ' + tail : '', decimals: dec }
}

const display = ref('0')
let raf = null
let startTime = 0

const easeOut = (t) => 1 - Math.pow(1 - t, 3)

function format(n, decimals) {
  return decimals > 0 ? n.toFixed(decimals) : Math.round(n).toLocaleString('it-IT')
}

function animate() {
  const { num, suffix: tail, decimals: autoDec } = parse(props.value)
  const decimals = props.decimals != null ? props.decimals : autoDec
  const finalSuffix = props.suffix || tail
  cancelAnimationFrame(raf)
  startTime = 0

  const step = (ts) => {
    if (!startTime) startTime = ts
    const progress = Math.min((ts - startTime) / props.duration, 1)
    const current = num * easeOut(progress)
    display.value = format(current, decimals) + finalSuffix
    if (progress < 1) raf = requestAnimationFrame(step)
    else display.value = format(num, decimals) + finalSuffix
  }
  raf = requestAnimationFrame(step)
}

onMounted(animate)
watch(() => props.value, animate)
onUnmounted(() => cancelAnimationFrame(raf))
</script>

<template>
  <span>{{ display }}</span>
</template>
