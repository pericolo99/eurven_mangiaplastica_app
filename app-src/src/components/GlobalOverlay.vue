<script setup>
import { ui } from '@/stores/ui'
import { t } from '@/i18n'
import Icon from './Icon.vue'
</script>

<template>
  <!-- Loader -->
  <Transition name="fade">
    <div
      v-if="ui.loading"
      class="fixed inset-0 z-[80] grid place-items-center bg-ink/30 backdrop-blur-sm"
    >
      <div class="flex flex-col items-center gap-3 rounded-3xl bg-white px-8 py-7 shadow-card">
        <span class="h-9 w-9 animate-spin rounded-full border-[3px] border-brand-100 border-t-brand"></span>
        <span class="text-sm font-medium text-muted">{{ t('common.loading') }}</span>
      </div>
    </div>
  </Transition>

  <!-- Confirm dialog -->
  <Transition name="fade">
    <div
      v-if="ui.confirmState"
      class="fixed inset-0 z-[90] grid place-items-center bg-ink/40 p-6 backdrop-blur-sm"
      @click.self="ui._resolveConfirm(false)"
    >
      <div class="w-full max-w-sm animate-pop-in rounded-3xl bg-white p-6 shadow-card">
        <p class="text-center text-[0.95rem] font-medium leading-relaxed text-ink">
          {{ ui.confirmState.message }}
        </p>
        <div class="mt-6 flex gap-3">
          <button class="btn-ghost btn-block" @click="ui._resolveConfirm(false)">
            {{ t('common.cancel') }}
          </button>
          <button class="btn-primary btn-block" @click="ui._resolveConfirm(true)">
            {{ t('common.proceed') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Alert informativo -->
  <Transition name="fade">
    <div
      v-if="ui.alertState"
      class="fixed inset-0 z-[90] grid place-items-center bg-ink/40 p-6 backdrop-blur-sm"
      @click.self="ui._closeAlert()"
    >
      <div class="w-full max-w-sm animate-pop-in rounded-3xl bg-white p-6 shadow-card">
        <div class="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand">
          <Icon name="info" :size="26" />
        </div>
        <p v-if="ui.alertState.title" class="text-center text-base font-extrabold text-ink">
          {{ ui.alertState.title }}
        </p>
        <p class="mt-1 text-center text-sm leading-relaxed text-muted">
          {{ ui.alertState.message }}
        </p>
        <button class="btn-primary btn-block mt-6" @click="ui._closeAlert()">
          {{ t('common.close') }}
        </button>
      </div>
    </div>
  </Transition>

  <!-- Toasts -->
  <div class="pointer-events-none fixed inset-x-0 top-0 z-[100] flex flex-col items-center gap-2 px-4"
       :style="{ paddingTop: 'calc(var(--safe-top) + 12px)' }">
    <TransitionGroup name="toast">
      <div
        v-for="toItem in ui.toasts"
        :key="toItem.id"
        class="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium shadow-card"
        :class="{
          'bg-white text-ink': toItem.type === 'info',
          'bg-eco-500 text-white': toItem.type === 'success',
          'bg-red-500 text-white': toItem.type === 'error',
        }"
      >
        <Icon
          :name="toItem.type === 'success' ? 'check' : toItem.type === 'error' ? 'close' : 'info'"
          :size="18"
        />
        <span class="flex-1">{{ toItem.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
