<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number, Array],
    default: '',
  },
  options: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(option => {
        if (typeof option === 'object') {
          return 'value' in option && 'label' in option;
        }
        return true;
      });
    },
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
  placeholder: {
    type: String,
    default: 'Select an option',
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
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
  loading: {
    type: Boolean,
    default: false,
  },
  searchable: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const searchQuery = ref('');

const selectClasses = computed(() => {
  const base = [
    'block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500',
    {
      'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500': props.error,
      'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500': !props.error,
      'opacity-50 bg-gray-50': props.disabled,
      'pl-3 pr-10': !props.multiple,
      'py-2': props.multiple,
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

const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value) {
    return props.options;
  }
  
  const query = searchQuery.value.toLowerCase();
  return props.options.filter(option => {
    const label = typeof option === 'object' ? option.label : option;
    return label.toLowerCase().includes(query);
  });
});

const selectedLabel = computed(() => {
  if (props.multiple) {
    const selected = props.options.filter(option => {
      const value = typeof option === 'object' ? option.value : option;
      return Array.isArray(props.modelValue) ? props.modelValue.includes(value) : false;
    });
    
    if (selected.length === 0) return props.placeholder;
    if (selected.length <= 2) {
      return selected.map(option => (typeof option === 'object' ? option.label : option)).join(', ');
    }
    return `${selected.length} selected`;
  }
  
  const selected = props.options.find(option => {
    const value = typeof option === 'object' ? option.value : option;
    return value === props.modelValue;
  });
  
  if (!selected) return props.placeholder;
  return typeof selected === 'object' ? selected.label : selected;
});

const isSelected = (option) => {
  const value = typeof option === 'object' ? option.value : option;
  
  if (props.multiple) {
    return Array.isArray(props.modelValue) ? props.modelValue.includes(value) : false;
  }
  
  return value === props.modelValue;
};

const toggleOption = (option) => {
  const value = typeof option === 'object' ? option.value : option;
  
  if (props.multiple) {
    const currentValue = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
    const index = currentValue.indexOf(value);
    
    if (index === -1) {
      currentValue.push(value);
    } else {
      currentValue.splice(index, 1);
    }
    
    emit('update:modelValue', currentValue);
  } else {
    emit('update:modelValue', value);
    isOpen.value = false;
  }
};

const clearSelection = (event) => {
  event.stopPropagation();
  emit('update:modelValue', props.multiple ? [] : null);
};

const closeOnClickOutside = (event) => {
  if (!event.target.closest('.select-container')) {
    isOpen.value = false;
  }
};

const onKeydown = (event) => {
  if (event.key === 'Escape') {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', closeOnClickOutside);
  document.addEventListener('keydown', onKeydown);
});

onUnmounted(() => {
  document.removeEventListener('click', closeOnClickOutside);
  document.removeEventListener('keydown', onKeydown);
});
</script>

<template>
  <div class="select-container relative">
    <label v-if="label" :for="id || name" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative">
      <div 
        @click="!disabled && (isOpen = !isOpen)"
        :class="[selectClasses, { 'cursor-pointer': !disabled }]"
        :tabindex="disabled ? -1 : 0"
      >
        <div class="flex justify-between items-center">
          <span class="truncate" :class="{ 'text-gray-500': !modelValue || (Array.isArray(modelValue) && modelValue.length === 0) }">
            {{ selectedLabel }}
          </span>
          <div class="flex items-center">
            <button 
              v-if="clearable && ((!multiple && modelValue) || (multiple && Array.isArray(modelValue) && modelValue.length > 0))"
              type="button"
              @click.stop="clearSelection"
              class="text-gray-400 hover:text-gray-500 mr-1"
              :disabled="disabled"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <svg 
              class="h-5 w-5 text-gray-400" 
              :class="{ 'transform rotate-180': isOpen }"
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor"
              aria-hidden="true"
            >
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      
      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div 
          v-show="isOpen"
          class="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg"
          :class="{ 'right-0': false, 'left-0': true }"
        >
          <div class="max-h-60 overflow-auto rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            <!-- Search input -->
            <div v-if="searchable" class="px-3 py-2 border-b border-gray-100 sticky top-0 bg-white z-10">
              <input
                type="text"
                v-model="searchQuery"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                placeholder="Search..."
                @click.stop
              />
            </div>
            
            <!-- Loading state -->
            <div v-if="loading" class="px-4 py-2 text-sm text-gray-500 flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </div>
            
            <!-- No results -->
            <div v-else-if="filteredOptions.length === 0" class="px-4 py-2 text-sm text-gray-500">
              No options found
            </div>
            
            <!-- Options list -->
            <template v-else>
              <div
                v-for="(option, index) in filteredOptions"
                :key="index"
                @click="toggleOption(option)"
                class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50"
                :class="{
                  'text-indigo-900 bg-indigo-100': isSelected(option),
                  'text-gray-900': !isSelected(option),
                }"
              >
                <div class="flex items-center">
                  <span class="block truncate">
                    {{ typeof option === 'object' ? option.label : option }}
                  </span>
                </div>
                
                <span 
                  v-if="isSelected(option)"
                  class="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600"
                >
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </span>
              </div>
            </template>
          </div>
        </div>
      </transition>
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
