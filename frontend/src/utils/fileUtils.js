/**
 * File utility functions for handling file operations
 */

// Common MIME types for validation
const MIME_TYPES = {
  // Images
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
  
  // Documents
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
  'text/plain': 'txt',
  'text/csv': 'csv',
  'application/json': 'json',
  'application/rtf': 'rtf',
  
  // Archives
  'application/zip': 'zip',
  'application/x-rar-compressed': 'rar',
  'application/x-7z-compressed': '7z',
  'application/x-tar': 'tar',
  'application/gzip': 'gz',
  
  // Media
  'audio/mpeg': 'mp3',
  'audio/wav': 'wav',
  'audio/ogg': 'ogg',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/ogg': 'ogv',
};

// Maximum file size in bytes (default: 5MB)
const DEFAULT_MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Validates a file against allowed types and size
 * @param {File} file - The file to validate
 * @param {Object} options - Validation options
 * @param {Array<string>} options.allowedTypes - Allowed MIME types (default: all)
 * @param {number} options.maxSize - Maximum file size in bytes (default: 5MB)
 * @returns {Object} Validation result with `isValid` and `error` message
 */
export const validateFile = (file, options = {}) => {
  const { allowedTypes = null, maxSize = DEFAULT_MAX_FILE_SIZE } = options;
  
  if (!(file instanceof File)) {
    return { isValid: false, error: 'Invalid file object' };
  }
  
  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
    return { 
      isValid: false, 
      error: `File is too large. Maximum size is ${maxSizeMB}MB.` 
    };
  }
  
  // Check file type
  if (allowedTypes && allowedTypes.length > 0) {
    const fileType = file.type.toLowerCase();
    const isTypeAllowed = allowedTypes.some(type => {
      // Handle wildcard types like 'image/*'
      if (type.endsWith('/*')) {
        const category = type.split('/')[0];
        return fileType.startsWith(`${category}/`);
      }
      return type.toLowerCase() === fileType;
    });
    
    if (!isTypeAllowed) {
      return { 
        isValid: false, 
        error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}` 
      };
    }
  }
  
  return { isValid: true, error: null };
};

/**
 * Converts a file to a base64 string
 * @param {File} file - The file to convert
 * @returns {Promise<string>} A promise that resolves with the base64 string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (!(file instanceof File)) {
      reject(new Error('Invalid file object'));
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = () => {
      resolve(reader.result);
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Converts a base64 string to a Blob
 * @param {string} base64 - The base64 string to convert
 * @param {string} mimeType - The MIME type of the file
 * @returns {Blob} The Blob object
 */
export const base64ToBlob = (base64, mimeType = '') => {
  // Remove the data URL prefix if present
  const base64WithoutPrefix = base64.split(';base64,').pop();
  
  // Convert base64 to binary
  const byteCharacters = atob(base64WithoutPrefix);
  const byteArrays = [];
  
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    byteArrays.push(new Uint8Array(byteNumbers));
  }
  
  return new Blob(byteArrays, { type: mimeType });
};

/**
 * Downloads a file from a URL or Blob
 * @param {string|Blob} source - The file source (URL or Blob)
 * @param {string} fileName - The name to save the file as
 * @param {Object} options - Additional options
 * @param {boolean} options.openInNewTab - Whether to open the file in a new tab instead of downloading
 */
export const downloadFile = (source, fileName, options = {}) => {
  const { openInNewTab = false } = options;
  
  if (!source) {
    console.error('No file source provided');
    return;
  }
  
  if (openInNewTab && typeof source === 'string') {
    // For URLs, open in a new tab
    window.open(source, '_blank', 'noopener,noreferrer');
    return;
  }
  
  // Create a temporary anchor element
  const link = document.createElement('a');
  link.style.display = 'none';
  
  // Set the file source
  if (source instanceof Blob) {
    link.href = URL.createObjectURL(source);
  } else if (typeof source === 'string') {
    link.href = source;
  } else {
    console.error('Unsupported file source type');
    return;
  }
  
  // Set the download attribute with the file name
  if (fileName) {
    link.download = fileName;
  }
  
  // Append to the document, trigger the click, and clean up
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  setTimeout(() => {
    if (source instanceof Blob) {
      URL.revokeObjectURL(link.href);
    }
    document.body.removeChild(link);
  }, 100);
};

/**
 * Gets the file extension from a file name or path
 * @param {string} fileName - The file name or path
 * @returns {string} The file extension (without the dot)
 */
export const getFileExtension = (fileName) => {
  if (!fileName || typeof fileName !== 'string') {
    return '';
  }
  
  // Handle hidden files and files with multiple extensions
  const parts = fileName.split('.');
  if (parts.length === 1) return ''; // No extension
  if (parts[0] === '' && parts.length === 2) return ''; // .gitignore style
  
  return parts.pop().toLowerCase();
};

/**
 * Gets the MIME type from a file extension
 * @param {string} extension - The file extension (with or without dot)
 * @returns {string|null} The MIME type or null if not found
 */
export const getMimeTypeFromExtension = (extension) => {
  if (!extension) return null;
  
  // Remove leading dot if present
  const ext = extension.startsWith('.') ? extension.slice(1) : extension;
  
  // Find the MIME type for the extension
  for (const [mimeType, extValue] of Object.entries(MIME_TYPES)) {
    if (extValue === ext.toLowerCase()) {
      return mimeType;
    }
  }
  
  return null;
};

/**
 * Gets the file icon based on MIME type or extension
 * @param {string} typeOrExt - MIME type or file extension
 * @returns {string} The name of the icon to use
 */
export const getFileIcon = (typeOrExt) => {
  if (!typeOrExt) return 'file';
  
  const type = typeOrExt.toLowerCase();
  
  // Check if it's a MIME type
  if (type.includes('/')) {
    const [category] = type.split('/');
    
    switch (category) {
      case 'image':
        return 'file-image';
      case 'audio':
        return 'file-audio';
      case 'video':
        return 'file-video';
      case 'application':
        if (type.includes('pdf')) return 'file-pdf';
        if (type.includes('word')) return 'file-word';
        if (type.includes('excel') || type.includes('spreadsheet')) return 'file-excel';
        if (type.includes('powerpoint') || type.includes('presentation')) return 'file-powerpoint';
        if (type.includes('zip') || type.includes('compressed')) return 'file-archive';
        if (type.includes('json')) return 'file-code';
        return 'file';
      case 'text':
        if (type.includes('csv')) return 'file-csv';
        return 'file-alt';
      default:
        return 'file';
    }
  }
  
  // Handle file extensions
  const ext = type.startsWith('.') ? type.slice(1) : type;
  
  switch (ext) {
    case 'pdf':
      return 'file-pdf';
    case 'doc':
    case 'docx':
      return 'file-word';
    case 'xls':
    case 'xlsx':
    case 'csv':
      return 'file-excel';
    case 'ppt':
    case 'pptx':
      return 'file-powerpoint';
    case 'zip':
    case 'rar':
    case '7z':
    case 'tar':
    case 'gz':
      return 'file-archive';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
    case 'svg':
      return 'file-image';
    case 'mp3':
    case 'wav':
    case 'ogg':
      return 'file-audio';
    case 'mp4':
    case 'webm':
    case 'ogv':
      return 'file-video';
    case 'txt':
      return 'file-alt';
    case 'json':
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
    case 'html':
    case 'css':
    case 'scss':
    case 'py':
    case 'java':
    case 'c':
    case 'cpp':
    case 'cs':
    case 'php':
    case 'rb':
    case 'go':
    case 'rs':
    case 'swift':
    case 'kt':
      return 'file-code';
    default:
      return 'file';
  }
};

/**
 * Formats a file size in bytes to a human-readable string
 * @param {number} bytes - The file size in bytes
 * @param {number} decimals - Number of decimal places to show (default: 2)
 * @returns {string} Formatted file size (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Creates a file upload input element and triggers a file selection dialog
 * @param {Object} options - Options for file selection
 * @param {string} options.accept - Comma-separated list of MIME types or file extensions
 * @param {boolean} options.multiple - Whether to allow multiple file selection
 * @param {number} options.maxSize - Maximum file size in bytes
 * @returns {Promise<FileList>} A promise that resolves with the selected files
 */
export const selectFiles = (options = {}) => {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    
    if (options.accept) {
      input.accept = options.accept;
    }
    
    if (options.multiple) {
      input.multiple = true;
    }
    
    input.onchange = (e) => {
      const files = e.target.files;
      
      if (!files || files.length === 0) {
        resolve([]);
        return;
      }
      
      // Filter files by size if maxSize is specified
      if (options.maxSize) {
        const validFiles = Array.from(files).filter(file => file.size <= options.maxSize);
        resolve(validFiles);
      } else {
        resolve(files);
      }
    };
    
    // Trigger file selection dialog
    input.click();
  });
};

export default {
  MIME_TYPES,
  DEFAULT_MAX_FILE_SIZE,
  validateFile,
  fileToBase64,
  base64ToBlob,
  downloadFile,
  getFileExtension,
  getMimeTypeFromExtension,
  getFileIcon,
  formatFileSize,
  selectFiles,
};
