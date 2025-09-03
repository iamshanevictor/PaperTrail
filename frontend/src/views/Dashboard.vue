<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useResumeStore } from '@/store';
import AppEmptyState from '@/components/ui/AppEmptyState.vue';
import AppLoading from '@/components/ui/AppLoading.vue';

const router = useRouter();
const resumeStore = useResumeStore();

const isLoading = ref(true);
const showNewResumeModal = ref(false);
const newResume = ref({
  title: '',
  theme: 'classic',
});

const fetchResumes = async () => {
  try {
    isLoading.value = true;
    await resumeStore.fetchResumes();
  } catch (error) {
    console.error('Failed to fetch resumes:', error);
  } finally {
    isLoading.value = false;
  }
};

const createNewResume = async () => {
  try {
    const resume = await resumeStore.createResume({
      title: newResume.value.title,
      theme: newResume.value.theme,
    });
    
    // Redirect to the new resume editor
    await router.push(`/resumes/${resume.id}`);
  } catch (error) {
    console.error('Failed to create resume:', error);
  } finally {
    showNewResumeModal.value = false;
    newResume.value = { title: '', theme: 'classic' };
  }
};

const deleteResume = async (id) => {
  if (!confirm('Are you sure you want to delete this resume? This action cannot be undone.')) {
    return;
  }
  
  try {
    await resumeStore.deleteResume(id);
  } catch (error) {
    console.error('Failed to delete resume:', error);
  }
};

const duplicateResume = async (resume) => {
  try {
    const newResume = await resumeStore.duplicateResume(resume.id);
    await router.push(`/resumes/${newResume.id}`);
  } catch (error) {
    console.error('Failed to duplicate resume:', error);
  }
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

onMounted(() => {
  fetchResumes();
});
</script>

<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">My Resumes</h1>
        <p class="mt-1 text-sm text-gray-500">
          Create and manage your professional resumes
        </p>
      </div>
      <button
        @click="showNewResumeModal = true"
        class="btn btn-primary"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        New Resume
      </button>
    </div>

    <div v-if="isLoading" class="mt-8">
      <AppLoading />
    </div>

    <div v-else-if="resumeStore.resumes.length === 0" class="mt-12">
      <AppEmptyState
        title="No resumes yet"
        description="Get started by creating your first resume."
        button-text="Create Resume"
        @action="showNewResumeModal = true"
      >
        <template #illustration>
          <svg class="mx-auto h-48 w-48 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </template>
      </AppEmptyState>
    </div>

    <div v-else class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div 
        v-for="resume in resumeStore.resumes" 
        :key="resume.id"
        class="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-200 border border-gray-200"
      >
        <div class="p-6">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900 truncate">
              {{ resume.title }}
            </h3>
            <div class="flex items-center space-x-2">
              <span 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="{
                  'bg-blue-100 text-blue-800': resume.theme === 'modern',
                  'bg-purple-100 text-purple-800': resume.theme === 'creative',
                  'bg-gray-100 text-gray-800': resume.theme === 'classic',
                  'bg-green-100 text-green-800': resume.theme === 'professional',
                }"
              >
                {{ resume.theme }}
              </span>
            </div>
          </div>
          
          <div class="mt-2 text-sm text-gray-500">
            Last updated {{ formatDate(resume.updated_at) }}
          </div>
          
          <div class="mt-4 flex items-center justify-between">
            <div class="flex space-x-2">
              <button
                @click="router.push(`/resumes/${resume.id}`)"
                class="btn btn-outline btn-sm"
              >
                Edit
              </button>
              <button
                @click="router.push(`/resumes/${resume.id}/preview`)"
                class="btn btn-outline btn-sm"
              >
                Preview
              </button>
            </div>
            
            <div class="relative" x-data="{ open: false }">
              <button 
                @click="open = !open"
                class="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
              
              <div 
                v-show="open"
                @click.away="open = false"
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
              >
                <div class="py-1" role="menu" aria-orientation="vertical">
                  <button
                    @click="duplicateResume(resume); open = false"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    role="menuitem"
                  >
                    Duplicate
                  </button>
                  <button
                    @click="router.push(`/resumes/${resume.id}/export`); open = false"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    role="menuitem"
                  >
                    Export PDF
                  </button>
                  <div class="border-t border-gray-100"></div>
                  <button
                    @click="deleteResume(resume.id); open = false"
                    class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 hover:text-red-700"
                    role="menuitem"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Resume Modal -->
    <div v-if="showNewResumeModal" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Create New Resume
                </h3>
                <div class="mt-4">
                  <div class="form-group">
                    <label for="resume-title" class="form-label">Resume Title</label>
                    <input
                      id="resume-title"
                      v-model="newResume.title"
                      type="text"
                      class="form-control"
                      placeholder="e.g. Software Engineer Resume"
                      autofocus
                    />
                  </div>
                  
                  <div class="form-group">
                    <label for="resume-theme" class="form-label">Theme</label>
                    <select
                      id="resume-theme"
                      v-model="newResume.theme"
                      class="form-control"
                    >
                      <option value="classic">Classic</option>
                      <option value="modern">Modern</option>
                      <option value="professional">Professional</option>
                      <option value="creative">Creative</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              @click="createNewResume"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              :disabled="!newResume.title.trim()"
            >
              Create Resume
            </button>
            <button
              type="button"
              @click="showNewResumeModal = false"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-header {
  @apply flex items-center justify-between pb-5 border-b border-gray-200;
}

.btn-sm {
  @apply px-3 py-1.5 text-sm;
}

.btn-outline {
  @apply border-gray-300 text-gray-700 bg-white hover:bg-gray-50;
}

.btn-outline:hover {
  @apply bg-gray-50;
}

/* Modal styles */
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
}

.modal-content {
  @apply bg-white rounded-lg w-full max-w-md p-6 mx-4 shadow-xl;
}
</style>
