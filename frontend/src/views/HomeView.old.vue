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
      <div class="resume-form">
        <section class="section">
          <h2>Personal Information</h2>
          <form @submit.prevent="savePersonalInfo">
            <div class="form-group" :class="{ 'has-error': v$.personalInfo.name.$errors.length }">
              <label>Full Name *</label>
              <input 
                v-model="resume.personalInfo.name" 
                type="text" 
                class="form-control"
                :class="{ 'is-invalid': formSubmitted && v$.personalInfo.name.$error }"
                @blur="validateField('personalInfo.name')"
              >
              <div class="invalid-feedback" v-for="error in v$.personalInfo.name.$errors" :key="error.$uid">
                {{ error.$message }}
              </div>
            </div>
            
            <div class="form-group" :class="{ 'has-error': v$.personalInfo.email.$errors.length }">
              <label>Email *</label>
              <input 
                v-model="resume.personalInfo.email" 
                type="email" 
                class="form-control"
                :class="{ 'is-invalid': formSubmitted && v$.personalInfo.email.$error }"
                @blur="validateField('personalInfo.email')"
              >
              <div class="invalid-feedback" v-for="error in v$.personalInfo.email.$errors" :key="error.$uid">
                {{ error.$message }}
              </div>
            </div>
            
            <div class="form-group" :class="{ 'has-error': v$.personalInfo.phone.$errors.length }">
              <label>Phone *</label>
              <input 
                v-model="resume.personalInfo.phone" 
                type="tel" 
                class="form-control"
                :class="{ 'is-invalid': formSubmitted && v$.personalInfo.phone.$error }"
                @blur="validateField('personalInfo.phone')"
              >
              <div class="invalid-feedback" v-for="error in v$.personalInfo.phone.$errors" :key="error.$uid">
                {{ error.$message }}
              </div>
            </div>
            
            <div class="form-group" :class="{ 'has-error': v$.personalInfo.location.$errors.length }">
              <label>Location *</label>
              <input 
                v-model="resume.personalInfo.location" 
                type="text" 
                class="form-control"
                :class="{ 'is-invalid': formSubmitted && v$.personalInfo.location.$error }"
                @blur="validateField('personalInfo.location')"
              >
              <div class="invalid-feedback" v-for="error in v$.personalInfo.location.$errors" :key="error.$uid">
                {{ error.$message }}
              </div>
            </div>
            
            <div class="form-group" :class="{ 'has-error': v$.personalInfo.website.$errors.length }">
              <label>Website/Portfolio</label>
              <input 
                v-model="resume.personalInfo.website" 
                type="url" 
                class="form-control"
                :class="{ 'is-invalid': formSubmitted && v$.personalInfo.website.$error }"
                @blur="validateField('personalInfo.website')"
                placeholder="https://example.com"
              >
              <div class="invalid-feedback" v-for="error in v$.personalInfo.website.$errors" :key="error.$uid">
                {{ error.$message }}
              </div>
            </div>
            
            <div class="form-group" :class="{ 'has-error': v$.personalInfo.summary.$errors.length }">
              <label>Professional Summary</label>
              <textarea 
                v-model="resume.personalInfo.summary" 
                class="form-control" 
                rows="4"
                :class="{ 'is-invalid': formSubmitted && v$.personalInfo.summary.$error }"
                @blur="validateField('personalInfo.summary')"
              ></textarea>
              <div class="invalid-feedback" v-for="error in v$.personalInfo.summary.$errors" :key="error.$uid">
                {{ error.$message }}
              </div>
              <small class="text-muted">{{ resume.personalInfo.summary?.length || 0 }}/500 characters</small>
            </div>
            
            <div class="form-group mt-3">
              <button type="submit" class="btn btn-primary" :disabled="v$.$invalid">
                <i class="fas fa-save me-1"></i> Save Changes
              </button>
            </div>
          </form>
        </section>

        <section class="section form-section">
          <div class="section-header d-flex justify-content-between align-items-center mb-3">
            <h2>Experience</h2>
            <button @click="addExperience" class="btn btn-sm btn-outline">
              <i class="fas fa-plus me-1"></i> Add Experience
            </button>
          </div>
          
          <div v-for="(exp, index) in resume.experience" :key="index" class="card mb-3">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <h5 class="card-title">{{ exp.position || 'Position' }}</h5>
                <button @click="removeExperience(index)" class="btn btn-sm btn-outline-danger">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              
              <form @submit.prevent="saveExperience(index)">
                <div class="form-group" :class="{ 'has-error': v$.experience.$each.$response.$errors[index]?.company?.length }">
                  <label class="required">Company</label>
                  <input 
                    v-model="exp.company" 
                    type="text" 
                    class="form-control"
                    :class="{ 'is-invalid': formSubmitted && v$.experience.$each.$response.$errors[index]?.company?.length }"
                    @blur="validateField(`experience.${index}.company`)"
                  >
                  <div class="invalid-feedback" v-for="error in v$.experience.$each.$response.$errors[index]?.company" :key="error.$uid">
                    {{ error.$message }}
                  </div>
                </div>
                
                <div class="form-group" :class="{ 'has-error': v$.experience.$each.$response.$errors[index]?.position?.length }">
                  <label class="required">Position</label>
                  <input 
                    v-model="exp.position" 
                    type="text" 
                    class="form-control"
                    :class="{ 'is-invalid': formSubmitted && v$.experience.$each.$response.$errors[index]?.position?.length }"
                    @blur="validateField(`experience.${index}.position`)"
                  >
                  <div class="invalid-feedback" v-for="error in v$.experience.$each.$response.$errors[index]?.position" :key="error.$uid">
                    {{ error.$message }}
                  </div>
                </div>
                
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group" :class="{ 'has-error': v$.experience.$each.$response.$errors[index]?.startDate?.length }">
                      <label class="required">Start Date</label>
                      <input 
                        v-model="exp.startDate" 
                        type="date" 
                        class="form-control"
                        :class="{ 'is-invalid': formSubmitted && v$.experience.$each.$response.$errors[index]?.startDate?.length }"
                        @change="validateExperienceStartDate(index)"
                      >
                      <div class="invalid-feedback" v-for="error in v$.experience.$each.$response.$errors[index]?.startDate" :key="error.$uid">
                        {{ error.$message }}
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group" :class="{ 'has-error': v$.experience.$each.$response.$errors[index]?.endDate?.length }">
                      <label :class="{ 'required': !exp.current }">End Date</label>
                      <input 
                        v-model="exp.endDate" 
                        type="date" 
                        class="form-control"
                        :class="{ 'is-invalid': formSubmitted && v$.experience.$each.$response.$errors[index]?.endDate?.length }"
                        :disabled="exp.current"
                        @change="validateExperienceEndDate(index)"
                      >
                      <div class="invalid-feedback" v-for="error in v$.experience.$each.$response.$errors[index]?.endDate" :key="error.$uid">
                        {{ error.$message }}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="form-check mb-3">
                  <input 
                    type="checkbox" 
                    class="form-check-input" 
                    :id="`current-${index}`" 
                    v-model="exp.current"
                    @change="handleCurrentWorkChange(exp)"
                  >
                  <label class="form-check-label" :for="`current-${index}`">
                    I currently work here
                  </label>
                </div>
                
                <div class="form-group">
                  <label>Description</label>
                  <textarea 
                    v-model="exp.description" 
                    class="form-control" 
                    rows="3"
                    :class="{ 'is-invalid': formSubmitted && v$.experience.$each.$response.$errors[index]?.description?.length }"
                    @blur="validateField(`experience.${index}.description`)"
                  ></textarea>
                  <div class="invalid-feedback" v-for="error in v$.experience.$each.$response.$errors[index]?.description" :key="error.$uid">
                    {{ error.$message }}
                  </div>
                  <small class="text-muted">{{ exp.description?.length || 0 }}/1000 characters</small>
                </div>
                
                <button type="submit" class="btn btn-primary btn-sm" :disabled="v$.experience.$each.$response.$errors[index]?.$anyError">
                  <i class="fas fa-save me-1"></i> Save
                </button>
              </form>
            </div>
          </div>
        </section>

        <section class="section form-section">
          <div class="section-header d-flex justify-content-between align-items-center mb-3">
            <h2>Education</h2>
            <button @click="addEducation" class="btn btn-sm btn-outline">
              <i class="fas fa-plus me-1"></i> Add Education
            </button>
          </div>
          
          <div v-for="(edu, index) in resume.education" :key="index" class="card mb-3">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <h5 class="card-title">{{ edu.degree || 'Degree' }}</h5>
                <button @click="removeEducation(index)" class="btn btn-sm btn-outline-danger">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              
              <form @submit.prevent="saveEducation(index)">
                <div class="form-group" :class="{ 'has-error': v$.education.$each.$response.$errors[index]?.institution?.length }">
                  <label class="required">Institution</label>
                  <input 
                    v-model="edu.institution" 
                    type="text" 
                    class="form-control"
                    :class="{ 'is-invalid': formSubmitted && v$.education.$each.$response.$errors[index]?.institution?.length }"
                    @blur="validateField(`education.${index}.institution`)"
                  >
                  <div class="invalid-feedback" v-for="error in v$.education.$each.$response.$errors[index]?.institution" :key="error.$uid">
                    {{ error.$message }}
                  </div>
                </div>
                
                <div class="form-group" :class="{ 'has-error': v$.education.$each.$response.$errors[index]?.degree?.length }">
                  <label class="required">Degree</label>
                  <input 
                    v-model="edu.degree" 
                    type="text" 
                    class="form-control"
                    :class="{ 'is-invalid': formSubmitted && v$.education.$each.$response.$errors[index]?.degree?.length }"
                    @blur="validateField(`education.${index}.degree`)"
                  >
                  <div class="invalid-feedback" v-for="error in v$.education.$each.$response.$errors[index]?.degree" :key="error.$uid">
                    {{ error.$message }}
                  </div>
                </div>
                
                <div class="form-group" :class="{ 'has-error': v$.education.$each.$response.$errors[index]?.field?.length }">
                  <label class="required">Field of Study</label>
                  <input 
                    v-model="edu.field" 
                    type="text" 
                    class="form-control"
                    :class="{ 'is-invalid': formSubmitted && v$.education.$each.$response.$errors[index]?.field?.length }"
                    @blur="validateField(`education.${index}.field`)"
                  >
                  <div class="invalid-feedback" v-for="error in v$.education.$each.$response.$errors[index]?.field" :key="error.$uid">
                    {{ error.$message }}
                  </div>
                </div>
                
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group" :class="{ 'has-error': v$.education.$each.$response.$errors[index]?.startYear?.length }">
                      <label class="required">Start Year</label>
                      <input 
                        v-model.number="edu.startYear" 
                        type="number" 
                        class="form-control"
                        :class="{ 'is-invalid': formSubmitted && v$.education.$each.$response.$errors[index]?.startYear?.length }"
                        min="1900"
                        :max="new Date().getFullYear()"
                        @blur="validateField(`education.${index}.startYear`)"
                      >
                      <div class="invalid-feedback" v-for="error in v$.education.$each.$response.$errors[index]?.startYear" :key="error.$uid">
                        {{ error.$message }}
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group" :class="{ 'has-error': v$.education.$each.$response.$errors[index]?.endYear?.length }">
                      <label :class="{ 'required': !edu.current }">End Year</label>
                      <input 
                        v-model.number="edu.endYear" 
                        type="number" 
                        class="form-control"
                        :class="{ 'is-invalid': formSubmitted && v$.education.$each.$response.$errors[index]?.endYear?.length }"
                        :min="edu.startYear || new Date().getFullYear() - 50"
                        :max="new Date().getFullYear()"
                        :disabled="edu.current"
                        @blur="validateField(`education.${index}.endYear`)"
                      >
                      <div class="invalid-feedback" v-for="error in v$.education.$each.$response.$errors[index]?.endYear" :key="error.$uid">
                        {{ error.$message }}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="form-check mb-3">
                  <input 
                    type="checkbox" 
                    class="form-check-input" 
                    :id="`edu-current-${index}`" 
                    v-model="edu.current"
                    @change="handleCurrentStudyChange(edu)"
                  >
                  <label class="form-check-label" :for="`edu-current-${index}`">
                    Currently studying here
                  </label>
                </div>
                
                <div class="form-group">
                  <label>Description</label>
                  <textarea 
                    v-model="edu.description" 
                    class="form-control" 
                    rows="3"
                    :class="{ 'is-invalid': formSubmitted && v$.education.$each.$response.$errors[index]?.description?.length }"
                    @blur="validateField(`education.${index}.description`)"
                  ></textarea>
                  <div class="invalid-feedback" v-for="error in v$.education.$each.$response.$errors[index]?.description" :key="error.$uid">
                    {{ error.$message }}
                  </div>
                  <small class="text-muted">{{ edu.description?.length || 0 }}/500 characters</small>
                </div>
                
                <button type="submit" class="btn btn-primary btn-sm" :disabled="v$.education.$each.$response.$errors[index]?.$anyError">
                  <i class="fas fa-save me-1"></i> Save
                </button>
              </form>
            </div>
          </div>
        </section>

        <section class="section">
          <div class="section-header">
            <h2>Skills</h2>
          </div>
          <div class="form-group">
            <div class="skills-input">
              <input 
                v-model="newSkill" 
                type="text" 
                class="form-control" 
                placeholder="Add a skill and press Enter"
                @keyup.enter="addNewSkill"
              >
              <button @click="addNewSkill" class="btn btn-sm btn-primary">Add</button>
            </div>
            <div class="skills-tags">
              <span v-for="(skill, index) in resume.skills" :key="index" class="badge">
                {{ skill }}
                <span @click="removeSkill(index)" class="remove-tag">×</span>
              </span>
            </div>
          </div>
        </section>
      </div>

      <div id="resume-pdf" class="resume-preview">
        <div class="resume-paper">
          <header class="resume-header">
            <h1>{{ resume.personalInfo.name || 'Your Name' }}</h1>
            <div class="contact-info">
              <span v-if="resume.personalInfo.email">{{ resume.personalInfo.email }}</span>
              <span v-if="resume.personalInfo.phone">{{ resume.personalInfo.phone }}</span>
              <span v-if="resume.personalInfo.website">{{ resume.personalInfo.website }}</span>
            </div>
          </header>

          <section v-if="resume.personalInfo.summary" class="resume-section">
            <h2>Summary</h2>
            <p>{{ resume.personalInfo.summary }}</p>
          </section>

          <section v-if="resume.experience.length > 0" class="resume-section">
            <h2>Experience</h2>
            <div v-for="(exp, index) in resume.experience" :key="'exp-prev-' + index" class="experience-item">
              <h3>{{ exp.title }}</h3>
              <div class="subheading">
                <span class="company">{{ exp.company }}</span>
                <span v-if="exp.dates" class="dates">{{ exp.dates }}</span>
              </div>
              <p v-if="exp.description" class="description">{{ exp.description }}</p>
            </div>
          </section>

          <section v-if="resume.education.length > 0" class="resume-section">
            <h2>Education</h2>
            <div v-for="(edu, index) in resume.education" :key="'edu-prev-' + index" class="education-item">
              <h3>{{ edu.degree }}</h3>
              <div class="subheading">
                <span class="institution">{{ edu.institution }}</span>
                <span v-if="edu.year" class="year">{{ edu.year }}</span>
              </div>
            </div>
          </section>

          <section v-if="resume.skills.length > 0" class="resume-section">
            <h2>Skills</h2>
            <div class="skills-list">
              <span v-for="(skill, index) in resume.skills" :key="'skill-' + index" class="skill-tag">
                {{ skill }}
              </span>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useResumeStore } from '@/store/resume';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import useVuelidate from '@vuelidate/core';
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
      }
    };
    
    const v$ = useVuelidate(rules, resume);
    
    // Initialize template on component mount
    onMounted(() => {
      resumeStore.initTemplate();
    });
    
    // Set the selected template
    const setTemplate = (templateId) => {
      resumeStore.setTemplate(templateId);
    };
    
    // Validate form
    const validateForm = async () => {
      formSubmitted.value = true;
      const isValid = await v$.value.$validate();
      return isValid;
    };
    
    // Save personal info with validation
    const savePersonalInfo = async () => {
      const isValid = await validateForm();
      if (isValid) {
        resumeStore.savePersonalInfo();
      }
    };
    
    // Save experience with validation
    const saveExperience = async (index) => {
      formSubmitted.value = true;
      const isValid = await v$.value.experience.$each.$response.$validate();
      if (isValid) {
        console.log('Experience saved successfully');
      }
    };
    
    // Save education with validation
    const saveEducation = async (index) => {
      formSubmitted.value = true;
      const isValid = await v$.value.education.$each.$response.$validate();
      if (isValid) {
        console.log('Education saved successfully');
      }
    };
    
    // Generate a filename based on the user's name
    const getExportFilename = () => {
      const name = resume.value.personalInfo.name 
        ? resume.value.personalInfo.name.toLowerCase().replace(/\s+/g, '-') 
        : 'resume';
      return `${name}-resume.pdf`;
    };
    
    // Export to PDF
    const exportToPDF = async () => {
      isLoading.value = true;
      try {
        await resumeStore.exportToPDF('resume-pdf', getExportFilename());
      } catch (error) {
        console.error('Error exporting to PDF:', error);
      } finally {
        isLoading.value = false;
      }
    };
    
    // Add experience
    const addExperience = () => {
      resumeStore.addExperience({
        title: '',
        company: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      });
    };
    
    // Remove experience
    const removeExperience = (index) => {
      resumeStore.removeExperience(index);
    };
    
    // Add education
    const addEducation = () => {
      resumeStore.addEducation({
        degree: '',
        institution: '',
        year: '',
        current: false
      });
    };
    
    // Remove education
    const removeEducation = (index) => {
      resumeStore.removeEducation(index);
    };
    
    // Add new skill
    const addNewSkill = () => {
      if (newSkill.value.trim() && !resume.value.skills.includes(newSkill.value.trim())) {
        resume.value.skills.push(newSkill.value.trim());
        newSkill.value = '';
      }
    };
    
    // Remove skill
    const removeSkill = (index) => {
      resume.value.skills.splice(index, 1);
    };
    
    // Export resume as JSON
    const exportResume = () => {
      resumeStore.exportResume();
    };
    
    // Import resume from JSON
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
    
    // Reset resume
    const resetResume = () => {
      if (confirm('Are you sure you want to reset your resume? This cannot be undone.')) {
        resumeStore.resetResume();
      }
    };
    
    // Handle current work change
    const handleCurrentWorkChange = (exp) => {
      if (exp.current) {
        exp.endDate = '';
      }
    };
    
    // Handle current study change
    const handleCurrentStudyChange = (edu) => {
      if (edu.current) {
        edu.year = '';
      }
    };
    
    // Validate field on blur
    const validateField = (fieldPath) => {
      const field = v$.value[fieldPath];
      if (field) {
        field.$touch();
      }
    };
    
    // Validate experience start date
    const validateExperienceStartDate = (exp, index) => {
      if (exp.startDate && exp.endDate && exp.startDate > exp.endDate) {
        exp.endDate = '';
      }
      validateField(`experience.${index}.startDate`);
    };
    
    // Validate experience end date
    const validateExperienceEndDate = (exp, index) => {
      if (exp.startDate && exp.endDate && exp.startDate > exp.endDate) {
        exp.startDate = '';
      }
      validateField(`experience.${index}.endDate`);
    };
    
    // Trigger file input click
    const triggerFileInput = () => {
      fileInput.value.click();
    };
    
    // Export resume as PDF
    const exportToPDF = async () => {
      try {
        isLoading.value = true;
        await resumeStore.exportToPDF();
      } finally {
        isLoading.value = false;
      }
    };
    
    return {
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
    };
    
    // Handle current work change
    const handleCurrentWorkChange = (exp) => {
      if (exp.current) {
        exp.endDate = '';
      }
    };
    
    // Handle current study change
    const handleCurrentStudyChange = (edu) => {
      if (edu.current) {
        edu.year = '';
      }
    };
    
    // Validate field on blur
    const validateField = (fieldPath) => {
      const field = v$.value[fieldPath];
      if (field) {
        field.$touch();
      }
    };
    
    // Validate experience start date
    const validateExperienceStartDate = (exp, index) => {
      if (exp.startDate && exp.endDate && exp.startDate > exp.endDate) {
        exp.endDate = '';
      }
      validateField(`experience.${index}.startDate`);
    };
    
    // Validate experience end date
    const validateExperienceEndDate = (exp, index) => {
      if (exp.startDate && exp.endDate && exp.startDate > exp.endDate) {
        exp.startDate = '';
      }
      validateField(`experience.${index}.endDate`);
    };
    
    // Trigger file input click
    const triggerFileInput = () => {
      fileInput.value.click();
    };
    
    // Export resume as PDF
    const exportToPDF = async () => {
      try {
        isLoading.value = true;
        await resumeStore.exportToPDF();
      } finally {
        isLoading.value = false;
      }
    };
    
    // Import resume
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
            alert('Invalid JSON file');
          }
        };
        reader.readAsText(file);
      }
    };
    
    // Reset resume
    const resetResume = () => {
      if (confirm('Are you sure you want to reset the resume? All unsaved changes will be lost.')) {
        resumeStore.resetResume();
      }
    };
    
    // Handle current work change
    const handleCurrentWorkChange = (exp) => {
      if (exp.current) {
        exp.endDate = '';
      }
    };
    
    // Handle current study change
    const handleCurrentStudyChange = (edu) => {
      if (edu.current) {
        edu.endYear = '';
      }
    };
    
    // Validate field
    const validateField = (fieldPath) => {
      const path = fieldPath.split('.');
      let current = v$.value;
      
      for (const part of path) {
        if (current[part]) {
          current = current[part];
        } else {
          return; // Path doesn't exist
        }
      }
      
      if (typeof current.$touch === 'function') {
        current.$touch();
      }
    };
    
    // Validate experience start date
    const validateExperienceStartDate = (index) => {
      if (v$.value.experience.$each.$response.$errors[index]?.startDate?.length) {
        v$.value.experience.$touch();
      }
    };
    
    // Validate experience end date
    const validateExperienceEndDate = (index) => {
      if (v$.value.experience.$each.$response.$errors[index]?.endDate?.length) {
        v$.value.experience.$touch();
      }
    };
    
    // Trigger file input click
    const triggerFileInput = () => {
      fileInput.value.click();
    };
    
    return {
      // Refs
      resume,
      currentTemplate,
      availableTemplates,
      isLoading,
      formSubmitted,
      newSkill,
      fileInput,
      v$,
      
      // Methods
      setTemplate,
      exportToPDF,
      savePersonalInfo,
      addExperience,
      removeExperience,
      addEducation,
      removeEducation,
      saveExperience,
      saveEducation,
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
      
      // Store methods
      ...resumeStore,
      // Refs
      newSkill
    };
  }
};
</script>

<style>
/* Template variables */
:root {
  --primary-color: #3490dc;
  --secondary-color: #6c757d;
  --font-family: 'Arial', sans-serif;
  --header-background: #f8f9fa;
  --section-background: #ffffff;
  --text-color: #333333;
  --border-color: #e0e0e0;
  --header-text-color: #333333;
}

/* Apply template styles */
body {
  font-family: var(--font-family);
  color: var(--text-color);
}

.resume-paper {
  background-color: var(--section-background);
  border: 1px solid var(--border-color);
}

.resume-header {
  background-color: var(--header-background);
  color: var(--header-text-color);
  padding: 2rem;
  margin-bottom: 2rem;
  border-bottom: 3px solid var(--primary-color);
}

.section-title {
  color: var(--primary-color);
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
}

.btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.btn-outline {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.btn-outline:hover {
  background-color: var(--primary-color);
  color: white;
}

/* Template preview in dropdown */
.template-preview {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  margin-right: 12px;
  border: 1px solid #dee2e6;
}
</style>

<style>
/* Form validation styles */
.form-group {
  margin-bottom: 1.5rem;
  position: relative;
}

.form-control.is-invalid {
  border-color: #dc3545;
  padding-right: calc(1.5em + 0.75rem);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}

.form-control.is-invalid:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
}

.invalid-feedback {
  display: none;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: #dc3545;
}

.was-validated .form-control:invalid ~ .invalid-feedback,
.was-validated .form-control:invalid ~ .invalid-tooltip,
.form-control.is-invalid ~ .invalid-feedback,
.form-control.is-invalid ~ .invalid-tooltip {
  display: block;
}

/* Character counter */
.text-muted {
  font-size: 0.8rem;
  display: block;
  margin-top: 0.25rem;
}

/* Required field indicator */
label.required:after {
  content: ' *';
  color: #dc3545;
}

/* Form section styling */
.form-section {
  background: #fff;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .form-section {
    padding: 1rem;
  }
}
</style>

<style scoped>
.resume-builder {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  display: none;
  min-width: 10rem;
  padding: 0.5rem 0;
  margin: 0.125rem 0 0;
  font-size: 1rem;
  color: #212529;
  text-align: left;
  list-style: none;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.25rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.175);
}

.dropdown-menu.show {
  display: block;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 0.25rem 1.5rem;
  clear: both;
  font-weight: 400;
  color: #212529;
  text-align: inherit;
  text-decoration: none;
  white-space: nowrap;
  background-color: transparent;
  border: 0;
  cursor: pointer;
}

.dropdown-item:hover {
  color: #16181b;
  background-color: #f8f9fa;
}

.dropdown-toggle::after {
  display: inline-block;
  margin-left: 0.255em;
  vertical-align: 0.255em;
  content: "";
  border-top: 0.3em solid;
  border-right: 0.3em solid transparent;
  border-bottom: 0;
  border-left: 0.3em solid transparent;
}

.resume-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-top: 20px;
}

.resume-form {
  background: #fff;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.section:last-child {
  border-bottom: none;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 15px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

input[type="text"],
input[type="email"],
input[type="tel"],
textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

textarea {
  min-height: 80px;
  resize: vertical;
}

.btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  padding: 0.5rem 1rem;
  margin: 0.5rem;
  border-radius: 4px;
  text-decoration: none;
}
.btn-primary {
  background-color: #42b983;
  color: white;
}
.btn-secondary {
  background-color: #35495e;
  color: white;
}
</style>
