<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: 'No results found',
  },
  description: {
    type: String,
    default: 'Get started by creating a new item.',
  },
  buttonText: {
    type: String,
    default: 'New Item',
  },
  showButton: {
    type: Boolean,
    default: true,
  },
  icon: {
    type: [String, Boolean],
    default: true,
  },
  iconSize: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value),
  },
  align: {
    type: String,
    default: 'center',
    validator: (value) => ['left', 'center', 'right'].includes(value),
  },
  maxWidth: {
    type: String,
    default: '28rem',
  },
});

const emit = defineEmits(['action']);

const containerClasses = computed(() => ({
  'px-4 py-12 sm:px-6 lg:px-8': true,
  'text-center': props.align === 'center',
  'text-left': props.align === 'left',
  'text-right': props.align === 'right',
  'mx-auto': props.align === 'center',
}));

const iconSizeClasses = computed(() => ({
  'h-12 w-12': props.iconSize === 'sm',
  'h-16 w-16': props.iconSize === 'md',
  'h-20 w-20': props.iconSize === 'lg',
  'h-24 w-24': props.iconSize === 'xl',
}));

const defaultIcon = computed(() => {
  return `
    <svg class="${iconSizeClasses.value} text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  `;
});

const handleAction = () => {
  emit('action');
};
</script>

<template>
  <div :class="containerClasses" :style="{ maxWidth: maxWidth }">
    <!-- Icon -->
    <div 
      v-if="icon" 
      class="mx-auto flex-shrink-0 flex items-center justify-center text-gray-400"
      :class="{ 'mb-4': title || description }"
      v-html="typeof icon === 'string' ? icon : defaultIcon"
    ></div>
    
    <!-- Title -->
    <h3 
      v-if="title" 
      class="mt-2 text-lg font-medium text-gray-900"
      :class="{ 'mt-0': !icon }"
    >
      {{ title }}
    </h3>
    
    <!-- Description -->
    <p 
      v-if="description" 
      class="mt-1 text-sm text-gray-500"
      :class="{ 'mt-2': title, 'mt-0': !title }"
    >
      {{ description }}
    </p>
    
    <!-- Action Button -->
    <div 
      v-if="showButton && $slots.action"
      class="mt-6"
    >
      <slot name="action"></slot>
    </div>
    
    <div 
      v-else-if="showButton"
      class="mt-6"
    >
      <button
        type="button"
        @click="handleAction"
        class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>
