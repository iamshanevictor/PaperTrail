import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { auth } from '@/services/api';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const isAuthenticated = computed(() => !!user.value);
  const loading = ref(false);
  const error = ref(null);

  const login = async (credentials) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await auth.login(credentials);
      user.value = response.data.user;
      localStorage.setItem('token', response.data.access_token);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error || 'Login failed';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const register = async (userData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await auth.register(userData);
      user.value = response.data.user;
      localStorage.setItem('token', response.data.access_token);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error || 'Registration failed';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    localStorage.removeItem('token');
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const response = await auth.getMe();
      user.value = response.data.user;
      return true;
    } catch (err) {
      localStorage.removeItem('token');
      return false;
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    checkAuth,
  };
});

export const useResumeStore = defineStore('resume', () => {
  const resumes = ref([]);
  const currentResume = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const { resumes: resumeApi } = require('@/services/api');

  const fetchResumes = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await resumeApi.getAll();
      resumes.value = response.data;
      return resumes.value;
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to fetch resumes';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createResume = async (data) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await resumeApi.create(data);
      resumes.value.push(response.data);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to create resume';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateResume = async (id, data) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await resumeApi.update(id, data);
      const index = resumes.value.findIndex(r => r.id === id);
      if (index !== -1) {
        resumes.value[index] = response.data;
      }
      if (currentResume.value?.id === id) {
        currentResume.value = response.data;
      }
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to update resume';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteResume = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      await resumeApi.delete(id);
      resumes.value = resumes.value.filter(r => r.id !== id);
      if (currentResume.value?.id === id) {
        currentResume.value = null;
      }
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to delete resume';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const duplicateResume = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await resumeApi.duplicate(id);
      resumes.value.push(response.data);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to duplicate resume';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const exportPdf = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await resumeApi.exportPdf(id);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to export PDF';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const setCurrentResume = (resume) => {
    currentResume.value = resume;
  };

  return {
    resumes,
    currentResume,
    loading,
    error,
    fetchResumes,
    createResume,
    updateResume,
    deleteResume,
    duplicateResume,
    exportPdf,
    setCurrentResume,
  };
});

export const useSectionStore = defineStore('section', () => {
  const sections = ref([]);
  const currentSection = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const { sections: sectionApi } = require('@/services/api');

  const fetchSections = async (resumeId) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await sectionApi.getAll(resumeId);
      sections.value = response.data;
      return sections.value;
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to fetch sections';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createSection = async (resumeId, data) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await sectionApi.create(resumeId, data);
      sections.value.push(response.data);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to create section';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateSection = async (resumeId, sectionId, data) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await sectionApi.update(resumeId, sectionId, data);
      const index = sections.value.findIndex(s => s.id === sectionId);
      if (index !== -1) {
        sections.value[index] = response.data;
      }
      if (currentSection.value?.id === sectionId) {
        currentSection.value = response.data;
      }
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to update section';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteSection = async (resumeId, sectionId) => {
    loading.value = true;
    error.value = null;
    try {
      await sectionApi.delete(resumeId, sectionId);
      sections.value = sections.value.filter(s => s.id !== sectionId);
      if (currentSection.value?.id === sectionId) {
        currentSection.value = null;
      }
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to delete section';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateSectionsOrder = async (resumeId, updatedSections) => {
    loading.value = true;
    error.value = null;
    try {
      await sectionApi.updateOrder(resumeId, updatedSections);
      // Update local state with new order
      sections.value = updatedSections;
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to update sections order';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const setCurrentSection = (section) => {
    currentSection.value = section;
  };

  return {
    sections,
    currentSection,
    loading,
    error,
    fetchSections,
    createSection,
    updateSection,
    deleteSection,
    updateSectionsOrder,
    setCurrentSection,
  };
});

export const useEntryStore = defineStore('entry', () => {
  const entries = ref([]);
  const currentEntry = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const { entries: entryApi } = require('@/services/api');

  const fetchEntries = async (resumeId, sectionId) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await entryApi.getAll(resumeId, sectionId);
      entries.value = response.data;
      return entries.value;
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to fetch entries';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createEntry = async (resumeId, sectionId, data) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await entryApi.create(resumeId, sectionId, data);
      entries.value.push(response.data);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to create entry';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateEntry = async (resumeId, sectionId, entryId, data) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await entryApi.update(resumeId, sectionId, entryId, data);
      const index = entries.value.findIndex(e => e.id === entryId);
      if (index !== -1) {
        entries.value[index] = response.data;
      }
      if (currentEntry.value?.id === entryId) {
        currentEntry.value = response.data;
      }
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to update entry';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteEntry = async (resumeId, sectionId, entryId) => {
    loading.value = true;
    error.value = null;
    try {
      await entryApi.delete(resumeId, sectionId, entryId);
      entries.value = entries.value.filter(e => e.id !== entryId);
      if (currentEntry.value?.id === entryId) {
        currentEntry.value = null;
      }
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to delete entry';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateEntriesOrder = async (resumeId, sectionId, updatedEntries) => {
    loading.value = true;
    error.value = null;
    try {
      await entryApi.updateOrder(resumeId, sectionId, updatedEntries);
      // Update local state with new order
      entries.value = updatedEntries;
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to update entries order';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const setCurrentEntry = (entry) => {
    currentEntry.value = entry;
  };

  return {
    entries,
    currentEntry,
    loading,
    error,
    fetchEntries,
    createEntry,
    updateEntry,
    deleteEntry,
    updateEntriesOrder,
    setCurrentEntry,
  };
});
