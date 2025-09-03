<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date', 'time', 'datetime-local', 'month', 'week', 'color'].includes(value),
  },
  placeholder: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  autocomplete: {
    type: String,
    default: 'off',
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
  error: {
    type: [String, Boolean],
    default: false,
  },
  helperText: {
    type: String,
    default: '',
  },
  leadingIcon: {
    type: String,
    default: '',
  },
  trailingIcon: {
    type: String,
    default: '',
  },
  leadingAddon: {
    type: String,
    default: '',
  },
  trailingAddon: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

const inputClasses = computed(() => {
  const base = [
    'block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500',
    {
      'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500': props.error,
      'border-gray-300 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500': !props.error,
      'opacity-50 bg-gray-50': props.disabled || props.readonly,
      'pl-10': props.leadingIcon,
      'pr-10': props.trailingIcon,
      'pl-3': !props.leadingIcon && !props.leadingAddon,
      'pr-3': !props.trailingIcon && !props.trailingAddon,
      'rounded-l-none': props.leadingAddon,
      'rounded-r-none': props.trailingAddon,
    },
  ];

  const sizes = {
    sm: 'py-1.5 text-xs',
    md: 'py-2 text-sm',
    lg: 'py-3 text-base',
  };

  base.push(sizes[props.size] || sizes.md);
  
  return base;
});

const wrapperClasses = computed(() => ({
  'mt-1 relative rounded-md shadow-sm': true,
  'flex': props.leadingAddon || props.trailingAddon,
}));

const leadingAddonClasses = computed(() => ({
  'inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm': true,
  'text-xs': props.size === 'sm',
  'text-sm': props.size === 'md',
  'text-base': props.size === 'lg',
}));

const trailingAddonClasses = computed(() => ({
  'inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm': true,
  'text-xs': props.size === 'sm',
  'text-sm': props.size === 'md',
  'text-base': props.size === 'lg',
}));

const updateValue = (event) => {
  emit('update:modelValue', event.target.value);
};
</script>

<template>
  <div>
    <label v-if="label" :for="id || name" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div :class="wrapperClasses">
      <!-- Leading addon -->
      <span v-if="leadingAddon" :class="leadingAddonClasses">
        {{ leadingAddon }}
      </span>
      
      <!-- Leading icon -->
      <div v-if="leadingIcon" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span class="h-5 w-5 text-gray-400" v-html="leadingIcon"></span>
      </div>
      
      <!-- Input -->
      <input
        :id="id || name"
        :name="name || id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :autocomplete="autocomplete"
        :class="inputClasses"
        @input="updateValue"
      />
      
      <!-- Trailing icon -->
      <div v-if="trailingIcon" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <span class="h-5 w-5 text-gray-400" v-html="trailingIcon"></span>
      </div>
      
      <!-- Trailing addon -->
      <span v-if="trailingAddon" :class="trailingAddonClasses">
        {{ trailingAddon }}
      </span>
    </div>
    
    <!-- Error message -->
    <p v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>
    
    <!-- Helper text -->
    <p v-else-if="helperText" class="mt-1 text-sm text-gray-500">
      {{ helperText }}
    </p>
  </div>
</template>
