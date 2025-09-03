import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store';

// Lazy load components for better performance
const Login = () => import('@/views/Login.vue');
const Register = () => import('@/views/Register.vue');
const Dashboard = () => import('@/views/Dashboard.vue');
const ResumeEditor = () => import('@/views/ResumeEditor.vue');
const ResumePreview = () => import('@/views/ResumePreview.vue');
const NotFound = () => import('@/views/NotFound.vue');

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guestOnly: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { guestOnly: true },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/resumes/:id',
    name: 'ResumeEditor',
    component: ResumeEditor,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'preview',
        name: 'ResumePreview',
        component: ResumePreview,
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  },
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = await authStore.checkAuth();

  // Redirect to login if route requires authentication and user is not authenticated
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } 
  // Redirect to dashboard if user is authenticated and tries to access guest-only routes
  else if (to.matched.some(record => record.meta.guestOnly) && isAuthenticated) {
    next({ name: 'Dashboard' });
  } 
  // Proceed to the requested route
  else {
    next();
  }
});

export default router;
