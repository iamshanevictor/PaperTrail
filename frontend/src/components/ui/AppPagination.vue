<script setup>
import { computed } from 'vue';
import { ChevronLeftIcon, ChevronRightIcon, EllipsisHorizontalIcon } from '@heroicons/vue/20/solid';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
    validator: (value) => value > 0,
  },
  totalItems: {
    type: Number,
    required: true,
    validator: (value) => value >= 0,
  },
  itemsPerPage: {
    type: Number,
    default: 10,
    validator: (value) => value > 0,
  },
  maxVisiblePages: {
    type: Number,
    default: 5,
    validator: (value) => value >= 3 && value <= 10,
  },
  showPageNumbers: {
    type: Boolean,
    default: true,
  },
  showPageInfo: {
    type: Boolean,
    default: true,
  },
  showPageSizeSelector: {
    type: Boolean,
    default: false,
  },
  pageSizeOptions: {
    type: Array,
    default: () => [10, 20, 50, 100],
    validator: (value) => value.every(item => Number.isInteger(item) && item > 0),
  },
  align: {
    type: String,
    default: 'center',
    validator: (value) => ['left', 'center', 'right', 'between'].includes(value),
  },
  variant: {
    type: String,
    default: 'default', // 'default', 'compact', 'minimal'
    validator: (value) => ['default', 'compact', 'minimal'].includes(value),
  },
});

const emit = defineEmits(['page-change', 'page-size-change']);

const totalPages = computed(() => {
  return Math.ceil(props.totalItems / props.itemsPerPage) || 1;
});

const startItem = computed(() => {
  return ((props.currentPage - 1) * props.itemsPerPage) + 1;
});

const endItem = computed(() => {
  const end = props.currentPage * props.itemsPerPage;
  return end > props.totalItems ? props.totalItems : end;
});

const pages = computed(() => {
  if (props.variant === 'minimal') return [];
  
  const pages = [];
  const half = Math.floor(props.maxVisiblePages / 2);
  let start = Math.max(1, props.currentPage - half);
  let end = Math.min(totalPages.value, start + props.maxVisiblePages - 1);
  
  if (end - start < props.maxVisiblePages - 1) {
    start = Math.max(1, end - props.maxVisiblePages + 1);
  }
  
  // Always show first page
  if (start > 1) {
    pages.push(1);
    if (start > 2) {
      pages.push('...');
    }
  }
  
  // Add middle pages
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  // Always show last page
  if (end < totalPages.value) {
    if (end < totalPages.value - 1) {
      pages.push('...');
    }
    pages.push(totalPages.value);
  }
  
  return pages;
});

const isFirstPage = computed(() => props.currentPage === 1);
const isLastPage = computed(() => props.currentPage === totalPages.value);

const changePage = (page) => {
  if (page < 1 || page > totalPages.value || page === props.currentPage) return;
  emit('page-change', page);
};

const changePageSize = (event) => {
  const newSize = parseInt(event.target.value, 10);
  if (newSize !== props.itemsPerPage) {
    emit('page-size-change', newSize);
  }
};

const getContainerClasses = computed(() => ({
  'flex items-center': true,
  'justify-start': props.align === 'left',
  'justify-center': props.align === 'center',
  'justify-end': props.align === 'right', 
  'justify-between': props.align === 'between',
  'space-x-2': props.align !== 'between',
  'flex-wrap gap-2': props.variant === 'minimal',
}));

const getButtonClasses = (isActive = false, isNav = false) => ({
  'relative inline-flex items-center px-4 py-2 border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500': true,
  'border-gray-300 bg-white text-gray-700 hover:bg-gray-50': !isActive && !isNav,
  'z-10 border-indigo-500 bg-indigo-50 text-indigo-600': isActive,
  'border-gray-300 bg-white text-gray-500 hover:bg-gray-50': isNav,
  'rounded-md': true,
  'px-2 py-1 text-xs': props.variant === 'compact',
  'px-3 py-1.5': props.variant === 'minimal',
});

const getPageInfoClasses = computed(() => ({
  'text-sm text-gray-700': true,
  'hidden sm:block': props.variant === 'minimal',
  'text-xs': props.variant === 'compact',
}));
</script>

<template>
  <div class="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
    <!-- Mobile view -->
    <div class="flex-1 flex justify-between sm:hidden">
      <button
        :disabled="isFirstPage"
        @click="changePage(currentPage - 1)"
        :class="[
          'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md',
          isFirstPage 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-white text-gray-700 hover:bg-gray-50'
        ]"
      >
        Previous
      </button>
      <div class="flex items-center justify-center px-4">
        <span class="text-sm text-gray-700">
          {{ currentPage }} / {{ totalPages }}
        </span>
      </div>
      <button
        :disabled="isLastPage"
        @click="changePage(currentPage + 1)"
        :class="[
          'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md',
          isLastPage 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-white text-gray-700 hover:bg-gray-50'
        ]"
      >
        Next
      </button>
    </div>

    <!-- Desktop view -->
    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <!-- Page info -->
      <div v-if="showPageInfo" :class="getPageInfoClasses">
        <p class="text-sm text-gray-700">
          Showing <span class="font-medium">{{ startItem }}</span> to <span class="font-medium">{{ endItem }}</span> of <span class="font-medium">{{ totalItems }}</span> results
        </p>
      </div>

      <!-- Page size selector -->
      <div v-if="showPageSizeSelector" class="flex items-center space-x-2">
        <span class="text-sm text-gray-700">Items per page:</span>
        <select
          :value="itemsPerPage"
          @change="changePageSize"
          class="block w-20 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option v-for="option in pageSizeOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>

      <!-- Pagination controls -->
      <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        <button
          :disabled="isFirstPage"
          @click="changePage(currentPage - 1)"
          :class="[
            'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium',
            isFirstPage 
              ? 'text-gray-300 cursor-not-allowed' 
              : 'text-gray-500 hover:bg-gray-50'
          ]"
          :aria-disabled="isFirstPage"
        >
          <span class="sr-only">Previous</span>
          <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
        </button>

        <!-- Page numbers -->
        <template v-if="showPageNumbers && variant !== 'minimal'">
          <button
            v-for="(page, index) in pages"
            :key="index"
            @click="typeof page === 'number' && changePage(page)"
            :class="[
              'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
              page === currentPage 
                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' 
                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
              { 'cursor-pointer': typeof page === 'number' }
            ]"
            :disabled="page === '...'"
            :aria-current="page === currentPage ? 'page' : undefined"
          >
            <template v-if="page === '...'">
              <span class="px-2">
                <EllipsisHorizontalIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </template>
            <template v-else>
              {{ page }}
            </template>
          </button>
        </template>
        
        <button
          :disabled="isLastPage"
          @click="changePage(currentPage + 1)"
          :class="[
            'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium',
            isLastPage 
              ? 'text-gray-300 cursor-not-allowed' 
              : 'text-gray-500 hover:bg-gray-50'
          ]"
          :aria-disabled="isLastPage"
        >
          <span class="sr-only">Next</span>
          <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
        </button>
      </nav>
    </div>
  </div>
</template>
