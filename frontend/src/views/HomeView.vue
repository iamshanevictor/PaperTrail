<template>
  <div class="resume-builder">
    <header class="header">
      <h1>Resume Builder</h1>
      <div class="actions">
        <button @click="resetResume" class="btn btn-outline">Reset</button>
        
        <!-- Template Selector -->
        <div class="dropdown">
          <button class="btn btn-outline dropdown-toggle" type="button" id="templateDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="fas fa-palette me-1"></i> Template: {{ currentTemplate.name }}
          </button>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="templateDropdown">
            <li v-for="template in availableTemplates" :key="template.id">
              <a class="dropdown-item" href="#" @click="setTemplate(template.id)">
                <div class="d-flex align-items-center">
                  <span class="template-preview" :style="{ backgroundColor: template.styles.primaryColor }"></span>
                  <div>
                    <div class="fw-bold">{{ template.name }}</div>
                    <small class="text-muted">{{ template.description }}</small>
                  </div>
                </div>
              </a>
            </li>
          </ul>
        </div>
        
        <!-- Export Dropdown -->
        <div class="dropdown">
          <button class="btn btn-primary dropdown-toggle" type="button" id="exportDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="fas fa-download me-1"></i> Export
          </button>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="exportDropdown">
            <li><a class="dropdown-item" href="#" @click="exportResume"><i class="fas fa-file-code me-2"></i>Export as JSON</a></li>
            <li><a class="dropdown-item" href="#" @click="exportToPDF"><i class="fas fa-file-pdf me-2"></i>Export as PDF</a></li>
          </ul>
        </div>
        <input 
          type="file" 
          ref="fileInput" 
          @change="importResume" 
          accept=".json" 
          style="display: none"
        >
        <button @click="triggerFileInput" class="btn btn-secondary">Import JSON</button>
      </div>
    </header>

    <div class="resume-container">
      <form @submit.prevent="savePersonalInfo" class="resume-form">
        <div class="form-section">
          <h2>Personal Information</h2>
          <div class="form-group">
            <label for="name">Full Name *</label>
            <input 
              type="text" 
              id="name" 
              v-model="resume.personalInfo.name"
              @blur="v$.personalInfo.name.$touch"
              :class="{ 'is-invalid': v$.personalInfo.name.$error }"
              class="form-control"
            >
            <div v-if="v$.personalInfo.name.$error" class="invalid-feedback">
              {{ v$.personalInfo.name.$errors[0].$message }}
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email *</label>
            <input 
              type="email" 
              id="email" 
              v-model="resume.personalInfo.email"
              @blur="v$.personalInfo.email.$touch"
              :class="{ 'is-invalid': v$.personalInfo.email.$error }"
              class="form-control"
            >
            <div v-if="v$.personalInfo.email.$error" class="invalid-feedback">
              {{ v$.personalInfo.email.$errors[0].$message }}
            </div>
          </div>

          <div class="form-group">
            <label for="phone">Phone *</label>
            <input 
              type="tel" 
              id="phone" 
              v-model="resume.personalInfo.phone"
              @blur="v$.personalInfo.phone.$touch"
              :class="{ 'is-invalid': v$.personalInfo.phone.$error }"
              class="form-control"
            >
            <div v-if="v$.personalInfo.phone.$error" class="invalid-feedback">
              {{ v$.personalInfo.phone.$errors[0].$message }}
            </div>
          </div>

          <div class="form-group">
            <label for="location">Location *</label>
            <input 
              type="text" 
              id="location" 
              v-model="resume.personalInfo.location"
              @blur="v$.personalInfo.location.$touch"
              :class="{ 'is-invalid': v$.personalInfo.location.$error }"
              class="form-control"
            >
            <div v-if="v$.personalInfo.location.$error" class="invalid-feedback">
              {{ v$.personalInfo.location.$errors[0].$message }}
            </div>
          </div>

          <div class="form-group">
            <label for="website">Website</label>
            <input 
              type="url" 
              id="website" 
              v-model="resume.personalInfo.website"
              @blur="v$.personalInfo.website.$touch"
              :class="{ 'is-invalid': v$.personalInfo.website.$error }"
              class="form-control"
              placeholder="https://"
            >
            <div v-if="v$.personalInfo.website.$error" class="invalid-feedback">
              {{ v$.personalInfo.website.$errors[0].$message }}
            </div>
          </div>

          <div class="form-group">
            <label for="summary">Professional Summary</label>
            <textarea 
              id="summary" 
              v-model="resume.personalInfo.summary"
              class="form-control"
              rows="4"
            ></textarea>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="v$.$invalid">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useResumeStore } from '@/store/resume';
import { storeToRefs } from 'pinia';
import { onMounted, ref, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength, maxLength, helpers } from '@vuelidate/validators';

export default {
  name: 'HomeView',
  
  setup() {
    // Store and Refs
    const resumeStore = useResumeStore();
    const { resume, currentTemplate, availableTemplates } = storeToRefs(resumeStore);
    const isLoading = ref(false);
    const formSubmitted = ref(false);
    const newSkill = ref('');
    const fileInput = ref(null);
    
    // Validation Rules
    const rules = {
      personalInfo: {
        name: { 
          required: helpers.withMessage('Name is required', required),
          minLength: minLength(2)
        },
        email: {
          required: helpers.withMessage('Email is required', required),
          email: helpers.withMessage('Must be a valid email', email)
        },
        phone: {
          required: helpers.withMessage('Phone number is required', required),
          minLength: minLength(10)
        },
        location: { 
          required: helpers.withMessage('Location is required', required) 
        },
        website: {
          validUrl: helpers.withMessage('Must be a valid URL', (value) => {
            if (!value) return true;
            try {
              new URL(value.startsWith('http') ? value : `https://${value}`);
              return true;
            } catch {
              return false;
            }
          })
        },
        summary: {
          maxLength: maxLength(500)
        }
      },
      experience: {
        required: helpers.withMessage('At least one experience is required', (value) => {
          return value && value.length > 0;
        }),
        $each: helpers.forEach({
          company: { required: helpers.withMessage('Company name is required', required) },
          position: { required: helpers.withMessage('Position is required', required) },
          startDate: { required: helpers.withMessage('Start date is required', required) },
          endDate: {
            required: helpers.withMessage('End date is required', (value, siblings) => {
              return !siblings.current;
            })
          },
          description: {}
        })
      },
      education: {
        required: helpers.withMessage('At least one education entry is required', (value) => {
          return value && value.length > 0;
        }),
        $each: helpers.forEach({
          institution: { required: helpers.withMessage('Institution is required', required) },
          degree: { required: helpers.withMessage('Degree is required', required) },
          field: { required: helpers.withMessage('Field of study is required', required) },
          startYear: { required: helpers.withMessage('Start year is required', required) },
          endYear: {
            required: helpers.withMessage('End year is required', (value, siblings) => {
              return !siblings.current;
            })
          }
        })
      }
    };
    
    // Initialize Vuelidate with the resume data
    const v$ = useVuelidate(rules, resume);
    
    // Lifecycle Hooks
    onMounted(() => {
      resumeStore.initTemplate();
    });
    
    // Methods
    const setTemplate = (templateId) => {
      resumeStore.setTemplate(templateId);
    };
    
    const savePersonalInfo = async () => {
      formSubmitted.value = true;
      const isValid = await v$.value.$validate();
      if (isValid) {
        resumeStore.updatePersonalInfo(resume.value.personalInfo);
      }
    };
    
    const saveExperience = async (exp, index) => {
      const expPath = `experience.${index}`;
      const expValid = await v$.value.experience.$each.$response.$results[index].$validate();
      
      if (expValid) {
        resumeStore.saveExperience({ ...exp, index });
      }
    };
    
    const saveEducation = async (edu, index) => {
      const eduPath = `education.${index}`;
      const eduValid = await v$.value.education.$each.$response.$results[index].$validate();
      
      if (eduValid) {
        resumeStore.saveEducation({ ...edu, index });
      }
    };
    
    const addExperience = () => {
      resumeStore.addExperience({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      });
    };
    
    const removeExperience = (index) => {
      if (confirm('Are you sure you want to remove this experience?')) {
        resumeStore.removeExperience(index);
      }
    };
    
    const addEducation = () => {
      resumeStore.addEducation({
        institution: '',
        degree: '',
        field: '',
        startYear: '',
        endYear: '',
        current: false
      });
    };
    
    const removeEducation = (index) => {
      if (confirm('Are you sure you want to remove this education entry?')) {
        resumeStore.removeEducation(index);
      }
    };
    
    const addNewSkill = () => {
      if (newSkill.value.trim()) {
        resumeStore.addSkill(newSkill.value.trim());
        newSkill.value = '';
      }
    };
    
    const removeSkill = (index) => {
      resume.value.skills.splice(index, 1);
    };
    
    const exportResume = () => {
      resumeStore.exportResume();
    };
    
    const importResume = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target.result);
            resumeStore.importResume(data);
          } catch (error) {
            console.error('Error parsing JSON file:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    
    const resetResume = () => {
      if (confirm('Are you sure you want to reset your resume? This cannot be undone.')) {
        resumeStore.resetResume();
      }
    };
    
    const handleCurrentWorkChange = (exp) => {
      if (exp.current) {
        exp.endDate = '';
      }
    };
    
    const handleCurrentStudyChange = (edu) => {
      if (edu.current) {
        edu.endYear = '';
      }
    };
    
    const validateField = (fieldPath) => {
      const field = v$.value[fieldPath];
      if (field) {
        field.$touch();
      }
    };
    
    const validateExperienceStartDate = (exp, index) => {
      if (exp.startDate && exp.endDate && exp.startDate > exp.endDate) {
        exp.endDate = '';
      }
      validateField(`experience.${index}.startDate`);
    };
    
    const validateExperienceEndDate = (exp, index) => {
      if (exp.startDate && exp.endDate && exp.startDate > exp.endDate) {
        exp.startDate = '';
      }
      validateField(`experience.${index}.endDate`);
    };
    
    const triggerFileInput = () => {
      fileInput.value.click();
    };
    
    const exportToPDF = async () => {
      try {
        isLoading.value = true;
        await resumeStore.exportToPDF();
      } finally {
        isLoading.value = false;
      }
    };
    
    // Return all reactive references and methods
    return {
      // Vuelidate instance
      // Refs
      resume,
      isLoading,
      formSubmitted,
      newSkill,
      fileInput,
      currentTemplate,
      availableTemplates,
      v$,
      
      // Methods
      setTemplate,
      exportToPDF,
      savePersonalInfo,
      saveExperience,
      saveEducation,
      addExperience,
      removeExperience,
      addEducation,
      removeEducation,
      addNewSkill,
      removeSkill,
      exportResume,
      importResume,
      resetResume,
      handleCurrentWorkChange,
      handleCurrentStudyChange,
      validateField,
      validateExperienceStartDate,
      validateExperienceEndDate,
      triggerFileInput,
      
      // Store methods and state
      ...resumeStore
    };
  }
};
</script>

<style scoped>
.resume-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.resume-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #eee;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
}

.form-control {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.form-control.is-invalid {
  border-color: #dc3545;
  padding-right: calc(1.5em + 0.75rem);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}

.invalid-feedback {
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: #dc3545;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.btn {
  display: inline-block;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.btn-primary {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0069d9;
  border-color: #0062cc;
}

.btn-primary:disabled {
  background-color: #6c757d;
  border-color: #6c757d;
  opacity: 0.65;
  cursor: not-allowed;
}

textarea.form-control {
  min-height: 100px;
  resize: vertical;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .resume-form {
    padding: 1rem;
  }
  
  .form-section h2 {
    font-size: 1.5rem;
  }
}
</style>
