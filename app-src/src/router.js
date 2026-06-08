import { createRouter, createWebHashHistory } from 'vue-router'
import { session } from '@/stores/session'

const routes = [
  { path: '/', name: 'splash', component: () => import('@/views/Splash.vue'), meta: { public: true } },
  { path: '/login', name: 'login', component: () => import('@/views/Login.vue'), meta: { public: true } },
  { path: '/register', name: 'register', component: () => import('@/views/Register.vue'), meta: { public: true } },
  { path: '/reset', name: 'reset', component: () => import('@/views/ResetPassword.vue'), meta: { public: true } },

  { path: '/home', name: 'home', component: () => import('@/views/Home.vue') },
  { path: '/code', name: 'code', component: () => import('@/views/Code.vue') },
  { path: '/machines', name: 'machines', component: () => import('@/views/Machines.vue') },
  { path: '/cards', name: 'cards', component: () => import('@/views/Cards.vue') },
  { path: '/profile', name: 'profile', component: () => import('@/views/Profile.vue') },
  { path: '/history', name: 'history', component: () => import('@/views/History.vue') },
  { path: '/projects', name: 'projects', component: () => import('@/views/Projects.vue') },
  { path: '/projects/:codice', name: 'project', component: () => import('@/views/ProjectDetail.vue'), props: true },
  { path: '/info', name: 'info', component: () => import('@/views/Info.vue') },
  { path: '/contacts', name: 'contacts', component: () => import('@/views/Contacts.vue') },

  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  if (!to.meta.public && !session.token) {
    return { name: 'login' }
  }
  return true
})
