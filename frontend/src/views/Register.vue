<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const error = ref('');
const validationErrors = ref({});

const validateForm = () => {
  const errors = {};
  
  if (!form.value.username.trim()) {
    errors.username = 'Username is required';
  } else if (form.value.username.length < 3) {
    errors.username = 'Username must be at least 3 characters';
  }
  
  if (!form.value.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(form.value.email)) {
    errors.email = 'Email is invalid';
  }
  
  if (!form.value.password) {
    errors.password = 'Password is required';
  } else if (form.value.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }
  
  if (form.value.password !== form.value.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  validationErrors.value = errors;
  return Object.keys(errors).length === 0;
};

const handleSubmit = async () => {
  if (!validateForm()) return;
  
  try {
    error.value = '';
    await authStore.register({
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
    });
    
    // Redirect to dashboard after successful registration
    await router.push('/dashboard');
  } catch (err) {
    error.value = err.message || 'Failed to create account. Please try again.';
  }
};
</script>

<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <h1>Create an account</h1>
        <p>Get started with PaperTrail today</p>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <div v-if="error" class="alert alert-danger">
          {{ error }}
        </div>

        <div class="form-group">
          <label for="username" class="form-label">Username</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            class="form-control"
            :class="{ 'border-red-500': validationErrors.username }"
            placeholder="johndoe"
            required
            autocomplete="username"
          />
          <p v-if="validationErrors.username" class="mt-1 text-sm text-red-600">
            {{ validationErrors.username }}
          </p>
        </div>

        <div class="form-group">
          <label for="email" class="form-label">Email Address</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="form-control"
            :class="{ 'border-red-500': validationErrors.email }"
            placeholder="you@example.com"
            required
            autocomplete="email"
          />
          <p v-if="validationErrors.email" class="mt-1 text-sm text-red-600">
            {{ validationErrors.email }}
          </p>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            class="form-control"
            :class="{ 'border-red-500': validationErrors.password }"
            placeholder="••••••••"
            required
            autocomplete="new-password"
          />
          <p v-if="validationErrors.password" class="mt-1 text-sm text-red-600">
            {{ validationErrors.password }}
          </p>
        </div>

        <div class="form-group">
          <label for="confirmPassword" class="form-label">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            class="form-control"
            :class="{ 'border-red-500': validationErrors.confirmPassword }"
            placeholder="••••••••"
            required
            autocomplete="new-password"
          />
          <p v-if="validationErrors.confirmPassword" class="mt-1 text-sm text-red-600">
            {{ validationErrors.confirmPassword }}
          </p>
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
            Creating account...
          </span>
          <span v-else>Create Account</span>
        </button>
      </form>

      <div class="auth-footer">
        <p class="text-center text-sm text-gray-600">
          Already have an account?
          <router-link to="/login" class="font-medium text-primary hover:text-primary-dark">
            Sign in
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

.text-red-600 {
  @apply text-red-600;
}

.border-red-500 {
  @apply border-red-500;
}
</style>
