import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { useUserStore } from '@/stores/userStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignUpView.vue')
    },
    {
      path: '/signup/moreinfo',
      name: 'signupnext',
      component: () => import('../views/SignUpNextView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue')
    },
    {
      path: '/admin-dash',
      name: 'admin-dash',
      meta: { requiresAdmin: true },
      component: () => import('../views/AdminDashboardView.vue')
    },
    {
      path: '/locations-services',
      name: 'locations-services',
      component: () => import('../views/LocationsAndServicesView.vue')
    },
    {
      path: '/specialists',
      name: 'specialists',
      component: () => import('../views/SpecialistsView.vue')
    },
    {
      path: '/education',
      name: 'education',
      component: () => import('../views/EducationView.vue')
    },
    {
      path: '/article',
      name: 'article',
      component: () => import('../views/ArticleView.vue')
    },
  ]
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (to.meta.requiresAdmin && !userStore.isAdmin) {
    next('/')
  } else if (to.meta.requiresStaff && !userStore.isStaff) {
    next('/')
  } else if (to.meta.requiresPractitioner && !userStore.isPractitioner) {
    next('/')
  } else {
    next()
  }
})

export default router
