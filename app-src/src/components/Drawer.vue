<script setup>
import { useRouter } from 'vue-router'
import Icon from './Icon.vue'
import { t, setLocale, locale, availableLocales } from '@/i18n'
import { session, fullName } from '@/stores/session'
import { ui } from '@/stores/ui'

const props = defineProps({ open: Boolean })
const emit = defineEmits(['close'])
const router = useRouter()

function go(name) {
  emit('close')
  router.push({ name })
}

async function logout() {
  emit('close')
  const ok = await ui.confirm(t('nav.logout') + '?')
  if (!ok) return
  session.logout()
  router.replace({ name: 'login' })
}

const links = [
  { name: 'history', icon: 'trophy', label: 'nav.history' },
  { name: 'projects', icon: 'leaf', label: 'nav.projects', requiresProjects: true },
  { name: 'info', icon: 'info', label: 'nav.info' },
  { name: 'contacts', icon: 'phone', label: 'nav.contacts' },
]
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[70] bg-ink/40 backdrop-blur-sm"
        @click="emit('close')"
      />
    </Transition>
    <Transition name="slide">
      <aside
        v-if="open"
        class="fixed inset-y-0 right-0 z-[71] flex w-[82%] max-w-xs flex-col bg-white shadow-card"
        :style="{ paddingTop: 'var(--safe-top)', paddingBottom: 'var(--safe-bottom)' }"
      >
        <!-- Header utente -->
        <div class="bg-brand-gradient px-5 pb-6 pt-6 text-white">
          <div class="flex items-center gap-3">
            <div class="grid h-12 w-12 place-items-center rounded-2xl bg-white/15">
              <Icon name="user" :size="26" />
            </div>
            <div class="min-w-0">
              <p class="truncate font-bold">{{ fullName() || t('appName') }}</p>
              <p class="truncate text-xs text-white/70">{{ session.user?.email }}</p>
            </div>
          </div>
        </div>

        <nav class="flex-1 overflow-y-auto px-3 py-4">
          <template v-for="l in links" :key="l.name">
            <button
              v-if="!l.requiresProjects || session.progetti"
              class="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-[0.95rem] font-medium text-ink transition hover:bg-brand-50"
              @click="go(l.name)"
            >
              <span class="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand">
                <Icon :name="l.icon" :size="19" />
              </span>
              {{ t(l.label) }}
            </button>
          </template>

          <!-- Lingua -->
          <div class="mt-3 px-3">
            <p class="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
              <Icon name="globe" :size="15" /> {{ t('nav.language') }}
            </p>
            <div class="flex gap-2">
              <button
                v-for="l in availableLocales"
                :key="l.code"
                class="chip border transition"
                :class="locale.value === l.code
                  ? 'border-brand bg-brand-50 text-brand'
                  : 'border-slate-200 text-muted'"
                @click="setLocale(l.code)"
              >
                {{ l.label }}
              </button>
            </div>
          </div>
        </nav>

        <button
          class="m-3 flex items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-3 font-semibold text-red-600 transition active:scale-95"
          @click="logout"
        >
          <Icon name="logout" :size="19" /> {{ t('nav.logout') }}
        </button>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
