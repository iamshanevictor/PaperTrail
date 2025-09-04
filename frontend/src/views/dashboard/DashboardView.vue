<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <div class="welcome">
      <h2>Welcome, {{ user.username }}!</h2>
      <button @click="handleLogout" class="btn-logout">Logout</button>
    </div>
    
    <div class="resume-actions">
      <button @click="createNewResume" class="btn-primary">
        + Create New Resume
      </button>
    </div>

    <div v-if="loading" class="loading">Loading your resumes...</div>
    
    <div v-else>
      <h3>Your Resumes</h3>
      <div v-if="resumes.length === 0" class="no-resumes">
        <p>You don't have any resumes yet. Create your first one!</p>
      </div>
      <div v-else class="resume-list">
        <div v-for="resume in resumes" :key="resume.id" class="resume-card">
          <h4>{{ resume.title || 'Untitled Resume' }}</h4>
          <p>Last updated: {{ formatDate(resume.updated_at) }}</p>
          <div class="resume-actions">
            <button @click="editResume(resume.id)" class="btn-edit">Edit</button>
            <button @click="deleteResume(resume.id)" class="btn-delete">Delete</button>
            <button @click="exportResume(resume.id)" class="btn-export">Export PDF</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store';

export default {
  name: 'DashboardView',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const loading = ref(true);
    const resumes = ref([]);

    const user = authStore.user;

    const fetchResumes = async () => {
      try {
        loading.value = true;
        // This would be replaced with actual API call
        // const response = await api.resumes.getAll();
        // resumes.value = response.data;
        
        // Mock data for now
        resumes.value = [];
      } catch (error) {
        console.error('Failed to fetch resumes:', error);
      } finally {
        loading.value = false;
      }
    };

    const handleLogout = async () => {
      try {
        await authStore.logout();
        router.push('/login');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };

    const createNewResume = () => {
      router.push('/resumes/new');
    };

    const editResume = (id) => {
      router.push(`/resumes/${id}/edit`);
    };

    const deleteResume = async (id) => {
      if (confirm('Are you sure you want to delete this resume?')) {
        try {
          // await api.resumes.delete(id);
          await fetchResumes();
        } catch (error) {
          console.error('Failed to delete resume:', error);
        }
      }
    };

    const exportResume = async (id) => {
      try {
        // const response = await api.resumes.exportPdf(id);
        // Handle file download
        console.log('Exporting resume:', id);
      } catch (error) {
        console.error('Export failed:', error);
      }
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString();
    };

    onMounted(() => {
      fetchResumes();
    });

    return {
      user,
      loading,
      resumes,
      handleLogout,
      createNewResume,
      editResume,
      deleteResume,
      exportResume,
      formatDate
    };
  }
};
</script>

<style scoped>
.dashboard {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.welcome {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.btn-logout {
  padding: 0.5rem 1rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-logout:hover {
  background-color: #c0392b;
}

.resume-actions {
  margin: 1.5rem 0;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary:hover {
  background-color: #369f6b;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.no-resumes {
  text-align: center;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 4px;
  color: #666;
}

.resume-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.resume-card {
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.resume-card h4 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.resume-card p {
  margin: 0 0 1rem 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.resume-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.resume-actions button {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-edit {
  background-color: #3498db;
  color: white;
}

.btn-edit:hover {
  background-color: #2980b9;
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
}

.btn-delete:hover {
  background-color: #c0392b;
}

.btn-export {
  background-color: #9b59b6;
  color: white;
}

.btn-export:hover {
  background-color: #8e44ad;
}
</style>
