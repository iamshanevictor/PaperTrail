<script setup>
import { computed, onMounted, onUnmounted, watch } from 'vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl'].includes(value),
  },
  closeOnClickOutside: {
    type: Boolean,
    default: true,
  },
  closeOnEscape: {
    type: Boolean,
    default: true,
  },
  showCloseButton: {
    type: Boolean,
    default: true,
  },
  fullscreen: {
    type: Boolean,
    default: false,
  },
  scrollable: {
    type: Boolean,
    default: false,
  },
  centered: {
    type: Boolean,
    default: false,
  },
  backdropClass: {
    type: String,
    default: 'bg-black bg-opacity-50',
  },
  modalClass: {
    type: String,
    default: '',
  },
  headerClass: {
    type: String,
    default: '',
  },
  bodyClass: {
    type: String,
    default: '',
  },
  footerClass: {
    type: String,
    default: 'bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse',
  },
});

const emit = defineEmits(['update:show', 'close', 'opened', 'closed']);

const modalSizes = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
  '3xl': 'sm:max-w-3xl',
  '4xl': 'sm:max-w-4xl',
  '5xl': 'sm:max-w-5xl',
  '6xl': 'sm:max-w-6xl',
  '7xl': 'sm:max-w-7xl',
};

const close = () => {
  emit('update:show', false);
  emit('close');
};

const handleKeydown = (event) => {
  if (event.key === 'Escape' && props.show && props.closeOnEscape) {
    close();
  }
};

const handleBackdropClick = (event) => {
  if (event.target === event.currentTarget && props.closeOnClickOutside) {
    close();
  }
};

// Handle body scroll when modal is open
const setBodyOverflow = (hidden) => {
  document.body.style.overflow = hidden ? 'hidden' : '';
};

watch(() => props.show, (newVal) => {
  if (newVal) {
    setBodyOverflow(true);
    emit('opened');
  } else {
    setBodyOverflow(false);
    emit('closed');
  }
}, { immediate: true });

// Cleanup on unmount
onUnmounted(() => {
  setBodyOverflow(false);
  document.removeEventListener('keydown', handleKeydown);
});

// Add/remove event listeners
onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});
</script>

<template>
  <transition
    enter-active-class="ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-show="show"
      class="fixed inset-0 z-50 overflow-y-auto"
      :class="backdropClass"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      @click="handleBackdropClick"
    >
      <div class="min-h-screen px-4 text-center">
        <!-- Overlay -->
        <transition
          enter-active-class="ease-out duration-300"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="ease-in duration-200"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-show="show"
            class="fixed inset-0 transition-opacity"
            aria-hidden="true"
          >
            <div class="absolute inset-0 opacity-75" :class="backdropClass"></div>
          </div>
        </transition>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span class="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>

        <!-- Modal panel -->
        <transition
          enter-active-class="ease-out duration-300"
          enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to-class="opacity-100 translate-y-0 sm:scale-100"
          leave-active-class="ease-in duration-200"
          leave-from-class="opacity-100 translate-y-0 sm:scale-100"
          leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            v-show="show"
            class="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
            :class="[
              modalSizes[size],
              { 'max-w-full': fullscreen },
              { 'my-8': !fullscreen },
              { 'h-screen': fullscreen },
              { 'max-h-screen': scrollable || fullscreen },
              { 'flex flex-col': scrollable || fullscreen },
              modalClass
            ]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <!-- Header -->
            <div 
              v-if="$slots.header || title" 
              class="flex items-center justify-between pb-3 border-b border-gray-200"
              :class="headerClass"
            >
              <div class="flex-1">
                <slot name="header">
                  <h3 
                    v-if="title" 
                    class="text-lg font-medium leading-6 text-gray-900" 
                    id="modal-title"
                  >
                    {{ title }}
                  </h3>
                </slot>
              </div>
              
              <button
                v-if="showCloseButton"
                type="button"
                class="text-gray-400 hover:text-gray-500 focus:outline-none"
                @click="close"
              >
                <span class="sr-only">Close</span>
                <XMarkIcon class="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <!-- Body -->
            <div 
              class="mt-4"
              :class="[{ 'overflow-y-auto': scrollable || fullscreen }, bodyClass]"
            >
              <slot></slot>
            </div>

            <!-- Footer -->
            <div 
              v-if="$slots.footer" 
              class="mt-5 border-t border-gray-200"
              :class="footerClass"
            >
              <slot name="footer"></slot>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </transition>
</template>
