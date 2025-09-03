<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/store';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const error = ref('');

const handleSubmit = async () => {
  try {
    error.value = '';
    await authStore.login({
      email: email.value,
      password: password.value,
    });
    
    // Redirect to the intended route or dashboard
    const redirectPath = route.query.redirect || '/';
    await router.push(redirectPath);
  } catch (err) {
    error.value = err.message || 'Failed to log in. Please check your credentials.';
  }
};

onMounted(() => {
  // Clear any previous auth errors
  authStore.error = null;
});
</script>

<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <h1>Welcome Back</h1>
        <p>Sign in to your PaperTrail account</p>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <div v-if="error" class="alert alert-danger">
          {{ error }}
        </div>

        <div class="form-group">
          <label for="email" class="form-label">Email Address</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="form-control"
            placeholder="you@example.com"
            required
            autocomplete="email"
          />
        </div>

        <div class="form-group">
          <div class="d-flex justify-between">
            <label for="password" class="form-label">Password</label>
            <router-link to="/forgot-password" class="text-sm text-primary">
              Forgot password?
            </router-link>
          </div>
          <input
            id="password"
            v-model="password"
            type="password"
            class="form-control"
            placeholder="••••••••"
            required
            autocomplete="current-password"
          />
        </div>

        <div class="form-group flex items-center">
          <input
            id="remember"
            v-model="rememberMe"
            type="checkbox"
            class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label for="remember" class="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>

        <button
          type="submit"
          class="btn btn-primary w-full"
          :disabled="authStore.loading"
        >
          <span v-if="authStore.loading" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
          </span>
          <span v-else>Sign In</span>
        </button>
      </form>

      <div class="auth-footer">
        <p class="text-center text-sm text-gray-600">
          Don't have an account?
          <router-link to="/register" class="font-medium text-primary hover:text-primary-dark">
            Sign up
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  @apply min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8;
}

.auth-container {
  @apply max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md;
}

.auth-header {
  @apply text-center;
}

.auth-header h1 {
  @apply text-3xl font-extrabold text-gray-900;
}

.auth-header p {
  @apply mt-2 text-sm text-gray-600;
}

.auth-form {
  @apply mt-8 space-y-6;
}

.auth-footer {
  @apply mt-6 text-center;
}

.d-flex {
  @apply flex;
}

.justify-between {
  @apply justify-between;
}

.text-sm {
  @apply text-sm;
}

.text-primary {
  @apply text-indigo-600;
}

.hover\:text-primary-dark:hover {
  @apply text-indigo-700;
}

.text-gray-600 {
  @apply text-gray-600;
}

.font-medium {
  @apply font-medium;
}

.ml-2 {
  @apply ml-2;
}

.block {
  @apply block;
}

.h-4 {
  @apply h-4;
}

.w-4 {
  @apply w-4;
}

.rounded {
  @apply rounded;
}

.focus\:ring-primary:focus {
  @apply ring-2 ring-offset-2 ring-indigo-500;
}

.border-gray-300 {
  @apply border-gray-300;
}

.text-gray-700 {
  @apply text-gray-700;
}

.text-white {
  @apply text-white;
}

.-ml-1 {
  @apply -ml-1;
}

.mr-2 {
  @apply mr-2;
}
</style>
