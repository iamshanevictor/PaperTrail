<script setup>
import { RouterView } from 'vue-router';
import { onMounted } from 'vue';
import { useAuthStore } from '@/store';
import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
import AppLoading from '@/components/ui/AppLoading.vue';

const authStore = useAuthStore();

// Check authentication status when the app loads
onMounted(async () => {
  await authStore.checkAuth();
});
</script>

<template>
  <div class="app-layout">
    <AppHeader />
    
    <main class="main-content">
      <RouterView v-slot="{ Component }">
        <Suspense>
          <component :is="Component" />
          <template #fallback>
            <AppLoading />
          </template>
        </Suspense>
      </RouterView>
    </main>
    
    <AppFooter />
  </div>
</template>

<style>
/* Global styles */
:root {
  --primary: #4f46e5;
  --primary-dark: #4338ca;
  --primary-light: #e0e7ff;
  --secondary: #10b981;
  --danger: #ef4444;
  --warning: #f59e0b;
  --info: #3b82f6;
  --light: #f9fafb;
  --dark: #111827;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --radius-sm: 0.25rem;
  --radius: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-full: 9999px;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  position: relative;
  font-weight: normal;
}

body {
  min-height: 100vh;
  color: var(--gray-900);
  background: var(--light);
  transition: color 0.5s, background-color 0.5s;
  line-height: 1.5;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-size: 16px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 2rem 1rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  line-height: 1.25;
  margin-bottom: 1rem;
  color: var(--gray-900);
}

h1 { font-size: 2.25rem; }
h2 { font-size: 1.75rem; }
h3 { font-size: 1.5rem; }
h4 { font-size: 1.25rem; }
h5 { font-size: 1.125rem; }
h6 { font-size: 1rem; }

p {
  margin-bottom: 1rem;
  line-height: 1.625;
}

a {
  color: var(--primary);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  transition: all 0.2s ease;
  cursor: pointer;
  border: 1px solid transparent;
  background-color: transparent;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: var(--primary);
  color: white;
  border-color: var(--primary);
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--primary-dark);
  border-color: var(--primary-dark);
}

.btn-outline {
  background-color: transparent;
  border: 1px solid var(--gray-300);
  color: var(--gray-700);
}

.btn-outline:hover:not(:disabled) {
  background-color: var(--gray-100);
  border-color: var(--gray-400);
}

.btn-danger {
  background-color: var(--danger);
  color: white;
  border-color: var(--danger);
}

.btn-danger:hover:not(:disabled) {
  background-color: #dc2626;
  border-color: #dc2626;
}

/* Forms */
.form-group {
  margin-bottom: 1.25rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--gray-700);
}

.form-control {
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--gray-900);
  background-color: white;
  background-clip: padding-box;
  border: 1px solid var(--gray-300);
  border-radius: var(--radius);
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  border-color: var(--primary);
  outline: 0;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

textarea.form-control {
  min-height: 100px;
  resize: vertical;
}

/* Cards */
.card {
  background: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--gray-200);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: var(--gray-900);
}

/* Alerts */
.alert {
  padding: 1rem;
  border-radius: var(--radius);
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.alert-success {
  background-color: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.alert-danger {
  background-color: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.alert-warning {
  background-color: #fffbeb;
  color: #92400e;
  border: 1px solid #fde68a;
}

.alert-info {
  background-color: #eff6ff;
  color: #1e40af;
  border: 1px solid #bfdbfe;
}

/* Utilities */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.text-center {
  text-align: center;
}

.mt-1 { margin-top: 0.25rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-3 { margin-top: 0.75rem; }
.mt-4 { margin-top: 1rem; }
.mt-6 { margin-top: 1.5rem; }
.mt-8 { margin-top: 2rem; }

.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 0.75rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }
.mb-8 { margin-bottom: 2rem; }

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.gap-2 {
  gap: 0.5rem;
}

.gap-4 {
  gap: 1rem;
}

/* Animations */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    padding: 1rem 0.5rem;
  }
  
  h1 { font-size: 1.875rem; }
  h2 { font-size: 1.5rem; }
  h3 { font-size: 1.25rem; }
}
</style>
