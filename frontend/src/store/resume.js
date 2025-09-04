import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import html2pdf from 'html2pdf.js';

// Template configurations
const TEMPLATES = {
  MODERN: {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and professional design with a modern layout',
    styles: {
      primaryColor: '#3490dc',
      secondaryColor: '#6c757d',
      fontFamily: 'Arial, sans-serif',
      headerBackground: '#f8f9fa',
      sectionBackground: '#ffffff',
      textColor: '#333333'
    }
  },
  CLASSIC: {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional resume layout with a professional appearance',
    styles: {
      primaryColor: '#2c3e50',
      secondaryColor: '#7f8c8d',
      fontFamily: 'Georgia, serif',
      headerBackground: '#2c3e50',
      sectionBackground: '#ffffff',
      textColor: '#2c3e50',
      headerTextColor: '#ffffff'
    }
  },
  MINIMAL: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and clean design with focus on content',
    styles: {
      primaryColor: '#333333',
      secondaryColor: '#666666',
      fontFamily: 'Helvetica, Arial, sans-serif',
      headerBackground: '#ffffff',
      sectionBackground: '#ffffff',
      textColor: '#333333',
      borderColor: '#e0e0e0'
    }
  }
};

// Store for managing resume data
export const useResumeStore = defineStore('resume', () => {
  // State
  const currentTemplate = ref(TEMPLATES.MODERN);
  
  const resume = ref({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      summary: ''
    },
    experience: [],
    education: [],
    skills: [],
    projects: []
  });
  
  // Computed
  const availableTemplates = computed(() => Object.values(TEMPLATES));

  // Actions
  const updatePersonalInfo = (data) => {
    resume.value.personalInfo = { ...resume.value.personalInfo, ...data };
  };

  const addExperience = (experience) => {
    resume.value.experience.push(experience);
  };

  const updateExperience = (index, data) => {
    resume.value.experience[index] = { ...resume.value.experience[index], ...data };
  };

  const removeExperience = (index) => {
    resume.value.experience.splice(index, 1);
  };

  const addEducation = (education) => {
    resume.value.education.push(education);
  };

  const updateEducation = (index, data) => {
    resume.value.education[index] = { ...resume.value.education[index], ...data };
  };

  const removeEducation = (index) => {
    resume.value.education.splice(index, 1);
  };

  const addSkill = (skill) => {
    if (!resume.value.skills.includes(skill)) {
      resume.value.skills.push(skill);
    }
  };

  const removeSkill = (index) => {
    resume.value.skills.splice(index, 1);
  };

  const addProject = (project) => {
    resume.value.projects.push(project);
  };

  const updateProject = (index, data) => {
    resume.value.projects[index] = { ...resume.value.projects[index], ...data };
  };

  const removeProject = (index) => {
    resume.value.projects.splice(index, 1);
  };

  const resetResume = () => {
    resume.value = {
      personalInfo: {
        name: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        summary: ''
      },
      experience: [],
      education: [],
      skills: [],
      projects: []
    };
  };

  // Export resume as JSON
  const exportResume = () => {
    const dataStr = JSON.stringify(resume.value, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'resume.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Change template
  const setTemplate = (templateId) => {
    const template = Object.values(TEMPLATES).find(t => t.id === templateId);
    if (template) {
      currentTemplate.value = template;
      // Apply template styles to the document
      applyTemplateStyles(template);
    }
  };
  
  // Apply template styles to the document
  const applyTemplateStyles = (template) => {
    const style = document.documentElement.style;
    Object.entries(template.styles).forEach(([key, value]) => {
      style.setProperty(`--${key.toLowerCase()}-color`, value);
    });
    style.setProperty('--font-family', template.styles.fontFamily);
  };
  
  // Initialize with default template
  const initTemplate = () => {
    applyTemplateStyles(currentTemplate.value);
  };
  
  // Export resume as PDF
  const exportToPDF = async (elementId, filename = 'resume.pdf') => {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('Element not found for PDF export');
      return;
    }

    // Clone the element to avoid affecting the original
    const clonedElement = element.cloneNode(true);
    
    // Hide any elements that shouldn't be in the PDF
    const elementsToHide = clonedElement.querySelectorAll('.no-print, button, a, .actions');
    elementsToHide.forEach(el => {
      el.style.display = 'none';
    });

    // Create a temporary container for the PDF
    const tempContainer = document.createElement('div');
    tempContainer.appendChild(clonedElement);
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    document.body.appendChild(tempContainer);

    // Validation rules
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
        location: { required: helpers.withMessage('Location is required', required) },
        website: {
          validUrl: helpers.withMessage('Must be a valid URL', (value) => {
            if (!value) return true; // Optional field
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
        $each: helpers.forEach({
          company: { 
            required: helpers.withMessage('Company name is required', required),
            minLength: minLength(2)
          },
          position: { 
            required: helpers.withMessage('Position is required', required),
            minLength: minLength(2)
          },
          startDate: { 
            required: helpers.withMessage('Start date is required', required)
          },
          endDate: {
            required: helpers.withMessage('End date is required', (value, { currentObject }) => !currentObject.current),
            validDate: helpers.withMessage('End date must be after start date', (value, { currentObject }) => {
              if (currentObject.current || !value || !currentObject.startDate) return true;
              return new Date(value) >= new Date(currentObject.startDate);
            })
          },
          description: {
            maxLength: maxLength(1000)
          }
        })
      },
      education: {
        $each: helpers.forEach({
          institution: { 
            required: helpers.withMessage('Institution name is required', required),
            minLength: minLength(2)
          },
          degree: { 
            required: helpers.withMessage('Degree is required', required),
            minLength: minLength(2)
          },
          field: { 
            required: helpers.withMessage('Field of study is required', required),
            minLength: minLength(2)
          },
          startYear: { 
            required: helpers.withMessage('Start year is required', required),
            numeric: helpers.withMessage('Must be a valid year', (value) => {
              if (!value) return false;
              const year = parseInt(value);
              return !isNaN(year) && year >= 1900 && year <= new Date().getFullYear();
            })
          },
          endYear: {
            required: helpers.withMessage('End year is required', (value, { currentObject }) => !currentObject.current),
            numeric: helpers.withMessage('Must be a valid year', (value, { currentObject }) => {
              if (currentObject.current) return true;
              if (!value) return false;
              const year = parseInt(value);
              const startYear = parseInt(currentObject.startYear);
              return !isNaN(year) && year >= startYear && year <= new Date().getFullYear();
            })
          },
          description: {
            maxLength: maxLength(500)
          }
        })
      },
      skills: {
        $each: helpers.forEach({
          name: {
            required: helpers.withMessage('Skill name is required', required),
            minLength: minLength(2)
          },
          level: {
            required: helpers.withMessage('Skill level is required', required),
            between: helpers.withMessage('Must be between 1 and 5', (value) => {
              const num = parseInt(value);
              return !isNaN(num) && num >= 1 && num <= 5;
            })
          }
        })
      }
    };

    // PDF options
    const opt = {
      margin: 10,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: true,
        letterRendering: true,
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    };

    try {
      // Generate PDF
      await html2pdf().set(opt).from(clonedElement).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      // Clean up
      document.body.removeChild(tempContainer);
    }
  };

  // Import resume from JSON
  const importResume = (jsonData) => {
    try {
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      resume.value = { ...resume.value, ...data };
      return true;
    } catch (e) {
      console.error('Failed to import resume:', e);
      return false;
    }
  };

  return {
    resume,
    currentTemplate,
    availableTemplates,
    setTemplate,
    initTemplate,
    updatePersonalInfo,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addSkill,
    removeSkill,
    addProject,
    updateProject,
    removeProject,
    resetResume,
    exportResume,
    exportToPDF,
    importResume
  };
});
