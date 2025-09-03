<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'outline', 'ghost', 'link'].includes(value),
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value),
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'button',
  },
  icon: {
    type: Boolean,
    default: false,
  },
});

const buttonClasses = computed(() => {
  const base = [
    'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200',
    {
      'w-full': props.fullWidth,
      'opacity-70 cursor-not-allowed': props.loading || props.disabled,
      'cursor-wait': props.loading,
    },
  ];

  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 focus:ring-indigo-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500',
    ghost: 'text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500',
    link: 'text-indigo-600 hover:text-indigo-800 hover:underline focus:ring-indigo-500',
  };

  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-2 text-base',
    xl: 'px-6 py-3 text-base',
  };

  const iconSizes = {
    xs: 'p-1',
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2',
    xl: 'p-3',
  };

  base.push(variants[props.variant] || variants.primary);
  base.push(props.icon ? iconSizes[props.size] || iconSizes.md : sizes[props.size] || sizes.md);
  
  if (props.icon) {
    base.push('rounded-full');
  }

  return base;
});
</script>

<template>
  <button
    :type="type"
    :class="buttonClasses"
    :disabled="disabled || loading"
    class="transition-colors duration-200"
  >
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
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
    <slot v-else></slot>
  </button>
</template>
