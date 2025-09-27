// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000',
  ENDPOINTS: {
    // Authentication
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    
    // User Management
    GET_USER: '/api/user',
    GET_FEED: '/api/user/feed',
    
    // Interactions
    CREATE_INTERACTION: '/api/interaction',
    GET_MATCHES: '/api/interaction/matches',
    
    // Health Check
    HEALTH: '/api/health'
  }
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'rizzler_auth_token',
  USER_DATA: 'rizzler_user_data'
};

// App Constants
export const APP_CONFIG = {
  NAME: 'Rizzler',
  VERSION: '1.0.0',
  DEFAULT_AVATAR: '/default-avatar.png'
};

// Gender Options
export const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' }
];

// Interaction Types
export const INTERACTION_TYPES = {
  LIKE: 'LIKE',
  DISLIKE: 'DISLIKE'
};
