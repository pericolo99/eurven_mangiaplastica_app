<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import logoWhite from '@/assets/logo-white.png'
import { session } from '@/stores/session'
import { api } from '@/api/client'
import { EP } from '@/api/endpoints'
import { deviceReady } from '@/native'

const router = useRouter()

onMounted(async () => {
  await deviceReady
  if (!session.token) {
    return router.replace({ name: 'login' })
  }
  try {
    await api(EP.loginToken, {})
    router.replace({ name: 'home' })
  } catch (e) {
    session.logout()
    router.replace({ name: 'login' })
  }
})
</script>

<template>
  <div class="grid min-h-full place-items-center bg-brand-gradient px-8 text-white">
    <div class="flex flex-col items-center gap-6 animate-fade-up">
      <img :src="logoWhite" alt="Mangiaplastica" class="w-52 max-w-[70vw]" />
      <span class="h-8 w-8 animate-spin rounded-full border-[3px] border-white/30 border-t-white"></span>
    </div>
  </div>
</template>
