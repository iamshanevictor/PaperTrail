<script setup>
import { computed } from 'vue';

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value),
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'white', 'gray', 'black'].includes(value),
  },
  fullScreen: {
    type: Boolean,
    default: false,
  },
  text: {
    type: String,
    default: 'Loading...',
  },
  showText: {
    type: Boolean,
    default: true,
  },
  overlay: {
    type: Boolean,
    default: true,
  },
  zIndex: {
    type: [String, Number],
    default: 50,
  },
});

const spinnerSize = computed(() => {
  const sizes = {
    xs: 'h-4 w-4',
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-12 w-12',
  };
  return sizes[props.size] || sizes.md;
});

const spinnerColor = computed(() => {
  const colors = {
    primary: 'text-indigo-600',
    white: 'text-white',
    gray: 'text-gray-400',
    black: 'text-gray-900',
  };
  return colors[props.color] || colors.primary;
});

textColor = computed(() => {
  const colors = {
    primary: 'text-indigo-600',
    white: 'text-white',
    gray: 'text-gray-500',
    black: 'text-gray-900',
  };
  return colors[props.color] || colors.primary;
});

const containerClasses = computed(() => ({
  'fixed inset-0 flex items-center justify-center': props.fullScreen,
  'inline-flex items-center': !props.fullScreen,
  'z-50': props.fullScreen,
}));

const overlayClasses = computed(() => ({
  'fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity': props.overlay && props.fullScreen,
  'z-40': props.overlay && props.fullScreen,
}));
</script>

<template>
  <div>
    <!-- Overlay -->
    <div 
      v-if="overlay && fullScreen" 
      :class="overlayClasses"
      aria-hidden="true"
    ></div>
    
    <!-- Spinner container -->
    <div :class="containerClasses" :style="{ zIndex: fullScreen ? zIndex : 'auto' }">
      <div class="flex flex-col items-center">
        <!-- Spinner -->
        <svg 
          class="animate-spin" 
          :class="[spinnerSize, spinnerColor]" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle 
            class="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            stroke-width="4"
          ></circle>
          <path 
            class="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        
        <!-- Loading text -->
        <span 
          v-if="showText && text" 
          class="mt-2" 
          :class="[textColor, {
            'text-xs': size === 'xs',
            'text-sm': size === 'sm',
            'text-base': size === 'md',
            'text-lg': size === 'lg',
            'text-xl': size === 'xl',
          }]"
        >
          {{ text }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
