import axios, { AxiosInstance, AxiosError } from 'axios';

// API base URL - can be overridden by environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const publicPaths = ['/login', '/cadastro', '/', '/sobre-o-programa', '/nossos-planos', '/contato'];
      const isPublicPath = publicPaths.includes(currentPath) || currentPath.startsWith('/tour');
      
      const hasToken = !!localStorage.getItem('authToken');
      
      if (hasToken && !isPublicPath) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
      }
    }
    
    if (error.response?.status === 404) {
      const url = error.config?.url || '';
      if (url.includes('/patient-profile/me') && error.config?.method === 'get') {
        return Promise.reject(error);
      }
    }
    
    if (error.code === 'ERR_NETWORK' || error.response?.status === 502) {
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (data: { fullName: string; cpf: string; email: string; passwordHash: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
};

// Users API
export const usersApi = {
  getCurrentUser: async () => {
    const response = await api.get('/user/me');
    return response.data;
  },
  
  updateUser: async (data: any) => {
    const response = await api.patch('/user/me', data);
    return response.data;
  },
};

// Content API
export const contentApi = {
  getRecommendations: async () => {
    const response = await api.get('/contents/recommendations');
    return response.data;
  },
  
  getAll: async () => {
    const response = await api.get('/contents');
    return response.data;
  },
  
  getBySpecialty: async (specialtyId: number) => {
    const response = await api.get(`/contents/specialty/${specialtyId}`);
    return response.data;
  },
  
  getByCategory: async (category: string) => {
    const response = await api.get(`/contents/category/${category}`);
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/contents/${id}`);
    return response.data;
  },
};

// Medical Record API
export const medicalRecordApi = {
  getMedicalRecord: async () => {
    const response = await api.get('/medical-records/me');
    return response.data;
  },
};

// Patient Profile API
export const patientProfileApi = {
  getProfile: async () => {
    const response = await api.get('/patient-profile/me');
    return response.data;
  },
  
  createProfile: async (data: any) => {
    const response = await api.post('/patient-profile/me', data);
    return response.data;
  },
  
  updateProfile: async (data: any) => {
    const response = await api.patch('/patient-profile/me', data);
    return response.data;
  },
  connectGoogleCalendar: async (calendarId: string) => {
    const response = await api.patch('/patient-profile/me', { googleCalendarId: calendarId });
    return response.data;
  },
  // Métodos para atualizar seções específicas
  updatePersonalData: async (data: { fullName?: string; email?: string }) => {
    const response = await api.patch('/patient-profile/me/personal-data', data);
    return response.data;
  },
  updateHealthInfo: async (data: { dateOfBirth?: string; bloodType?: string; height?: number; weight?: number }) => {
    const response = await api.patch('/patient-profile/me/health-info', data);
    return response.data;
  },
  updateDiseasesMedications: async (data: { diseases?: string; medications?: string }) => {
    const response = await api.patch('/patient-profile/me/diseases-medications', data);
    return response.data;
  },
  updateFamilyHistory: async (data: { familyHistory?: string }) => {
    const response = await api.patch('/patient-profile/me/family-history', data);
    return response.data;
  },
  updateAllergies: async (data: { allergies?: string }) => {
    const response = await api.patch('/patient-profile/me/allergies', data);
    return response.data;
  },
  updateSpecialConditions: async (data: { specialConditions?: string }) => {
    const response = await api.patch('/patient-profile/me/special-conditions', data);
    return response.data;
  },
  // Métodos para gerenciar endereço
  createAddress: async (data: any) => {
    const response = await api.post('/patient-profile/me/address', data);
    return response.data;
  },
  updateAddress: async (addressId: number, data: any) => {
    const response = await api.patch(`/patient-profile/me/address/${addressId}`, data);
    return response.data;
  },
};

// Consultation API
export const consultationApi = {
  getConsultations: async () => {
    const response = await api.get('/consultation/me');
    return response.data;
  },
  
  getConsultationById: async (id: number) => {
    const response = await api.get(`/consultation/me/${id}`);
    return response.data;
  },
  
  createConsultation: async (data: any) => {
    const response = await api.post('/consultation', data);
    return response.data;
  },
  
  updateConsultation: async (id: number, data: any) => {
    const response = await api.patch(`/consultation/${id}`, data);
    return response.data;
  },
};

// Diary API
export const diaryApi = {
  getEntries: async (page: number = 1, limit: number = 20) => {
    const response = await api.get(`/diary/me?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  getTodayEntry: async () => {
    const response = await api.get('/diary/me/today');
    return response.data;
  },
  
  shouldShowDiary: async () => {
    const response = await api.get('/diary/should-show');
    return response.data;
  },
  
  createEntry: async (data: any) => {
    const response = await api.post('/diary/me', data);
    return response.data;
  },
  
  updateEntry: async (id: number, data: any) => {
    const response = await api.patch(`/diary/me/${id}`, data);
    return response.data;
  },
  
  getEntryById: async (id: number) => {
    const response = await api.get(`/diary/${id}`);
    return response.data;
  },
  
  deleteEntry: async (id: number) => {
    const response = await api.delete(`/diary/${id}`);
    return response.data;
  },
};

// Goals API
export const goalsApi = {
  getGoals: async () => {
    const response = await api.get('/goals/me');
    return response.data;
  },
  
  createGoal: async (data: { title: string; description?: string; endDate?: string; status?: string }) => {
    const response = await api.post('/goals/me', data);
    return response.data;
  },
  
  updateGoal: async (id: number, data: { title?: string; description?: string; endDate?: string; status?: string }) => {
    const response = await api.patch(`/goals/me/${id}`, data);
    return response.data;
  },
  
  getGoalById: async (id: number) => {
    const response = await api.get(`/goals/${id}`);
    return response.data;
  },
  
  deleteGoal: async (id: number) => {
    const response = await api.delete(`/goals/me/${id}`);
    return response.data;
  },
};

// Journey API
export const journeyApi = {
  getJourneyData: async () => {
    const response = await api.get('/journey/me');
    return response.data;
  },
};

// Agenda API
export const agendaApi = {
  getSummary: async () => {
    const response = await api.get('/agenda/summary');
    return response.data;
  },
};

// Calendar API
export const calendarApi = {
  getEvents: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const response = await api.get(`/calendar/events?${params.toString()}`);
    return response.data;
  },
  sync: async () => {
    const response = await api.get('/calendar/sync');
    return response.data;
  },
  isGoogleConnected: async () => {
    const response = await api.get('/calendar/google-connected');
    return response.data;
  },
  connectGoogle: () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    window.location.href = `${apiUrl}/google-calendar/auth`;
  },
  disconnectGoogle: async () => {
    const response = await api.get('/google-calendar/disconnect');
    return response.data;
  },
};

// Checkin API
export const checkinApi = {
  getNextCheckin: async () => {
    const response = await api.get('/checkin/next');
    return response.data;
  },
  
  submitCheckin: async (data: { questionnaireId: number; answers: Array<{ questionId: number; chosenAnswerId: number }> }) => {
    const response = await api.post('/checkin', data);
    return response.data;
  },
};

// Notifications API
export const notificationsApi = {
  getNotifications: async () => {
    const response = await api.get('/notifications/me');
    return response.data;
  },
  
  getUnreadNotifications: async () => {
    const response = await api.get('/notifications/me/unread');
    return response.data;
  },
  
  getNotificationCount: async () => {
    const response = await api.get('/notifications/me/count');
    return response.data;
  },
  
  markAsRead: async (id: number) => {
    const response = await api.patch(`/notifications/me/${id}/read`);
    return response.data;
  },
  
  markAllAsRead: async () => {
    const response = await api.patch('/notifications/me/mark-all-read');
    return response.data;
  },
  
  deleteNotification: async (id: number) => {
    const response = await api.delete(`/notifications/me/${id}`);
    return response.data;
  },
};

// Admin API
export const adminApi = {
  getAllPatients: async () => {
    const response = await api.get('/admin/patients');
    return response.data;
  },
  
  getPatientTriageList: async () => {
    const response = await api.get('/admin/triage-list');
    return response.data;
  },
  
  getUnassignedPatients: async () => {
    const response = await api.get('/admin/triage/unassigned');
    return response.data;
  },
  
  getPatientCheckinSummary: async (userId: number) => {
    const response = await api.get(`/admin/patients/${userId}/checkin-summary`);
    return response.data;
  },
  
  getPatientCheckinHistory: async (userId: number) => {
    const response = await api.get(`/admin/patients/${userId}/checkin-history`);
    return response.data;
  },
  
  getCheckinDetails: async (checkinId: number) => {
    const response = await api.get(`/admin/checkins/${checkinId}`);
    return response.data;
  },
  
  getAllCheckinsBySpecialty: async () => {
    const response = await api.get('/admin/checkins/all');
    return response.data;
  },
};

// Specialty API
export const specialtyApi = {
  listSpecialties: async () => {
    const response = await api.get('/specialty');
    return response.data;
  },
};

// Patient Profile API (Admin endpoints)
export const patientProfileAdminApi = {
  assignLine: async (userId: number, specialtyId: number) => {
    const response = await api.patch(`/patient-profile/${userId}/assign-line`, { specialtyId });
    return response.data;
  },
  
  removeLine: async (userId: number) => {
    const response = await api.delete(`/patient-profile/${userId}/assign-line`);
    return response.data;
  },
};

export default api;

