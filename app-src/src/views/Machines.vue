<script setup>
import { ref, onMounted, shallowRef } from 'vue'
import AppShell from '@/components/AppShell.vue'
import Icon from '@/components/Icon.vue'
import EmptyState from '@/components/EmptyState.vue'
import { t } from '@/i18n'
import { api } from '@/api/client'
import { EP } from '@/api/endpoints'
import { ui } from '@/stores/ui'
import { getPosition, navigateTo, loadGoogleMaps } from '@/native'

const machines = ref([])
const loading = ref(true)
const mapEl = ref(null)
const mapReady = ref(false)
const myPos = shallowRef(null)
let map = null

async function load() {
  loading.value = true
  myPos.value = await getPosition()
  const body = myPos.value
    ? { latitude: myPos.value.latitude, longitude: myPos.value.longitude }
    : { noposition: 1 }
  try {
    const res = await api(EP.macchine, body)
    machines.value = res?.data?.macchine || []
    initMap()
  } catch (e) {
    ui.error(e.message)
  } finally {
    loading.value = false
  }
}

async function initMap() {
  try {
    const google = await loadGoogleMaps()
    if (!mapEl.value) return
    const center = myPos.value
      ? { lat: myPos.value.latitude, lng: myPos.value.longitude }
      : { lat: 41.9027, lng: 12.4963 }
    map = new google.maps.Map(mapEl.value, {
      center,
      zoom: 12,
      disableDefaultUI: true,
      zoomControl: true,
    })
    const bounds = new google.maps.LatLngBounds()
    if (myPos.value) {
      new google.maps.Marker({
        position: center,
        map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: '#00b0f2',
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 2,
        },
      })
      bounds.extend(center)
    }
    machines.value.forEach((m) => {
      if (!m.latitudine || !m.longitudine) return
      const pos = { lat: parseFloat(m.latitudine), lng: parseFloat(m.longitudine) }
      const marker = new google.maps.Marker({ position: pos, map, title: m.descrizione })
      const iw = new google.maps.InfoWindow({ content: `<b>${m.descrizione || m.nome}</b>` })
      marker.addListener('click', () => iw.open(map, marker))
      bounds.extend(pos)
    })
    if (!bounds.isEmpty()) {
      map.fitBounds(bounds)
      if (machines.value.length <= 1) map.setZoom(14)
    }
    mapReady.value = true
  } catch (e) {
    mapReady.value = false
  }
}

async function navigate(m) {
  const ok = await ui.confirm(t('machines.navConfirm'))
  if (ok) navigateTo(m.latitudine, m.longitudine)
}

onMounted(load)
</script>

<template>
  <AppShell :title="t('machines.title')">
    <!-- Mappa -->
    <div class="relative mb-4 overflow-hidden rounded-3xl shadow-card">
      <div ref="mapEl" class="h-52 w-full bg-brand-soft"></div>
      <div v-if="!mapReady" class="absolute inset-0 grid place-items-center bg-brand-soft text-slate-300">
        <Icon name="pin" :size="40" />
      </div>
    </div>

    <div v-if="loading" class="card grid place-items-center py-10">
      <span class="h-8 w-8 animate-spin rounded-full border-[3px] border-brand-100 border-t-brand"></span>
      <p class="mt-3 text-sm text-muted">{{ t('machines.locating') }}</p>
    </div>

    <ul v-else-if="machines.length" class="space-y-3">
      <li v-for="(m, i) in machines" :key="m.codice_macchina || i" class="card flex items-center gap-3 p-4">
        <span class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent-50 text-accent-600">
          <Icon name="pin" :size="22" />
        </span>
        <div class="min-w-0 flex-1">
          <p class="truncate font-bold text-ink">{{ m.descrizione || m.nome }}</p>
          <p class="truncate text-xs text-muted">
            {{ m.comune }}<span v-if="m.distance"> · {{ m.distance }}</span>
          </p>
          <span
            class="chip mt-1"
            :class="m.online_sync ? 'bg-eco-500/10 text-eco-600' : 'bg-slate-100 text-slate-400'"
          >
            <span class="h-1.5 w-1.5 rounded-full" :class="m.online_sync ? 'bg-eco-500' : 'bg-slate-400'"></span>
            {{ m.online_sync ? t('machines.online') : t('machines.offline') }}
          </span>
        </div>
        <button
          v-if="m.latitudine"
          class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-gradient text-white active:scale-90"
          @click="navigate(m)"
          :aria-label="t('machines.navigate')"
        >
          <Icon name="navigate" :size="20" />
        </button>
      </li>
    </ul>

    <div v-else class="card">
      <EmptyState icon="pin" :title="t('machines.empty')" :subtitle="t('machines.noPosition')" />
    </div>
  </AppShell>
</template>
