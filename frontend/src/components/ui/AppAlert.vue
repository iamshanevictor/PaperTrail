<script setup>
import { computed } from 'vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'success', 'warning', 'error'].includes(value),
  },
  title: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    default: '',
  },
  showIcon: {
    type: Boolean,
    default: true,
  },
  dismissible: {
    type: Boolean,
    default: false,
  },
  show: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['dismiss', 'update:show']);

const alertClasses = computed(() => {
  const base = ['rounded-md p-4'];
  
  const variants = {
    info: 'bg-blue-50 border border-blue-200',
    success: 'bg-green-50 border border-green-200',
    warning: 'bg-yellow-50 border border-yellow-200',
    error: 'bg-red-50 border border-red-200',
  };
  
  base.push(variants[props.type] || variants.info);
  
  return base;
});

const iconClasses = computed(() => {
  const base = ['h-5 w-5'];
  
  const variants = {
    info: 'text-blue-400',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400',
  };
  
  base.push(variants[props.type] || variants.info);
  
  return base;
});

const titleClasses = computed(() => {
  const base = ['text-sm font-medium'];
  
  const variants = {
    info: 'text-blue-800',
    success: 'text-green-800',
    warning: 'text-yellow-800',
    error: 'text-red-800',
  };
  
  base.push(variants[props.type] || variants.info);
  
  return base;
});

const messageClasses = computed(() => {
  const base = ['mt-2 text-sm'];
  
  const variants = {
    info: 'text-blue-700',
    success: 'text-green-700',
    warning: 'text-yellow-700',
    error: 'text-red-700',
  };
  
  base.push(variants[props.type] || variants.info);
  
  return base;
});

const getIcon = () => {
  const icons = {
    info: (
      <svg class={iconClasses.value} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h.01a1 1 0 100-2H10V9z" clip-rule="evenodd" />
      </svg>
    ),
    success: (
      <svg class={iconClasses.value} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
    ),
    warning: (
      <svg class={iconClasses.value} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
    ),
    error: (
      <svg class={iconClasses.value} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
    ),
  };
  
  return icons[props.type] || icons.info;
};

const handleDismiss = () => {
  emit('dismiss');
  emit('update:show', false);
};
</script>

<template>
  <div v-if="show" :class="alertClasses">
    <div class="flex">
      <div v-if="showIcon" class="flex-shrink-0">
        <component :is="getIcon" />
      </div>
      <div class="ml-3 flex-1">
        <div v-if="title" :class="titleClasses">
          {{ title }}
        </div>
        <div v-if="message || $slots.default" :class="messageClasses">
          <slot>
            {{ message }}
          </slot>
        </div>
      </div>
      <div v-if="dismissible" class="ml-4">
        <button
          type="button"
          class="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
          :class="{
            'text-blue-400 hover:text-blue-500 focus:ring-blue-500': type === 'info',
            'text-green-400 hover:text-green-500 focus:ring-green-500': type === 'success',
            'text-yellow-400 hover:text-yellow-500 focus:ring-yellow-500': type === 'warning',
            'text-red-400 hover:text-red-500 focus:ring-red-500': type === 'error',
          }"
          @click="handleDismiss"
        >
          <span class="sr-only">Dismiss</span>
          <XMarkIcon class="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.alert-enter-active,
.alert-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.alert-enter-from,
.alert-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
