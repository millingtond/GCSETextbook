// App-wide constants
export const CONSTANTS = {
  // Search
  MAX_SEARCH_RESULTS: 10,
  SEARCH_DEBOUNCE_DELAY: 300,
  SEARCH_THRESHOLD: 0.4,
  
  // Storage
  LOCAL_STORAGE_KEYS: {
    THEME: 'theme',
    PROGRESS_STATE: 'progressState',
    OPEN_SECTIONS: 'openSections',
    LAST_VISITED_TOPIC: 'lastVisitedTopic'
  },
  
  // Theme
  THEME: {
    LIGHT: 'light',
    DARK: 'dark'
  },
  
  // Validation
  MIN_PASSWORD_LENGTH: 8,
  MAX_LOGIN_ATTEMPTS: 3,
  SESSION_TIMEOUT: 3600, // seconds
  
  // UI
  DEFAULT_PAGE_SIZE: 20,
  ANIMATION_DURATION: 300, // ms
  
  // File handling
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['.txt', '.csv', '.json'],
  
  // Performance
  LAZY_LOAD_DELAY: 150, // ms
  
  // Error messages
  ERRORS: {
    FILE_NOT_FOUND: 'File not found',
    INVALID_FILE_TYPE: 'Invalid file type',
    FILE_TOO_LARGE: 'File size exceeds limit',
    NETWORK_ERROR: 'Network connection error',
    STORAGE_FULL: 'Storage quota exceeded',
    INVALID_INPUT: 'Invalid input provided'
  }
};

// Fuse.js search options
export const FUSE_OPTIONS = {
  includeScore: true,
  shouldSort: true,
  threshold: CONSTANTS.SEARCH_THRESHOLD,
  keys: ['title', 'content', 'subsection'],
};

// Pyodide configuration
export const PYODIDE_CONFIG = {
  indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/",
  env: {
    HOME: "/tmp"
  }
};