import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

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
      // route level code-splitting
      // this generates a separate chunk (SignUp.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/SignUpView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/admin-dash',
      name: 'admin-dash',
      component: () => import('../views/AdminDashboardView.vue')
    },
    {
      path: '/locations-services',
      name: 'locations-services',
      component: () => import('../views/LocationsAndServicesView.vue')
    },
    {
      path: '/clinics-specialists',
      name: 'clinics-specialists',
      component: () => import('../views/ClinicsAndSpecialistsView.vue')
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
    {
      path: '/contact-us',
      name: 'contact-us',
      component: () => import('../views/ContactUsView.vue')
    }
  ]
})

export default router
